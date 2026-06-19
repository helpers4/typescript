/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { basename } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { build, type InlineConfig } from 'vite';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';

/**
 * External dependencies that should not be bundled
 */
const EXTERNAL_DEPS = ['rxjs'];

/**
 * Compile a TypeScript file using Vite/Rollup build with rollup-plugin-dts for .d.ts generation.
 *
 * @param filePath - The path of the TypeScript file to compile.
 * @param outDir - The output directory for the compiled file.
 * @returns A promise that resolves when the compilation is complete.
 */
export async function compileTypeScript(filePath: string, outDir: string) {
  try {
    const fileName = basename(filePath, '.ts');

    // Build JS files with bundling using Vite/Rollup
    const viteConfig: InlineConfig = {
      configFile: false,
      build: {
        lib: {
          entry: filePath,
          name: fileName,
          formats: ['es'],
          fileName: () => `${fileName}.js`
        },
        outDir: outDir,
        emptyOutDir: false,
        rollupOptions: {
          external: EXTERNAL_DEPS,
          output: {
            preserveModules: false,
          }
        },
        minify: false,
        sourcemap: true
      },
      logLevel: 'silent'
    };

    await build(viteConfig);

    // Generate bundled .d.ts file using rollup-plugin-dts
    await generateBundledDeclarations(filePath, outDir, fileName);

  } catch (error) {
    console.error(`❌ Error compiling ${filePath}:`, error);
    throw error;
  }
}

/**
 * Generate bundled .d.ts files using rollup-plugin-dts
 */
async function generateBundledDeclarations(indexPath: string, outDir: string, fileName: string) {
  try {
    const bundle = await rollup({
      input: indexPath,
      plugins: [dts()],
      external: EXTERNAL_DEPS,
    });

    const outputPath = `${outDir}/${fileName}.d.ts`;

    await bundle.write({
      file: outputPath,
      format: 'es',
    });

    await bundle.close();

    // rollup-plugin-dts strips /// <reference lib="..."> directives.
    // Re-inject them so consumers don't need to configure their tsconfig manually.
    await injectLibReferences(outputPath);
  } catch (error) {
    console.warn(`⚠️ Declaration generation failed for ${indexPath}:`, error);
    // Don't throw - some files may not generate declarations cleanly
  }
}

/**
 * Re-inject lib references that rollup-plugin-dts strips from bundled .d.ts files.
 * Required because consumers should not need to configure their tsconfig manually
 * for features like Temporal that live in optional ESNext lib slices.
 */
async function injectLibReferences(dtsPath: string): Promise<void> {
  let content: string;
  try {
    content = await readFile(dtsPath, 'utf-8');
  } catch {
    return;
  }

  const refs: string[] = [];

  const TEMPORAL_REF = '/// <reference lib="esnext.temporal" />';
  // \bTemporal\. (with dot) is intentional: Temporal is a namespace, all its types are accessed
  // as Temporal.Duration, Temporal.Instant, etc. A bare \bTemporal\b would also match JSDoc
  // prose ("the Temporal API") and inject the directive for files that don't actually use the types.
  if (/\bTemporal\./.test(content) && !content.includes(TEMPORAL_REF)) {
    refs.push(TEMPORAL_REF);
  }

  if (refs.length > 0) {
    await writeFile(dtsPath, `${refs.join('\n')}\n\n${content}`);
  }
}
