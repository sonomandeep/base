import Docker from "dockerode";

const socketPath = process.env.DOCKER_SOCKET_PATH ?? "/var/run/docker.sock";

export const docker = new Docker({ socketPath });
