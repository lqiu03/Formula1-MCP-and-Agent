# 🏎️ Formula 1 MCP & Enhanced Agent

A comprehensive Formula 1 data solution featuring both a basic MCP server and an enhanced AI agent powered by [Mastra](https://mastra.ai/). Get race results, podium winners, and advanced F1 analysis directly in your LLM applications!

## 🚀 Two Approaches Available

### 1. **Basic MCP Server** - Simple, compatible with any MCP client
### 2. **Enhanced Mastra Agent** - Advanced AI agent with memory, workflows, and sophisticated analysis

## 🏁 Features

### Basic MCP Server
- **Get Podium Winners**: Retrieve the top 3 finishers for any F1 Grand Prix
- **Full Race Results**: Get complete race results with customizable result count
- **Race Calendar**: List all races for a given year
- **Current Season**: Overview of the current F1 season
- **Smart Location Matching**: Flexible race location search (e.g., "Silverstone", "British GP", etc.)

### Enhanced Mastra Agent
- **All Basic Features**: Plus advanced capabilities
- **Driver Performance Analysis**: Comprehensive season-long driver analysis
- **Head-to-Head Comparisons**: Statistical driver comparisons with insights
- **Weather Analysis**: Race weather impact analysis
- **Intelligent Conversations**: AI agent that understands F1 context
- **Future**: Memory, workflows, and multi-step reasoning (coming soon)

## 🚀 Quick Start

### Installation

```bash
# Clone or navigate to the Formula1-MCP directory
cd Formula1-MCP

# Install dependencies (includes both MCP SDK and Mastra)
npm install

# Build the project
npm run build
```

### Usage Options

#### Option 1: Basic MCP Server
```bash
# Test the basic MCP server
npm run test

# Start the basic MCP server
npm start
```

#### Option 2: Enhanced Mastra Agent
```bash
# Test the enhanced agent
npm run test:enhanced

# Start the enhanced agent
npm run start:enhanced
```

#### Option 3: Both Together (Recommended)
```bash
# Terminal 1: Start the basic MCP server
npm start

# Terminal 2: Start the enhanced agent (uses MCP server as a tool)
npm run start:enhanced
```

### Usage Examples

#### Basic MCP Server
Once connected to an MCP client, you can use these tools:

**Get Podium Winners**
```
Tool: get_podium_winners
Parameters:
- year: 2024
- location: "Silverstone"
```

**Get Full Race Results**
```
Tool: get_race_results
Parameters:
- year: 2023
- location: "Monaco" 
- top_n: 10 (optional, default: 10)
```

**List Available Races**
```
Tool: list_races
Parameters:
- year: 2024
```

#### Concrete Example – 2025 British GP

The command you ran inside Cursor:

```text
/formula1.get_podium_winners { "year": 2025, "location": "Silverstone" }
```

Example response:

```text
1⃣  Lando Norris  (McLaren)
2⃣  Oscar Piastri (McLaren)
3⃣  Nico Hülkenberg (Kick Sauber)
```

<p align="center">
  <img src="docs/screenshots/silverstone-2025.png" width="500" />
</p>

#### Enhanced Mastra Agent
Chat naturally with the AI agent:

**Example Conversations:**
```
User: "Who won the 2024 British Grand Prix?"
Agent: *Uses get_podium_winners tool and provides detailed analysis*

User: "Compare Hamilton and Verstappen's performance in 2023"
Agent: *Uses compareDrivers tool for statistical head-to-head analysis*

User: "Analyze Leclerc's 2024 season performance"
Agent: *Uses analyzeDriverPerformance tool for comprehensive insights*

User: "What was the weather like during Monaco 2024?"
Agent: *Uses raceWeatherAnalysis tool for detailed weather impact*
```

## 🔧 Tools Available

### `get_podium_winners`
Get the top 3 finishers for a Formula 1 Grand Prix.

**Parameters:**
- `year` (number): The year of the race (2018-2025)
- `location` (string): Race location (e.g., 'Silverstone', 'Monaco', 'Monza')

**Example Output:**
```
🏆 Silverstone 2024 Grand Prix - Podium Winners

🥇 1st Place: Lewis Hamilton (HAM)
   Team: Mercedes
   Country: GBR

🥈 2nd Place: Max Verstappen (VER)
   Team: Red Bull Racing
   Country: NED

🥉 3rd Place: Lando Norris (NOR)
   Team: McLaren
   Country: GBR
```

### `get_race_results`
Get complete race results for a Formula 1 Grand Prix.

**Parameters:**
- `year` (number): The year of the race (2018-2025)
- `location` (string): Race location
- `top_n` (number, optional): Number of results to show (default: 10)

### `list_races`
List all Formula 1 races for a given year.

**Parameters:**
- `year` (number): The year to list races for (2018-2025)

## 📋 Resources Available

### `current_season`
Overview of the current Formula 1 season including race calendar.

**URI:** `f1://season/current`

## 💭 Prompts Available

### `ask_race_results`
Generate a prompt to ask about Formula 1 race results.

### `compare_races`
Generate a prompt to compare results between different races.

## 🏗️ Technical Details

### Built With
- **TypeScript**: Type-safe development
- **MCP SDK**: Official Model Context Protocol SDK
- **Mastra**: Advanced TypeScript agent framework
- **OpenF1 API**: Real-time and historical F1 data
- **Zod**: Runtime type validation

### Architecture

#### Basic MCP Server
- Direct MCP protocol implementation
- Simple tool-based interface
- Compatible with any MCP client
- Lightweight and focused

#### Enhanced Mastra Agent
- Uses Mastra's Agent framework
- Connects to the basic MCP server as a tool source
- Additional advanced analysis tools
- Natural language conversation interface
- Built-in support for memory and workflows (expandable)

### API Coverage
The server uses the [OpenF1 API](https://openf1.org/) which provides:
- Historical data (2018-2025) - **Free access**
- Real-time data - Requires paid account
- Multiple data formats (JSON/CSV)
- Comprehensive F1 data including lap times, telemetry, and race results

### Data Sources
- **Meetings**: Race weekend information
- **Sessions**: Practice, qualifying, and race sessions
- **Positions**: Real-time and final race positions
- **Drivers**: Driver information and team details

## 🎯 Example Use Cases

### In Cursor/VS Code
```
User: "Who won the 2024 British Grand Prix?"
LLM: *Uses get_podium_winners tool with year=2024, location="Silverstone"*

User: "Show me all races in 2023"  
LLM: *Uses list_races tool with year=2023*

User: "What were the full results for Monaco 2024?"
LLM: *Uses get_race_results tool with year=2024, location="Monaco"*
```

### Smart Location Matching
The server supports flexible location matching:
- ✅ "Silverstone" → British Grand Prix
- ✅ "Monaco" → Monaco Grand Prix  
- ✅ "Monza" → Italian Grand Prix
- ✅ "Spa" → Belgian Grand Prix
- ✅ "British GP" → British Grand Prix

## 🔧 Development

### Project Structure
```
Formula1-MCP/
├── src/
│   ├── index.ts          # Main MCP server
│   └── openf1-client.ts  # OpenF1 API client
├── build/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

### Development Commands
```bash
# Install dependencies
npm install

# Build the project  
npm run build

# Watch mode for development
npm run dev

# Start the server
npm start
```

## 🌐 Integration

### Basic MCP Server Integration

#### With Claude Desktop
Add to your MCP configuration:
```json
{
  "mcpServers": {
    "formula1": {
      "command": "node",
      "args": ["path/to/Formula1-MCP/build/index.js"]
    }
  }
}
```

#### With Other MCP Clients
The server uses standard MCP protocol and works with any MCP-compatible client via stdio transport.

### Enhanced Mastra Agent Integration

#### Standalone Agent
```bash
# Run the enhanced agent directly
npm run start:enhanced
```

#### With Existing Applications
```typescript
import { f1Agent } from './build/mastra-agent.js';

// Use the agent in your application
const response = await f1Agent.generate([
  {
    role: "user", 
    content: "Who won the 2024 Silverstone GP?"
  }
]);
```

#### Hybrid Setup (Recommended)
1. **Start MCP Server**: Provides basic tools for any MCP client
2. **Start Mastra Agent**: Enhanced analysis using MCP server + advanced tools
3. **Best of Both**: Simple queries via MCP, complex analysis via Mastra

## 📊 Data Availability

- **Historical Data**: *OpenF1 currently provides 2024-2025 seasons* (earlier years
  will be added when OpenF1 publishes them)
- **Real-time Data**: Requires OpenF1 paid account
- **Update Frequency**: ~3 seconds delay for live events
- **Query Timeout**: 10 seconds maximum

## ⚖️ Legal Notice

This is an unofficial project not associated with Formula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V.

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues and enhancement requests.

## 📄 License

MIT License - see LICENSE file for details.

---

Ready to bring Formula 1 data to your AI applications! 🏁🏎️ 