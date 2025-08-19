import { useState, useEffect, useCallback, useRef } from 'react';
import { googleSheetsService } from '../services/googleSheets';
import type { SheetData } from '../services/googleSheets';

const DEFAULT_POLLING_INTERVAL = 5000; // 5 seconds

export const useGoogleSheets = () => {
  const [data, setData] = useState<SheetData>({
    teams: [],
    lastUpdated: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [previousScores, setPreviousScores] = useState<Map<string, number>>(new Map());
  const intervalRef = useRef<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const newData = await googleSheetsService.fetchScores();
      
      // Check for score changes to trigger animations
      const newScoresMap = new Map<string, number>();
      newData.teams.forEach(team => {
        newScoresMap.set(team.name, team.score);
      });

      // Mark teams with score changes
      newData.teams = newData.teams.map(team => ({
        ...team,
        scoreChanged: previousScores.get(team.name) !== team.score
      }));

      setData(newData);
      setPreviousScores(newScoresMap);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setIsLoading(false);
    }
  }, [previousScores]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up polling
  useEffect(() => {
    const pollingInterval = parseInt(
      import.meta.env.VITE_POLLING_INTERVAL || String(DEFAULT_POLLING_INTERVAL),
      10
    );

    intervalRef.current = setInterval(fetchData, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    teams: data.teams,
    lastUpdated: data.lastUpdated,
    error: data.error,
    isLoading,
    refresh,
  };
};