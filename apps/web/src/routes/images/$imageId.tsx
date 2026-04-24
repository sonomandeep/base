import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/images/$imageId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/images/$imageId"!</div>
}
