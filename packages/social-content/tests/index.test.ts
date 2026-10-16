import { describe, expect, it } from 'vitest';
import { SUBJECT_ID } from '../src/index.ts';

describe('paquete de Sociedad', () => {
  it('está enchufado al monorepo', () => {
    expect(SUBJECT_ID).toBe('sociedad');
  });
});
