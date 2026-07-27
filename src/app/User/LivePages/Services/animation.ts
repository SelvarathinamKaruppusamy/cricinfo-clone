import { Injectable, signal } from '@angular/core';

export interface ScoreEvent {
  id: number;

  value: string;

  text: string;

  team: number;

  type: 'run' | 'boundary' | 'six' | 'wicket' | 'wide' | 'noball';

  shape: number;

  path: number;
}

@Injectable({
  providedIn: 'root',
})
export class Animation {
  visible = signal(false);
  defaultAnimation = signal(true);
  animationPath = signal('');
  private queue: string[] = [];
  private playing = false;
  winnerVisible = signal(false);

  //for score-animation
  events = signal<ScoreEvent[]>([]);
  private scoreId = 0;

  showScoreEvent(ball: string, team: number) {
    const event: ScoreEvent = {
      id: ++this.scoreId,

      value: ball,

      text: this.getText(ball),

      team,

      type: this.getType(ball),

      shape: Math.floor(Math.random() * 5),

      path: Math.floor(Math.random() * 5),
    };

    this.events.update((v) => [...v, event]);

    setTimeout(() => {
      this.events.update((list) => list.filter((x) => x.id !== event.id));
    }, 1800);
  }

  private getText(ball: string) {
    switch (ball) {
      case '1':
        return '+1';

      case '2':
        return '+2';

      case '3':
        return '+3';

      case '4':
        return 'FOUR';

      case '6':
        return 'SIX';

      case 'W':
        return 'W';

      case 'Wd':
        return 'WD';

      case 'Nb':
        return 'NB';

      default:
        return ball;
    }
  }

  private getType(ball: string) {
    switch (ball) {
      case '4':
        return 'boundary';

      case '6':
        return 'six';

      case 'W':
        return 'wicket';

      case 'Wd':
        return 'wide';

      case 'Nb':
        return 'noball';

      default:
        return 'run';
    }
  }

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
      }, 300);
    }, 3000);
  }
}
