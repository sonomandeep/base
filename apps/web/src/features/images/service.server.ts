import { docker } from "#/lib/docker/client.server";
import { type ImageListItem, imageListSchema } from "./schema";

export interface ImageStateSummary {
  size: number;
  total: number;
}

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

export async function getImageStateSummary() {
  try {
    const usage = await docker.df();
    const summary: ImageStateSummary = {
      size: usage.LayersSize ?? 0,
      total: usage.Images?.length ?? 0,
    };

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getImages() {
  try {
    const images = await docker.listImages();
    const data: ImageListItem[] = images.map((image) => {
      const reference = image.RepoTags?.[0] ?? image.RepoDigests?.[0];
      const parts = getImageParts(reference);

      return {
        id: image.Id,
        name: parts.name,
        size: image.Size ?? 0,
        tag: parts.tag,
      };
    });

    return { data: imageListSchema.parse(data), error: null };
  } catch (error) {
    return { data: [], error };
  }
}
