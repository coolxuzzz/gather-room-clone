import { Player } from './player';

describe('Player', () => {
  it('should create an instance', (config) => {
    expect(new Player(config)).toBeTruthy();
  });
});
