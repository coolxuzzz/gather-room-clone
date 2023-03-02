import { Sprite } from './sprite';

export class Player {
  id: string;
  x: number;
  y: number;
  sprite: Sprite;
  isMoving: boolean = false;
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
      x: this.x,
      y: this.y,
      src: config.src,
      playerObject: this,
      app: config.app,
    });
  }

  remove() {
    this.sprite.removeFromStage();
  }

  updatePosition(x: number, y: number) {
    this.sprite.updatePosition(x, y);
  }
}
