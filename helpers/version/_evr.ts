/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal [epoch:]version[-release] splitting shared by the RPM and pacman schemes.
 */

/** @ignore */
export interface Evr {
  epoch: number;
  version: string;
  release: string;
}

/**
 * Splits `[epoch:]version[-release]`: the epoch runs up to the first colon and must be digits,
 * the release starts after the last hyphen. `allowed` is the character set of the version and of
 * the release.
 * @ignore
 */
export function splitEvr(input: string, scheme: string, allowed: RegExp): Evr {
  const fail = (reason: string): never => {
    throw new SyntaxError(`parse: "${input}" is not a valid ${scheme} version (${reason})`);
  };

  if (/\s/.test(input)) fail('contains whitespace');

  let rest = input;
  let epoch = 0;
  const colon = rest.indexOf(':');
  if (colon !== -1) {
    const digits = rest.slice(0, colon);
    if (!/^\d+$/.test(digits)) fail('the epoch before ":" must be a non-negative integer');
    epoch = Number(digits);
    rest = rest.slice(colon + 1);
  }

  const hyphen = rest.lastIndexOf('-');
  const version = hyphen === -1 ? rest : rest.slice(0, hyphen);
  const release = hyphen === -1 ? '' : rest.slice(hyphen + 1);

  if (version === '') fail('the version is empty');
  if (!allowed.test(version)) fail('the version has a character that is not allowed');
  if (hyphen !== -1 && (release === '' || !allowed.test(release))) fail('the release after the last "-" must be non-empty and use allowed characters');

  return { epoch, version, release };
}

/** @ignore */
export function stringifyEvr({ epoch, version, release }: Evr): string {
  return `${epoch > 0 ? `${epoch}:` : ''}${version}${release === '' ? '' : `-${release}`}`;
}
