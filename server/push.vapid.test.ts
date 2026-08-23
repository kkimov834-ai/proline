import { describe, expect, it } from "vitest";
import webpush from "web-push";
import { getPushPublicKey, isPushConfigured, prolineColumnLabel } from "./push";

describe("PROLINE VAPID configuration", () => {
  it("loads valid VAPID credentials into web-push", () => {
    const publicKey = process.env.PROLINE_VAPID_PUBLIC_KEY;
    const privateKey = process.env.PROLINE_VAPID_PRIVATE_KEY;
    const subject = process.env.PROLINE_VAPID_SUBJECT;

    expect(publicKey).toBeTruthy();
    expect(privateKey).toBeTruthy();
    expect(subject).toMatch(/^mailto:|^https?:/);

    expect(() => webpush.setVapidDetails(subject!, publicKey!, privateKey!)).not.toThrow();
  });

  it("exposes only the public key and keeps column labels localized", () => {
    expect(isPushConfigured()).toBe(true);
    expect(getPushPublicKey()).toMatch(/^B/);
    expect(prolineColumnLabel("production")).toBe("İstehsalat");
    expect(prolineColumnLabel("orders")).toBe("Sifarişlər");
  });
});
