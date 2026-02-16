/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { compare } from "./compare";

describe("compare", () => {
  describe("core version comparison", () => {
    it("should return 0 for equal versions", () => {
      expect(compare("1.0.0", "1.0.0")).toBe(0);
      expect(compare("v1.0.0", "1.0.0")).toBe(0);
      expect(compare("0.0.0", "0.0.0")).toBe(0);
      expect(compare("10.20.30", "10.20.30")).toBe(0);
    });

    it("should return -1 when first version is lower", () => {
      expect(compare("1.0.0", "1.0.1")).toBe(-1);
      expect(compare("1.0.0", "1.1.0")).toBe(-1);
      expect(compare("1.0.0", "2.0.0")).toBe(-1);
      expect(compare("0.0.1", "0.0.2")).toBe(-1);
      expect(compare("1.9.0", "1.10.0")).toBe(-1);
    });

    it("should return 1 when first version is higher", () => {
      expect(compare("1.0.1", "1.0.0")).toBe(1);
      expect(compare("1.1.0", "1.0.0")).toBe(1);
      expect(compare("2.0.0", "1.0.0")).toBe(1);
      expect(compare("1.10.0", "1.9.0")).toBe(1);
    });

    it("should handle different lengths", () => {
      expect(compare("1.0", "1.0.0")).toBe(0);
      expect(compare("1.0.1", "1.0")).toBe(1);
      expect(compare("1.0", "1.0.1")).toBe(-1);
      expect(compare("1", "1.0.0")).toBe(0);
    });

    it("should handle v prefix", () => {
      expect(compare("v1.0.0", "v1.0.1")).toBe(-1);
      expect(compare("v2.0.0", "v1.0.0")).toBe(1);
      expect(compare("v1.0.0", "1.0.0")).toBe(0);
    });
  });

  describe("prerelease comparison", () => {
    it("should consider prerelease lower than release", () => {
      // SemVer spec: 1.0.0-alpha < 1.0.0
      expect(compare("1.0.0-alpha", "1.0.0")).toBe(-1);
      expect(compare("1.0.0", "1.0.0-alpha")).toBe(1);
      expect(compare("1.0.0-beta", "1.0.0")).toBe(-1);
      expect(compare("1.0.0-rc.1", "1.0.0")).toBe(-1);
    });

    it("should compare prerelease identifiers alphabetically", () => {
      // SemVer spec: 1.0.0-alpha < 1.0.0-beta
      expect(compare("1.0.0-alpha", "1.0.0-beta")).toBe(-1);
      expect(compare("1.0.0-beta", "1.0.0-alpha")).toBe(1);
      expect(compare("1.0.0-alpha", "1.0.0-alpha")).toBe(0);
    });

    it("should compare numeric prerelease identifiers numerically", () => {
      // SemVer spec: 1.0.0-alpha.1 < 1.0.0-alpha.2
      expect(compare("1.0.0-alpha.1", "1.0.0-alpha.2")).toBe(-1);
      expect(compare("1.0.0-alpha.2", "1.0.0-alpha.1")).toBe(1);
      expect(compare("1.0.0-alpha.1", "1.0.0-alpha.1")).toBe(0);
      expect(compare("1.0.0-1", "1.0.0-2")).toBe(-1);
      expect(compare("1.0.0-2", "1.0.0-11")).toBe(-1); // Numeric, not lexical
    });

    it("should consider numeric identifiers lower than alphanumeric", () => {
      // SemVer spec: numeric < alphanumeric
      expect(compare("1.0.0-1", "1.0.0-alpha")).toBe(-1);
      expect(compare("1.0.0-alpha", "1.0.0-1")).toBe(1);
    });

    it("should handle SemVer spec example ordering", () => {
      // 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
      const versions = [
        "1.0.0-alpha",
        "1.0.0-alpha.1",
        "1.0.0-alpha.beta",
        "1.0.0-beta",
        "1.0.0-beta.2",
        "1.0.0-beta.11",
        "1.0.0-rc.1",
        "1.0.0",
      ];

      for (let i = 0; i < versions.length - 1; i++) {
        expect(compare(versions[i], versions[i + 1])).toBe(-1);
        expect(compare(versions[i + 1], versions[i])).toBe(1);
      }
    });

    it("should handle longer prerelease has higher precedence", () => {
      // When all preceding identifiers are equal, larger set has higher precedence
      expect(compare("1.0.0-alpha", "1.0.0-alpha.1")).toBe(-1);
      expect(compare("1.0.0-alpha.1", "1.0.0-alpha")).toBe(1);
    });
  });

  describe("build metadata", () => {
    it("should ignore build metadata in comparison", () => {
      // SemVer spec: Build metadata MUST be ignored when determining version precedence
      expect(compare("1.0.0+build", "1.0.0")).toBe(0);
      expect(compare("1.0.0", "1.0.0+build")).toBe(0);
      expect(compare("1.0.0+build1", "1.0.0+build2")).toBe(0);
      expect(compare("1.0.0+20130313144700", "1.0.0+exp.sha.5114f85")).toBe(0);
    });

    it("should handle prerelease with build metadata", () => {
      expect(compare("1.0.0-alpha+001", "1.0.0-alpha+002")).toBe(0);
      expect(compare("1.0.0-alpha+build", "1.0.0-beta+build")).toBe(-1);
      expect(compare("1.0.0-beta+exp.sha.5114f85", "1.0.0")).toBe(-1);
    });
  });

  describe("edge cases", () => {
    it("should handle version 0.x.x", () => {
      expect(compare("0.0.1", "0.0.2")).toBe(-1);
      expect(compare("0.1.0", "0.0.99")).toBe(1);
    });

    it("should handle complex prerelease identifiers", () => {
      expect(compare("1.0.0-x.7.z.92", "1.0.0-x.7.z.93")).toBe(-1);
      expect(compare("1.0.0-0.3.7", "1.0.0-0.3.8")).toBe(-1);
    });

    it("should handle v prefix with prerelease", () => {
      expect(compare("v1.0.0-alpha", "v1.0.0-beta")).toBe(-1);
      expect(compare("v1.0.0-alpha", "1.0.0-alpha")).toBe(0);
    });

    it("should handle complex version strings with zeros", () => {
      expect(compare("0.0.0", "0.0.1")).toBe(-1);
      expect(compare("1.0.0", "1.0.0-rc.1")).toBe(1);
      expect(compare("2.0.0", "1.9.9")).toBe(1);
    });

    it("should handle longer prerelease arrays with mixed numeric and alphanumeric", () => {
      expect(compare("1.0.0-alpha.1.2", "1.0.0-alpha.1.3")).toBe(-1);
      expect(compare("1.0.0-1.2.3", "1.0.0-1.2.4")).toBe(-1);
      expect(compare("1.0.0-rc.1.beta.2", "1.0.0-rc.1.beta.10")).toBe(-1);
    });

    it("should handle numeric prerelease identifiers correctly", () => {
      expect(compare("1.0.0-10", "1.0.0-9")).toBe(1); // 10 > 9 numerically
      expect(compare("1.0.0-2.10", "1.0.0-2.9")).toBe(1); // 10 > 9 numerically
      expect(compare("1.0.0-10", "1.0.0-a")).toBe(-1); // numeric < alpha
    });

    it("should handle mixed prerelease and no prerelease", () => {
      expect(compare("1.0.0", "1.0.0-0")).toBe(1); // release > any prerelease
      expect(compare("1.0.0-a", "1.0.0")).toBe(-1); // prerelease < release
      expect(compare("2.0.0-zzz", "1.0.0")).toBe(1); // major difference dominates
    });

    it("should handle equal numeric identifiers in prerelease", () => {
      // Test case where numeric identifiers are equal, should continue to next
      expect(compare("1.0.0-1.1", "1.0.0-1.2")).toBe(-1); // First id equal (1==1), compare second (1<2)
      expect(compare("1.0.0-5.5", "1.0.0-5.10")).toBe(-1); // First id equal (5==5), compare second (5<10)
    });

    it("should handle equal alphanumeric identifiers in prerelease", () => {
      // Test case where alphanumeric identifiers are equal, should continue to next
      expect(compare("1.0.0-alpha.1", "1.0.0-alpha.2")).toBe(-1); // First id equal (alpha==alpha), compare second (1<2)
      expect(compare("1.0.0-beta.x", "1.0.0-beta.y")).toBe(-1); // First id equal (beta==beta), compare second (x<y)
      // Test alphanumeric ordering in else block
      expect(compare("1.0.0-beta.1", "1.0.0-alpha.2")).toBe(1); // beta > alpha
      expect(compare("1.0.0-gamma", "1.0.0-alpha")).toBe(1); // gamma > alpha
      // Test alphanumeric equal in else block (exercises both id1<id2 and implicit else)
      expect(compare("1.0.0-alpha.y", "1.0.0-alpha.x")).toBe(1); // alpha==alpha, then y>x (else branch of if id1<id2)
    });

    it("should handle multiple equal numeric identifiers with final difference", () => {
      // Test case where first numeric identifiers loop through equality with continue, then differ
      expect(compare("1.0.0-1.1.2", "1.0.0-1.1.3")).toBe(-1); // 1==1 (continue), 1==1 (continue), 2<3
      expect(compare("1.0.0-5.5.5", "1.0.0-5.5.6")).toBe(-1); // 5==5 (continue), 5==5 (continue), 5<6
      // Test with leading zeros (numeric comparison) - "01" and "1" should be treated as equal numbers
      expect(compare("1.0.0-01.1", "1.0.0-1.2")).toBe(-1); // parseInt("01") === parseInt("1") (1==1), continue, then 1<2
      expect(compare("1.0.0-05.2", "1.0.0-5.3")).toBe(-1); // parseInt("05") === parseInt("5") (5==5), continue, then 2<3
      // Test numeric identifiers that are equal (covers continue in numeric block)
      expect(compare("1.0.0-1.2.3", "1.0.0-1.2.4")).toBe(-1); // 1==1 (continue), 2==2 (continue), 3<4
    });

    it("should handle multiple equal alphanumeric identifiers with final difference", () => {
      // Test case where first alphanumeric identifiers loop through equality with continue, then differ
      expect(compare("1.0.0-alpha.beta.1", "1.0.0-alpha.beta.2")).toBe(-1); // alpha==alpha (continue), beta==beta (continue), 1<2
      expect(compare("1.0.0-a.b.x", "1.0.0-a.b.y")).toBe(-1); // a==a (continue), b==b (continue), x<y
      // Test alphanumeric equal cases (covers continue in alphanumeric else block)
      expect(compare("1.0.0-alpha.1", "1.0.0-alpha.1")).toBe(0); // alpha==alpha (continue), 1==1 (continue), no more identifiers, equal
      expect(compare("1.0.0-a.b.c", "1.0.0-a.b.c")).toBe(0); // a==a, b==b, c==c, equal
    });
  });
});
