import { useEffect } from 'react';
import { LoggerScreen } from './LoggerScreen';
import { party, enemyParty, enemyMob } from './Entities';
import { EntityCard } from './EntityCard';
import { BattleEngine } from './BattleEngine';




const battlengine: BattleEngine = new BattleEngine(party, enemyParty);

export default function App() {

  const allies = battlengine.allies;
  const enemies = battlengine.enemies;
  useEffect(() => {

    battlengine.start();

    return () => {
      battlengine.stop();
    };
  }, []);


  return (
    <div className="battle-container">
      <LoggerScreen />
      <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'spaceEvenly', width: '100%' }}>
        <div className="enemy-side">
          {enemies.map((enemy) => (
            <EntityCard key={enemy.name} player={enemy} />
          ))}
        </div>

        <div className="ally-side">
          {allies.map((ally) => (
            <EntityCard key={ally.name} player={ally} />
          ))}
        </div>
      </div>
    </div>

  )
}
