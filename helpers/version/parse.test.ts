/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parse } from './parse';

describe('parse', () => {
  describe('core version parsing', () => {
    it('should parse basic version', () => {
      expect(parse('1.2.3')).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: [],
        build: [],
      });
    });

    it('should parse version with v prefix', () => {
      expect(parse('v1.2.3')).toEqual({
        major: 1,
        minor: 2,
        patch: 3,
        prerelease: [],
        build: [],
      });
    });

    it('should parse version 0.0.0', () => {
      expect(parse('0.0.0')).toEqual({
        major: 0,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
      });
    });

    it('should parse large version numbers', () => {
      expect(parse('100.200.300')).toEqual({
        major: 100,
        minor: 200,
        patch: 300,
        prerelease: [],
        build: [],
      });
    });

    it('should handle missing parts as 0', () => {
      expect(parse('1.2')).toEqual({
        major: 1,
        minor: 2,
        patch: 0,
        prerelease: [],
        build: [],
      });

      expect(parse('1')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
      });
    });
  });

  describe('prerelease parsing', () => {
    it('should parse simple prerelease', () => {
      expect(parse('1.0.0-alpha')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['alpha'],
        build: [],
      });
    });

    it('should parse prerelease with number', () => {
      expect(parse('1.0.0-alpha.1')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['alpha', '1'],
        build: [],
      });
    });

    it('should parse numeric prerelease', () => {
      expect(parse('1.0.0-0.3.7')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['0', '3', '7'],
        build: [],
      });
    });

    it('should parse complex prerelease', () => {
      expect(parse('1.0.0-x.7.z.92')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['x', '7', 'z', '92'],
        build: [],
      });
    });

    it('should parse common prerelease tags', () => {
      expect(parse('2.0.0-beta')).toEqual({
        major: 2,
        minor: 0,
        patch: 0,
        prerelease: ['beta'],
        build: [],
      });

      expect(parse('3.0.0-rc.1')).toEqual({
        major: 3,
        minor: 0,
        patch: 0,
        prerelease: ['rc', '1'],
        build: [],
      });
    });

    it('should parse prerelease with v prefix', () => {
      expect(parse('v1.0.0-alpha.1')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['alpha', '1'],
        build: [],
      });
    });
  });

  describe('build metadata parsing', () => {
    it('should parse simple build metadata', () => {
      expect(parse('1.0.0+build')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: ['build'],
      });
    });

    it('should parse numeric build metadata', () => {
      expect(parse('1.0.0+20130313144700')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: ['20130313144700'],
      });
    });

    it('should parse complex build metadata', () => {
      expect(parse('1.0.0+exp.sha.5114f85')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: ['exp', 'sha', '5114f85'],
      });
    });

    it('should parse build metadata with dashes', () => {
      expect(parse('1.0.0+21AF26D3----117B344092BD')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: ['21AF26D3----117B344092BD'],
      });
    });
  });

  describe('prerelease and build metadata combined', () => {
    it('should parse prerelease with build metadata', () => {
      expect(parse('1.0.0-alpha+001')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['alpha'],
        build: ['001'],
      });
    });

    it('should parse complex prerelease with build metadata', () => {
      expect(parse('1.0.0-beta+exp.sha.5114f85')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['beta'],
        build: ['exp', 'sha', '5114f85'],
      });
    });

    it('should parse SemVer spec example', () => {
      expect(parse('1.0.0-alpha.1+build.123')).toEqual({
        major: 1,
        minor: 0,
        patch: 0,
        prerelease: ['alpha', '1'],
        build: ['build', '123'],
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string parts', () => {
      expect(parse('')).toEqual({
        major: 0,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
      });
    });

    it('should handle v only', () => {
      expect(parse('v')).toEqual({
        major: 0,
        minor: 0,
        patch: 0,
        prerelease: [],
        build: [],
      });
    });
  });
});
