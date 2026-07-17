const assert = require('node:assert/strict');
const test = require('node:test');
const {ProjectService} = require('../../../dist/api/services/projectService');
const {InMemoryProjectRepository} = require('../../../dist/api/providers/inMemoryProjectRepository');

test('ProjectService filters projects by status and paginates results', async () => {
  const service = new ProjectService(new InMemoryProjectRepository());
  const result = await service.getProjects({status: 'active', page: '1', size: '2'});

  assert.equal(result.data.length, 1);
  assert.equal(result.data[0].status, 'active');
  assert.equal(result.paginationOptions.page, 1);
});

test('ProjectService returns a not found error for unknown project ids', async () => {
  const service = new ProjectService(new InMemoryProjectRepository());

  await assert.rejects(
    () => service.getProjectById('missing-project'),
    /Project was not found/
  );
});
