package docker

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"
	"time"

	"github.com/moby/moby/api/types/events"
	"github.com/moby/moby/client"
)

func TestListenEventsDeliversEventsAndReturnsEOF(t *testing.T) {
	expected := []events.Message{
		{Type: events.ContainerEventType, Action: events.ActionStart, Actor: events.Actor{ID: "first"}},
		{Type: events.ContainerEventType, Action: events.ActionDie, Actor: events.Actor{ID: "second"}},
	}
	apiClient := newEventsTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		encoder := json.NewEncoder(w)
		for _, event := range expected {
			if err := encoder.Encode(event); err != nil {
				t.Errorf("encode event: %v", err)
				return
			}
		}
	})
	ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
	defer cancel()

	var received []events.Message
	err := ListenEvents(ctx, apiClient, func(event events.Message) error {
		received = append(received, event)
		return nil
	})

	if !errors.Is(err, io.EOF) {
		t.Fatalf("expected EOF, got %v", err)
	}
	if !reflect.DeepEqual(received, expected) {
		t.Fatalf("expected events %v, got %v", expected, received)
	}
}

func TestListenEventsStopsOnHandlerError(t *testing.T) {
	requestClosed := make(chan struct{})
	apiClient := newEventsTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		encoder := json.NewEncoder(w)
		for _, id := range []string{"first", "second"} {
			if err := encoder.Encode(events.Message{Actor: events.Actor{ID: id}}); err != nil {
				t.Errorf("encode event: %v", err)
				return
			}
		}
		w.(http.Flusher).Flush()
		<-r.Context().Done()
		close(requestClosed)
	})
	ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
	defer cancel()

	handlerErr := errors.New("handler failed")
	calls := 0
	err := ListenEvents(ctx, apiClient, func(event events.Message) error {
		calls++
		if event.Actor.ID != "first" {
			t.Errorf("expected first event, got %q", event.Actor.ID)
		}
		return handlerErr
	})

	if !errors.Is(err, handlerErr) {
		t.Fatalf("expected handler error, got %v", err)
	}
	if calls != 1 {
		t.Fatalf("expected one callback invocation, got %d", calls)
	}
	select {
	case <-requestClosed:
	case <-ctx.Done():
		t.Fatal("stream request was not closed after handler error")
	}
}

func TestListenEventsStopsOnCancellation(t *testing.T) {
	requestStarted := make(chan struct{})
	requestClosed := make(chan struct{})
	apiClient := newEventsTestClient(t, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/x-ndjson")
		w.(http.Flusher).Flush()
		close(requestStarted)
		<-r.Context().Done()
		close(requestClosed)
	})
	ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
	defer cancel()
	streamCtx, stop := context.WithCancel(ctx)
	defer stop()

	result := make(chan error, 1)
	go func() {
		result <- ListenEvents(streamCtx, apiClient, func(event events.Message) error {
			t.Error("unexpected event on an empty stream")
			return nil
		})
	}()

	select {
	case <-requestStarted:
	case <-ctx.Done():
		t.Fatal("stream request did not start")
	}
	stop()

	select {
	case err := <-result:
		if !errors.Is(err, context.Canceled) {
			t.Fatalf("expected context cancellation, got %v", err)
		}
	case <-ctx.Done():
		t.Fatal("listener did not stop after cancellation")
	}
	select {
	case <-requestClosed:
	case <-ctx.Done():
		t.Fatal("stream request was not closed after cancellation")
	}
}

func newEventsTestClient(t *testing.T, handler http.HandlerFunc) *client.Client {
	t.Helper()

	server := httptest.NewServer(handler)
	t.Cleanup(server.Close)

	apiClient, err := client.New(client.WithHost(server.URL), client.WithAPIVersion("1.56"))
	if err != nil {
		t.Fatalf("create Docker client: %v", err)
	}
	t.Cleanup(func() {
		if err := apiClient.Close(); err != nil {
			t.Errorf("close Docker client: %v", err)
		}
	})
	return apiClient
}
