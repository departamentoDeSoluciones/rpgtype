
export class Experience {
  public lvl: number = 1;
  public xpPoints: number = 0;
  get xpToNextLvl(): number {
    return (this.lvl + 1) * 1500;
  }
  get bounty(): number {
    return this.lvl * 800;
  }
}
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


export class Stats {
  public critChance: number = .35;
  constructor(
    public int: number,
    public dex: number,
    public strength: number
  ) { }


  statsLevelUp(totalLevels: number) {
    const growthRate = 5 * totalLevels;
    this.int += growthRate;
    this.dex += growthRate;
    this.strength += growthRate;
  }
}

