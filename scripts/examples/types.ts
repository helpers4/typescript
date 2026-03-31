/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Defines a single usage example for a helper function.
 *
 * Used for:
 * 1. **Smoke tests** — assertions validate the build output works correctly
 * 2. **Website documentation** — `code` and `description` are rendered on the docs page
 */
export interface ExampleDefinition {
  /** Human-readable title for this example */
  readonly title: string;

  /** Short description of what the example demonstrates */
  readonly description: string;

  /**
   * The example code as a string literal — displayed on the website.
   * Should be self-contained and readable without additional context.
   */
  readonly code: string;

  /**
   * Assertion function that validates the helper works correctly.
   * Throws if the result is unexpected.
   */
  readonly assert: () => void | Promise<void>;
}

/**
 * Defines the full set of examples for one helper function.
 */
export interface HelperExamples {
  /** Name of the helper function (e.g., 'chunk', 'slugify') */
  readonly helper: string;

  /** Category the helper belongs to (e.g., 'array', 'string') */
  readonly category: string;

  /** List of usage examples */
  readonly examples: readonly ExampleDefinition[];
}
