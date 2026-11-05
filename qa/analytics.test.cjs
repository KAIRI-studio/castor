const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname + '/../analytics.js', 'utf8');

async function visit({search = '', embedded = false, excluded = false, privacy = false} = {}) {
  const requests = [], tags = [], writes = [], handlers = {};
  const window = {};
  window.self = window;
  window.top = embedded ? {} : window;
  const context = {
    window, URL, URLSearchParams, Set, AbortController, setTimeout, clearTimeout,
    location: {search, origin: 'https://kairi-studio.github.io', pathname: '/kuku-collect/'},
    navigator: {doNotTrack: privacy ? '1' : '0'},
    localStorage: {
      getItem: () => excluded ? '1' : null,
      setItem: (...args) => writes.push(args),
      removeItem: (...args) => writes.push(args),
    },
    document: {
      currentScript: {dataset: {site: 'kuku-collect'}}, title: '九九コレクト', referrer: '',
      addEventListener: (name, fn) => { handlers[name] = fn; },
      createElement: () => ({}), head: {appendChild: tag => tags.push(tag)},
    },
    fetch: async url => {
      requests.push(url);
      return {ok: true, json: async () => ({measurement_id: 'G-TEST123'})};
    },
  };
  vm.runInNewContext(source, context);
  window.castorAnalytics.event('game_start');
  await new Promise(resolve => setImmediate(resolve));
  window.castorAnalytics.event('game_start');
  const events = Array.from(window.dataLayer || [], args => Array.from(args));
  return {requests, tags, writes, events};
}

test('embedded and review visits never load GA4, send events, or change exclusion preferences', async () => {
  for (const options of [
    {embedded: true},
    {embedded: true, search: '?analytics-exclude=0'},
    {search: '?preview-exchange=1'},
    {search: '?preview-progress=1'},
    {search: '?preview-roster=1'},
    {search: '?screen-review=title'},
  ]) {
    const result = await visit(options);
    assert.deepEqual(result, {requests: [], tags: [], writes: [], events: []});
  }
});

test('real game visits still send page/open/start events, including queued starts', async () => {
  const result = await visit();
  assert.equal(result.requests.length, 1);
  assert.equal(result.tags.length, 1);
  const names = result.events.filter(args => args[0] === 'event').map(args => args[1]);
  assert.deepEqual(names, ['page_view', 'game_start', 'game_open', 'game_start']);
  assert.deepEqual(result.writes, []);
});

test('family exclusion and browser privacy still prevent tracking', async () => {
  for (const options of [{excluded: true}, {privacy: true}]) {
    const result = await visit(options);
    assert.deepEqual(result.requests, []);
    assert.deepEqual(result.tags, []);
    assert.deepEqual(result.events, []);
  }
});
