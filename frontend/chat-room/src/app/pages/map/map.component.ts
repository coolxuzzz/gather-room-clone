import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
import { Application } from '@pixi/app';
import { UtilsService } from 'src/app/services/utils.service';
import { KeyPressListener } from 'src/app/classes/key-press-listener';
import { Player } from 'src/app/classes/player';

import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // map states
  WIDTH = 960;
  HEIGHT = 720;
  BG_COLOR = 0xd9f4ff;
  speed = 4;

  app!: Application;
  playerId!: string;
  playerRef!: any;
  allPlayersRef: any = {};
  allPlayers: { [key: string]: Player } = {};
  mapLowerContainer!: PIXI.Container;
  mapUpperContainer!: PIXI.Container;
  otherPlayersContainer!: PIXI.Container;
  mePlayerContainer!: PIXI.Container;

  skins = [
    '../assets/PNGS/davidmartinez.png',
    '../assets/PNGS/dorio.png',
    '../assets/PNGS/faraday.png',
    '../assets/PNGS/johnny.png',
    '../assets/PNGS/judy.png',
    '../assets/PNGS/judyscuba.png',
    '../assets/PNGS/kiwi.png',
    '../assets/PNGS/lucy.png',
    '../assets/PNGS/maine.png',
    '../assets/PNGS/rebecca.png',
    '../assets/PNGS/river.png',
    '../assets/PNGS/riverjacket.png',
    '../assets/PNGS/roguejacket.png',
    '../assets/PNGS/takemura.png',
    '../assets/PNGS/takemurajacket.png',
    '../assets/PNGS/tbug.png',
  ];

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private Utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        // you're' logged in
        this.playerId = user.uid;
        this.playerRef = this.db.database.ref(`players/${this.playerId}`);
        this.playerRef.set({
          id: this.playerId,
          name: 'test',
          skin: this.skins[Math.floor(Math.random() * 15)],
          direction: 'down',
          x: this.Utils.withGrid(38),
          y: this.Utils.withGrid(14),
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

  initGame() {
    // initialize the game canvas
    this.app = new Application({
      view: document.getElementById('game-canvas') as HTMLCanvasElement,
      width: this.WIDTH,
      height: this.HEIGHT,
      backgroundColor: this.BG_COLOR,
    });

    // initialize the map
    this.initMap();

    // real time player activities updates
    const allPlayersRef = this.db.database.ref('players');

    allPlayersRef.on('value', (snapshot: any) => {
      this.allPlayersRef = snapshot.val();
      Object.values(this.allPlayersRef).forEach((player: any) => {
        this.loadOtherPlayers(player);
      });
    });

    allPlayersRef.on('child_added', (snapshot: any) => {
      const playerSnapshot = snapshot.val();

      // add player to the game
      let container =
        playerSnapshot.id === this.playerId
          ? this.mePlayerContainer
          : this.otherPlayersContainer;

      const newPlayer = new Player({
        id: playerSnapshot.id,
        x: playerSnapshot.x,
        y: playerSnapshot.y,
        skin: playerSnapshot.skin,
        direction: playerSnapshot.direction,
        container: container,
      });

      this.allPlayers[playerSnapshot.id] = newPlayer;
    });

    allPlayersRef.on('child_removed', (snapshot: any) => {
      const removedPlayer = snapshot.val();
      this.allPlayers[removedPlayer.id].remove();
      delete this.allPlayers[removedPlayer.id];
    });

    this.keyPressListener();
  }

  initMap() {
    // initialize different layers of the game
    this.mapLowerContainer = new PIXI.Container();
    this.mapUpperContainer = new PIXI.Container();
    this.otherPlayersContainer = new PIXI.Container();
    this.mePlayerContainer = new PIXI.Container();

    this.app.stage.addChild(this.mapLowerContainer);
    this.app.stage.addChild(this.otherPlayersContainer);
    this.app.stage.addChild(this.mePlayerContainer);
    this.app.stage.addChild(this.mapUpperContainer);

    // initialize the game map
    const mapLower = PIXI.Sprite.from('../../assets/map-lower.png');
    const mapUpper = PIXI.Sprite.from('../../assets/map-upper.png');
    console.log(this.Utils.xOffSet() - this.playerRef.x);
    this.mapLowerContainer.position.set(
      this.Utils.xOffSet() - this.Utils.withGrid(38),
      this.Utils.yOffSet() - this.Utils.withGrid(14)
    );
    this.mapUpperContainer.position.set(
      this.Utils.xOffSet() - this.Utils.withGrid(38),
      this.Utils.yOffSet() - this.Utils.withGrid(14)
    );
    this.mapLowerContainer.addChild(mapLower);
    this.mapUpperContainer.addChild(mapUpper);
  }

  handleArrowPress(direction: string) {
    const cameraPerson = this.allPlayersRef[this.playerId];

    if (true) {
      //move to the next space
      const mePlayer = this.allPlayers[this.playerId];
      mePlayer.update({ direction: direction, cameraPerson: mePlayer });
      this.allPlayersRef[this.playerId].x = mePlayer.x;
      this.allPlayersRef[this.playerId].y = mePlayer.y;
      this.allPlayersRef[this.playerId].direction = mePlayer.direction;
      this.playerRef.set(this.allPlayersRef[this.playerId]);
    }

    // update map position
    this.mapLowerContainer.position.set(
      this.Utils.xOffSet() - cameraPerson.x,
      this.Utils.yOffSet() - cameraPerson.y
    );
    this.mapUpperContainer.position.set(
      this.Utils.xOffSet() - cameraPerson.x,
      this.Utils.yOffSet() - cameraPerson.y
    );
  }

  loadOtherPlayers(player: any) {
    if (this.allPlayers[player.id].isSpriteLoaded === false) {
      setTimeout(() => {
        this.loadOtherPlayers(player);
      }, 100);
    } else {
      this.allPlayers[player.id].update({
        x: player.x,
        y: player.y,
        cameraPerson: this.allPlayersRef[this.playerId],
      });
    }
  }

  keyPressListener() {
    new KeyPressListener('KeyW', () => this.handleArrowPress('up'));
    new KeyPressListener('KeyS', () => this.handleArrowPress('down'));
    new KeyPressListener('KeyA', () => this.handleArrowPress('left'));
    new KeyPressListener('KeyD', () => this.handleArrowPress('right'));
  }
}
