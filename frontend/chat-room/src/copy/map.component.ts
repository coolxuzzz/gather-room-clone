import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
import { Application } from '@pixi/app';
import { Sprite } from 'src/app/classes/sprite';

import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  app!: Application;
  playerId!: string;
  playerRef!: any;
  allPlayersRef: any = {};
  allPlayersSprite: { [key: string]: Sprite } = {};

  position = [
    [303, 30],
    [100, 10],
    [500, 50],
  ];

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        // you're' logged in
        const [x, y] = this.position[Math.floor(Math.random() * 3)];
        this.playerId = user.uid;
        this.playerRef = this.db.database.ref(`players/${this.playerId}`);
        this.playerRef.set({
          id: this.playerId,
          name: 'test',
          x,
          y,
        });

        this.playerRef.onDisconnect().remove();

        // initialize the game
        this.initGame();
      } else {
        // you're logged out
      }
    });

    this.authService.login();
  }

  gameloop() {}

  initGame() {
    this.app = new Application({
      width: 800,
      height: 600,
    });
    this.element.nativeElement.appendChild(this.app.view);
    //this.app.ticker.add(this.gameloop);

    const allPlayersRef = this.db.database.ref('players');

    allPlayersRef.on('value', (snapshot: any) => {
      this.allPlayersRef = snapshot.val();
      Object.values(this.allPlayersRef).forEach((player: any) => {
        console.log(this.allPlayersSprite[player.id]);
        if (this.allPlayersSprite[player.id] === undefined) return;
        this.allPlayersSprite[player.id].updatePosition(player.x, player.y);
        // this.allPlayersObject[player.id].x = player.x;
        // this.allPlayersObject[player.id].y = player.y;
      });
    });

    allPlayersRef.on('child_added', (snapshot: any) => {
      const newPlayer = snapshot.val();
      const playerSprite = new Sprite({
        x: newPlayer.x,
        y: newPlayer.y,
        app: this.app,
      });
      this.allPlayersSprite[newPlayer.id] = playerSprite;
      //this.allPlayersSprit[newPlayer.id] = player.sprite;
      // PIXI.Assets.load('../../assets/characters/characters.png').then(
      //   (texture) => {
      //     this.createSheet(texture);
      //     const sprite = new PIXI.AnimatedSprite(
      //       this.allPlayersSheet['stand-down']
      //     );
      //     sprite.animationSpeed = 0.1;
      //     sprite.loop = false;
      //     sprite.x = newPlayer.x;
      //     sprite.y = newPlayer.y;
      //     sprite.scale.set(5);
      //     texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      //     this.app.stage.addChild(sprite);
      //     sprite.play();
      //     this.allPlayersSprit[newPlayer.id] = sprite;
      //   }
      // );
    });

    allPlayersRef.on('child_removed', (snapshot: any) => {
      const removedPlayer = snapshot.val();
      this.allPlayersSprite[removedPlayer.id].removeFromStage();
      delete this.allPlayersSprite[removedPlayer.id];
      // this.app.stage.removeChild(this.allPlayersSprit[removedPlayer.id]);
      // delete this.allPlayersSprit[removedPlayer.id];
    });

    this.keyPressListener();
  }

  handleArrowPress(xChange = 0, yChange = 0) {
    const newX = this.allPlayersRef[this.playerId].x + xChange;
    const newY = this.allPlayersRef[this.playerId].y + yChange;
    if (true) {
      //move to the next space
      // const playerSprite = this.allPlayersSprit[this.playerId];
      // playerSprite.textures = this.allPlayersSheet['walk-down'];
      // playerSprite.play();
      console.log(this.allPlayersSprite[this.playerId]);
      this.allPlayersSprite[this.playerId].setAnimation('walk-down');
      this.allPlayersRef[this.playerId].x = newX;
      this.allPlayersRef[this.playerId].y = newY;
      // if (xChange === 1) {
      //   players[playerId].direction = 'right';
      // }
      // if (xChange === -1) {
      //   players[playerId].direction = 'left';
      // }
      this.playerRef.set(this.allPlayersRef[this.playerId]);
    }
  }

  keyPressListener() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'w':
          this.handleArrowPress(0, -32);
          break;
        case 'a':
          this.handleArrowPress(-32, 0);
          break;
        case 's':
          this.handleArrowPress(0, 32);
          break;
        case 'd':
          this.handleArrowPress(32, 0);
          break;
      }
    });
  }

  // createSheet(sheet: any) {
  //   this.allPlayersSheet = {
  //     'stand-down': [
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 6 * 22, 16, 22)),
  //     ],
  //     'walk-down': [
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 6 * 22, 16, 22)),
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 5 * 22, 16, 22)),
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 6 * 22, 16, 22)),
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 7 * 22, 16, 22)),
  //       new PIXI.Texture(sheet, new PIXI.Rectangle(4 * 16, 6 * 22, 16, 22)),
  //     ],
  //   };
  // }

  gridx(x: number) {
    return x * 16;
  }

  gridy(y: number) {
    return y * 22;
  }
}
