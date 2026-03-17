import { Badge } from "@shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

const MOCK_USERS = [
  {
    role: "org_admin",
    name: "Alice Admin",
    email: "alice@acme.dev",
    teams: ["All teams"],
    description: "Full access to all views and settings",
  },
  {
    role: "vp_cto",
    name: "Bob CTO",
    email: "bob@acme.dev",
    teams: ["Platform", "Infra"],
    description: "Executive overview, adoption, delivery, cost",
  },
  {
    role: "eng_manager",
    name: "Carol Manager",
    email: "carol@acme.dev",
    teams: ["Backend"],
    description: "All analytics views + settings",
  },
  {
    role: "platform_eng",
    name: "Dave Platform",
    email: "dave@acme.dev",
    teams: ["Platform"],
    description: "Adoption, delivery, operations",
  },
  {
    role: "ic_dev",
    name: "Eve Developer",
    email: "eve@acme.dev",
    teams: ["Frontend"],
    description: "Adoption, delivery views",
  },
  {
    role: "finops",
    name: "Frank FinOps",
    email: "frank@acme.dev",
    teams: ["Finance"],
    description: "Executive overview, cost & budgets",
  },
  {
    role: "security",
    name: "Grace Security",
    email: "grace@acme.dev",
    teams: ["Security"],
    description: "Quality & security view",
  },
];

export default function AuthPage() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Cloud Agent Platform</h1>
        <p className="mt-2 text-muted-foreground">
          Select a mock user to sign in
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_USERS.map((user) => (
          <a
            key={user.role}
            href={`/api/auth/callback?role=${user.role}`}
            className="block"
            data-testid={`login-${user.role}`}
          >
            <Card className="h-full transition-colors hover:border-primary hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{user.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Teams: {user.teams.join(", ")}
                </p>
                <p className="mt-1 text-xs text-muted-foreground italic">
                  {user.description}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
