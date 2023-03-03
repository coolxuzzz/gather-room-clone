import { Sprite } from './sprite';
import { UtilsService } from 'src/app/services/utils.service';

export class Player {
  id: string;
  x: number;
  y: number;
  direction: string = 'down';
  isSpriteLoaded: boolean = false;
  isPlayerMoving: boolean = false;

  private sprite: Sprite;
  private moveUpdate: { [key: string]: [number, number] } = {
    up: [0, -8],
    down: [0, 8],
    left: [-8, 0],
    right: [8, 0],
  };

  private Utils: UtilsService = new UtilsService();

  constructor(config: any) {
    this.id = config.id;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.sprite = new Sprite({
      skin: config.skin,
      playerObject: this,
      container: config.container,
      direction: config.direction || 'down',
    });
  }

  get playerSprite() {
    return this.sprite.playerSprite;
  }

  update(state: any) {
    this.refineState(state);
    this.updatePosition(state);
    this.updateSprite(state);
  }

  private updatePosition(state: any) {
    if (this.isPlayerMoving && state.direction !== this.direction) return;
    this.x = state.x;
    this.y = state.y;
  }

  private updateSprite(state: any) {
    this.sprite.update(state);
  }

  refineState(state: any) {
    if (state.direction === undefined) {
      const xChange = state.x - this.x;
      const yChange = state.y - this.y;
      if (xChange > 0) {
        state.direction = 'right';
      } else if (xChange < 0) {
        state.direction = 'left';
      } else if (yChange > 0) {
        state.direction = 'down';
      } else if (yChange < 0) {
        state.direction = 'up';
      }
    } else {
      const [x, y] = this.moveUpdate[state.direction];
      state.x = this.x + x;
      state.y = this.y + y;
    }
  }

  remove() {
    this.sprite.removeFromStage();
  }
}
