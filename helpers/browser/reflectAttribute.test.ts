/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { reflectAttribute } from './reflectAttribute';

type Reflected = Element & Record<string, unknown>;
const make = () => document.createElement('div') as unknown as Reflected;

describe('reflectAttribute', () => {
  it('reflects a string, with the property name lowercased as the attribute', () => {
    const element = make();
    reflectAttribute(element, 'heading');
    expect(element.heading).toBe('');
    element.heading = 'Hello';
    expect(element.getAttribute('heading')).toBe('Hello');
    element.setAttribute('heading', 'Changed');
    expect(element.heading).toBe('Changed');
    reflectAttribute(element, 'dataLabel');
    element.dataLabel = 'x';
    expect(element.getAttribute('datalabel')).toBe('x');
  });

  it('reflects a number', () => {
    const element = make();
    reflectAttribute(element, 'count', { type: 'number' });
    expect(element.count).toBe(0);
    element.count = 3;
    expect(element.getAttribute('count')).toBe('3');
    expect(element.count).toBe(3);
    element.setAttribute('count', 'abc');
    expect(element.count).toBeNaN();
  });

  it('reflects a boolean as the presence of the attribute', () => {
    const element = make();
    reflectAttribute(element, 'selected', { type: 'boolean' });
    expect(element.selected).toBe(false);
    element.selected = true;
    expect(element.hasAttribute('selected')).toBe(true);
    expect(element.selected).toBe(true);
    element.selected = false;
    expect(element.hasAttribute('selected')).toBe(false);
    element.setAttribute('selected', 'false');
    expect(element.selected).toBe(true);
  });

  it('removes the attribute for null or undefined', () => {
    const element = make();
    reflectAttribute(element, 'heading');
    element.heading = 'x';
    element.heading = null;
    expect(element.hasAttribute('heading')).toBe(false);
    element.heading = 'y';
    element.heading = undefined;
    expect(element.hasAttribute('heading')).toBe(false);
  });

  it('uses a custom attribute name and default value', () => {
    const element = make();
    reflectAttribute(element, 'size', { type: 'number', attribute: 'data-size', defaultValue: 12 });
    expect(element.size).toBe(12);
    element.size = 20;
    expect(element.getAttribute('data-size')).toBe('20');
    reflectAttribute(element, 'tone', { defaultValue: 'warm' });
    expect(element.tone).toBe('warm');
  });

  it('removes the property again', () => {
    const element = make();
    const remove = reflectAttribute(element, 'heading');
    element.heading = 'x';
    remove();
    expect('heading' in element).toBe(false);
    expect(element.getAttribute('heading')).toBe('x');
  });
});
