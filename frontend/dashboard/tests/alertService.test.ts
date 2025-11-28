import { describe, it, expect } from "vitest";
import { alertService } from "../services/alertService";

describe("alertService", () => {
    it("returns only items that are Level1/Level2/Manual or high risk (>75)", async () => {
        const alerts = await alertService.fetchAlerts();
        expect(Array.isArray(alerts)).toBe(true);
        for (const a of alerts) {
            const isLevel = a.detection?.level && a.detection.level !== "Level 0";
            const highRisk = a.riskScore > 75;
            expect(isLevel || highRisk).toBe(true);
        }
    });
});
