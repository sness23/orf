import { useState, useEffect } from 'react'
import './App.css'

type Player = {
  id: number;
  name: string;
  selections: string[];
}

type RNABase = 'A' | 'C' | 'G' | 'U';

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', selections: [] },
    { id: 2, name: 'Player 2', selections: [] },
    { id: 3, name: 'Player 3', selections: [] }
  ]);
  const [currentSequence, setCurrentSequence] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  const validBases: RNABase[] = ['A', 'C', 'G', 'U'];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      setKeyPressed(key);
      
      if (validBases.includes(key as RNABase)) {
        addBase(key as RNABase);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPlayerIndex, players]);

  const addBase = (base: RNABase) => {
    // Update the current player's selections
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].selections.push(base);
    setPlayers(updatedPlayers);
    
    // Update the current sequence
    setCurrentSequence(prev => prev + base);
    
    // Move to the next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  return (
    <div className="rna-game">
      <h1>RNA Base Selection Game</h1>
      
      <div className="game-info">
        <div className="current-player">
          <h2>Current Turn: {players[currentPlayerIndex].name}</h2>
          <p>Press A, C, G, or U to select a base</p>
          {keyPressed && <p>Last key pressed: {keyPressed}</p>}
        </div>
        
        <div className="sequence-display">
          <h2>Current RNA Sequence</h2>
          <div className="sequence">{currentSequence || 'No bases selected yet'}</div>
        </div>
      </div>
      
      <div className="players-section">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`player-card ${currentPlayerIndex === player.id - 1 ? 'active' : ''}`}
          >
            <h3>{player.name}</h3>
            <div className="player-selections">
              <h4>Selected Bases:</h4>
              <div>{player.selections.join(' ') || 'None'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
