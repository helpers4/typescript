/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { increment } from "./increment";

describe("increment", () => {
  it("should increment patch version", () => {
    expect(increment("1.2.3", "patch")).toBe("1.2.4");
    expect(increment("v1.2.3", "patch")).toBe("v1.2.4");
  });

  it("should increment minor version and reset patch", () => {
    expect(increment("1.2.3", "minor")).toBe("1.3.0");
    expect(increment("v1.2.3", "minor")).toBe("v1.3.0");
  });

  it("should increment major version and reset minor and patch", () => {
    expect(increment("1.2.3", "major")).toBe("2.0.0");
    expect(increment("v1.2.3", "major")).toBe("v2.0.0");
  });

  it("should handle incomplete versions", () => {
    expect(increment("1.2", "patch")).toBe("1.2.1");
    expect(increment("1", "minor")).toBe("1.1.0");
  });

  it("should throw for invalid increment type", () => {
    expect(() => increment("1.0.0", "invalid" as any)).toThrow();
  });
});
