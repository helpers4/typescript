/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createFileStore } from './createFileStore';

function fakeCaches() {
  const stores = new Map<string, Map<string, Response>>();
  const failing = { put: false };
  const caches = {
    open: async (name: string) => {
      const entries = stores.get(name) ?? new Map<string, Response>();
      stores.set(name, entries);
      return {
        put: async (url: string, response: Response) => {
          if (failing.put) throw new Error('quota');
          entries.set(url, response);
        },
        match: async (url: string) => entries.get(url)?.clone(),
        keys: async () => [...entries.keys()].map((url) => new Request(url)),
        delete: async (request: Request) => entries.delete(request.url),
      };
    },
  };
  return { caches, stores, failing };
}

describe('createFileStore', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads back what it stored, as blobs', async () => {
    vi.stubGlobal('caches', fakeCaches().caches);
    const store = createFileStore('bakes');
    expect(await store.put('design 1', { 'layers/a.png': new Blob(['png']), 'index.json': '{}', 'raw.bin': new Uint8Array([1, 2]) }, 'v1')).toBe(true);
    const files = await store.get('design 1', 'v1');
    expect(Object.keys(files!).sort()).toEqual(['index.json', 'layers/a.png', 'raw.bin']);
    expect(await files!['layers/a.png']!.text()).toBe('png');
    expect(await files!['index.json']!.text()).toBe('{}');
    expect(new Uint8Array(await files!['raw.bin']!.arrayBuffer())).toEqual(new Uint8Array([1, 2]));
  });

  it('misses on another version or key, and defaults to an empty version', async () => {
    vi.stubGlobal('caches', fakeCaches().caches);
    const store = createFileStore('bakes');
    await store.put('k', { a: 'x' }, 'v1');
    expect(await store.get('k', 'v2')).toBeUndefined();
    expect(await store.get('other', 'v1')).toBeUndefined();
    await store.put('plain', { a: 'x' });
    expect(await store.get('plain')).toBeDefined();
  });

  it('replaces every version of a key when it stores again', async () => {
    const { caches } = fakeCaches();
    vi.stubGlobal('caches', caches);
    const store = createFileStore('bakes');
    await store.put('k', { a: 'x' }, 'v1');
    await store.put('k', { b: 'y' }, 'v2');
    expect(await store.get('k', 'v1')).toBeUndefined();
    expect(Object.keys((await store.get('k', 'v2'))!)).toEqual(['b']);
  });

  it('misses when a file went missing', async () => {
    const { caches, stores } = fakeCaches();
    vi.stubGlobal('caches', caches);
    const store = createFileStore('bakes');
    await store.put('k', { a: 'x' }, 'v1');
    const entries = stores.get('bakes')!;
    for (const url of entries.keys()) if (url.includes('/files/')) entries.delete(url);
    expect(await store.get('k', 'v1')).toBeUndefined();
  });

  it('deletes a key without touching the others', async () => {
    vi.stubGlobal('caches', fakeCaches().caches);
    const store = createFileStore('bakes');
    await store.put('k', { a: 'x' }, 'v1');
    await store.put('k2', { a: 'x' }, 'v1');
    expect(await store.delete('k')).toBe(true);
    expect(await store.delete('k')).toBe(false);
    expect(await store.get('k', 'v1')).toBeUndefined();
    expect(await store.get('k2', 'v1')).toBeDefined();
  });

  it('turns cache failures into misses', async () => {
    const { caches, failing } = fakeCaches();
    vi.stubGlobal('caches', caches);
    const store = createFileStore('bakes');
    failing.put = true;
    expect(await store.put('k', { a: 'x' })).toBe(false);
    failing.put = false;
    await store.put('k', { a: 'x' });
    vi.stubGlobal('caches', { open: async () => { throw new Error('denied'); } });
    expect(await store.put('k', { a: 'x' })).toBe(false);
    expect(await store.get('k')).toBeUndefined();
    expect(await store.delete('k')).toBe(false);
  });

  it('stores nothing and always misses without the Cache API', async () => {
    vi.stubGlobal('caches', undefined);
    const store = createFileStore('bakes');
    expect(await store.put('k', { a: 'x' })).toBe(false);
    expect(await store.get('k')).toBeUndefined();
    expect(await store.delete('k')).toBe(false);
  });
});
