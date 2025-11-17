import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold tracking-tight">Project: {params.projectId}</h1>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Project Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the project detail page for project {params.projectId}.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    