import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
import { Application } from '@pixi/app';
import { Sprite } from 'src/app/classes/sprite';
import { KeyPressListener } from 'src/app/classes/key-press-listener';

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
          skin: this.skins[Math.floor(Math.random() * 15)],
          direction: 'down',
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
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.element.nativeElement.appendChild(this.app.view);

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
    //this.app.ticker.add(this.gameloop);

    const allPlayersRef = this.db.database.ref('players');

    allPlayersRef.on('value', (snapshot: any) => {
      this.allPlayersRef = snapshot.val();
      Object.values(this.allPlayersRef).forEach((player: any) => {
        if (this.allPlayersSprite[player.id] === undefined) return;
        this.allPlayersSprite[player.id].updatePosition(player.x, player.y);
      });
    });

    allPlayersRef.on('child_added', (snapshot: any) => {
      const newPlayer = snapshot.val();
      const playerSprite = new Sprite({
        x: newPlayer.x,
        y: newPlayer.y,
        skin: newPlayer.skin,
        direction: newPlayer.direction,
        app: this.app,
      });
      this.allPlayersSprite[newPlayer.id] = playerSprite;
    });

    allPlayersRef.on('child_removed', (snapshot: any) => {
      const removedPlayer = snapshot.val();
      this.allPlayersSprite[removedPlayer.id].removeFromStage();
      delete this.allPlayersSprite[removedPlayer.id];
    });

    this.keyPressListener();
  }

  handleArrowPress(xChange = 0, yChange = 0) {
    const newX = this.allPlayersRef[this.playerId].x + xChange;
    const newY = this.allPlayersRef[this.playerId].y + yChange;
    if (true) {
      //move to the next space
      this.allPlayersSprite[this.playerId].updatePosition(newX, newY);
      this.allPlayersRef[this.playerId].x = newX;
      this.allPlayersRef[this.playerId].y = newY;
      this.allPlayersRef[this.playerId].direction =
        this.allPlayersSprite[this.playerId].direction;
      this.playerRef.set(this.allPlayersRef[this.playerId]);
    }
  }

  keyPressListener() {
    new KeyPressListener('KeyW', () => this.handleArrowPress(0, -4));
    new KeyPressListener('KeyS', () => this.handleArrowPress(0, 4));
    new KeyPressListener('KeyA', () => this.handleArrowPress(-4, 0));
    new KeyPressListener('KeyD', () => this.handleArrowPress(4, 0));
  }
}
