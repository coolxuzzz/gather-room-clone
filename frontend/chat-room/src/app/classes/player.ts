import { Sprite } from './sprite';

export class Player {
  id: string;
  x: number;
  y: number;
  direction: string = 'down';
  sprite: Sprite;
  moveUpdate: { [key: string]: [number, number] } = {
    up: [0, -16],
    down: [0, 16],
    left: [-16, 0],
    right: [16, 0],
  };

  constructor(config: any) {
    this.id = config.id;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.sprite = new Sprite({
      skin: config.skin,
      playerObject: this,
      app: config.app,
      direction: config.direction || 'down',
    });
  }

  get playerSprite() {
    return this.sprite.playerSprite;
  }

  remove() {
    this.sprite.removeFromStage();
  }

  updatePosition(x: number, y: number, cameraPerson: any) {
    const xSprite = x + 384 - cameraPerson.x;
    const ySprite = y + 246 - cameraPerson.y;
    this.sprite.updatePosition(x, y, xSprite, ySprite);
  }
}
