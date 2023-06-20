'use strict';

const createReactjsGenerator = require('..');
const assert = require('assert').strict;

assert.strictEqual(createReactjsGenerator(), 'Hello from createReactjsGenerator');
console.info('createReactjsGenerator tests passed');
