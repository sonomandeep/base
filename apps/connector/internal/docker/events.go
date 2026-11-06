package docker

import (
	"context"
	"fmt"

	"github.com/moby/moby/api/types/events"
	"github.com/moby/moby/client"
)

// ListenEvents handles Docker events sequentially until cancellation or an error.
func ListenEvents(ctx context.Context, apiClient *client.Client, handle func(events.Message) error) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	stream := apiClient.Events(ctx, client.EventsListOptions{})

	for {
		select {
		case event, ok := <-stream.Messages:
			if !ok {
				return nil
			}

			if err := handle(event); err != nil {
				return fmt.Errorf("handle Docker event: %w", err)
			}

		case err, ok := <-stream.Err:
			if ctx.Err() != nil {
				return ctx.Err()
			}
			if !ok || err == nil {
				return nil
			}
			return fmt.Errorf("read Docker events: %w", err)

		case <-ctx.Done():
			return ctx.Err()
		}
	}
}
