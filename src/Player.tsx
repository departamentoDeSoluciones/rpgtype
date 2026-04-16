

export interface PlayerPrompts extends Player {
  attack: (defender: any) => void;
}






const PlayerComponent = (props: PlayerPrompts) => {
  return (
    <div>
      <h2>{props.name}</h2>
    </div>
  );
};

export default PlayerComponent;
