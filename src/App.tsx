import { useState, useEffect } from 'react'
import { translateRNA, findORFs } from './utils/rnaUtils'
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
  const [showTranslation, setShowTranslation] = useState<boolean>(true);

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
    // Update the current player's selections and RNA sequence
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].selections.push(base);
    updatedPlayers[currentPlayerIndex].rnaSequence += base;
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

  const getOpenReadingFrames = (rnaSequence: string): string[] => {
    if (!rnaSequence || rnaSequence.length < 3) return [];
    
    return findORFs(rnaSequence);
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
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
          
          {currentSequence.length >= 3 && (
            <div className="protein-translation">
              <h3>Full Protein Translation</h3>
              <div className="protein-sequence">
                {getProteinTranslation(currentSequence)}
              </div>
              
              <button className="toggle-btn" onClick={toggleTranslation}>
                {showTranslation ? 'Hide ORFs' : 'Show ORFs'}
              </button>
              
              {showTranslation && (
                <div className="orfs">
                  <h3>Open Reading Frames</h3>
                  {getOpenReadingFrames(currentSequence).length > 0 ? (
                    <ul className="orf-list">
                      {getOpenReadingFrames(currentSequence).map((orf, index) => (
                        <li key={index}><code>{orf}</code></li>
                      ))}
                    </ul>
                  ) : (
                    <p>No complete open reading frames found</p>
                  )}
                </div>
              )}
            </div>
          )}
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
              
              {player.rnaSequence.length >= 3 && (
                <div className="player-protein">
                  <h4>Protein Translation:</h4>
                  <div className="player-protein-sequence">
                    {getProteinTranslation(player.rnaSequence)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
