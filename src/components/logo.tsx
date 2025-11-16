import { HeartPulse } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 text-xl font-bold text-primary sm:text-2xl">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <HeartPulse className="h-6 w-6" />
      </div>
      <h1 className="font-headline font-extrabold tracking-tight">PulsePad</h1>
    </div>
  );
}
