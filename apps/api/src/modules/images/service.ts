import { client } from "../../lib/client";
import type { ImageModel } from "./model";

function getImageParts(reference?: string) {
  if (!reference || reference === "<none>:<none>") {
    return { name: "<none>", tag: "<none>" };
  }

  const [repository] = reference.split("@");
  const lastSlashIndex = repository.lastIndexOf("/");
  const lastColonIndex = repository.lastIndexOf(":");
  const hasTag = lastColonIndex > lastSlashIndex;
  const imageName = hasTag ? repository.slice(0, lastColonIndex) : repository;
  const tag = hasTag ? repository.slice(lastColonIndex + 1) : "latest";
  const parts = imageName.split("/");
  const registryCandidate = parts[0];
  const hasRegistry =
    parts.length > 1 &&
    (registryCandidate.includes(".") ||
      registryCandidate.includes(":") ||
      registryCandidate === "localhost");

  return {
    name: hasRegistry ? parts.slice(1).join("/") : imageName,
    tag,
  };
}

export async function getImages(): Promise<ImageModel["list"]> {
  const images = await client.listImages();

  return images.map((image) => {
    const reference = image.RepoTags?.[0] ?? image.RepoDigests?.[0];
    const parts = getImageParts(reference);

    return {
      id: image.Id,
      name: parts.name,
      size: image.Size ?? 0,
      tag: parts.tag,
    };
  });
}

export async function getImageSummary(): Promise<
  { data: ImageModel["summary"]; error: null } | { data: null; error: unknown }
> {
  try {
    const usage = await client.df();

    return {
      data: {
        size: usage.LayersSize ?? 0,
        total: usage.Images?.length ?? 0,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
