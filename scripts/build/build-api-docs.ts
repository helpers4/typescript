/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Application, type ProjectReflection, type DeclarationReflection, type SignatureReflection, type ParameterReflection, type CommentTag } from 'typedoc';
import { DIR } from '../constants';
import { writeFile } from '../utils';

/** Serialized parameter for api.json */
interface ApiParam {
  readonly name: string;
  readonly type: string;
  readonly description: string;
}

/** Serialized function/type for api.json */
interface ApiMember {
  readonly name: string;
  readonly kind: 'function' | 'type' | 'interface' | 'variable';
  readonly description: string;
  readonly signature?: string;
  readonly params?: readonly ApiParam[];
  readonly returns?: string;
  readonly examples?: readonly string[];
}

/** Full api.json for one category */
interface CategoryApiJson {
  readonly category: string;
  readonly members: readonly ApiMember[];
}

function extractText(summary: Array<{ kind: string; text: string }> | undefined): string {
  if (!summary) return '';
  return summary.map(s => s.text).join('').trim();
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
  if (t.type === 'literal') return JSON.stringify(t.value);
  if (t.type === 'reflection') return 'object';
  return String(t.name || t.type || 'unknown');
}

function extractSignature(sig: SignatureReflection): string {
  const params = sig.parameters
    ?.map((p: ParameterReflection) => `${p.name}: ${serializeType(p.type)}`)
    .join(', ') ?? '';
  const ret = serializeType(sig.type);
  const typeParams = sig.typeParameters
    ?.map(tp => tp.name)
    .join(', ');
  const generics = typeParams ? `<${typeParams}>` : '';
  return `${sig.name}${generics}(${params}): ${ret}`;
}

function processMember(child: DeclarationReflection): ApiMember | undefined {
  const kindMap: Record<number, ApiMember['kind']> = {
    64: 'function',      // Function
    2097152: 'type',     // TypeAlias
    256: 'interface',    // Interface
    32: 'variable',      // Variable
  };

  const kind = kindMap[child.kind];
  if (!kind) return undefined;

  const sig = child.signatures?.[0] as SignatureReflection | undefined;
  const comment = sig?.comment ?? child.comment;

  const description = extractText(comment?.summary as Array<{ kind: string; text: string }> | undefined);
  const examples = extractExamples(comment?.blockTags as CommentTag[] | undefined);

  const member: ApiMember = {
    name: child.name,
    kind,
    description,
    ...(sig ? { signature: extractSignature(sig) } : {}),
    ...(sig?.parameters?.length ? {
      params: sig.parameters.map((p: ParameterReflection) => ({
        name: p.name,
        type: serializeType(p.type),
        description: extractText(p.comment?.summary as Array<{ kind: string; text: string }> | undefined),
      })),
    } : {}),
    ...(sig?.type ? { returns: serializeType(sig.type) } : {}),
    ...(examples.length ? { examples } : {}),
  };

  return member;
}

/**
 * Generates an `api.json` file in each built category directory
 * using TypeDoc to extract JSDoc information from source files.
 *
 * @param validCategories - Categories that were successfully built
 */
export async function buildApiDocs(validCategories: string[]): Promise<void> {
  for (const category of validCategories) {
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);

    // Only consider actual helper source files (not tests, examples, benchmarks, index, or _internal helpers)
    const sourceFiles = files
      .filter(f => f.endsWith('.ts'))
      .filter(f => !f.startsWith('_'))
      .filter(f => !f.match(/\.\w+\.ts$/))
      .filter(f => f !== 'index.ts');

    if (sourceFiles.length === 0) continue;

    const entryPoint = join(categoryPath, 'index.ts');

    const app = await Application.bootstrapWithPlugins({
      entryPoints: [entryPoint],
      tsconfig: join(DIR.ROOT, 'tsconfig.json'),
      excludeInternal: true,
      excludePrivate: true,
      disableSources: true,
    });

    const project: ProjectReflection | undefined = await app.convert();
    if (!project) {
      console.error(`   ⚠️  TypeDoc failed for ${category}`);
      continue;
    }

    const members: ApiMember[] = [];

    for (const child of project.children ?? []) {
      const member = processMember(child as DeclarationReflection);
      if (member) members.push(member);
    }

    // Sort by name for deterministic output
    members.sort((a, b) => a.name.localeCompare(b.name));

    const json: CategoryApiJson = { category, members };
    const outputPath = join(DIR.BUILD, category, 'api.json');
    writeFile(outputPath, JSON.stringify(json, null, 2));
  }
}
