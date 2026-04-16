import { Player, Stats } from './Model';
import {
  armorSetDarkCleric,
  armorSetBasic,
  armorSetChaman,
  armorSetBelafonte,
  armorSetNecro,
  hellPray,
  soulMisil,
  entangle,
  quickArrow,
  punch,
  healingVine,
  thunderArrow,
  fireball,
  copalWaves,
  createHealingPotion,
  createPoisonDart,
  doubleStrike,
  darkPulse
} from './Arsenal';
export class depthCleric extends Player {
  constructor(name: string) {
    const clericStats = new Stats(100, 60, 40);
    super(name, 375, clericStats, armorSetDarkCleric, 15);
    this.levelUp(20);
    this.castSet.push(hellPray);
    this.moveSet.push(punch);
    this.moveSet.push(soulMisil);
    this.team = false;
  }
}
export class Treant extends Player {
  constructor(name: string) {
    const treantStats = new Stats(200, 25, 120);
    super(name, 390, treantStats, armorSetBasic, 10);
    this.moveSet.push(entangle);
    this.moveSet.push(punch);
    this.moveSet.push(healingVine);
    this.team = true;
    this.levelUp(25);
  }
}
export class Chaman extends Player {
  constructor(name: string) {
    const chamanStats = new Stats(200, 175, 20);
    super(name, 175, chamanStats, armorSetChaman, 10);
    this.moveSet.push(copalWaves);
    this.moveSet.push(punch);
    this.moveSet.push(fireball);
    this.levelUp(20);
  }
}
export class Archer extends Player {
  constructor(name: string) {
    const archerStats = new Stats(10, 233, 40);
    super(name, 125, archerStats, armorSetBelafonte, 15);
    this.moveSet.push(thunderArrow);
    this.moveSet.push(quickArrow);
    this.team = true;
    this.levelUp(23);
  }
}
export class Wizard extends Player {
  constructor(name: string) {
    const wizardStats = new Stats(120, 75, 20);
    super(name, 160, wizardStats, armorSetBasic, 12);
    this.moveSet.push(fireball);
    this.moveSet.push(soulMisil);
    this.team = true;
    this.levelUp(25);
  }
}
export class Goblin extends Player {
  constructor() {
    const goblinStats = new Stats(0, 45, 20);
    super("Goblin", 100, goblinStats, armorSetBasic, 5);
    this.inventory.push(createHealingPotion());
    this.inventory.push(createPoisonDart());
    this.moveSet.push(punch);
    this.team = true;
    this.levelUp(12);
  }
}
export class Warrior extends Player {
  constructor(name: string) {
    const warriorStats = new Stats(20, 65, 145);
    super(name, 200, warriorStats, armorSetBasic, 15);
    this.moveSet.push(doubleStrike);
    this.moveSet.push(punch);
    this.team = true;
    this.levelUp(23);
  }
}
export class Negromante extends Player {
  constructor() {
    const negromanteStats = new Stats(140, 130, 100)
    super("Negromante", 550, negromanteStats, armorSetNecro, 30)
    this.moveSet.push(fireball);
    this.moveSet.push(darkPulse);
    this.team = false;
    this.levelUp(31);
  }
}
export const gandalf = new Wizard("Gandalf");
export const conan = new Warrior("Conan");
export const goblin = new Goblin;
export const pachita = new Chaman("Pachita");
export const negromante = new Negromante;
export const negromante2 = new Negromante;
negromante2.levelUp(-12);
export const belafonte = new Archer("Belafonte");
export const trencho = new Treant("Trencho");
export const judas = new depthCleric("Judas");
export const party: Player[] = [trencho, gandalf, conan, belafonte];
export const enemyParty: Player[] = [judas, negromante, negromante2, pachita];
