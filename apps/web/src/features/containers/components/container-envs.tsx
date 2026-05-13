import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "#/components/ui/item";

interface ContainerEnv {
  key: string;
  value: string;
}

interface ContainerEnvsProps {
  envs: ContainerEnv[];
}

function maskEnvValue(value: string) {
  return "•".repeat(Math.min(Math.max(value.length, 4), 32));
}

function getEnvKey(env: ContainerEnv, index: number) {
  return `${env.key}-${index}`;
}

export function ContainerEnvs({ envs }: ContainerEnvsProps) {
  const [visibleEnvKeys, setVisibleEnvKeys] = useState<Set<string>>(new Set());

  function toggleEnvVisibility(key: string) {
    setVisibleEnvKeys((keys) => {
      const nextKeys = new Set(keys);

      if (nextKeys.has(key)) {
        nextKeys.delete(key);
      } else {
        nextKeys.add(key);
      }

      return nextKeys;
    });
  }

  function copyEnvValue(value: string) {
    navigator.clipboard.writeText(value).catch(console.error);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="inline-flex w-full items-center justify-between pr-2 pl-4">
        <h2 className="font-medium">Envs</h2>
      </div>

      {envs.length > 0 ? (
        <ItemGroup className="gap-1">
          {envs.map((env, index) => {
            const envKey = getEnvKey(env, index);
            const isVisible = visibleEnvKeys.has(envKey);

            return (
              <Item
                className="w-full rounded-lg border-transparent"
                key={envKey}
                render={
                  <div className="grid w-full grid-cols-6 items-center gap-4">
                    <ItemContent className="col-span-2 min-w-0">
                      <ItemTitle className="truncate font-mono font-normal text-muted-foreground text-sm">
                        {env.key}
                      </ItemTitle>
                    </ItemContent>

                    <div className="col-span-3 min-w-0 truncate font-mono text-sm">
                      {isVisible ? env.value : maskEnvValue(env.value)}
                    </div>

                    <ItemActions className="col-span-1 justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/item:opacity-100">
                      <Button
                        aria-label={
                          isVisible
                            ? `Hide ${env.key} value`
                            : `Show ${env.key} value`
                        }
                        onClick={() => toggleEnvVisibility(envKey)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        {isVisible ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button
                        aria-label={`Copy ${env.key} value`}
                        onClick={() => copyEnvValue(env.value)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Copy />
                      </Button>
                    </ItemActions>
                  </div>
                }
              />
            );
          })}
        </ItemGroup>
      ) : (
        <p className="px-2 text-muted-foreground text-sm">
          No environment variables
        </p>
      )}
    </section>
  );
}
