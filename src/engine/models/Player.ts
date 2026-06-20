import { Stats, Experience, StatusEffect } from './Stats'
import { BattleStatus } from './ATB';
import { logger } from '../core/Logger';
import { ArmorSet, Armor, Move, Cast, BattleItem } from './BattleActions';
function diceRoll(rolls: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < rolls; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    results.push(roll);
  } return results;
}

type Listener = () => void;
export class Player {
  public _baseHp: number;
  public hp: number = 0;
  isAlive: boolean = true;
  public coin: number;
  public stats: Stats;
  public armor: ArmorSet;
  public xp: Experience = new Experience;
  public moveSet: Move[] = [];
  public castSet: Cast[] = [];
  public team: boolean = false;
  public inventory: BattleItem[] = [];
  public statusEffects: StatusEffect[] = [];
  private listeners: Listener[] = [];
  public atb: BattleStatus = new BattleStatus;
  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  private notify() {
    this.listeners.forEach(l => l());
  }
  get currentInt() {
    let val = this.stats.int;
    for (const effect of this.statusEffects) {
      if (effect.onIntMod) val = effect.onIntMod(val);
    }
    return val;
  }
  get currentDex() {
    let val = this.stats.dex;
    for (const effect of this.statusEffects) {
      if (effect.onDexMod) val = effect.onDexMod(val);
    }
    return val;
  }
  get currentStr() {
    let val = this.stats.strength;
    for (const effect of this.statusEffects) {
      if (effect.onStrMod) val = effect.onStrMod(val);
    }
    return val;
  }
  constructor(
    public name: string,
    hp: number,
    stats: Stats,
    armor: ArmorSet,
    coin: number = 0

  ) {
    this.stats = stats;
    this.statusEffects = [];
    this._baseHp = hp;
    this.armor = armor;
    this.coin = Math.max(0, coin);
    this.stats.statsLevelUp(1);
    this.hp = this.maxHp;
  }
  get maxHp() {
    return this._baseHp + Math.floor(this.currentStr * 1.5);
  }
  public updateEffects(delta: number) {
    this.statusEffects = this.statusEffects.filter(effect => {
      const alive = effect.update(delta);
      if (!alive) {
        logger.log(`${effect.name} ha terminado en ${this.name}`);
        this.notify();
      }

      return alive;
    });
  }

  receiveHealing(heal: number) {
    this.hp = Math.min(this.hp + heal, this.maxHp);
    logger.log(`${this.name} fue curado ${heal}. HP: ${this.hp}`);
    this.notify();
    if (this.hp <= 0) {
      this.isAlive = false;
      this.notify();
      logger.log(`${this.name} fainted `);
    }
  }
  receiveDamage(damage: number) {
    const defense = this.armor.totalDefense;
    const roll = diceRoll(2, 28);
    if (roll[0] === 2 || roll[1] === 20) {
      logger.log("¡CRÍTICO!");
      let dc = (damage * (1.5 + this.stats.critChance)) - defense;
      dc = Math.floor(dc);
      this.hp = Math.max(0, this.hp - dc);
      logger.log(`${this.name} recibe ${dc} de daño. HP restante: ${this.hp}`);
      this.notify();
    } else {

      let finalDamage = Math.max(0, damage - defense);
      finalDamage = Math.floor(finalDamage);
      if (finalDamage === 0) { finalDamage = + 1; }


      this.hp = Math.max(0, this.hp - finalDamage);
      logger.log(`${this.name} recibe ${finalDamage} de daño. HP restante: ${this.hp}`);
      this.notify();
    }

    if (this.hp <= 0) {
      this.isAlive = false;
      logger.log(`${this.name} fainted `);
      this.notify();

    }
  }
  cast(allies: Player, enemies: Player) {

    let roll = diceRoll(2, 28);
    if (roll[0] === 7 || roll[1] === 1) {
      logger.log(`hechizo de ${this.name} fallo`);
      this.atb.status = 'idle';
      this.atb.atb = 0; this.notify();

      return;
    }
    if (!this.isAlive) {
      this.notify();
      return;
    }
    const randomIndex = Math.floor(Math.random() * this.castSet.length);
    const selectedCast = this.castSet[randomIndex];
    logger.log(`${this.name} lanza ${selectedCast.name}!`);
    const strPenalty = this.currentStr / 5000;
    selectedCast.execute(allies, enemies);
    this.atb.actingTime = selectedCast.castTime + strPenalty;
    this.atb.status = 'acting';

    this.notify();

  }
  attack(target: Player) {

    let roll = diceRoll(2, 28);
    if (roll[0] === 7 || roll[1] === 1) {
      logger.log(`ataque de ${this.name} fallo`);
      this.atb.status = 'idle';
      this.atb.atb = 0;
      this.notify();
      return;
    }
    if (!target.isAlive) {
      this.notify();
      return;
    }
    if (!this.isAlive) {
      this.notify();
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.moveSet.length);
    const selectedMove = this.moveSet[randomIndex];
    logger.log(`${this.name} usa ${selectedMove.name} contra ${target.name}!`);
    selectedMove.execute(this, target);
    const strPenalty = this.currentStr / 5000;
    this.atb.actingTime = selectedMove.castTime + strPenalty;
    this.atb.status = 'acting';
    this.notify();

  }
  public levelUp(totalLevels: number) {
    this.xp.lvl += totalLevels;
    this.stats.statsLevelUp(totalLevels);
    this.hp = this.maxHp;
    this.notify();
  }
  public receiveXp(xpGained: number) {
    this.xp.xpPoints += xpGained;
    let gainlevels: number = 0;

    while (this.xp.xpPoints >= this.xp.xpToNextLvl) {
      this.xp.xpPoints -= this.xp.xpToNextLvl;
      this.xp.lvl++;
      gainlevels++;
    }
    if (gainlevels > 0) {
      this.stats.statsLevelUp(gainlevels);
      logger.log(`>>> ${this.name} LEVEL UP x${gainlevels}! Nivel actual: ${this.xp.lvl}`);
      this.hp = this.maxHp;
      logger.log(`Nuevos Stats -> INT: ${this.stats.int} | DEX: ${this.stats.dex} | STR: ${this.stats.strength}`);
      this.notify();
    }
  }

  public updateAtb(delta: number) {
    if (!this.isAlive) return;
    this.atb.update(delta, this.currentDex);
    this.notify();
  }
}


export class Mob extends Player {
  constructor(areaLevel: number) {
    const generateArmorNumber = (): number => {
      return (areaLevel / 1.4);
    };
    const generateHpNumber = (): number => {
      return (areaLevel * 20);
    };
    const bonus = diceRoll(3, 20);

    const finalStr: number = (areaLevel * 1.3) + bonus[0];
    const finalDex: number = (areaLevel * 3) + bonus[1];
    const finalInt: number = (areaLevel * 1.3) + bonus[2];

    const mobStats = new Stats(finalStr, finalDex, finalInt);
    const mobName: string = "";
    const armorone = new Armor("mobarmor", generateArmorNumber(), 0)
    const mobArmorSet = new ArmorSet(armorone, armorone, armorone);
    super(mobName, generateHpNumber(), mobStats, mobArmorSet);

  }
}
