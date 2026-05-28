import Docker from "dockerode";
import { env } from "./env";

export const client = new Docker({ socketPath: env.DOCKER_SOCKET_PATH });
