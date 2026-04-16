import { logger } from './Logger.ts';
import { Player } from './Model.ts';

export class BattleEngine {
  private lastTime: number = 0;
  private isRuning: boolean = false;
  private actionQueue: Player[] = [];
  private allEntities: Player[] = [];
  constructor(party: Player[], enemyParty: Player[]) {
    this.allEntities = [...party, ...enemyParty];
  }
  public stop() {
    this.isRuning = false;
  }
  public start() {



    this.allEntities.forEach(p => {
      if (p.atb) {
        p.atb.atb = 0;
      }
    })
    this.isRuning = true;
    this.lastTime = performance.now();
    this.loop();
  }
  private checkGameOver() {
    const alliesAlive = this.allEntities.filter(p => p.team && p.isAlive);
    const enemiesAlive = this.allEntities.filter(p => !p.team && p.isAlive);

    if (alliesAlive.length === 0) {
      this.stop();
      logger.log("DERROTA: Todos los aliados han caído.");
      return "DEFEAT";
    }

    if (enemiesAlive.length === 0) {
      this.stop();
      logger.log("VICTORIA: Los enemigos han sido derrotados.");
      return "VICTORY";
    }

    return null;
  }
  private loop = () => {
    if (!this.isRuning) return;
    if (this.checkGameOver()) return;

    const currentTime = performance.now();
    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    if (this.actionQueue.length > 0) {
      const attacker = this.actionQueue.shift()!;


      if (attacker.isAlive) {
        const opps = attacker.team ?
          this.allEntities.filter(e => !e.team && e.isAlive) :
          this.allEntities.filter(e => e.team && e.isAlive);

        if (opps.length > 0) {
          attacker.attack(opps[0]);
        }
      }
      attacker.atb.reset();
    }
    this.allEntities.forEach(player => {
      if (player.isAlive && player.atb.status === 'idle') {
        player.updateAtb(delta);
      }
      if (player.atb.status === 'ready' && !this.actionQueue.includes(player)) {
        this.actionQueue.push(player);
      }

    });
    requestAnimationFrame(this.loop);
  }
}
