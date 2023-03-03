import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  withGrid(n: number): number {
    return n * 32;
  }

  xOffSet(): number {
    return 13.5 * 32;
  }

  yOffSet(): number {
    return 10.75 * 32;
  }
}
