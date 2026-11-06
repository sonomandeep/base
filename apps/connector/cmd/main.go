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
	apiClient, err := docker.NewClient()
	if err != nil {
		panic(err)
	}
	defer apiClient.Close()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err = docker.ListenEvents(ctx, apiClient, func(event events.Message) error {
		fmt.Printf("Event: type=%s action=%s id=%s\n", event.Type, event.Action, event.Actor.ID)
		return nil
	})
	if err != nil && !errors.Is(err, context.Canceled) {
		log.Printf("Docker stream error: %v", err)
	}
}
