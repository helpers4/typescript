/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { basename } from "node:path";
import { build, type InlineConfig } from 'vite';
import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';

/**
 * External dependencies that should not be bundled
 */
const EXTERNAL_DEPS = ['radashi', 'simple-deepcompare', 'angular-oauth2-oidc', 'rxjs'];

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
        sourcemap: false
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

    await bundle.write({
      file: `${outDir}/${fileName}.d.ts`,
      format: 'es',
    });

    await bundle.close();
  } catch (error) {
    console.warn(`⚠️ Declaration generation failed for ${indexPath}:`, error);
    // Don't throw - some files may not generate declarations cleanly
  }
}


