import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/containers/$containerId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/containers/$containerId"!</div>
}
