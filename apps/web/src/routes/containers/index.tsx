import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/containers/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/containers/"!</div>
}
