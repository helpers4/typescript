/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { extractErrorMessage } from './extractErrorMessage';

describe('extractErrorMessage — contract', () => {
  it('null returns undefined', () => {
    expect(extractErrorMessage(null)).toBeUndefined();
  });

  it('undefined returns undefined', () => {
    expect(extractErrorMessage(undefined)).toBeUndefined();
  });

  it('empty string returns undefined (falsy)', () => {
    expect(extractErrorMessage('')).toBeUndefined();
  });

  it('non-empty string returns same string', () => {
    expect(extractErrorMessage('something went wrong')).toBe('something went wrong');
  });

  it('Error instance returns string representation', () => {
    const err = new Error('test error');
    expect(extractErrorMessage(err)).toBe(String(err));
  });

  it('object with message property returns message as string', () => {
    expect(extractErrorMessage({ message: 'foo' })).toBe('foo');
  });

  it('object with errorMessage property returns errorMessage', () => {
    expect(extractErrorMessage({ errorMessage: 'foo' })).toBe('foo');
  });

  it('object with error string property returns error string', () => {
    expect(extractErrorMessage({ error: 'foo' })).toBe('foo');
  });

  it('nested error: {error: {message: "deep"}} returns "deep"', () => {
    expect(extractErrorMessage({ error: { message: 'deep' } })).toBe('deep');
  });

  it('non-plain object falls back to String(obj)', () => {
    class CustomError {
      toString() { return 'custom error'; }
    }
    expect(extractErrorMessage(new CustomError())).toBe('custom error');
  });

  it('stringify=true returns JSON.stringify as fallback for unknown object', () => {
    const obj = { unknown: 'structure' };
    const result = extractErrorMessage(obj, true);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('stringify=true returns string directly when it is a string', () => {
    expect(extractErrorMessage('hello', true)).toBe('hello');
  });

  it('stringify=string uses that string as fallback', () => {
    expect(extractErrorMessage(null, 'fallback')).toBe('fallback');
  });

  it('stringify=string fallback for unknown object', () => {
    const obj = { unknown: 42 };
    expect(extractErrorMessage(obj, 'fallback')).toBe('fallback');
  });

  it('0 (falsy number) returns undefined', () => {
    expect(extractErrorMessage(0)).toBeUndefined();
  });

  it('false (falsy boolean) returns undefined', () => {
    expect(extractErrorMessage(false)).toBeUndefined();
  });

  it('object with reason and params (OAuth code_error) returns formatted string', () => {
    const oauthError = {
      type: 'code_error',
      reason: 'access_denied',
      params: { error: 'access_denied', error_description: 'User denied access' },
    };
    expect(extractErrorMessage(oauthError)).toBe('access_denied: User denied access');
  });

  it('object with reason and params (non-code_error) returns type: reason', () => {
    const oauthError = { type: 'timeout', reason: 'network timeout', params: {} };
    expect(extractErrorMessage(oauthError)).toBe('timeout: network timeout');
  });
});
