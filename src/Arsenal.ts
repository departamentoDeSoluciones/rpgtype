import { logger } from "./Logger";
import type { Player, StatusEffect } from './Model';
// Valores reales: Esto sí se mantiene porque haces "new Move()", "new ArmorSet()", etc.
import { Move, Cast, BattleItem, Armor, ArmorSet } from './Model';

function diceRoll(rolls: number, sides: number): number[] {
  const results: number[] = [];
  for (let i = 0; i < rolls; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    results.push(roll);
  } return results;
}

export class ZenEffect implements StatusEffect {
  constructor(public name = " Modo Zen ", public duration: number = 3) { }
  onIntMod(currentValue: number): number {
    logger.log(`MODO ZEN INTELIGENCIA DOBLE!`);
    return currentValue * 2;
  }
}

export const none = new Armor("none", 0, 1);
export const helmet = new Armor("Casco de hierro", 5, 100);
export const chest = new Armor("Pechera de acero", 15, 200);
export const boots = new Armor("Botas de cuero", 5, 80);
export const titaniumrobe = new Armor("Titanium Robe", 40, 100);
export const dedalousheather = new Armor("Dedalous Heather", 25, 150);
export const leaf = new Armor("Leaf Armor", 1, 1);
export const holyHelmet = new Armor("Holy Helmet", 35, 120);
export const penacho = new Armor("Penacho", 20, 100);

export const armorSetDarkCleric = new ArmorSet(holyHelmet, chest, boots);
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
  const targets = allies.length > 0 ? allies : enemies;
  const livingTargets = targets.filter(t => t.isAlive);

  if (livingTargets.length === 0) return; // Nadie a quien rezar

  const ally = livingTargets[Math.floor(Math.random() * livingTargets.length)];

  const baseHeal = 20 + (ally.currentInt / 2);
  const roll = diceRoll(2, 28);
  const totalRoll = roll.reduce((acc, val) => acc + val, 0);

  if (roll[0] === 7 || roll[1] === 1) {
    logger.log(`${ally.name} fue maldecido por el infierno!`);
    ally.statusEffects.push(new ZenEffect());
    const sacrificeDamage = 15;
    ally.receiveDamage(sacrificeDamage);
  } else {
    ally.receiveHealing(baseHeal + totalRoll);
  }
});

export const copalWaves = new Move("Ondas de Copal", (attacker: Player, target: Player) => {
  let baseDamage = Math.floor(attacker.currentDex / 3.3);
  let roll = diceRoll(2, 20);
  let finaldamage = baseDamage + roll[0] * roll[1];
  if (roll[0] === 7 && roll[1] === 14) {
    logger.log(`Espiritus bendicen a ${attacker.name}`);
    attacker.statusEffects.push(new ZenEffect());
  }
  target.receiveDamage(finaldamage);
});
export const quickArrow = new Move("Flecha Rápida", (attacker: Player, target) => {
  let roll = diceRoll(3, 6);
  let baseDamage = attacker.currentDex / 6;
  let finaldamage = (baseDamage + roll[0]) + (baseDamage + roll[1] - (roll[2] + 9));
  let finaldamage2 = (baseDamage + roll[2] + 9);
  target.receiveDamage(finaldamage);
  target.receiveDamage(finaldamage2);
  target.receiveDamage(roll[2]);

});
export const darkPulse = new Move("Pulso Sombrio", (attacker, target) => {
  let baseDamage = Math.floor(attacker.currentInt / 2);
  let intDifference = attacker.currentInt - target.currentInt;
  let bonusDamage = intDifference > 0 ? Math.floor(intDifference * (attacker.currentInt / 100)) : 0;

  target.receiveDamage(baseDamage + bonusDamage);
});

export const punch = new Move("Puñetazo", (attacker, target) => {
  let damage = 10 + (attacker.stats.strength / 2);
  target.receiveDamage(damage);
});

export const soulMisil = new Move("misil de almas", (attacker, target) => {
  let damage = 20 + (attacker.currentStr / .85);
  target.receiveDamage(damage);
})

export const doubleStrike = new Move("Golpe Doble", (attacker, target) => {
  const roll = diceRoll(2, 20);
  let damage = (attacker.currentStr);
  if (roll[0] + roll[1] === 5) {
    damage *= 1.25;
  }
  let damage2 = damage / 2;
  logger.log(`${attacker.name} golpea dos veces`);
  target.receiveDamage(damage);
  if (!target.isAlive) { return; }
  target.receiveDamage(damage2);
});



export const fireball = new Move("Bola de Fuego", (attacker, target) => {
  let damage = attacker.currentInt * .5;
  let roll = diceRoll(2, 20);
  target.receiveDamage(damage);
  if (roll[0] === 1 || roll[1] == 10) {
    if (!target.isAlive) { return; }
    logger.log(`${target.name} se quema y recibe daño extra!`);
    target.receiveDamage(attacker.stats.int / 5.55);
  }
});


export const thunderArrow = new Move("Flecha de Trueno", (attacker, target) => {
  let damage = attacker.stats.dex * .75;
  let roll = diceRoll(2, 20);
  let thunderDamage = (roll[0] + roll[1]) / 2;
  let finaldamage: number = damage + thunderDamage;
  logger.log(`${target.name} es golpeado por un trueno que inflige ${thunderDamage} de daño!`);
  target.receiveDamage(finaldamage);
});

export const healingVine = new Move("Vid Curativa", (attacker, target) => {
  let baseDamage = attacker.currentStr * 0.5;
  const roll = diceRoll(2, 20);
  let rawHeal = baseDamage - roll[0] - roll[1];
  let healAmount = Math.min(attacker.maxHp, rawHeal);
  target.receiveDamage(baseDamage);

  logger.log(`lianas espinosas curan a ${attacker.name}`);
  attacker.receiveHealing(healAmount);
  return 0;
});
healingVine.isSupport = true;


export const entangle = new Move("Enredadera", (attacker, target) => {
  logger.log(` las hojas de ${attacker.name} se mueven con el viento`);
  attacker.receiveHealing(1);
});


