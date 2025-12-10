#!/bin/bash

# TripMate Deployment Script
# This script helps deploy TripMate to a DigitalOcean Droplet

set -e  # Exit on error

echo "🚀 TripMate Deployment Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on server
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
    echo -e "${YELLOW}⚠️  Running inside Docker container${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose: apt install docker-compose-plugin -y"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check for .env files
if [ ! -f "back-end/.env" ]; then
    echo -e "${YELLOW}⚠️  back-end/.env not found${NC}"
    if [ -f "back-end/.env.example" ]; then
        echo "Creating back-end/.env from .env.example..."
        cp back-end/.env.example back-end/.env
        echo -e "${YELLOW}⚠️  Please edit back-end/.env with your actual values${NC}"
    else
        echo -e "${RED}❌ back-end/.env.example not found${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Environment files checked${NC}"
echo ""

# Pull latest changes
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes from Git..."
    git pull origin master || git pull origin main || echo -e "${YELLOW}⚠️  Could not pull from Git${NC}"
    echo ""
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down || true
echo ""

# Build and start containers
echo "🔨 Building and starting containers..."
docker compose up -d --build

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - View backend logs: docker compose logs -f backend"
echo "  - View frontend logs: docker compose logs -f frontend"
echo "  - Stop services: docker compose down"
echo "  - Restart services: docker compose restart"
echo ""

