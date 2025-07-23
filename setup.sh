#!/bin/bash

echo "🏎️ Setting up Formula 1 MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$MAJOR_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the project"
    exit 1
fi

echo "🏁 Setup complete! Formula 1 MCP Server is ready to use."
echo ""
echo "Next steps:"
echo "1. Test the server: npm run test"
echo "2. Add to your MCP client configuration"
echo "3. Start querying F1 race data!"
echo ""
echo "Example usage:"
echo "  Tool: get_podium_winners"
echo "  Parameters: {\"year\": 2024, \"location\": \"Silverstone\"}" 