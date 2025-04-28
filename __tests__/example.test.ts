import { describe, expect, test } from '@jest/globals';

describe('Example Test Suite', () => {
  test('should pass', () => {
    console.log('hello world');
    expect(1 + 1).toBe(2);
  });
});