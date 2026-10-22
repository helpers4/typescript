/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { paginate } from './paginate';

const pages = (...data: (number[] | null)[]) =>
  vi.fn((page: number) => Promise.resolve(data[page - 1] ?? []));

describe('paginate', () => {
  it('concatenates pages in order and starts at page 1', async () => {
    const fetchPage = pages([1, 2], [3, 4], []);
    await expect(paginate(fetchPage)).resolves.toEqual([1, 2, 3, 4]);
    expect(fetchPage.mock.calls.map(([p]) => p)).toEqual([1, 2, 3]);
  });

  it('stops on an empty page', async () => {
    await expect(paginate(pages([1], [], [9]))).resolves.toEqual([1]);
  });

  it('stops on null without adding it', async () => {
    const fetchPage = pages([1, 2], null, [9]);
    await expect(paginate(fetchPage)).resolves.toEqual([1, 2]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('stops after a page shorter than pageSize, without another request', async () => {
    const fetchPage = pages([1, 2], [3]);
    await expect(paginate(fetchPage, { pageSize: 2 })).resolves.toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('asks for one more page after a full last page', async () => {
    const fetchPage = pages([1, 2], [3, 4]);
    await expect(paginate(fetchPage, { pageSize: 2 })).resolves.toEqual([1, 2, 3, 4]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it('caps the number of pages', async () => {
    const fetchPage = vi.fn((page: number) => Promise.resolve([page]));
    await expect(paginate(fetchPage, { maxPages: 3 })).resolves.toEqual([1, 2, 3]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it('requests nothing when maxPages is below 1', async () => {
    const fetchPage = pages([1]);
    await expect(paginate(fetchPage, { maxPages: 0 })).resolves.toEqual([]);
    expect(fetchPage).not.toHaveBeenCalled();
  });

  it('rejects when a page rejects', async () => {
    const fetchPage = vi.fn((page: number) => page === 2 ? Promise.reject(new Error('boom')) : Promise.resolve([page]));
    await expect(paginate(fetchPage)).rejects.toThrow('boom');
  });

  it('requests pages one at a time', async () => {
    let running = 0;
    let peak = 0;
    const fetchPage = async (page: number) => {
      running++;
      peak = Math.max(peak, running);
      await Promise.resolve();
      running--;
      return page < 4 ? [page] : [];
    };
    await paginate(fetchPage);
    expect(peak).toBe(1);
  });
});
