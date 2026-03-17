import { Monitor } from "lucide-react";

interface MobileUnavailableProps {
  viewName: string;
}

export function MobileUnavailable({ viewName }: MobileUnavailableProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Monitor className="mb-4 size-12 text-muted-foreground" />
      <h2 className="text-lg font-semibold">{viewName}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This view requires a wider screen. Open on desktop for the full experience.
      </p>
    </div>
  );
}
