import * as PIXI from 'pixi.js';

export class Sprite {
  texture: any;
  isLoaded = false;
  animations: any;
  direction!: string;
  skin: string;
  playerSprite!: PIXI.AnimatedSprite;
  animateSpriteSheet: any;
  app: PIXI.Application;
  isMoving: boolean = false;

  constructor(config: any) {
    this.app = config.app;
    this.skin = config.skin;
    PIXI.Assets.load(this.skin).then((texture) => {
      this.createSpriteSheet(texture);
      this.createPlayerSprite(texture, config);
    });
  }

  createSpriteSheet(sheet: any) {
    this.animateSpriteSheet = {
      'stand-down': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 0 * 32, 32, 32)),
      ],
      'stand-up': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 3 * 32, 32, 32)),
      ],
      'stand-left': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 2 * 32, 32, 32)),
      ],
      'stand-right': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 1 * 32, 32, 32)),
      ],
      'walk-down': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 0 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * 32, 0 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * 32, 0 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * 32, 0 * 32, 32, 32)),
        //new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 0 * 32, 32, 32)),
      ],
      'walk-up': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 3 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * 32, 3 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * 32, 3 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * 32, 3 * 32, 32, 32)),
        //new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 3 * 32, 32, 32)),
      ],
      'walk-left': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 2 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * 32, 2 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * 32, 2 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * 32, 2 * 32, 32, 32)),
        //new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 2 * 32, 32, 32)),
      ],
      'walk-right': [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 1 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * 32, 1 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * 32, 1 * 32, 32, 32)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * 32, 1 * 32, 32, 32)),
        //new PIXI.Texture(sheet, new PIXI.Rectangle(0 * 32, 1 * 32, 32, 32)),
      ],
    };
  }

  createPlayerSprite(texture: any, config: any) {
    this.playerSprite = new PIXI.AnimatedSprite(
      this.animateSpriteSheet['stand-' + config.direction]
    );
    this.playerSprite.animationSpeed = 0.2;
    this.playerSprite.loop = false;
    this.playerSprite.x = config.x;
    this.playerSprite.y = config.y;
    this.playerSprite.scale.set(2);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.app.stage.addChild(this.playerSprite);
    this.playerSprite.play();
  }

  removeFromStage() {
    this.app.stage.removeChild(this.playerSprite);
  }

  setAnimation(direction: string) {
    if (!this.playerSprite.playing) {
      this.playerSprite.textures = this.animateSpriteSheet['walk-' + direction];
      this.playerSprite.play();
      this.direction = direction;
      this.playerSprite.onComplete = () => {
        this.playerSprite.textures =
          this.animateSpriteSheet['stand-' + direction];
      };
    }
  }

  updatePosition(x: number, y: number) {
    const xChange = x - this.playerSprite.x;
    const yChange = y - this.playerSprite.y;
    if (xChange > 0) {
      this.setAnimation('right');
    } else if (xChange < 0) {
      this.setAnimation('left');
    } else if (yChange > 0) {
      this.setAnimation('down');
    } else if (yChange < 0) {
      this.setAnimation('up');
    }
    this.playerSprite.x = x;
    this.playerSprite.y = y;
  }
}
