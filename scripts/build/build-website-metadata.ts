/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
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

// TypeDoc content parts — each text segment carries a `kind` discriminant and the raw `text`.
type ContentPart = { kind: string; text: string };

// Shared scanner context types used by buildCommentRanges and findTopLevelSemicolon.
type ScanCodeCtx = { kind: 'code'; depth: number };
type ScanStrCtx  = { kind: 'str';  ch: string };
type ScanTmplCtx = { kind: 'tmpl' };
type ScanCtx = ScanCodeCtx | ScanStrCtx | ScanTmplCtx;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractText(summary: ContentPart[] | undefined): string {
  if (!summary) return '';
  return summary.map(s => s.text).join('').trim();
}

function extractTagText(tags: CommentTag[] | undefined, tagName: string): string | undefined {
  if (!tags) return undefined;
  const tag = tags.find(t => t.tag === tagName);
  if (!tag) return undefined;
  return extractText(tag.content as ContentPart[]);
}

function extractExamples(tags: CommentTag[] | undefined): string[] {
  if (!tags) return [];
  return tags
    .filter(t => t.tag === '@example')
    .map(t => extractText(t.content as ContentPart[]))
    .filter(Boolean);
}

/** A type alias or an interface — as opposed to a function or a variable. */
function isTypeOrInterface(kind: WebsiteFunction['kind']): boolean {
  return kind === 'type' || kind === 'interface';
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
  const description = extractText(comment?.summary as ContentPart[] | undefined);
  const returnsDesc = extractTagText(comment?.blockTags as CommentTag[] | undefined, '@returns') ?? '';

  return {
    signature: buildSignatureString(sig),
    description,
    params: (sig.parameters ?? []).map((p: ParameterReflection) => ({
      name: p.name,
      type: serializeType(p.type),
      description: extractText(p.comment?.summary as ContentPart[] | undefined),
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

// Caches source file contents so a file with multiple exported type aliases
// is only read from disk once.
const sourceFileCache = new Map<string, string>();

function readSourceCached(path: string): string {
  let src = sourceFileCache.get(path);
  if (src === undefined) {
    src = readFileSync(path, 'utf-8');
    sourceFileCache.set(path, src);
  }
  return src;
}

/**
 * Pre-scans `src` once and returns a sorted array of `[start, end]` character
 * ranges covering every line comment (`//`) and block comment (`/* … *​/`).
 *
 * Uses a context stack (shared `ScanCtx` types) so that comment-like sequences
 * inside string or template literals are correctly ignored. Template interpolations
 * (`${…}`) are tracked with brace-depth counting so that a `}` only exits the
 * interpolation's code context when it matches the opening `{`, not an inner brace.
 *
 * Call once per source file; reuse the result with `isInCommentRange` (O(log n)).
 */
function buildCommentRanges(src: string): [number, number][] {
  const ranges: [number, number][] = [];
  const stack: ScanCtx[] = [{ kind: 'code', depth: 0 }];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const ctx = stack[stack.length - 1];

    if (ctx.kind === 'str') {
      if (c === '\\') { i += 2; continue; }
      if (c === ctx.ch) stack.pop();
      i++;
      continue;
    }

    if (ctx.kind === 'tmpl') {
      if (c === '\\') { i += 2; continue; }
      if (c === '$' && src[i + 1] === '{') { stack.push({ kind: 'code', depth: 0 }); i += 2; continue; }
      if (c === '`') stack.pop();
      i++;
      continue;
    }

    // Code context: top-level or inside a ${…} interpolation.
    if (c === '\\') { i += 2; continue; } // skip escaped char (e.g. '\/*' inside a regex literal)
    if (c === '/' && src[i + 1] === '/') {
      const start = i;
      while (i < src.length && src[i] !== '\n') i++;
      ranges.push([start, i - 1]);
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      ranges.push([start, i + 1]);
      i += 2;
      continue;
    }
    if (c === '"' || c === "'") { stack.push({ kind: 'str', ch: c }); i++; continue; }
    if (c === '`')               { stack.push({ kind: 'tmpl' });       i++; continue; }
    if (c === '{') {
      ctx.depth++;
    } else if (c === '}') {
      if (ctx.depth === 0 && stack.length > 1) stack.pop(); // close ${…}, resume template body
      else if (ctx.depth > 0) ctx.depth--;
    }
    i++;
  }
  return ranges;
}

// Caches comment ranges per source file so each file is scanned only once
// across all processMember calls for the same build category.
const commentRangesCache = new Map<string, [number, number][]>();

function getCommentRanges(srcPath: string): [number, number][] {
  let ranges = commentRangesCache.get(srcPath);
  if (!ranges) {
    ranges = buildCommentRanges(readSourceCached(srcPath));
    commentRangesCache.set(srcPath, ranges);
  }
  return ranges;
}

/** O(log n) binary search: is `pos` inside any pre-computed comment span? */
function isInCommentRange(ranges: [number, number][], pos: number): boolean {
  let lo = 0, hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const [start, end] = ranges[mid];
    if (pos < start) hi = mid - 1;
    else if (pos > end) lo = mid + 1;
    else return true;
  }
  return false;
}

/**
 * Finds the index of the `;` that terminates a type alias starting at `start`,
 * skipping over brackets/semicolons that appear inside string/template literals
 * or comments (e.g. a string-literal type like `'{' | '}' | ';'`).
 *
 * Uses a context stack to correctly handle nested template literals such as
 * `\`${\`inner\`}\`` — a flat quote variable would exit the outer template
 * prematurely when it saw the inner closing backtick.
 */
function findTopLevelSemicolon(src: string, start: number): number {
  const stack: ScanCtx[] = [{ kind: 'code', depth: 0 }];
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    const ctx = stack[stack.length - 1];

    // Inside a plain string literal — skip until the closing quote.
    if (ctx.kind === 'str') {
      if (ch === '\\') { i++; }
      else if (ch === ctx.ch) { stack.pop(); }
      continue;
    }

    // Inside a template literal body — watch for escape, ${ and closing `.
    if (ctx.kind === 'tmpl') {
      if (ch === '\\') { i++; }
      else if (ch === '$' && next === '{') { stack.push({kind: 'code', depth: 0}); i++; }
      else if (ch === '`') { stack.pop(); }
      continue;
    }

    // Code context: top-level or inside a ${...} expression.
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') { inBlockComment = false; i++; }
      continue;
    }

    if (ch === '/' && next === '/') { inLineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (ch === "'" || ch === '"')   { stack.push({kind: 'str', ch}); continue; }
    if (ch === '`')                  { stack.push({kind: 'tmpl'}); continue; }

    if (ch === '{' || ch === '(' || ch === '[') {
      ctx.depth++;
    } else if (ch === '}' || ch === ')' || ch === ']') {
      if (ch === '}' && ctx.depth === 0 && stack.length > 1) {
        stack.pop(); // close the ${...} expression, resume template body
      } else if (ctx.depth > 0) {
        ctx.depth--;
      }
    } else if (ch === ';' && ctx.depth === 0 && stack.length === 1) {
      return i;
    }
  }
  return src.length;
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

  const description = extractText(comment?.summary as ContentPart[] | undefined);
  const since = extractTagText(comment?.blockTags as CommentTag[] | undefined, '@since') ?? 'unknown';

  // Double-safety: exclude anything without an explicit @since tag.
  // Primary guard is @internal + excludeInternal:true in TypeDoc options.
  // Types/interfaces are exempt: the repo's own convention (see AGENTS.md and
  // e.g. RgbColor, CapitalizeOptions) is that a companion type documented
  // alongside its function does *not* get its own @since — it inherits
  // relevance from whatever function(s) it's attached to below, and `since`
  // isn't read from WebsiteRelatedType at all. Applying this check to types
  // silently dropped every convention-following companion type from the
  // website (verified: CapitalizeOptions, RgbColor, TrimMode were all missing
  // from their function's relatedTypes because of this).
  if (since === 'unknown' && !isTypeOrInterface(kind)) return undefined;

  const examples = extractExamples(comment?.blockTags as CommentTag[] | undefined);

  // For type aliases: read the definition verbatim from the source file so that
  // complex constructs (conditional types, mapped types, etc.) render correctly.
  // For interfaces: build the `interface Name { ... }` definition string
  let typeDefinition: string | undefined;
  if (kind === 'type') {
    const srcRef = child.sources?.[0] as ({ fullFileName?: string } & object) | undefined;
    const srcPath = srcRef?.fullFileName;
    if (srcPath) {
      try {
        const src = readSourceCached(srcPath);
        // Find the specific declaration: `export type NAME` → extract from `type NAME`
        // up to the closing `;` at brace-depth 0 (handles multi-line conditional types).
        // Word-boundary check: skip `export type FooBar` when looking for `Foo`.
        // Comment check: skip occurrences that fall inside `//` or `/* */` comments.
        //
        // Comment ranges are pre-computed once per file (O(n)) and reused across all
        // processMember calls for the same source file via getCommentRanges/commentRangesCache.
        // Each individual candidate check is then O(log k) binary search instead of O(n).
        const searchStr = `export type ${child.name}`;
        const commentRanges = getCommentRanges(srcPath);
        let exportStart = -1;
        let searchFrom = 0;
        while (true) {
          const candidate = src.indexOf(searchStr, searchFrom);
          if (candidate === -1) break;
          const charAfter = src[candidate + searchStr.length];
          const wordBoundaryOk = charAfter === undefined || /[\s<=;(]/.test(charAfter);
          if (wordBoundaryOk && !isInCommentRange(commentRanges, candidate)) {
            exportStart = candidate;
            break;
          }
          searchFrom = candidate + 1;
        }
        if (exportStart !== -1) {
          const typeStart = exportStart + 'export '.length;
          const end = findTopLevelSemicolon(src, typeStart);
          typeDefinition = src.slice(typeStart, end).trimEnd();
        }
      } catch {
        // fallback to serialized form
      }
    }
    if (!typeDefinition && (child as unknown as Record<string, unknown>).type) {
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
  } else if (kind === 'interface') {
    const typeParams = child.typeParameters
      ?.map((tp: TypeParameterReflection) => {
        let s = tp.name;
        if (tp.type) s += ` extends ${serializeType(tp.type)}`;
        if (tp.default) s += ` = ${serializeType(tp.default)}`;
        return s;
      })
      .join(', ');
    const generics = typeParams ? `<${typeParams}>` : '';
    const members = ((child as unknown as Record<string, unknown>).children as DeclarationReflection[] | undefined) ?? [];
    const memberDefinitions = members.flatMap(m => {
      if (m.kind === ReflectionKind.Property) {
        const opt = (m.flags as unknown as Record<string, unknown>)?.isOptional ? '?' : '';
        return [`  ${m.name}${opt}: ${serializeType(m.type)}`];
      }
      if (m.signatures?.length) {
        return m.signatures.map((sig: SignatureReflection) => `  ${buildSignatureString(sig)}`);
      }
      return [];
    });
    const body = memberDefinitions.join(';\n');
    typeDefinition = memberDefinitions.length > 0
      ? `interface ${child.name}${generics} {\n${body};\n}`
      : `interface ${child.name}${generics} {}`;
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
  // Clear per-invocation caches so repeated calls (e.g. watch mode) don't serve stale data.
  sourceFileCache.clear();
  commentRangesCache.clear();

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
      .filter(f => !f.startsWith('_'))
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

    /** Attach a companion type to a function, deduping by type name. */
    const attachCompanion = (fnName: string, type: WebsiteRelatedType): void => {
      const list = companionTypesMap.get(fnName) ?? [];
      if (!list.some(t => t.name === type.name)) list.push(type);
      companionTypesMap.set(fnName, list);
    };

    /** Collect every text blob of a function where a type name might appear. */
    const collectFunctionText = (fn: WebsiteFunction): string => {
      const parts: string[] = [];
      for (const sig of fn.signatures) {
        parts.push(sig.signature);
        if (sig.returns.type) parts.push(sig.returns.type);
        for (const p of sig.params) parts.push(p.type);
        for (const tp of sig.typeParameters ?? []) {
          if (tp.constraint) parts.push(tp.constraint);
          if (tp.default) parts.push(tp.default);
        }
      }
      return parts.join(' ');
    };

    /** Word-boundary match for a type identifier inside a signature blob. */
    // '\\$&' in a JS replacement string → one literal backslash before the matched char.
    const typeRefCache = new Map<string, RegExp>();
    const referencesType = (haystack: string, typeName: string): boolean => {
      let re = typeRefCache.get(typeName);
      if (!re) {
        re = new RegExp(`\\b${typeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
        typeRefCache.set(typeName, re);
      }
      return re.test(haystack);
    };

    // Precompute text blobs once per function — avoids M×N redundant joins in the orphan loop.
    const functionTextCache = new Map<WebsiteFunction, string>(
      functions
        .filter(fn => fn.kind === 'function')
        .map(fn => [fn, collectFunctionText(fn)]),
    );

    for (const fn of functions) {
      if (!isTypeOrInterface(fn.kind)) continue;

      const related: WebsiteRelatedType = {
        name: fn.name,
        description: fn.description,
        typeDefinition: fn.typeDefinition ?? fn.name,
      };

      // Consumers = every function declared in the same source file (the type
      // was presumably introduced for it) PLUS every function anywhere else in
      // the category whose signature references this type by name — a
      // companion type isn't only used by the function(s) it was declared
      // alongside (e.g. RgbColor, declared in hexToRgb.ts, is also a param or
      // return type for rgbToHex, rgbToHsl and hslToRgb, each in its own file).
      const colocated = funcNamesBySourceFile.get(fn.sourceFile) ?? [];
      const otherConsumers = functions
        .filter(other => other.kind === 'function' && !colocated.includes(other.name))
        .filter(other => referencesType(functionTextCache.get(other) ?? '', fn.name))
        .map(other => other.name);
      const consumers = [...colocated, ...otherConsumers];

      if (consumers.length > 0) {
        companionTypeNames.add(fn.name);
        for (const consumer of consumers) attachCompanion(consumer, related);
      }
      // If no consumer is found anywhere, keep the standalone page as a fallback.
    }

    // Transitive pass — a type referenced only inside another companion type's
    // definition (e.g. `DateLike = ... | EpochMilliseconds`) should follow its
    // referrer and stop being a standalone page. Iterate to fixpoint.
    const orphanTypes = functions.filter(fn => isTypeOrInterface(fn.kind) && !companionTypeNames.has(fn.name));
    let changed = true;
    while (changed) {
      changed = false;
      for (const orphan of orphanTypes) {
        if (companionTypeNames.has(orphan.name)) continue;
        // Find every function whose already-attached companions reference this orphan.
        const referrerFns: string[] = [];
        for (const [fnName, types] of companionTypesMap) {
          if (types.some(t => referencesType(t.typeDefinition, orphan.name))) {
            referrerFns.push(fnName);
          }
        }
        if (referrerFns.length > 0) {
          companionTypeNames.add(orphan.name);
          const related: WebsiteRelatedType = {
            name: orphan.name,
            description: orphan.description,
            typeDefinition: orphan.typeDefinition ?? orphan.name,
          };
          for (const fnName of referrerFns) attachCompanion(fnName, related);
          changed = true;
        }
      }
    }

    const enrichedFunctions = functions
      .filter(fn => !companionTypeNames.has(fn.name)) // exclude companion types (embedded in their consumer(s) instead)
      // processMember exempts every type/interface from the @since guard because a
      // *companion* type inherits relevance from the function(s) it's attached to. A
      // type that never became anyone's companion is about to get its own standalone
      // page instead — hold it to the same @since guard functions already get.
      .filter(fn => !(isTypeOrInterface(fn.kind) && fn.since === 'unknown'))
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
