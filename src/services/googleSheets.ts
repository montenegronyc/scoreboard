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
  private lastRequestTime = 0;
  private minRequestInterval = 10000; // Minimum 10 seconds between requests

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.sheetId = '1OURa7t4JU4k8Py5Mc9ZJ0NW5qbg1JXzUbWFevQeyYaI';
    this.range = 'Sheet1!A:C';

    console.log('Environment debugging:', {
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
      // Rate limiting protection
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        console.log(`Rate limiting: waiting ${this.minRequestInterval - timeSinceLastRequest}ms`);
        await new Promise(resolve => setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest));
      }
      
      this.lastRequestTime = Date.now();
      console.log(`Making API request at: ${new Date().toISOString()}`);
      
      const url = `${this.baseUrl}/${this.sheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await axios.get(url);
      
      if (!response.data.values || response.data.values.length === 0) {
        throw new Error('No data found in the specified range');
      }

      // Get team names from header row (columns B and C)
      const headerRow = response.data.values[0];
      const totalSignupsRow = response.data.values[1];
      
      const teams: TeamScore[] = [];
      
      // Parse Team Alpha (column B)
      if (headerRow[1] && totalSignupsRow[1]) {
        teams.push({
          name: String(headerRow[1]).trim(),
          score: parseInt(String(totalSignupsRow[1]).replace(/[^0-9]/g, ''), 10) || 0
        });
      }
      
      // Parse Team Beta (column C)
      if (headerRow[2] && totalSignupsRow[2]) {
        teams.push({
          name: String(headerRow[2]).trim(),
          score: parseInt(String(totalSignupsRow[2]).replace(/[^0-9]/g, ''), 10) || 0
        });
      }

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