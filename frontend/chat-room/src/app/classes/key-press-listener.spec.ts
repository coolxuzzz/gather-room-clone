import { KeyPressListener } from './key-press-listener';

describe('KeyPressListener', () => {
  it('should create an instance', (keyCode, callback) => {
    expect(new KeyPressListener(keyCode)).toBeTruthy();
  });
});
