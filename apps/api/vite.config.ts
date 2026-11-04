import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      dev: {
        command: "vpx --watch src/index.ts",
        cache: false,
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
      build: {
        command: "tsc -p tsconfig.json",
        dependsOn: [{ task: "build", from: ["dependencies", "devDependencies"] }],
      },
    },
  },
});
