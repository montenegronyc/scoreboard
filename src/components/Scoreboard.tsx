import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { FaCrown } from 'react-icons/fa';
import type { TeamScore } from '../services/googleSheets';
import './Scoreboard.css';

interface ScoreboardProps {
  teams: TeamScore[];
  lastUpdated: Date;
  error?: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teams, lastUpdated, error }) => {
  return (
    <div className="scoreboard-container">
      <div className="scoreboard-header">
        <h1 className="led-text title">TEAM SCOREBOARD</h1>
        <div className="status-indicator">
          <span className={`status-dot ${error ? 'error' : 'active'}`}></span>
          <span className="status-text">
            {error ? 'CONNECTION ERROR' : 'LIVE'}
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p className="led-text error-text">{error}</p>
          <p className="led-text error-subtext">DISPLAYING LAST KNOWN DATA</p>
        </div>
      )}

      <div className="teams-grid">
        <AnimatePresence mode="popLayout">
          {teams.map((team, index) => (
            <motion.div
              key={team.name}
              className={`team-card ${team.isLeader ? 'leader' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <div className="team-rank">
                {team.isLeader ? (
                  <FaCrown className="crown-icon" />
                ) : (
                  <span className="rank-number">{index + 1}</span>
                )}
              </div>
              
              <div className="team-info">
                <h2 className="team-name led-text">{team.name}</h2>
                <div className="score-display">
                  <CountUp
                    end={team.score}
                    duration={1.5}
                    separator=","
                    className="score-number led-text"
                    preserveValue
                  />
                  <span className="score-label">SIGNUPS</span>
                </div>
              </div>

              {team.isLeader && (
                <div className="leader-indicator">
                  <span className="leader-text led-text">LEADER</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="scoreboard-footer">
        <p className="update-time">
          LAST UPDATE: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default Scoreboard;