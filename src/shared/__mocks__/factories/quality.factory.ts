import { faker } from "@faker-js/faker";
import type { QualityResponse } from "@pages/quality/api/schemas";

export function createQualityResponse(
  overrides?: Partial<QualityResponse>,
): QualityResponse {
  const totalRuns = faker.number.int({ min: 100, max: 2000 });
  const passRate = faker.number.float({ min: 70, max: 99, fractionDigits: 1 });

  const approved = faker.number.int({ min: 100, max: 500 });
  const changesReq = faker.number.int({ min: 10, max: 100 });
  const closedUnmerged = faker.number.int({ min: 1, max: 30 });
  const totalOutcomes = approved + changesReq + closedUnmerged;

  const violationTypes = ["secret_exposure", "large_file", "license_violation", "unsafe_dependency"];
  const violations = faker.helpers
    .arrayElements(violationTypes, { min: 0, max: 3 })
    .map((vType) => {
      const count = faker.number.int({ min: 1, max: 10 });
      return {
        violation_type: vType,
        severity: faker.helpers.arrayElement(["low", "medium", "high", "critical"] as const),
        count,
        latest_timestamp: faker.date.recent().toISOString(),
        details: Array.from({ length: Math.min(count, 3) }, () => ({
          id: faker.string.uuid(),
          timestamp: faker.date.recent().toISOString(),
          resource: `src/${faker.system.fileName()}`,
          message: faker.lorem.sentence(),
        })),
      };
    });

  return {
    data: {
      ci_pass_rate: {
        first_run_passed: passRate,
        first_run_failed: parseFloat((100 - passRate).toFixed(1)),
        total_runs: totalRuns,
      },
      review_outcomes: {
        approved,
        changes_requested: changesReq,
        closed_unmerged: closedUnmerged,
        distribution: [
          { outcome: "approved", count: approved, percentage: parseFloat(((approved / totalOutcomes) * 100).toFixed(1)) },
          { outcome: "changes_requested", count: changesReq, percentage: parseFloat(((changesReq / totalOutcomes) * 100).toFixed(1)) },
          { outcome: "closed_unmerged", count: closedUnmerged, percentage: parseFloat(((closedUnmerged / totalOutcomes) * 100).toFixed(1)) },
        ],
      },
      policy_violations: violations,
    },
    meta: {
      time_range: faker.helpers.arrayElement(["7d", "30d", "90d"]),
      org_id: faker.string.uuid(),
      generated_at: new Date().toISOString(),
    },
    ...overrides,
  };
}
