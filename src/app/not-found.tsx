import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
      <div className="relative mb-8">
        <Sparkles className="absolute -top-8 -left-8 h-16 w-16 text-primary/30" />
        <Sparkles className="absolute -bottom-8 -right-8 h-16 w-16 text-primary/30" />
        <h1 className="text-9xl font-headline font-bold text-gradient bg-gradient-to-r from-primary to-brand-purple">404</h1>
      </div>
      <h2 className="mt-4 text-4xl font-headline font-semibold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Oops! It seems the page you were looking for has been moved, deleted, or perhaps never existed.
      </p>
      <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)]">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
