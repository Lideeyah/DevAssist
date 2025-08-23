# DevAssist Backend Deployment Guide

## Overview

This guide covers deploying the DevAssist backend to various platforms including Render, Heroku, Railway, and DigitalOcean.

## Prerequisites

- Node.js 18+ application
- MongoDB Atlas database
- Hugging Face API key (free)
- Git repository

## Environment Variables

All deployment platforms require these environment variables:

### Required Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devassist?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### Optional Variables

```env
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
HUGGINGFACE_MODEL=Qwen/Qwen2.5-7B-Instruct
HUGGINGFACE_MAX_TOKENS=512
MAX_FILE_SIZE=204800
MAX_FILES_PER_PROJECT=100
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-admin-panel.com
LOG_LEVEL=info
```

## Render Deployment (Recommended)

### Step 1: Prepare Repository

1. Ensure your code is pushed to GitHub/GitLab
2. Verify `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "nodemon src/server.js"
     }
   }
   ```

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure service:
   - **Name**: `devassist-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Starter` (free) or `Standard`

### Step 3: Environment Variables

Add all required environment variables in Render dashboard:

1. Go to service → Environment
2. Add each variable from the list above
3. Click "Save Changes"

### Step 4: Deploy

1. Click "Manual Deploy" or push to connected branch
2. Monitor build logs
3. Test deployment at provided URL

### Render Configuration File (Optional)

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: devassist-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      # Add other environment variables here
```

## Heroku Deployment

### Step 1: Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App

```bash
heroku create devassist-backend
```

### Step 3: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set JWT_REFRESH_SECRET="your-refresh-secret"
heroku config:set HUGGINGFACE_API_KEY="your-huggingface-key"
heroku config:set ALLOWED_ORIGINS="https://your-frontend.herokuapp.com"
```

### Step 4: Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Heroku Procfile

Create `Procfile` in project root:

```
web: npm start
```

## Railway Deployment

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Initialize Project

```bash
railway init
railway link
```

### Step 3: Set Environment Variables

```bash
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set HUGGINGFACE_API_KEY="your-huggingface-key"
```

### Step 4: Deploy

```bash
railway up
```

## DigitalOcean App Platform

### Step 1: Create App

1. Go to DigitalOcean Control Panel
2. Create → Apps
3. Connect GitHub repository

### Step 2: Configure App

```yaml
name: devassist-backend
services:
  - name: api
    source_dir: /
    github:
      repo: your-username/devassist-backend
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "8080"
    # Add other environment variables
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Build and Run

```bash
# Build image
docker build -t devassist-backend .

# Run container
docker run -p 5000:5000 --env-file .env devassist-backend

# Using Docker Compose
docker-compose up -d
```

## MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create new cluster (free tier available)
3. Choose cloud provider and region

### Step 2: Database User

1. Database Access → Add New Database User
2. Choose authentication method (password)
3. Set username and password
4. Grant `readWrite` permissions

### Step 3: Network Access

1. Network Access → Add IP Address
2. Add `0.0.0.0/0` for all IPs (production: use specific IPs)
3. Or add your deployment platform's IP ranges

### Step 4: Connection String

1. Clusters → Connect → Connect your application
2. Copy connection string
3. Replace `<username>`, `<password>`, and `<dbname>`

## SSL/TLS Configuration

### Let's Encrypt (for custom domains)

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure nginx (if using)
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Logging

### Health Checks

All platforms should monitor:

- `GET /api/health` - General health
- `GET /api/ai/health` - AI service health

### Logging Services

- **Render**: Built-in logs
- **Heroku**: `heroku logs --tail`
- **Railway**: Built-in logging
- **External**: LogDNA, Papertrail, Loggly

### Monitoring Services

- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Errors**: Sentry, Bugsnag

## Performance Optimization

### Production Optimizations

```javascript
// In production, consider:
app.use(compression()); // Gzip compression
app.use(helmet()); // Security headers
app.set("trust proxy", 1); // Behind reverse proxy
```

### Database Optimization

- Enable MongoDB indexes
- Use connection pooling
- Monitor slow queries

### Caching

```javascript
// Add Redis for caching (future enhancement)
import redis from "redis";
const client = redis.createClient(process.env.REDIS_URL);
```

## Backup Strategy

### Database Backups

```bash
# MongoDB Atlas automatic backups
# Or manual backup
mongodump --uri="your-mongodb-uri" --out=backup/
```

### Code Backups

- Git repository (primary)
- Automated deployments from main branch
- Tagged releases for rollbacks

## Troubleshooting

### Common Issues

1. **Port Issues**

   ```javascript
   const PORT = process.env.PORT || 5000;
   ```

2. **CORS Errors**

   ```javascript
   // Update ALLOWED_ORIGINS environment variable
   ALLOWED_ORIGINS=https://your-frontend.com
   ```

3. **Database Connection**

   ```javascript
   // Check MongoDB URI format
   mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

4. **Environment Variables**
   ```bash
   # Verify all required variables are set
   echo $MONGODB_URI
   echo $JWT_SECRET
   ```

### Debugging

```bash
# Check logs
heroku logs --tail
railway logs
docker logs container-name

# Test endpoints
curl https://your-app.com/api/health
curl https://your-app.com/api/version
```

## Security Checklist

- [ ] All environment variables set
- [ ] JWT secrets are strong (32+ characters)
- [ ] MongoDB user has minimal permissions
- [ ] CORS origins are restricted
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Security headers are set
- [ ] Input validation is active
- [ ] Error messages don't leak sensitive info

## Rollback Strategy

### Quick Rollback

```bash
# Heroku
heroku rollback v123

# Railway
railway rollback

# Render
# Use dashboard to redeploy previous version
```

### Manual Rollback

1. Revert to previous Git commit
2. Redeploy application
3. Verify functionality
4. Update DNS if needed

## Cost Optimization

### Free Tier Limits

- **Render**: 750 hours/month
- **Heroku**: 550-1000 hours/month
- **Railway**: $5 credit/month
- **MongoDB Atlas**: 512MB storage

### Scaling Considerations

- Monitor resource usage
- Upgrade when limits are reached
- Consider serverless options for variable load

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
