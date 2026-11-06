package main

import (
	"context"
	"fmt"

	"github.com/moby/moby/client"
	"github.com/sonomandeep/base/apps/connector/internal/docker"
)

func main() {
	apiClient, err := docker.NewClient()
	if err != nil {
		panic(err)
	}
	defer apiClient.Close()

	result, err := apiClient.ContainerList(context.Background(), client.ContainerListOptions{
		All: true,
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("%s  %-22s  %s\n", "ID", "STATUS", "IMAGE")
	for _, ctr := range result.Items {
		fmt.Printf("%s  %-22s  %s\n", ctr.ID, ctr.Status, ctr.Image)
	}
}
