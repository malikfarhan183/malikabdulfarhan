const assert = require('node:assert/strict');
const test = require('node:test');
const {AuthService} = require('../../../dist/api/services/authService');
const {InMemoryProjectRepository} = require('../../../dist/api/providers/inMemoryProjectRepository');
const {verifyJwt} = require('../../../dist/api/utils/jwt');

test('AuthService returns a signed token for valid demo credentials', async () => {
  const service = new AuthService(new InMemoryProjectRepository(), 'test-secret');
  const session = await service.login({
    email: 'malik@example.com',
    password: 'Portfolio@2026',
  });
  const payload = verifyJwt(session.token, 'test-secret');

  assert.equal(session.user.email, 'malik@example.com');
  assert.equal(payload.sub, session.user.id);
});

test('AuthService rejects invalid credentials', async () => {
  const service = new AuthService(new InMemoryProjectRepository(), 'test-secret');

  await assert.rejects(
    () =>
      service.login({
        email: 'malik@example.com',
        password: 'wrong-password',
      }),
    /Invalid email or password/
  );
});
