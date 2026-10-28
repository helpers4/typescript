/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * What {@link createFileStore} accepts as a file's content.
 * @since next
 */
export type FileContent = Blob | BufferSource | string;

/**
 * A set of files kept in the browser's Cache API under a key, created by {@link createFileStore}.
 * @since next
 */
export interface FileStore {
  /**
   * Stores `files` (by path) under `key`, replacing what the key held, whatever its version.
   * The files are written first and the manifest last, so an interrupted write is a miss, never
   * a half-set.
   * @returns Whether it was stored: `false` without the Cache API, or if writing failed
   */
  put(key: string, files: Record<string, FileContent>, version?: string): Promise<boolean>;
  /**
   * Reads the files stored under `key` for `version`.
   * @returns The files by path, or `undefined` on a miss: unknown key, another version, no Cache API
   */
  get(key: string, version?: string): Promise<Record<string, Blob> | undefined>;
  /** Removes what `key` holds, every version. @returns Whether anything was removed */
  delete(key: string): Promise<boolean>;
}

const ORIGIN = 'https://file-store.invalid/';
const keyBase = (key: string): string => `${ORIGIN}${encodeURIComponent(key)}/`;
const versionBase = (key: string, version: string): string => `${keyBase(key)}${encodeURIComponent(version)}/`;
const manifestUrl = (key: string, version: string): string => `${versionBase(key, version)}manifest`;
const fileUrl = (key: string, version: string, path: string): string => `${versionBase(key, version)}files/${encodeURIComponent(path)}`;

async function remove(cache: Cache, key: string): Promise<boolean> {
  const base = keyBase(key);
  const entries = (await cache.keys()).filter((request) => request.url.startsWith(base));
  const results = await Promise.all(entries.map((request) => cache.delete(request)));
  return results.some(Boolean);
}

/**
 * Creates a file store on a named Cache API cache: keep a computed set of files (a bake, a
 * download, extracted layers) under a key and a version, and read it back later, even offline.
 * Cache entries are keyed by made-up URLs, so nothing is ever fetched.
 *
 * Outside a browser (no `caches`), `put` stores nothing and `get` always misses, so a caller
 * works without a cache, only slower.
 *
 * @param name - The name of the cache, shared by every store with that name
 * @returns The {@link FileStore}
 * @example
 * const store = createFileStore('bakes');
 * await store.put('design-1', { 'a.png': blob, 'index.json': '{}' }, 'v3');
 * const files = await store.get('design-1', 'v3'); // => { 'a.png': Blob, 'index.json': Blob }
 * @since next
 */
export function createFileStore(name: string): FileStore {
  const open = (): Promise<Cache> | undefined => (typeof globalThis.caches === 'undefined' ? undefined : globalThis.caches.open(name));
  return {
    async put(key, files, version = '') {
      const opened = open();
      if (!opened) return false;
      try {
        const cache = await opened;
        await remove(cache, key);
        const paths = Object.keys(files);
        await Promise.all(paths.map((path) => cache.put(fileUrl(key, version, path), new Response(files[path]))));
        await cache.put(manifestUrl(key, version), new Response(JSON.stringify(paths)));
        return true;
      } catch {
        return false;
      }
    },
    async get(key, version = '') {
      const opened = open();
      if (!opened) return undefined;
      try {
        const cache = await opened;
        const manifest = await cache.match(manifestUrl(key, version));
        if (!manifest) return undefined;
        const paths = (await manifest.json()) as string[];
        const blobs = await Promise.all(
          paths.map(async (path) => (await cache.match(fileUrl(key, version, path)))?.blob()),
        );
        if (blobs.some((blob) => blob === undefined)) return undefined;
        return Object.fromEntries(paths.map((path, i) => [path, blobs[i]!]));
      } catch {
        return undefined;
      }
    },
    async delete(key) {
      const opened = open();
      if (!opened) return false;
      try {
        return await remove(await opened, key);
      } catch {
        return false;
      }
    },
  };
}
