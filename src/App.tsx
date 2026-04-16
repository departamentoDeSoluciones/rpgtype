import React, { useState, useEffect } from 'react';
import { LoggerScreen } from './LoggerScreen';
import { party, enemyParty } from './Entities';
import { EntityCard } from './EntityCard';
import { BattleEngine } from './BattleEngine';




const battlengine: BattleEngine = new BattleEngine(party, enemyParty);

export default function App() {

  const allies = party.filter(p => p.team === true);
  const enemies = enemyParty.filter(p => p.team === false);
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
        {/* Columna de Enemigos */}
        <div className="enemy-side">
          {enemies.map((enemy) => (
            <EntityCard key={enemy.name} player={enemy} />
          ))}
        </div>

        {/* Columna de Aliados */}
        <div className="ally-side">
          {allies.map((ally) => (
            <EntityCard key={ally.name} player={ally} />
          ))}
        </div>
      </div>
    </div>

  )
}
