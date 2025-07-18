# Deployment Guide

This guide provides step-by-step instructions for deploying the P2P USDT Trading Platform to production environments.

## 🎯 Deployment Overview

The platform consists of three main components:
1. **Frontend** (React) - Deploy to Vercel or Netlify
2. **Backend** (FastAPI) - Deploy to Render or Railway
3. **Telegram Bot** - Deploy to PythonAnywhere or Railway

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Prepare the Build**
   ```bash
   cd frontend/p2p-frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend-url.com
     ```

### Option 2: Netlify

1. **Build the Project**
   ```bash
   cd frontend/p2p-frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🔧 Backend Deployment

### Option 1: Render (Recommended)

1. **Prepare for Deployment**
   ```bash
   cd backend
   # Ensure requirements.txt is up to date
   pip freeze > requirements.txt
   ```

2. **Create render.yaml**
   ```yaml
   services:
     - type: web
       name: p2p-trading-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: DATABASE_URL
           value: sqlite:///./p2p_trading.db
         - key: ESCROW_WALLET_ADDRESS
           value: TXxxxxxx
         - key: COMMISSION_PERCENT
           value: "1.5"
         - key: RELEASE_SECRET
           generateValue: true
         - key: TELEGRAM_ADMIN_ID
           value: "123456789"
   ```

3. **Deploy to Render**
   - Connect your GitHub repository
   - Select the backend folder
   - Configure environment variables
   - Deploy

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Configure Environment Variables**
   ```bash
   railway variables set DATABASE_URL=sqlite:///./p2p_trading.db
   railway variables set ESCROW_WALLET_ADDRESS=TXxxxxxx
   railway variables set COMMISSION_PERCENT=1.5
   railway variables set RELEASE_SECRET=your_secure_key
   railway variables set TELEGRAM_ADMIN_ID=123456789
   ```

### Option 3: DigitalOcean App Platform

1. **Create app.yaml**
   ```yaml
   name: p2p-trading-platform
   services:
   - name: api
     source_dir: /backend
     github:
       repo: your-username/p2p-marketplace
       branch: main
     run_command: uvicorn main:app --host 0.0.0.0 --port $PORT
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DATABASE_URL
       value: sqlite:///./p2p_trading.db
     - key: ESCROW_WALLET_ADDRESS
       value: TXxxxxxx
     - key: COMMISSION_PERCENT
       value: "1.5"
     - key: RELEASE_SECRET
       value: your_secure_key
     - key: TELEGRAM_ADMIN_ID
       value: "123456789"
   ```

## 🤖 Telegram Bot Deployment

### Option 1: PythonAnywhere

1. **Upload Files**
   - Upload telegram-bot folder to PythonAnywhere
   - Install dependencies in console:
     ```bash
     pip3.11 install --user -r requirements.txt
     ```

2. **Create Task**
   - Go to Tasks tab in dashboard
   - Create new task with command:
     ```bash
     python3.11 /home/yourusername/telegram-bot/bot.py
     ```

3. **Configure Environment**
   - Create .env file with your configuration
   - Ensure bot token and admin ID are correct

### Option 2: Railway (with Backend)

1. **Modify Backend Structure**
   ```bash
   # Copy bot files to backend folder
   cp -r telegram-bot/* backend/
   ```

2. **Update main.py**
   ```python
   import asyncio
   import threading
   from bot import P2PTradingBot
   
   # Start bot in background thread
   def start_bot():
       bot = P2PTradingBot()
       bot.run()
   
   # Start bot when app starts
   if __name__ == "__main__":
       bot_thread = threading.Thread(target=start_bot, daemon=True)
       bot_thread.start()
       
       import uvicorn
       uvicorn.run(app, host="0.0.0.0", port=8000)
   ```

### Option 3: Heroku

1. **Create Procfile**
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   bot: python bot.py
   ```

2. **Deploy**
   ```bash
   heroku create your-app-name
   git push heroku main
   heroku ps:scale bot=1
   ```

## 🗄️ Database Deployment

### SQLite (Development/Small Scale)
- Included with backend deployment
- No additional setup required
- Suitable for testing and small deployments

### PostgreSQL (Production)

1. **Create Database**
   - Use provider's PostgreSQL service (Render, Railway, etc.)
   - Get connection string

2. **Update Backend Configuration**
   ```python
   # In database.py
   DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@host:port/db")
   ```

3. **Install PostgreSQL Dependencies**
   ```bash
   pip install psycopg2-binary
   ```

4. **Run Migrations**
   ```bash
   python database/init_db.py
   ```

## 🔐 Security Configuration

### Environment Variables

**Critical Variables to Set:**
```env
# Backend
DATABASE_URL=your_database_url
ESCROW_WALLET_ADDRESS=your_trc20_wallet
COMMISSION_PERCENT=1.5
RELEASE_SECRET=generate_strong_random_key
TELEGRAM_ADMIN_ID=your_telegram_user_id

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
BACKEND_URL=https://your-backend-url.com
```

### Security Checklist

- [ ] Use strong, unique release secret
- [ ] Enable HTTPS for all deployments
- [ ] Set up proper CORS configuration
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Use secure wallet addresses

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy P2P Trading Platform

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install and Build
        run: |
          cd frontend/p2p-frontend
          npm install
          npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add Render deployment action
```

## 📊 Monitoring and Maintenance

### Health Checks

1. **Backend Health**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Frontend Availability**
   ```bash
   curl https://your-frontend-url.com
   ```

3. **Bot Status**
   - Send `/start` command to bot
   - Check bot logs for errors

### Logging

1. **Backend Logs**
   - Configure logging level in production
   - Use external logging service (LogDNA, Papertrail)

2. **Bot Logs**
   - Monitor bot activity
   - Set up error notifications

### Backup Strategy

1. **Database Backups**
   - Daily automated backups
   - Test restore procedures

2. **Configuration Backups**
   - Version control all configuration
   - Document environment variables

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names and values
   - Restart services after changes

3. **Database Connection Issues**
   - Verify connection string format
   - Check network connectivity
   - Ensure database exists

4. **Bot Not Responding**
   - Verify bot token is correct
   - Check webhook/polling configuration
   - Ensure backend URL is accessible

### Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement caching strategies

2. **Backend**
   - Add database indexing
   - Implement API caching
   - Use connection pooling

3. **Bot**
   - Implement rate limiting
   - Use webhook instead of polling
   - Add error handling and retries

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers for backend
- Implement database read replicas
- Consider microservices architecture

### Vertical Scaling
- Monitor resource usage
- Upgrade server specifications
- Optimize database queries

### Global Deployment
- Use multiple regions
- Implement CDN
- Consider data locality requirements

---

**Need help with deployment? Contact the development team or check the troubleshooting section.**

