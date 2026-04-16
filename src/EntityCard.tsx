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

  const handleClick = () => {
    if (isTargetable && onSelect && !isDead) {
      onSelect(player);
    }
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
    </div>
  );
};
