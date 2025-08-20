import { useState, useEffect } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';
import Scoreboard from './components/Scoreboard';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import './App.css';

function App() {
  const { teams, lastUpdated, error, isLoading } = useGoogleSheets();
  console.log('App loaded - testing deploy hook');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  if (isLoading && teams.length === 0) {
    return (
      <div className="loading-container">
        <h1 className="led-text loading-text">INITIALIZING SCOREBOARD...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <button 
        className="fullscreen-button" 
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>

      <Scoreboard 
        teams={teams} 
        lastUpdated={lastUpdated} 
        error={error} 
      />
    </div>
  );
}

export default App;