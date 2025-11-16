import { capitalize } from '../lib/utils';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should return an empty string if the input is empty', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle strings with a single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should not change an already capitalized string', () => {
    expect(capitalize('World')).toBe('World');
  });

  it('should capitalize the first letter and leave the rest as is', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('should handle numbers and special characters at the beginning', () => {
    expect(capitalize('123test')).toBe('123test');
    expect(capitalize('!hello')).toBe('!hello');
  });
});
