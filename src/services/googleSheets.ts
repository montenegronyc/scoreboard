import axios from 'axios';

export interface TeamScore {
  name: string;
  score: number;
  isLeader?: boolean;
  scoreChanged?: boolean;
}

export interface SheetData {
  teams: TeamScore[];
  lastUpdated: Date;
  error?: string;
}

class GoogleSheetsService {
  private apiKey: string;
  private sheetId: string;
  private range: string;
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

  constructor() {
    this.apiKey = process.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.sheetId = '1OURa7t4JU4k8Py5Mc9ZJ0NW5qbg1JXzUbWFevQeyYaI';
    this.range = 'Sheet1!A:C';

    console.log('Environment debugging:', {
      processEnv: process.env.VITE_GOOGLE_API_KEY ? 'SET' : 'NOT SET',
      importMeta: import.meta.env.VITE_GOOGLE_API_KEY ? 'SET' : 'NOT SET',
      apiKeyExists: this.apiKey ? 'YES' : 'NO',
      apiKeyLength: this.apiKey.length
    });

    if (!this.apiKey || !this.sheetId) {
      console.error('Missing Google Sheets configuration. Please check your environment variables.');
    }
  }

  async fetchScores(): Promise<SheetData> {
    try {
      const url = `${this.baseUrl}/${this.sheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await axios.get(url);
      
      if (!response.data.values || response.data.values.length === 0) {
        throw new Error('No data found in the specified range');
      }

      // Skip header row and parse data
      const rows = response.data.values.slice(1);
      const teams: TeamScore[] = rows
        .filter((row: string[]) => row.length >= 2 && row[0] && row[1])
        .map((row: string[]) => ({
          name: String(row[0]).trim(),
          score: parseInt(String(row[1]).replace(/[^0-9]/g, ''), 10) || 0
        }));

      // Find the leader(s)
      const maxScore = Math.max(...teams.map(t => t.score));
      teams.forEach(team => {
        team.isLeader = team.score === maxScore && team.score > 0;
      });

      return {
        teams: teams.sort((a, b) => b.score - a.score),
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      return {
        teams: [],
        lastUpdated: new Date(),
        error: error instanceof Error ? error.message : 'Failed to fetch data'
      };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();