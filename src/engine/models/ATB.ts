
function diceRoll(rolls: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < rolls; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    results.push(roll);
  } return results;
}

export type FigtherState = 'idle' | 'ready' | 'acting' | 'dead';

export class BattleStatus {
  public atb: number = 0;
  public actingTime: number = 0;
  public status: FigtherState = 'idle';

  public resetacting() {
    this.actingTime = 0;
    this.status = 'idle';
  }

  public actingupdate(delta: number) {
    this.actingTime -= delta;
    this.resetacting();
  }


  public update(delta: number, currentDex: number) {
    if (this.status === 'acting') {
      this.actingTime -= delta;
      if (this.actingTime <= 0) {
        this.actingTime = 0;
        this.reset();
      }
      return;
    }

    if (this.status != 'idle') return;


    const speed = currentDex * .20;
    this.atb += speed * delta;

    if (this.atb >= 200) {
      this.atb = 200;
      this.status = 'ready';

    }
  }
  public reset() {
    this.atb = 0;
    this.status = 'idle';
  }
}
