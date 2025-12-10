#!/bin/bash

# Quick setup script for DigitalOcean Droplet
# Run this on your droplet after SSH connection

set -e

echo "🚀 TripMate Droplet Setup Script"
echo "=================================="
echo ""

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "📦 Installing Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    apt install docker-compose-plugin -y
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# Install Git
echo "📦 Installing Git..."
apt install git -y

# Install Node.js (optional, for npm scripts)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installations
echo ""
echo "✅ Installation complete!"
echo ""
echo "📊 Installed versions:"
docker --version
docker compose version
git --version
node --version
echo ""

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/tripmate
cd /opt/tripmate

echo ""
echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository:"
echo "   cd /opt/tripmate"
echo "   git clone https://github.com/agile-students-fall2025/4-final-fishy.git ."
echo ""
echo "2. Configure environment variables (see DEPLOYMENT.md)"
echo ""
echo "3. Deploy:"
echo "   docker compose up -d --build"
echo ""

