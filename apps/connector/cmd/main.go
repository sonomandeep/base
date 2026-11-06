package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/moby/moby/api/types/events"
	"github.com/sonomandeep/base/apps/connector/internal/docker"
)

func main() {
	if err := run(); err != nil && !errors.Is(err, context.Canceled) {
		log.Printf("Connector error: %v", err)
		os.Exit(1)
	}
}

func run() error {
	apiClient, err := docker.NewClient()
	if err != nil {
		return fmt.Errorf("create Docker client: %w", err)
	}
	defer apiClient.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	return docker.ListenEvents(ctx, apiClient, func(event events.Message) error {
		fmt.Printf("Event: type=%s action=%s id=%s\n", event.Type, event.Action, event.Actor.ID)
		return nil
	})
}
