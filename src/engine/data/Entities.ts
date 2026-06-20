import { Player, Mob } from '../models/Player.ts';
import { Stats } from '../models/Stats'
import {
  armorSetDarkCleric,
  armorSetBasic,
  armorSetVS,
  armorSetChaman,
  armorSetBelafonte,
  armorSetNecro,
  hellPray,
  soulMisil,
  sacretChilds,
  desolatorWine,
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
  darkPulse,
  funeralopolis
} from './Arsenal';
function diceRoll(rolls: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < rolls; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    results.push(roll);
  } return results;
}

export class vivonuinmSabathi extends Player {
  constructor() {
    const vinvonimSabathiStats = new Stats(150, 300, 500);
    super("Vinvonim", 1000, vinvonimSabathiStats, armorSetVS, 500);
    this.levelUp(55);
    this.moveSet.push(fireball);
    this.castSet.push(funeralopolis);
    this.moveSet.push(doubleStrike);
    this.team = false;
  }
}


export class depthCleric extends Player {
  constructor(name: string) {
    const clericStats = new Stats(150, 130, 40);
    super(name, 375, clericStats, armorSetDarkCleric, 15);
    this.levelUp(27);
    this.castSet.push(hellPray);
    this.castSet.push(desolatorWine);
    this.moveSet.push(soulMisil);
    this.team = false;
  }
}
export class Treant extends Player {
  constructor(name: string) {
    const treantStats = new Stats(200, 112, 150);
    super(name, 650, treantStats, armorSetBasic, 10);
    this.moveSet.push(entangle);
    this.castSet.push(sacretChilds);
    this.moveSet.push(healingVine);
    this.team = true;
    this.levelUp(25);
  }
}
export class Chaman extends Player {
  constructor(name: string) {
    const chamanStats = new Stats(200, 200, 20);
    super(name, 175, chamanStats, armorSetChaman, 10);
    this.moveSet.push(copalWaves);
    this.castSet.push(sacretChilds);
    this.moveSet.push(fireball);
    this.levelUp(25);
    this.team = true;
  }
}
export class Archer extends Player {
  constructor(name: string) {
    const archerStats = new Stats(10, 235, 10);
    super(name, 125, archerStats, armorSetBelafonte, 15);
    this.moveSet.push(thunderArrow);
    this.moveSet.push(quickArrow);
    this.team = true;
    this.stats.critChance += 1;
    this.levelUp(27);
  }
}
export class Wizard extends Player {
  constructor(name: string) {
    const wizardStats = new Stats(220, 170, 20);
    super(name, 160, wizardStats, armorSetBasic, 12);
    this.moveSet.push(fireball);
    this.moveSet.push(soulMisil);
    this.team = true;
    this.levelUp(27);
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
    const warriorStats = new Stats(20, 130, 275);
    super(name, 200, warriorStats, armorSetBasic, 15);
    this.moveSet.push(doubleStrike);
    this.moveSet.push(punch);
    this.team = true;
    this.levelUp(30);
  }
}
export class Negromante extends Player {
  constructor() {
    const negromanteStats = new Stats(200, 130, 100)
    super("Negromante", 550, negromanteStats, armorSetNecro, 30)
    this.moveSet.push(fireball);
    this.moveSet.push(darkPulse);
    this.team = false;
    this.levelUp(31);
  }
}
export const mobSpawn = (areaLevel: number): Mob[] => {
  let roll = diceRoll(1, 4);
  const mobArray: Mob[] = [];
  for (let m = 0; m < roll[0]; m++) {
    mobArray.push(new Mob(areaLevel));
    mobArray[m].moveSet.push(punch);
  }
  return mobArray;
};
export const gandalf = new Wizard("Gandalf");
export const conan = new Warrior("Conan");
export const goblin = new Goblin;
export const pachita = new Chaman("Pachita");
export const negromante = new Negromante;
export const negromante2 = new Negromante;
export const belafonte = new Archer("Belafonte");
export const trencho = new Treant("Trencho");
export const judas = new depthCleric("Judas");
export const vinvonimSabathi = new vivonuinmSabathi;
export const party: Player[] = [trencho, pachita, conan, belafonte];
export const enemyMob: Mob[] = mobSpawn(45);
export const enemyParty: Player[] = [vinvonimSabathi, judas, negromante];
