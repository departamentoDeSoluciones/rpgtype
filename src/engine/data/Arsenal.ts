import { logger } from "../core/Logger";
import { Player } from '../models/Player';
import { StatusEffect } from "../models/Stats";
import { Move, Cast, BattleItem, Armor, ArmorSet } from '../models/BattleActions';

function diceRoll(rolls: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < rolls; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    results.push(roll);
  } return results;
}
export class Bash extends StatusEffect {
  constructor(duration: number = .2) {
    super("Aturdimiento", duration);
  }
  onDexMod(currentValue: number): number {
    return 0;
  }
}

export class ZenEffect extends StatusEffect {
  constructor(duration: number = 4) {
    super("Zen Mode", duration);
    logger.log(`MODO ZEN INTELIGENCIA DOBLE!`);
  }
  onIntMod(currentValue: number): number {
    return currentValue * 2;
  }
}
export class winded extends StatusEffect {
  constructor(duration: number = 4) {
    super("Winded", duration);
    logger.log(`Corres con el viento`);
  }
  onDexMod(currentValue: number): number {
    return currentValue * 1.5;
  }
}

export class cemetaryCurse extends StatusEffect {
  constructor(duration: number = 4) {
    super("Cemetary Curse", duration);
    logger.log(`Los cadaveres del cementerio te relentizan!`);

  }
  onDexMod(currentValue: number): number {
    return currentValue * 0.75;
  }
}

export const none = new Armor("none", 0, 1);
export const helmet = new Armor("Casco de hierro", 5, 100);
export const chest = new Armor("Pechera de acero", 15, 200);
export const boots = new Armor("Botas de cuero", 10, 80);
export const titaniumrobe = new Armor("Titanium Robe", 40, 100);
export const dedalousheather = new Armor("Dedalous Heather", 25, 150);
export const leaf = new Armor("Leaf Armor", 1, 1);
export const holyHelmet = new Armor("Holy Helmet", 35, 120);
export const penacho = new Armor("Penacho", 20, 100);
export const blackDrug = new Armor("Black Drug", 55, 150);

export const armorSetDarkCleric = new ArmorSet(holyHelmet, chest, boots);
export const armorSetVS = new ArmorSet(helmet, blackDrug, boots);
export const armorSetBasic = new ArmorSet(helmet, chest, boots);
export const armorSetNecro = new ArmorSet(none, titaniumrobe, boots);
export const armorSetBelafonte = new ArmorSet(helmet, dedalousheather, none);
export const armorSetTreant = new ArmorSet(leaf, leaf, leaf);
export const armorSetChaman = new ArmorSet(leaf, leaf, penacho);

export function createPoisonDart() {
  return new BattleItem("Dardo Envenenado", (attacker: Player, target?: Player) => {
    if (!target) return;
    let damage = 15 + (attacker.currentDex / 2);
    let roll = diceRoll(3, 6);
    if (roll[0] === roll[2]) {
      let damageBonus = roll[0] + roll[1] + roll[2];
      let finalDamage = Math.floor(damage + damageBonus);
      logger.log(`Dardo Envenenado usado en ${target.name}`);
      logger.log(`${target.name} tiene suerte, recibe ${damageBonus} de daño extra!`);
      target.receiveDamage(finalDamage);
    } else {
      logger.log(`Dardo Envenenado usado en ${target.name}`);
      target.receiveDamage(Math.floor(damage));
    }
  });
}

export function createHealingPotion() {
  return new BattleItem("Poción de curación", (user) => {
    let healAmount = 30;
    user.receiveHealing(healAmount);
    logger.log(`${user.name} usó una Poción de curación y recuperó ${healAmount} HP!`);
  });
}

export const hellPray = new Cast("Oración al Infierno", (allies, enemies) => {
  const baseHeal = 20 + (allies.currentInt / 2);
  const roll = diceRoll(2, 1);
  const totalRoll = roll.reduce((acc, val) => acc + val, 0);
  if (roll[1] === 1) {
    logger.log(`${allies.name} fue maldecido por el infierno!`);
    allies.statusEffects.push(new ZenEffect);
    const sacrificeDamage = allies.hp * 0.1;
    allies.receiveDamage(sacrificeDamage);
  } else {
    allies.receiveHealing(baseHeal + totalRoll);
  }
});

export const sacretChilds = new Cast("Hijos Sagrados", (allies, enemies) => {
  let baseHeal = Math.floor(allies.currentInt / 2);
  let roll = diceRoll(4, 28);
  if (roll[0] === roll[1] || roll[2] === roll[3]) {
    logger.log(`Los hijos sagrados afilan tu vision ${allies.name} `);
    let finalHeal = baseHeal + roll[0] + roll[1] + roll[2] + roll[3];
    allies.receiveHealing(finalHeal);
  } else {
    allies.receiveHealing(baseHeal);
  }
});
export const desolatorWine = new Cast("Vino Desolador", (allies, enemies) => {
  let baseheal = 150;
  let roll = diceRoll(2, 20);
  if (roll[0] === 1 || roll[1] === 1) {
    logger.log(`${allies.name} se emborracha y recibe daño!`);
    allies.receiveDamage(baseheal / 1.5);
    return;
  }
  if (roll[0] === 20 || roll[1] === 20) {
    let healBonus = (allies.currentInt / 2);
    logger.log(`${allies.name} se emborracha y se siente genial! Recibe curación extra!`);
    allies.receiveHealing(baseheal + healBonus);
  } else {
    allies.receiveHealing(baseheal);
  }
});

