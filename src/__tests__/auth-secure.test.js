import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const code = readFileSync(join(__dirname, '../auth-secure.js'), 'utf8');

describe('Guardrail — auth-secure.js static analysis', () => {

  test('uses parameterised query with ? placeholder', () => {
    expect(code).toMatch(/prepare\(['"`][^'"`]*\?[^'"`]*['"`]\)/);
  });

  test('never uses string interpolation in SQL', () => {
    expect(code).not.toMatch(/prepare\(`[^`]*\$\{/);
  });

  test('never exposes stack trace in response', () => {
    expect(code).not.toMatch(/stack:\s*\w+\.stack/);
  });

  test('never exposes raw error message in response', () => {
    expect(code).not.toMatch(/error:\s*\w+\.message/);
  });

  test('uses bcrypt for password comparison', () => {
    expect(code).toMatch(/bcrypt\.compare/);
  });

  test('uses Zod schema validation', () => {
    expect(code).toMatch(/safeParse/);
  });

  test('returns generic error on auth failure', () => {
    expect(code).toMatch(/Invalid credentials/);
  });

  test('returns generic error on server failure', () => {
    expect(code).toMatch(/Authentication failed/);
  });

  test('never returns full user object', () => {
    expect(code).not.toMatch(/user:\s*user/);
  });

  test('imports bcrypt and zod', () => {
    expect(code).toMatch(/import.*bcrypt/);
    expect(code).toMatch(/import.*zod/);
  });

});
