const CONTAINERS = [
  {
    id: 1,
    name: "API Gateway",
    image: "nginx:latest",
    cpu: 24,
    ram: 47,
    state: "HEALTHY",
  },
  {
    id: 2,
    name: "User Authentication",
    image: "auth-service:v2",
    cpu: 18,
    ram: 35,
    state: "DEGRADED",
  },
  {
    id: 3,
    name: "Notification Service",
    image: "notification-service:4.0.1",
    cpu: 51,
    ram: 79,
    state: "HEALTHY",
  },
  {
    id: 4,
    name: "Cache",
    image: "redis:6-alpine",
    cpu: 8,
    ram: 15,
    state: "STOPPED",
  },
  {
    id: 5,
    name: "Database",
    image: "postgres:latest",
    cpu: 12,
    ram: 29,
    state: "HEALTHY",
  },
];

export async function getContainers() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { data: CONTAINERS, error: null };
}
