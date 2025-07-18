# P2P USDT Trading Platform for Ethiopia

A complete mobile-friendly peer-to-peer USDT crypto trading platform designed specifically for Ethiopia, featuring manual escrow, Telegram bot integration, and admin-controlled fund release.

## 🌟 Features

### Core Trading Features
- **Secure Escrow System**: Admin-controlled manual escrow for safe transactions
- **Mobile-Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Listings**: Browse and post buy/sell offers with live updates
- **Trade Management**: Complete workflow from listing to fund release
- **Commission System**: Automated 1.5% commission calculation

### Telegram Integration
- **Bot Commands**: Full trade management through Telegram
- **Admin Notifications**: Real-time alerts for new deals and confirmations
- **Payment Confirmation**: Sellers can confirm payments via bot
- **Fund Release**: Admin can release USDT through bot commands

### Security & Safety
- **User Verification**: Built-in user verification system
- **Trade Timeouts**: 90-minute automatic expiration for incomplete trades
- **Audit Logging**: Complete transaction history and logs
- **Admin Controls**: Comprehensive admin panel for platform management

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React with Vite, responsive design
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **Telegram Bot**: python-telegram-bot library
- **Deployment**: Ready for Vercel/Netlify (frontend) and Render/Railway (backend)

### Project Structure
```
p2p-marketplace/
├── frontend/           # React application
│   └── p2p-frontend/   # Main React app
├── backend/            # FastAPI application
├── telegram-bot/       # Telegram bot
├── database/           # Database schema and initialization
├── .env.template       # Environment configuration template
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm/pnpm/yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd p2p-marketplace
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.template .env
# Edit .env with your configuration
python main.py
```

### 3. Frontend Setup
```bash
cd frontend/p2p-frontend
npm install
npm run dev
```

### 4. Telegram Bot Setup
```bash
cd telegram-bot
pip install -r requirements.txt
cp .env.template .env
# Edit .env with your bot token
python start_bot.py
```

### 5. Database Initialization
```bash
cd database
python init_db.py
```

## 📱 Usage

### For Traders

1. **Browse Listings**: Visit the platform to see available buy/sell offers
2. **Post Ads**: Create your own trade advertisements with rates and payment methods
3. **Initiate Trades**: Contact counterparties and create deals
4. **Use Escrow**: Follow the secure escrow process for safe trading
5. **Telegram Integration**: Manage trades through the Telegram bot

### For Admins

1. **Monitor Deals**: Use admin panel to oversee all platform activity
2. **Release Funds**: Manually release USDT after payment confirmation
3. **User Management**: Verify users and manage platform access
4. **Telegram Commands**: Use bot commands for quick admin actions

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=sqlite:///./p2p_trading.db
ESCROW_WALLET_ADDRESS=TXxxxxxx
COMMISSION_PERCENT=1.5
RELEASE_SECRET=secure_key_here
TELEGRAM_ADMIN_ID=123456789
```

#### Telegram Bot (.env)
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_ID=123456789
BACKEND_URL=http://localhost:8000
RELEASE_SECRET=secure_key_here
FRONTEND_URL=http://localhost:3000
```

### Telegram Bot Setup

1. **Create Bot**: Message @BotFather on Telegram
2. **Get Token**: Use `/newbot` command and copy the token
3. **Get Admin ID**: Use @userinfobot to get your Telegram user ID
4. **Configure**: Add token and admin ID to `.env` file

## 🔄 Trading Workflow

### Complete Trade Process

1. **Listing Creation**
   - User posts buy/sell offer with amount, rate, payment method
   - Listing appears on platform for other users to see

2. **Deal Initiation**
   - Interested party contacts listing creator
   - Deal created with unique trade code (e.g., #EZ104)
   - 90-minute timer starts

3. **Escrow Process**
   - Seller sends USDT to admin escrow wallet
   - Transaction memo includes trade code
   - Admin verifies receipt

4. **ETB Payment**
   - Buyer sends Ethiopian Birr to seller
   - Uses agreed payment method (bank transfer, mobile money, etc.)
   - Buyer keeps payment receipt

5. **Confirmation & Release**
   - Seller confirms ETB receipt via Telegram bot: `/confirm_payment #EZ104`
   - Admin receives notification
   - Admin releases USDT via bot: `/release_funds #EZ104`
   - 1.5% commission automatically deducted

## 🛡️ Security Features

### Escrow Protection
- Admin-controlled USDT wallets
- Manual verification of all transactions
- Trade codes for transaction tracking
- Automatic timeout for incomplete trades

### User Safety
- Contact information verification
- Payment receipt requirements
- Dispute resolution system
- Complete audit trail

### Admin Controls
- Secure fund release mechanism
- Real-time monitoring capabilities
- User verification system
- Emergency trade cancellation

## 📊 API Documentation

### Core Endpoints

#### Listings
- `GET /listings` - Get all active listings
- `POST /listings` - Create new listing
- `GET /listings/{id}` - Get specific listing

#### Deals
- `POST /deals` - Create new deal
- `GET /deals/{trade_code}` - Get deal by trade code
- `POST /confirm-payment` - Confirm ETB payment

#### Admin
- `POST /admin/release-funds` - Release USDT funds
- `GET /admin/pending-deals` - Get pending deals
- `GET /admin/stats` - Platform statistics

### Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

## 🤖 Telegram Bot Commands

### User Commands
- `/start` - Welcome message and main menu
- `/help` - Detailed help and instructions
- `/post_trade` - Create new trade offer
- `/confirm_payment #TRADE_CODE` - Confirm ETB payment received
- `/my_deals` - View active deals

### Admin Commands
- `/release_funds #TRADE_CODE` - Release USDT to buyer
- `/admin` - Admin panel with statistics

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend/p2p-frontend
npm run build
# Deploy dist/ folder to Vercel or Netlify
```

### Backend Deployment (Render/Railway)
```bash
# Ensure all environment variables are set
# Deploy backend/ folder to Render or Railway
```

### Telegram Bot Deployment
```bash
# Deploy to PythonAnywhere, Railway, or include with backend
# Ensure bot token and environment variables are configured
```

## 🔧 Customization

### Commission Rate
Edit `COMMISSION_PERCENT` in backend `.env` file

### Trade Timeout
Modify `TRADE_TIMEOUT_MINUTES` in backend configuration

### Payment Methods
Update payment method list in frontend `PostAd.jsx`

### Escrow Wallet
Configure `ESCROW_WALLET_ADDRESS` for your TRC20 USDT wallet

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check Python version (3.11+ required)
   - Verify all dependencies installed
   - Check database permissions

2. **Frontend build errors**
   - Clear node_modules and reinstall
   - Check Node.js version (20+ required)
   - Verify all environment variables

3. **Telegram bot not responding**
   - Verify bot token is correct
   - Check admin ID format (numeric)
   - Ensure backend is accessible

4. **Database errors**
   - Run database initialization script
   - Check file permissions
   - Verify SQLite installation

### Support

For technical support or questions:
- Check the documentation in each component folder
- Review the troubleshooting guides
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔮 Future Enhancements

### Planned Features
- Multi-language support (Amharic, Oromo)
- Mobile app development
- Advanced user verification
- Automated dispute resolution
- Integration with more payment methods
- Real-time chat system
- Advanced analytics dashboard

### Technical Improvements
- PostgreSQL migration
- Redis caching
- WebSocket real-time updates
- API rate limiting
- Enhanced security measures
- Automated testing suite

---

**Built with ❤️ for the Ethiopian crypto community**

