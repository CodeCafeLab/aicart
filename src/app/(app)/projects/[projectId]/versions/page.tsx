import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectVersionsPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold tracking-tight">Versions for Project: {params.projectId}</h1>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>History / Versions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the project versions page for project {params.projectId}.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    