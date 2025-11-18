import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Logo = ({ className, showText = true }: { className?: string; showText?: boolean }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline", className)}>
      <div className="p-1.5 bg-gradient-to-br from-primary to-brand-purple rounded-lg">
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      {showText && <span>AI Cart</span>}
    </Link>
  );
};

export default Logo;
