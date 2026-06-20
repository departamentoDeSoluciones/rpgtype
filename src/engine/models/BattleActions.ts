import { Player } from "./Player";

export class StatusEffect {
  constructor(
    public name: string,
    public duration: number,
  ) { }
  update(delta: number): boolean {
    this.duration -= delta;
    return this.duration > 0;
  }
  onDexMod?(currentValue: number): number;
  onIntMod?(currentValue: number): number;
  onStrMod?(currentValue: number): number;
  onATBMod?(currentValue: number): number;
}

export class Move {
  public isSupport: boolean = false;

  constructor(
    public name: string,
    private formula: (attacker: Player, defender: Player) => number | void,
    public castTime: number) { }

  execute(attacker: Player, target: Player) {
    this.formula(attacker, target);
  }
}
export class Cast {
  castTime: number = .30;
  constructor(
    public name: string,
    private formula: (allies: Player, enemies: Player) => void) { }

  execute(allies: Player, enemies: Player) {
    this.formula(allies, enemies);
  }
}
export class BattleItem {
  amount: number = 0;
  constructor(
    public name: string,
    private effect: (user: Player, target?: Player) => void) {
    this.amount++;
  }
  count(amount: number) {
    this.amount += amount;
    return this;
  }
  use(user: Player, target?: Player) {
    if (this.amount <= 0 || !user.isAlive) return;
    const receiver = target ? target : user;
    this.effect(receiver, target);
    this.amount--;
  }
}

export class Armor {
  public defense: number;
  constructor(
    name: string,
    defense: number,
    durability: number,
  ) { this.defense = defense; }
}
export class ArmorSet {
  public totalDefense: number;
  constructor(
    public slot1: Armor,
    public slot2: Armor,
    public slot3: Armor,
  ) {
    this.totalDefense = slot1.defense + slot2.defense + slot3.defense;
  }
}

