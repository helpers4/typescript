/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { errorToReadableMessage } from './errorToReadableMessage';

describe('errorToReadableMessage — contract', () => {
  it('null returns undefined', () => {
    expect(errorToReadableMessage(null)).toBeUndefined();
  });

  it('undefined returns undefined', () => {
    expect(errorToReadableMessage(undefined)).toBeUndefined();
  });

  it('empty string returns undefined (falsy)', () => {
    expect(errorToReadableMessage('')).toBeUndefined();
  });

  it('non-empty string returns same string', () => {
    expect(errorToReadableMessage('something went wrong')).toBe('something went wrong');
  });

  it('Error instance returns string representation', () => {
    const err = new Error('test error');
    expect(errorToReadableMessage(err)).toBe(String(err));
  });

  it('object with message property returns message as string', () => {
    expect(errorToReadableMessage({ message: 'foo' })).toBe('foo');
  });

  it('object with errorMessage property returns errorMessage', () => {
    expect(errorToReadableMessage({ errorMessage: 'foo' })).toBe('foo');
  });

  it('object with error string property returns error string', () => {
    expect(errorToReadableMessage({ error: 'foo' })).toBe('foo');
  });

  it('nested error: {error: {message: "deep"}} returns "deep"', () => {
    expect(errorToReadableMessage({ error: { message: 'deep' } })).toBe('deep');
  });

  it('non-plain object falls back to String(obj)', () => {
    class CustomError {
      toString() { return 'custom error'; }
    }
    expect(errorToReadableMessage(new CustomError())).toBe('custom error');
  });

  it('stringify=true returns JSON.stringify as fallback for unknown object', () => {
    const obj = { unknown: 'structure' };
    const result = errorToReadableMessage(obj, true);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('stringify=true returns string directly when it is a string', () => {
    expect(errorToReadableMessage('hello', true)).toBe('hello');
  });

  it('stringify=string uses that string as fallback', () => {
    expect(errorToReadableMessage(null, 'fallback')).toBe('fallback');
  });

  it('stringify=string fallback for unknown object', () => {
    const obj = { unknown: 42 };
    expect(errorToReadableMessage(obj, 'fallback')).toBe('fallback');
  });

  it('0 (falsy number) returns undefined', () => {
    expect(errorToReadableMessage(0)).toBeUndefined();
  });

  it('false (falsy boolean) returns undefined', () => {
    expect(errorToReadableMessage(false)).toBeUndefined();
  });

  it('object with reason and params (OAuth code_error) returns formatted string', () => {
    const oauthError = {
      type: 'code_error',
      reason: 'access_denied',
      params: { error: 'access_denied', error_description: 'User denied access' },
    };
    expect(errorToReadableMessage(oauthError)).toBe('access_denied: User denied access');
  });

  it('object with reason and params (non-code_error) returns type: reason', () => {
    const oauthError = { type: 'timeout', reason: 'network timeout', params: {} };
    expect(errorToReadableMessage(oauthError)).toBe('timeout: network timeout');
  });
});
