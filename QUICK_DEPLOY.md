# Quick Deployment Checklist

Use this checklist for a fast deployment to DigitalOcean.

## Pre-Deployment

- [ ] Sign up for DigitalOcean using referral link: https://www.digitalocean.com/?refcode=4d1066078eb0
- [ ] Get OpenWeather API key from https://openweathermap.org/api
- [ ] (Optional) Get Google Maps API key
- [ ] (Optional) Get Unsplash API key
- [ ] Set up MongoDB Atlas account (free tier) OR use local MongoDB

## Step 1: Create Droplet (5 minutes)

- [ ] Create Ubuntu 22.04 droplet (2GB RAM minimum, 4GB recommended)
- [ ] Add SSH key for authentication
- [ ] Note your droplet IP address
- [ ] Wait for droplet to be ready

## Step 2: Initial Server Setup (10 minutes)

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Run these commands:
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin git -y

# Verify
docker --version && docker compose version
```

## Step 3: Clone Repository (2 minutes)

```bash
mkdir -p /opt/tripmate
cd /opt/tripmate
git clone https://github.com/agile-students-fall2025/4-final-fishy.git .
```

## Step 4: Configure Environment (5 minutes)

### Backend .env
```bash
cd /opt/tripmate/back-end
nano .env
```

Add:
```env
NODE_ENV=production
PORT=4000
MONGODB_URI=your_mongodb_connection_string
OPENWEATHER_API_KEY=your_key
JWT_SECRET=$(openssl rand -base64 32)
ALLOWED_ORIGINS=http://YOUR_DROPLET_IP:3001
```

### Update docker-compose.yml
```bash
cd /opt/tripmate
nano docker-compose.yml
```

Update `REACT_APP_API_URL` in frontend build args to:
```yaml
REACT_APP_API_URL=http://YOUR_DROPLET_IP:4001
```

## Step 5: Deploy (5 minutes)

```bash
cd /opt/tripmate
docker compose up -d --build
```

## Step 6: Configure Firewall (2 minutes)

```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3001/tcp # Frontend
ufw allow 4001/tcp # Backend
ufw enable
```

## Step 7: Verify (2 minutes)

- [ ] Check containers: `docker compose ps`
- [ ] Check backend: `curl http://YOUR_DROPLET_IP:4001/api/health`
- [ ] Open frontend: `http://YOUR_DROPLET_IP:3001` in browser
- [ ] Check logs: `docker compose logs -f`

## Step 8: Update README (1 minute)

- [ ] Add frontend URL to README.md
- [ ] Add backend API URL to README.md
- [ ] Commit and push changes

## Total Time: ~30 minutes

## Troubleshooting

If something goes wrong:
```bash
# View logs
docker compose logs

# Rebuild
docker compose down
docker compose up -d --build

# Check status
docker compose ps
```

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

