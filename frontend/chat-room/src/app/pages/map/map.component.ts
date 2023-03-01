import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
import { initializeApp } from '@firebase/app';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  playerId!: string;
  playerRef!: any;

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // initialize the game
    this.initGame();

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        // you're' logged in
        this.playerId = user.uid;
        this.playerRef = this.db.database.ref(`players/${this.playerId}`);
        this.playerRef.set({
          id: this.playerId,
          name: 'test',
        });

        this.playerRef.onDisconnect().remove();
      } else {
        // you're logged out
      }
    });

    this.authService.login();
  }

  initGame() {}
}
