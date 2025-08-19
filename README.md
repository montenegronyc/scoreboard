# Real-Time Sports Scoreboard

A dynamic, LED-style scoreboard web application that displays real-time sales team signup counts from Google Sheets. Perfect for displaying on large TV screens at events.

![Scoreboard Preview](https://img.shields.io/badge/status-ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Real-Time Updates**: Automatically fetches data from Google Sheets every 5 seconds
- **LED Display Style**: Authentic stadium scoreboard aesthetic with glowing effects
- **Leader Detection**: Automatically highlights the team with the highest score
- **Smooth Animations**: Score changes animate with count-up effects
- **Fullscreen Mode**: One-click fullscreen for TV displays
- **Error Handling**: Gracefully handles connection issues with fallback display
- **Responsive Design**: Scales perfectly from mobile to large TV screens

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Console account for API access
- A Google Sheet with team data

### Installation

1. Clone the repository:
```bash
git clone https://github.com/montenegronyc/scoreboard.git
cd scoreboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your Google Sheets credentials:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEETS_ID=your_sheet_id_here
VITE_GOOGLE_SHEETS_RANGE=Sheet1!A:B
```

5. Start the development server:
```bash
npm run dev
```

## Google Sheets Setup

### 1. Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Restrict the API key to Google Sheets API

### 2. Prepare Your Google Sheet

Create a Google Sheet with the following structure:

| Team Name | Score |
|-----------|-------|
| Team Alpha | 45 |
| Team Beta | 32 |
| Team Gamma | 78 |

- Column A: Team names
- Column B: Signup counts (numbers only)
- First row is treated as headers and ignored

### 3. Make Sheet Publicly Readable

1. Click "Share" in your Google Sheet
2. Change to "Anyone with the link can view"
3. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/[SHEET_ID_HERE]/edit`

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/montenegronyc/scoreboard)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_GOOGLE_SHEETS_API_KEY`
   - `VITE_GOOGLE_SHEETS_ID`
   - `VITE_GOOGLE_SHEETS_RANGE`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GOOGLE_SHEETS_API_KEY` | Your Google Sheets API key | Required |
| `VITE_GOOGLE_SHEETS_ID` | The ID of your Google Sheet | Required |
| `VITE_GOOGLE_SHEETS_RANGE` | Range to fetch (e.g., Sheet1!A:B) | Sheet1!A:B |
| `VITE_POLLING_INTERVAL` | Update interval in milliseconds | 5000 |

### Customization

#### Colors

Edit `src/index.css` to customize the LED colors:

```css
:root {
  --led-red: #ff1e1e;
  --led-green: #00ff41;
  --led-yellow: #ffff00;
  --led-orange: #ff9100;
  --led-blue: #00b4ff;
}
```

#### Polling Interval

Adjust the refresh rate in your `.env`:
```env
VITE_POLLING_INTERVAL=3000  # 3 seconds
```

## Usage Tips

### For Events

1. **Fullscreen Mode**: Click the expand icon in the top-right corner
2. **Browser Settings**: Hide browser UI with F11 (Windows/Linux) or Cmd+Shift+F (Mac)
3. **Prevent Sleep**: Adjust TV/computer display settings to prevent sleep mode
4. **Stable Connection**: Use wired ethernet if possible for reliability

### Troubleshooting

**No data showing?**
- Check API key is valid and not restricted incorrectly
- Verify Sheet ID is correct
- Ensure sheet is publicly viewable
- Check browser console for errors

**Connection errors?**
- The app will show last known data during connection issues
- Check network connectivity
- Verify Google Sheets API isn't rate limited

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Project Structure

```
scoreboard/
├── src/
│   ├── components/
│   │   ├── Scoreboard.tsx      # Main scoreboard component
│   │   └── Scoreboard.css      # LED styling
│   ├── hooks/
│   │   └── useGoogleSheets.ts  # Real-time data fetching
│   ├── services/
│   │   └── googleSheets.ts     # Google Sheets API integration
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # App styles
│   └── index.css              # Global styles and LED effects
├── .env.example               # Environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Framer Motion** for animations
- **React CountUp** for number animations
- **Axios** for API calls
- **React Icons** for UI icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/montenegronyc/scoreboard/issues) page.
