# DigitalOcean Deployment Guide

This guide will help you deploy TripMate to a DigitalOcean Droplet.

## Prerequisites

1. **DigitalOcean Account**: Sign up using the referral link: https://www.digitalocean.com/?refcode=4d1066078eb0&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=CopyPaste
2. **SSH Key**: You'll need an SSH key pair for accessing your droplet
3. **API Keys**: 
   - OpenWeather API key
   - Google Maps API key (optional)
   - Unsplash API key (optional)

## Step 1: Create a DigitalOcean Droplet

1. **Log in to DigitalOcean** using the referral link above
2. **Click "Create" → "Droplets"**
3. **Configure your droplet:**
   - **Image**: Choose "Ubuntu 22.04 (LTS) x64"
   - **Plan**: Select "Regular" with at least:
     - **2 GB RAM / 1 vCPU** (minimum) - Recommended: **4 GB RAM / 2 vCPU**
     - **50 GB SSD Disk**
   - **Datacenter region**: Choose closest to your users
   - **Authentication**: 
     - Select "SSH keys" and add your public SSH key
     - Or use "Password" (less secure)
   - **Hostname**: `tripmate-server` (or your preferred name)
4. **Click "Create Droplet"**
5. **Wait for droplet creation** (1-2 minutes)
6. **Note your droplet's IP address** (you'll need this)

## Step 2: Initial Server Setup

### Connect to your droplet:

```bash
ssh root@YOUR_DROPLET_IP
```

Replace `YOUR_DROPLET_IP` with your actual droplet IP address.

### Update the system:

```bash
apt update && apt upgrade -y
```

### Install required software:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Install Git
apt install git -y

# Install Node.js (for potential npm scripts)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installations
docker --version
docker compose version
git --version
node --version
```

## Step 3: Clone Your Repository

```bash
# Create application directory
mkdir -p /opt/tripmate
cd /opt/tripmate

# Clone your repository
git clone https://github.com/agile-students-fall2025/4-final-fishy.git .

# Or if you have SSH access:
# git clone git@github.com:agile-students-fall2025/4-final-fishy.git .
```

## Step 4: Configure Environment Variables

### Backend Environment Variables

Create `/opt/tripmate/back-end/.env`:

```bash
cd /opt/tripmate/back-end
nano .env
```

Add the following (replace with your actual values):

```env
# Server Configuration
NODE_ENV=production
PORT=4000

# MongoDB Configuration
# Option 1: Use MongoDB Atlas (Recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tripmate?retryWrites=true&w=majority

# Option 2: Use local MongoDB (if using docker-compose)
# MONGODB_URI=mongodb://mongodb:27017/tripmate

# API Keys
OPENWEATHER_API_KEY=your_openweather_api_key_here
JWT_SECRET=your_very_long_and_random_jwt_secret_key_here

# CORS Configuration
ALLOWED_ORIGINS=http://YOUR_DROPLET_IP:3001,http://YOUR_DOMAIN.com

# Optional: Map data file path
MAP_DATA_FILE=
```

**Generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

### Frontend Environment Variables

The frontend uses build-time environment variables. These are set in the Dockerfile build args or in `docker-compose.yml`.

## Step 5: Configure Docker Compose for Production

Edit `/opt/tripmate/docker-compose.yml` to ensure production settings:

```bash
cd /opt/tripmate
nano docker-compose.yml
```

Key things to check:
- Backend `ALLOWED_ORIGINS` should include your droplet IP and domain
- Frontend build args should have production API URL
- Ports are correctly mapped

### Update docker-compose.yml for production:

The `REACT_APP_API_URL` should point to your droplet:

```yaml
frontend:
  build:
    args:
      - REACT_APP_API_URL=http://YOUR_DROPLET_IP:4001
      - REACT_APP_GOOGLE_MAPS_API_KEY=${REACT_APP_GOOGLE_MAPS_API_KEY}
      - REACT_APP_UNSPLASH_ACCESS_KEY=${REACT_APP_UNSPLASH_ACCESS_KEY}
```

## Step 6: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to `back-end/.env` as `MONGODB_URI`
5. **Remove the mongodb service** from `docker-compose.yml`:

```yaml
# Comment out or remove this section:
# mongodb:
#   image: mongo:7
#   ...
```

### Option B: Local MongoDB Container

If you want to use the MongoDB container in docker-compose, ensure it's configured correctly in `docker-compose.yml`.

## Step 7: Build and Deploy

```bash
cd /opt/tripmate

