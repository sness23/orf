import { useState, useEffect } from 'react'
import { translateRNA } from './utils/rnaUtils'
import './App.css'

type Player = {
  id: number;
  name: string;
  selections: string[];
  rnaSequence: string;
}

type RNABase = 'A' | 'C' | 'G' | 'U';

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'Player 1', selections: [], rnaSequence: '' },
    { id: 2, name: 'Player 2', selections: [], rnaSequence: '' },
    { id: 3, name: 'Player 3', selections: [], rnaSequence: '' }
  ]);
  const [currentSequence, setCurrentSequence] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [isFirstRound, setIsFirstRound] = useState<boolean>(true);

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
    const updatedPlayers = [...players];
    
    // Add the base to the current player's selections
    updatedPlayers[currentPlayerIndex].selections.push(base);
    
    if (isFirstRound) {
      // During the first round, only add the base to the current player's RNA sequence
      updatedPlayers[currentPlayerIndex].rnaSequence += base;
      
      // Check if we've gone through all players in the first round
      if (currentPlayerIndex === players.length - 1) {
        setIsFirstRound(false);
      }
    } else {
      // After the first round, add the base to all players' RNA sequences
      updatedPlayers.forEach(player => {
        player.rnaSequence += base;
      });
    }
    
    setPlayers(updatedPlayers);
    
    // Update the current sequence
    setCurrentSequence(prev => prev + base);
    
    // Move to the next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const getProteinTranslation = (rnaSequence: string): string => {
    if (!rnaSequence || rnaSequence.length < 3) return 'Not enough bases for translation';
    
    return translateRNA(rnaSequence);
  };


  return (
    <div className="rna-game">
      <h1>RNA Base Selection Game</h1>
      
      <div className="game-info">
        <div className="current-player">
          <h2>Current Turn: {players[currentPlayerIndex].name}</h2>
          <p>Press A, C, G, or U to select a base</p>
          {isFirstRound && (
            <p className="first-round-message">
              First round: Each player starts with their own reading frame
            </p>
          )}
          {keyPressed && <p>Last key pressed: {keyPressed}</p>}
        </div>
        
        <div className="sequence-display">
          <h2>Combined RNA Sequence</h2>
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
              <h4>Bases Selected by {player.name}:</h4>
              <div>{player.selections.join(' ') || 'None'}</div>
            </div>
            
            <div className="player-rna">
              <h4>Full RNA Sequence:</h4>
              <div className="player-rna-sequence">
                {player.rnaSequence || 'No bases yet'}
              </div>
            </div>
            
            {player.rnaSequence.length >= 3 && (
              <div className="player-protein">
                <h4>Protein Translation:</h4>
                <div className="player-protein-sequence">
                  {getProteinTranslation(player.rnaSequence)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
