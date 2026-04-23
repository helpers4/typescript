/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureDir } from 'fs-extra';
import {
  Application,
  type CommentTag,
  type DeclarationReflection,
  type ParameterReflection,
  type ProjectReflection,
  ReflectionKind,
  type SignatureReflection,
  type TypeParameterReflection,
} from 'typedoc';
import { DIR } from '../constants';
import { readFileJson, writeFile } from '../utils';
import { getExternalDependencies } from './helpers/get-external-dependencies.helper';

// ---------------------------------------------------------------------------
// Types — website-enriched metadata
// ---------------------------------------------------------------------------

interface WebsiteTypeParam {
  readonly name: string;
  readonly constraint?: string;
  readonly default?: string;
}

interface WebsiteParam {
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly optional?: boolean;
  readonly defaultValue?: string;
}

interface WebsiteReturn {
  readonly type: string;
  readonly description: string;
}

interface WebsiteSignature {
  readonly signature: string;
  readonly description: string;
  readonly params: readonly WebsiteParam[];
  readonly returns: WebsiteReturn;
  readonly typeParameters?: readonly WebsiteTypeParam[];
}

interface WebsiteExample {
  readonly title: string;
  readonly description: string;
  readonly code: string;
}

interface WebsiteRelatedType {
  readonly name: string;
  readonly description: string;
  readonly typeDefinition: string;
}

interface WebsiteFunction {
  readonly name: string;
  readonly kind: 'function' | 'type' | 'interface' | 'variable';
  readonly description: string;
  readonly since: string;
  readonly signatures: readonly WebsiteSignature[];
  readonly examples: readonly WebsiteExample[];
  readonly sourceFile: string;
  readonly typeDefinition?: string;
  readonly relatedTypes?: readonly WebsiteRelatedType[];
}

interface WebsiteDependency {
  readonly name: string;
  readonly license: string;
  readonly homepage?: string;
  readonly repository?: string;
}

interface WebsiteApiJson {
  readonly category: string;
  readonly version: string;
  readonly functions: readonly WebsiteFunction[];
}

interface WebsiteExamplesJson {
  readonly category: string;
  readonly functions: readonly { name: string; examples: readonly WebsiteExample[] }[];
}

