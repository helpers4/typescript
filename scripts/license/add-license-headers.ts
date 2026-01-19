/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Script to automatically add AGPL-3.0-or-later license headers
 * to TypeScript files in the helpers4 project.
 * 
 * Improvements:
 * - Uses glob package for file pattern matching
 * - Portable via PROJECT_ROOT environment variable
 * - Works in local, devcontainer, CI/CD environments
 * - Handles shebangs correctly
 * - Intelligently avoids duplicates
 * - Reads configuration dynamically from VS Code settings
 * - Consistent with psioniq.psi-header extension behavior
 */

import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { globSync } from "glob";

interface VsCodeSettings {
  "psi-header.templates": {
    language: string;
    template: string[];
  }[];
  "psi-header.lang-config": {
    language: string;
    begin: string;
    prefix: string;
    end: string;
    blankLinesAfter?: number;
  }[];
  "psi-header.config": {
    author: string;
    license: string;
    copyrightHolder: string;
  };
}

async function loadLicenseHeaderFromVsCode(): Promise<string> {
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const settingsPath = resolve(projectRoot, '.vscode/settings.json');
  const settingsContent = await readFile(settingsPath, 'utf-8');

  // More careful JSON cleanup - preserve structure
  const cleanedContent = settingsContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
  const settings: VsCodeSettings = JSON.parse(cleanedContent);

  // Find TypeScript template and lang config
  const tsTemplate = settings["psi-header.templates"]?.find(t => t.language === "typescript");
  const config = settings["psi-header.config"];

  if (!tsTemplate || !config) {
    throw new Error("TypeScript template or config not found in VS Code settings");
  }

  // Build header from template
  const templateLines = tsTemplate.template.map(line => {
    return line
      .replace("<<yeartoyear>>", "2025")
      .replace("<<copyrightHolder>>", config.copyrightHolder || "baxyz")
      .replace("<<spdxid>>", config.license || "AGPL-3.0-or-later");
  });

  // Use hardcoded comment format since lang-config parsing seems broken
  let header = '/**\n';
  templateLines.forEach(line => {
    header += ' * ' + line + '\n';
  });
  header += ' */\n\n';

  return header;
}

async function addLicenseHeader() {
  // Use current directory or environment variable
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  console.log(`🔍 Processing files in: ${projectRoot}`);

  // Load license header from VS Code settings
  const licenseHeader = await loadLicenseHeaderFromVsCode();

  // Search for all TypeScript files in the project
  const patterns = [
    "helpers/**/*.ts",
    "scripts/**/*.ts",
    "*.ts"  // root files like add-license-headers.ts
  ];

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalAdded = 0;

  for (const pattern of patterns) {
    const files = globSync(pattern, { cwd: projectRoot, nodir: true });

    for (const file of files) {
      totalProcessed++;

      // Exclude generated build files and others
      if (file.includes('node_modules') ||
        file.includes('build/') ||
        file.endsWith('.d.ts')) {
        totalSkipped++;
        continue;
      }

      const fullPath = resolve(projectRoot, file);

      try {
        const content = await readFile(fullPath, "utf-8");

        // Check if header already exists
        if (content.includes("This file is part of helpers4")) {
          console.log(`⏭️  Skipping ${file} - header already exists`);
          totalSkipped++;
          continue;
        }

        // Special handling for files starting with #!/usr/bin/env
        const lines = content.split('\n');
        let newContent = '';

        if (lines[0] && lines[0].startsWith('#!/')) {
          // Keep the shebang line
          newContent = lines[0] + '\n\n' + licenseHeader + lines.slice(1).join('\n');
        } else {
          newContent = licenseHeader + content;
        }

        await writeFile(fullPath, newContent);

        console.log(`✅ Added header to ${file}`);
        totalAdded++;
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${totalProcessed}`);
  console.log(`   Headers added: ${totalAdded}`);
  console.log(`   Files skipped: ${totalSkipped}`);
}

addLicenseHeader().catch(console.error);
