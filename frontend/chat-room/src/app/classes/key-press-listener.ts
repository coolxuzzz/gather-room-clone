export class KeyPressListener {
  keyCode: string;
  lastKey: string = '';
  callback: () => void;
  keySafe: boolean;

  constructor(keyCode: string, callback: () => void) {
    this.keyCode = keyCode;
    this.callback = callback;
    this.keySafe = true;
    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  keydownFunction = (event: KeyboardEvent) => {
    if (event.code === this.keyCode) {
      if (this.keySafe) {
        //this.keySafe = false;
        this.callback();
      }
    }
  };

  keyupFunction = (event: KeyboardEvent) => {
    if (event.code === this.keyCode) {
      this.keySafe = true;
    }
  };

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}
