import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Home } from 'lucide-react';

const Astronaut = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="w-48 h-48 md:w-64 md:h-64 text-foreground"
    >
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.8}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0}} />
            </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="100" fill="url(#grad1)" />
        <g transform="translate(40 20) scale(0.9)">
            <path d="M101.5,41.5c0,11.3-9.2,20.5-20.5,20.5S60.5,52.8,60.5,41.5S69.7,21,81,21S101.5,30.2,101.5,41.5z" fill="hsl(var(--background))"/>
            <path d="M81,17c-13.5,0-24.5,11-24.5,24.5S67.5,66,81,66s24.5-11,24.5-24.5S94.5,17,81,17z M81,62c-11.3,0-20.5-9.2-20.5-20.5S69.7,21,81,21s20.5,9.2,20.5,20.5S92.3,62,81,62z" fill="hsl(var(--foreground))"/>
            <path d="M81,63.9c-26.6,0-48.2,21.6-48.2,48.2h96.4C129.2,85.5,107.6,63.9,81,63.9z" fill="hsl(var(--background))"/>
            <path d="M81,60c-28.7,0-52.1,23.4-52.1,52.1h104.2C133.1,83.4,109.7,60,81,60z M32.8,108.1C34.7,87.5,55.7,72,81,72c25.3,0,46.3,15.5,48.2,36.1H32.8z" fill="hsl(var(--foreground))"/>
            <path d="M74.8,81c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S77,81,74.8,81z" fill="hsl(var(--primary))"/>
            <path d="M87.3,81c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S89.5,81,87.3,81z" fill="hsl(var(--primary))"/>
            <path d="M81,95c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S86,95,81,95z" fill="hsl(var(--foreground))"/>
            <circle cx="20" cy="120" r="5" fill="hsl(var(--foreground))" />
            <circle cx="140" cy="30" r="3" fill="hsl(var(--foreground))" />
            <circle cx="150" cy="100" r="2" fill="hsl(var(--foreground))" />
        </g>
    </svg>
);

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,180,0,0.1),rgba(255,255,255,0))]"></div>
        <div className="relative">
            <Astronaut />
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl font-headline font-black text-foreground/5" style={{ textShadow: '0 0 10px hsla(var(--background), 0.5)'}}>
                404
            </h1>
        </div>

      <h2 className="mt-8 text-3xl md:text-5xl font-headline font-bold text-gradient bg-gradient-to-r from-primary to-brand-purple">
        Lost in Space?
      </h2>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        It seems you've drifted into uncharted territory. The page you're looking for has either been moved or is on a mission in a galaxy far, far away.
      </p>
      <Button asChild size="lg" className="mt-8 bg-gradient-to-r from-primary to-brand-purple text-primary-foreground shadow-[0_0_20px_theme(colors.primary/50%)] transition-all duration-300 hover:shadow-[0_0_35px_theme(colors.primary/70%)] hover:scale-105">
        <Link href="/dashboard">
          <Home className="mr-2 h-5 w-5" />
          Return to Base
        </Link>
      </Button>
    </div>
  );
}