export const funeralopolis = new Cast("Funeralópolis", (allies, enemies) => {

  let roll = diceRoll(3, 6);
  let baseDamage = 30 + (allies.currentStr / 100);
  if (roll[0] === 6 || roll[1] === 6 || roll[2] === 6) {
    logger.log(`Millions are screaming, the dead are still living`);
    enemies.statusEffects.push(new cemetaryCurse);

  }

  logger.log(`Death shroud existence, slave for a pittance`);
  enemies.receiveDamage(baseDamage);
});

export const copalWaves = new Move("Ondas de Copal", (attacker: Player, target: Player) => {
  let baseDamage = Math.floor(attacker.currentDex / 3.3);
  let roll = diceRoll(2, 20);
  let finaldamage = baseDamage + roll[0] * roll[1];
  if (roll[0] === 7 || roll[1] === 14) {
    logger.log(`Espiritus bendicen a ${attacker.name}`);
    attacker.statusEffects.push(new ZenEffect);
  }
  target.receiveDamage(finaldamage);
}, .01);
export const quickArrow = new Move("Flecha Rápida", (attacker: Player, target) => {
  let roll = diceRoll(3, 6);
  let baseDamage = attacker.currentDex / 6;
  let finaldamage = (baseDamage + roll[0]) + (baseDamage + roll[1] - (roll[2] + 9));
  let finaldamage2 = (baseDamage + roll[2] + roll[0] + roll[1]);
  if (roll[0] === roll[1] || roll[1] === roll[2]) {
    attacker.statusEffects.push(new winded);
  }
  target.receiveDamage(finaldamage);
  if (!target.isAlive) { return; }
  target.receiveDamage(finaldamage2);

}, .02);

export const darkPulse = new Move("Pulso Sombrio", (attacker, target) => {
  let baseDamage = Math.floor(attacker.currentInt / 2);
  let intDifference = attacker.currentInt - target.currentInt;
  let bonusDamage = intDifference > 0 ? Math.floor(intDifference * (attacker.currentInt / 100)) : 0;

  target.receiveDamage(baseDamage + bonusDamage);
}, 5);

export const punch = new Move("Puñetazo", (attacker, target) => {
  let damage = 50 + (attacker.currentStr / 2);
  let roll = diceRoll(2, 20);
  if (roll[0] === 1 || roll[1] === 20) {
    logger.log(`${attacker.name} aturde a ${target.name} con un golpe!`);
    target.atb.actingTime += .2;
    target.atb.status = 'acting';
  }
  target.receiveDamage(damage);
}, .5);

export const soulMisil = new Move("misil de almas", (attacker, target) => {
  let damage = 20 + (attacker.currentStr / .85);
  target.receiveDamage(damage);
}, .2)

export const doubleStrike = new Move("Golpe Doble", (attacker, target) => {
  const roll = diceRoll(2, 20);
  let damage = attacker.currentStr * .5;
  if (roll[0] + roll[1] === 5) {
    damage *= 1.25;
  }
  let damage2 = damage / 2;
  logger.log(`${attacker.name} golpea dos veces`);
  target.receiveDamage(damage);
  if (!target.isAlive) { return; }
  target.receiveDamage(damage2);
}, 1);



export const fireball = new Move("Bola de Fuego", (attacker, target) => {
  let damage = attacker.currentInt * .5;
  let roll = diceRoll(2, 20);
  target.receiveDamage(damage);
  if (roll[0] === 1 || roll[1] == 10) {
    if (!target.isAlive) { return; }
    logger.log(`${target.name} se quema y recibe daño extra!`);
    target.receiveDamage(attacker.stats.int / 5.55);
  }
}, .1);


export const thunderArrow = new Move("Flecha de Trueno", (attacker, target) => {
  let damage = attacker.stats.dex * .75;
  let roll = diceRoll(2, 20);
  let thunderDamage = (roll[0] + roll[1] + (attacker.currentDex / 10));
  thunderDamage = Math.floor(thunderDamage);
  let finaldamage: number = damage + thunderDamage;
  logger.log(`${target.name} es golpeado por un trueno que inflige ${thunderDamage} de daño extra!`);
  target.receiveDamage(finaldamage);
}, .4);

export const healingVine = new Move("Vid Curativa", (attacker, target) => {
  let baseDamage = attacker.currentStr * 0.5;
  const roll = diceRoll(2, 20);
  let rawHeal = baseDamage - roll[0] - roll[1];
  let healAmount = Math.min(attacker.maxHp, rawHeal);
  target.receiveDamage(baseDamage);

  logger.log(`lianas espinosas curan a ${attacker.name}`);
  attacker.receiveHealing(healAmount);
  return 0;
}, .5);
healingVine.isSupport = true;


export const entangle = new Move("Enredadera", (attacker, target) => {
  logger.log(` las hojas de ${attacker.name} reflejan la luz del dia`);
}, 0.1);


