import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Ready!</CardTitle>
          <CardDescription>
            Your Next.js project with shadcn/ui is set up.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm leading-loose">
          <div>
            <p>We've added the following tools:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>shadcn/ui components (Button, Card, Form, etc.)</li>
              <li>Firebase (Auth, Firestore, Storage)</li>
              <li>React Hook Form & Zod</li>
              <li>Axios & Day.js</li>
            </ul>
            <Button className="mt-4 w-full">Get Started</Button>
          </div>
          <div className="mt-4 text-center font-mono text-xs text-muted-foreground">
            (Press <kbd className="rounded bg-muted px-1 py-0.5">d</kbd> to
            toggle dark mode)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
