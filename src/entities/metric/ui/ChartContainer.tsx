import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import { Button } from "@shared/ui/button";

export interface ChartContainerProps {
  title: string;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  children: React.ReactNode;
  accessibilityData?: { headers: string[]; rows: (string | number)[][] };
}

export function ChartContainer({
  title,
  loading = false,
  error,
  onRetry,
  isEmpty = false,
  children,
  accessibilityData,
}: ChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div role="status" aria-label={`${title} loading`}>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-destructive">{error.message}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : isEmpty ? (
          <div
            role="status"
            aria-label="No data available"
            className="flex items-center justify-center py-8 text-sm text-muted-foreground"
          >
            No data available
          </div>
        ) : (
          <div role="img" aria-label={title}>
            {children}
            {accessibilityData && (
              <table className="sr-only">
                <thead>
                  <tr>
                    {accessibilityData.headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {accessibilityData.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