interface WebsiteLicensesJson {
  readonly category: string;
  readonly dependencies: readonly WebsiteDependency[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractText(summary: Array<{ kind: string; text: string }> | undefined): string {
  if (!summary) return '';
  return summary.map(s => s.text).join('').trim();
}

function extractTagText(tags: CommentTag[] | undefined, tagName: string): string | undefined {
  if (!tags) return undefined;
  const tag = tags.find(t => t.tag === tagName);
  if (!tag) return undefined;
  return extractText(tag.content as Array<{ kind: string; text: string }>);
}

function extractExamples(tags: CommentTag[] | undefined): string[] {
  if (!tags) return [];
  return tags
    .filter(t => t.tag === '@example')
    .map(t => extractText(t.content as Array<{ kind: string; text: string }>))
    .filter(Boolean);
}

function serializeType(type: unknown): string {
  if (!type) return 'unknown';
  const t = type as Record<string, unknown>;
  if (t.type === 'intrinsic') return t.name as string;
  if (t.type === 'array') return `${serializeType(t.elementType)}[]`;
  if (t.type === 'reference') {
    const args = t.typeArguments as unknown[] | undefined;
    const name = t.name as string;
    if (args?.length) return `${name}<${args.map(serializeType).join(', ')}>`;
    return name;
  }
  if (t.type === 'union') return (t.types as unknown[]).map(serializeType).join(' | ');
  if (t.type === 'intersection') return (t.types as unknown[]).map(serializeType).join(' & ');
  if (t.type === 'literal') return JSON.stringify(t.value);
  if (t.type === 'namedTupleMember') {
    const memberName = t.name as string;
    const isOptional = (t.isOptional as boolean | undefined) ? '?' : '';
    return `${memberName}${isOptional}: ${serializeType(t.element)}`;
  }
  if (t.type === 'tuple') {
    const elems = (t.elements as unknown[]) ?? [];
    return `[${elems.map(serializeType).join(', ')}]`;
  }
  if (t.type === 'reflection') {
    const decl = t.declaration as Record<string, unknown> | undefined;
    if (decl?.signatures) return 'function';
    return 'object';
  }
  if (t.type === 'typeOperator') {
    const op = t.operator as string;
    const target = serializeType(t.target);
    return `${op} ${target}`;
  }
  if (t.type === 'predicate') {
    const name = t.name as string;
    if (t.targetType) return `${name} is ${serializeType(t.targetType)}`;
    return name;
  }
  return String(t.name || t.type || 'unknown');
}

function buildSignatureString(sig: SignatureReflection): string {
  const params = sig.parameters
    ?.map((p: ParameterReflection) => {
      const opt = p.flags?.isOptional ? '?' : '';
      return `${p.name}${opt}: ${serializeType(p.type)}`;
    })
    .join(', ') ?? '';
  const ret = serializeType(sig.type);
  const typeParams = sig.typeParameters
    ?.map((tp: TypeParameterReflection) => {
      let s = tp.name;
      if (tp.type) s += ` extends ${serializeType(tp.type)}`;
      if (tp.default) s += ` = ${serializeType(tp.default)}`;
      return s;
    })
    .join(', ');
  const generics = typeParams ? `<${typeParams}>` : '';
  return `${sig.name}${generics}(${params}): ${ret}`;
}

function processSignature(sig: SignatureReflection): WebsiteSignature {
  const comment = sig.comment;
  const description = extractText(comment?.summary as Array<{ kind: string; text: string }> | undefined);
  const returnsDesc = extractTagText(comment?.blockTags as CommentTag[] | undefined, '@returns') ?? '';

  return {
    signature: buildSignatureString(sig),
    description,
    params: (sig.parameters ?? []).map((p: ParameterReflection) => ({
      name: p.name,
      type: serializeType(p.type),
      description: extractText(p.comment?.summary as Array<{ kind: string; text: string }> | undefined),
      ...(p.flags?.isOptional ? { optional: true } : {}),
      ...(p.defaultValue ? { defaultValue: p.defaultValue } : {}),
    })),
    returns: {
      type: serializeType(sig.type),
      description: returnsDesc,
    },
    ...(sig.typeParameters?.length ? {
      typeParameters: sig.typeParameters.map((tp: TypeParameterReflection) => ({
        name: tp.name,
        ...(tp.type ? { constraint: serializeType(tp.type) } : {}),
        ...(tp.default ? { default: serializeType(tp.default) } : {}),
      })),
    } : {}),
  };
}

function processMember(child: DeclarationReflection): WebsiteFunction | undefined {
  const kindMap: Record<number, WebsiteFunction['kind']> = {
    [ReflectionKind.Function]: 'function',
    [ReflectionKind.TypeAlias]: 'type',
    [ReflectionKind.Interface]: 'interface',
    [ReflectionKind.Variable]: 'variable',
  };

  const kind = kindMap[child.kind];
  if (!kind) return undefined;

  // All signatures (supports overloads)
  const signatures = (child.signatures ?? []).map(sig =>
    processSignature(sig as SignatureReflection)
  );

  // Primary comment (first signature or declaration)
  const primarySig = child.signatures?.[0] as SignatureReflection | undefined;
  const comment = primarySig?.comment ?? child.comment;

  const description = extractText(comment?.summary as Array<{ kind: string; text: string }> | undefined);
  const since = extractTagText(comment?.blockTags as CommentTag[] | undefined, '@since') ?? 'unknown';
  const examples = extractExamples(comment?.blockTags as CommentTag[] | undefined);

  // For type aliases: build the `type Name<T> = ...` definition string
  let typeDefinition: string | undefined;
  if (kind === 'type' && (child as unknown as Record<string, unknown>).type) {
    const rawType = (child as unknown as Record<string, unknown>).type;
    const typeStr = serializeType(rawType);
    const typeParams = child.typeParameters
      ?.map((tp: TypeParameterReflection) => {
        let s = tp.name;
        if (tp.type) s += ` extends ${serializeType(tp.type)}`;
        if (tp.default) s += ` = ${serializeType(tp.default)}`;
        return s;
      })
      .join(', ');
    const generics = typeParams ? `<${typeParams}>` : '';
    typeDefinition = `type ${child.name}${generics} = ${typeStr}`;
  }

  // Source file name
  const sourceFile = child.sources?.[0]?.fileName
    ?? `${child.name}.ts`;
  const fileName = sourceFile.includes('/')
    ? sourceFile.split('/').pop()!
    : sourceFile;

  return {
    name: child.name,
    kind,
    description,
    since,
    signatures,
    examples: examples.map(code => ({
      title: child.name,
      description: '',
      code,
    })),
    sourceFile: fileName,
    ...(typeDefinition ? { typeDefinition } : {}),
  };
}

function readDependencyLicense(packageName: string): WebsiteDependency {
  const pkgJsonPath = join(DIR.ROOT, 'node_modules', packageName, 'package.json');
  const pkg = readFileJson<Record<string, unknown>>(pkgJsonPath);

  const repository = typeof pkg.repository === 'string'
    ? pkg.repository
    : (pkg.repository as Record<string, string> | undefined)?.url;

  const cleanRepo = repository
    ?.replace(/^git\+/, '')
    ?.replace(/\.git$/, '');

  const license = typeof pkg.license === 'string'
    ? pkg.license
    : (pkg.license as Record<string, string> | undefined)?.type ?? 'UNKNOWN';

  return {
    name: packageName,
    license,
    ...(pkg.homepage ? { homepage: pkg.homepage as string } : {}),
    ...(cleanRepo ? { repository: cleanRepo } : {}),
  };
}

// ---------------------------------------------------------------------------
// Merge examples from .example.ts files
// ---------------------------------------------------------------------------

interface HelperExamples {
  helper: string;
  examples: Array<{ title: string; description: string; code: string; assert: () => void }>;
}

async function loadExampleFiles(
  category: string
): Promise<Map<string, WebsiteExample[]>> {
  const categoryPath = join(DIR.HELPERS, category);
  const files = await readdir(categoryPath);
  const exampleFiles = files.filter(f => f.endsWith('.example.ts')).sort();

  const map = new Map<string, WebsiteExample[]>();

  for (const file of exampleFiles) {
    const filePath = join(process.cwd(), categoryPath, file);
    const mod = await import(filePath) as { default: HelperExamples };
    const helperExamples = mod.default;

    map.set(helperExamples.helper, helperExamples.examples.map(ex => ({
      title: ex.title,
      description: ex.description,
      code: ex.code,
    })));
  }

  return map;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Generates enriched metadata files for the website in `build/<category>/meta/`.
 * Produces four files per category, plus an optional fifth file when native
 * alternatives are defined for that category:
 * - `meta/api.json` — full function docs with overloads, @since, type parameters
 * - `meta/category.json` — category label and descriptions for the website
 * - `meta/examples.json` — examples per function
 * - `meta/licenses.json` — third-party dependency license metadata
 * - `meta/native-alternatives.json` — optional native alternatives metadata
 *
 * @param validCategories - Categories that were successfully built
 */
export async function buildWebsiteMetadata(validCategories: string[]): Promise<void> {
  const rootPkg = readFileJson<Record<string, unknown>>(join(DIR.ROOT, 'package.json'));
  const version = rootPkg.version as string;

  // Load native alternatives once (keyed by category)
  const nativeAlternatives = readFileJson<Record<string, unknown[]>>(
    join(DIR.ROOT, 'docs', 'native-alternatives.json')
  );

  for (const category of validCategories) {
    const categoryPath = join(DIR.HELPERS, category);
    const metaDir = join(DIR.BUILD, category, 'meta');
    await ensureDir(metaDir);

    const files = await readdir(categoryPath);
    const sourceFiles = files
      .filter(f => f.endsWith('.ts'))
      .filter(f => !f.match(/\.\w+\.ts$/))
      .filter(f => f !== 'index.ts');

    if (sourceFiles.length === 0) continue;

    // --- API ---
    const entryPoint = join(categoryPath, 'index.ts');

    const app = await Application.bootstrapWithPlugins({
      entryPoints: [entryPoint],
      tsconfig: join(DIR.ROOT, 'tsconfig.json'),
      excludeInternal: true,
      excludePrivate: true,
      disableSources: false, // keep sources for sourceFile
    });

    const project: ProjectReflection | undefined = await app.convert();
    if (!project) {
      console.error(`   ⚠️  TypeDoc failed for ${category}`);
      continue;
    }

    const functions: WebsiteFunction[] = [];

    for (const child of project.children ?? []) {
      const fn = processMember(child as DeclarationReflection);
      if (fn) functions.push(fn);
    }

    // Merge .example.ts examples into functions (richer than JSDoc @example)
    const exampleMap = await loadExampleFiles(category);

    // --- Detect 1:1 companion types (type that shares sourceFile with exactly one function) ---
    // These will be embedded in their companion function's page instead of having a standalone page.
    const funcNamesBySourceFile = new Map<string, string[]>();
    for (const fn of functions) {
      if (fn.kind === 'function') {
        const list = funcNamesBySourceFile.get(fn.sourceFile) ?? [];
        list.push(fn.name);
        funcNamesBySourceFile.set(fn.sourceFile, list);
      }
    }

    // companion types indexed by their companion function name
    const companionTypesMap = new Map<string, WebsiteRelatedType[]>();
    const companionTypeNames = new Set<string>();
    for (const fn of functions) {
      if (fn.kind !== 'type') continue;
      const sharedWithFunctions = funcNamesBySourceFile.get(fn.sourceFile) ?? [];
      if (sharedWithFunctions.length === 1) {
        // 1:1 companion — embed in the function
        companionTypeNames.add(fn.name);
        const companionFnName = sharedWithFunctions[0];
        const list = companionTypesMap.get(companionFnName) ?? [];
        list.push({
          name: fn.name,
          description: fn.description,
          typeDefinition: fn.typeDefinition ?? fn.name,
        });
        companionTypesMap.set(companionFnName, list);
      }
      // 1:N companions keep their standalone page — no action needed
    }

    const enrichedFunctions = functions
      .filter(fn => !companionTypeNames.has(fn.name)) // exclude 1:1 companion types
      .map(fn => {
        const fileExamples = exampleMap.get(fn.name);
        const relatedTypes = companionTypesMap.get(fn.name) ?? [];
        return {
          ...fn,
          ...(fileExamples?.length ? { examples: fileExamples } : {}),
          ...(relatedTypes.length ? { relatedTypes } : {}),
        };
      });

    enrichedFunctions.sort((a, b) => a.name.localeCompare(b.name));

    const apiJson: WebsiteApiJson = {
      category,
      version,
      functions: enrichedFunctions,
    };

    writeFile(join(metaDir, 'api.json'), JSON.stringify(apiJson, null, 2));

    // --- Examples (standalone file for convenience) ---
    const examplesJson: WebsiteExamplesJson = {
      category,
      functions: enrichedFunctions
        .filter(fn => fn.examples.length > 0)
        .map(fn => ({ name: fn.name, examples: fn.examples })),
    };

    writeFile(join(metaDir, 'examples.json'), JSON.stringify(examplesJson, null, 2));

    // --- Licenses ---
    const externalDeps = await getExternalDependencies(category);
    const dependencies = externalDeps.map(readDependencyLicense);

    const licensesJson: WebsiteLicensesJson = { category, dependencies };
    writeFile(join(metaDir, 'licenses.json'), JSON.stringify(licensesJson, null, 2));

    // --- Category metadata (label, descriptions for the website) ---
    const categoryConfig = readFileJson<Record<string, string>>(
      join(DIR.HELPERS, category, 'config.json')
    );
    writeFile(
      join(metaDir, 'category.json'),
      JSON.stringify({ category, ...categoryConfig }, null, 2)
    );

    // --- Native alternatives (filtered for this category) ---
    const categoryAlternatives = nativeAlternatives[category];
    if (categoryAlternatives) {
      writeFile(
        join(metaDir, 'native-alternatives.json'),
        JSON.stringify({ category, functions: categoryAlternatives }, null, 2)
      );
    }
  }
}