# Build and start all services
docker compose up -d --build

# Check logs
docker compose logs -f

# Check running containers
docker compose ps
```

## Step 8: Configure Firewall

```bash
# Allow HTTP traffic
ufw allow 80/tcp

# Allow HTTPS traffic (if using SSL)
ufw allow 443/tcp

# Allow backend API
ufw allow 4001/tcp

# Allow SSH (important!)
ufw allow 22/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 9: Verify Deployment

1. **Check backend health:**
   ```bash
   curl http://YOUR_DROPLET_IP:4001/api/health
   ```

2. **Access frontend:**
   Open in browser: `http://YOUR_DROPLET_IP:3001`

3. **Check container status:**
   ```bash
   docker compose ps
   docker compose logs backend
   docker compose logs frontend
   ```

## Step 10: Set Up Domain (Optional)

If you have a domain name:

1. **Point your domain to the droplet IP** in your DNS settings
2. **Update CORS and API URLs** in environment variables
3. **Set up SSL with Let's Encrypt** (recommended)

## Step 11: Configure GitHub Actions for CI/CD (Optional - Extra Credit)

To enable automated deployment:

1. **Go to GitHub Repository → Settings → Secrets and variables → Actions**
2. **Add the following secrets:**

   - `DROPLET_HOST`: Your droplet IP address
   - `DROPLET_USER`: `root` (or your SSH user)
   - `DROPLET_SSH_KEY`: Your private SSH key (the entire key, including `-----BEGIN` and `-----END` lines)
   - `REACT_APP_API_URL`: `http://YOUR_DROPLET_IP:4001` (or your domain)
   - `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
   - `REACT_APP_UNSPLASH_ACCESS_KEY`: Your Unsplash API key (optional)

3. **Push to master/main** - deployment will happen automatically!

## Troubleshooting

### Containers won't start:

```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down
docker compose up -d --build
```

### Backend connection issues:

```bash
# Check backend logs
docker compose logs backend

# Verify environment variables
docker compose exec backend env | grep -E "MONGODB|OPENWEATHER|JWT"
```

### Frontend not loading:

```bash
# Check frontend logs
docker compose logs frontend

# Verify build args
docker compose config
```

### Port already in use:

```bash
# Check what's using the port
netstat -tulpn | grep :3001
netstat -tulpn | grep :4001

# Stop conflicting services or change ports in docker-compose.yml
```

### MongoDB connection issues:

- Verify `MONGODB_URI` in `.env` is correct
- Check MongoDB Atlas network access (if using Atlas)
- Ensure MongoDB container is running (if using local)

## Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart services
docker compose restart

# Stop all services
docker compose down

# Update and redeploy
cd /opt/tripmate
git pull origin master
docker compose down
docker compose up -d --build

# Check resource usage
docker stats

# Access backend container shell
docker compose exec backend sh

# Access frontend container shell
docker compose exec frontend sh
```

## Security Best Practices

1. **Change default SSH port** (optional but recommended)
2. **Set up fail2ban** to prevent brute force attacks
3. **Use strong passwords** for MongoDB Atlas
4. **Keep system updated**: `apt update && apt upgrade`
5. **Regular backups** of your database
6. **Monitor logs** for suspicious activity
7. **Use SSL/HTTPS** for production (Let's Encrypt)

## Cost Estimation

- **Droplet (2GB RAM)**: ~$12/month
- **Droplet (4GB RAM)**: ~$24/month
- **MongoDB Atlas (Free tier)**: $0/month (up to 512MB)
- **Domain name**: ~$10-15/year (optional)

**Total**: ~$12-24/month (with referral credits, should be free for several months)

## Next Steps

1. ✅ Deploy to DigitalOcean Droplet
2. ✅ Test the application
3. ✅ Add deployment link to README.md
4. ✅ (Optional) Set up CI/CD for automated deployment
5. ✅ (Optional) Configure domain and SSL

## Support

If you encounter issues:
1. Check the logs: `docker compose logs`
2. Verify environment variables
3. Check firewall settings
4. Review this guide for missed steps

