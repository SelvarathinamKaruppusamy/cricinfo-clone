import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Animation {
  visible = signal(false);
  defaultAnimation = signal(true);
  animationPath = signal('');
  private queue: string[] = [];
  private playing = false;
  winnerVisible = signal(false);
 show(ball: string) {

  // Don't play ball animations after match is over
  if (this.winnerVisible()) {
    return;
  }

  this.queue.push(ball);

  if (!this.playing) {
    this.playNext();
  }
}
 showWinner() {

  this.queue = [];

  this.playing = false;

  this.visible.set(false);

  this.defaultAnimation.set(false);

  this.animationPath.set('/animations/winner.json');

  this.winnerVisible.set(true);

}
hideWinner() {

  this.winnerVisible.set(false);

}
  private playNext() {
    if (this.queue.length === 0) {
      this.playing = false;
      return;
    }
    this.playing = true;
    const ball = this.queue.shift()!;
    let animation = '';
    switch (ball) {
      case '6':
        animation = '/animations/six.json';
        break;
      case '4':
        animation = '/animations/four.json';
        break;
      case 'W':
        animation = '/animations/wicket.json';
        break;
      case 'Wd':
        animation = '/animations/wide.json';
        break;
      case 'Nb':
        animation = '/animations/noball.json';
        break;
      case '1':
        case '2':
          case '3':
        animation = '/animations/Runn.json';
        break;
      default:
        this.playing = false;
        this.playNext();
        return;
    }
    this.defaultAnimation.set(false);
    this.animationPath.set(animation);
    this.visible.set(true);

  setTimeout(() => {

    this.visible.set(false);

    if (!this.winnerVisible()) {
        this.defaultAnimation.set(true);
    }

    setTimeout(() => {
        this.playNext();
    },300);

},3000);

  }

}