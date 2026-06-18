import { useEffect, useState } from 'react';
import { Player } from './Model';
import './EntityCard.css';
import { logger } from './Logger';

interface EntityCardProps {
  player: Player;
}
export const EntityCard: React.FC<EntityCardProps> = ({ player }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = player.subscribe(() => setTick(t => t + 1));
    return () => unsubscribe();
  }, [player]);

  const onSelect = (target: Player) => {
    logger.log(`${target.name} seleccionado`);
  };

  const isTargetable: boolean = true;
  const hpPercentage = Math.max(0, (player.hp / player.maxHp) * 100);
  const isDead = player.hp <= 0;
  const isLowHp = hpPercentage < 25;
  const staminaPercentage = Math.max(0, (player.atb.atb / 200) * 100);
  const isLowStamina = staminaPercentage > 25;
  const actingPercentage = Math.max(0, (player.atb.actingTime / 1) * 100);


  const handleClick = () => {
    if (isTargetable && onSelect && !isDead) {
      onSelect(player);
    }
  };
  const renderStat = (base: number, current: number) => {
    const diff = Math.floor(current - base);
    return (
      <div className="stat-value-container">
        <span className="stat-value">{Math.floor(base)}</span>
        {diff > 0 && <span className="stat-mod stat-mod-pos">+{diff}</span>}
        {diff < 0 && <span className="stat-mod stat-mod-neg">{diff}</span>}
      </div>
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`entity-card ${isDead ? 'is-dead' : ''} ${isTargetable && !isDead ? 'is-targetable' : ''}`}
    >
      <div className="entity-header">
        <span className="entity-name">{player.name}</span>
        <span className="entity-level">Lv. {player.xp.lvl}</span>
      </div>

      <div className="entity-stats">
        <span>HP </span> {/* <--- MARCA DE AGua */}
        <span className={`entity-hp-text ${isLowHp ? 'low-hp' : ''}`}>
          {player.hp} / {player.maxHp}
        </span>
      </div>

      <div className="health-bar-container">
        <div
          className={`health-bar-fill ${isLowHp ? 'low-hp-fill' : ''}`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>

      <div className="entity-stats">
        <span>Stamina </span> {/* <--- MARCA DE AGUA */}
        <span className={`entity-hp-text ${isLowStamina ? 'low-stamina' : ''}`}>
          {Math.floor(player.atb.atb)} / {200}
        </span>
      </div>


      <div className="stamina-bar-container">
        <div
          className={`stamina-bar-fill ${isLowStamina ? 'low-stamina-fill' : ''}`}
          style={{ width: `${staminaPercentage}%` }}
        />
      </div>

      <div
        className="acting-bar-container">

        <div
          className={`acting-bar-fill `}
          style={{ width: `${actingPercentage}%` }}>

        </div>

      </div>
      <div className="entity-moves">
        {player.moveSet.map((move) => (
          <span key={move.name} className="move-badge move-physical">
            {move.name}
          </span>
        ))}
        {player.castSet.map((cast) => (
          <span key={cast.name} className="move-badge move-magical">
            {cast.name}
          </span>
        ))}
      </div>
      <div className="entity-main-stats-grid">
        <div className="stat-item">
          <span className="stat-label">STR</span>
          {renderStat(player.stats.strength, player.currentStr)}
        </div>
        <div className="stat-item">
          <span className="stat-label">DEX</span>
          {renderStat(player.stats.dex, player.currentDex)}
        </div>
        <div className="stat-item">
          <span className="stat-label">INT</span>
          {renderStat(player.stats.int, player.currentInt)}
        </div>
        <div className="stat-item">
          <span className="stat-label">DEF</span>
          {/* La defensa no tiene StatusEffect aún, así que la mostramos directa */}
          <span className="stat-value">{Math.floor(player.armor.totalDefense)}</span>
        </div>
      </div>



    </div>
  );
};
