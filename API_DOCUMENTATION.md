# API Documentation

Complete API reference for the P2P USDT Trading Platform backend.

## 📋 Overview

The P2P USDT Trading Platform API is built with FastAPI and provides endpoints for managing users, listings, deals, and administrative functions.

**Base URL**: `http://localhost:8000` (development) or your deployed backend URL

**Content Type**: `application/json`

**Response Format**: All responses follow a consistent format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null
}
```

## 🔐 Authentication

Currently, the API uses simple user ID-based authentication. In production, implement proper JWT or OAuth authentication.

## 📊 Health Check

### GET /health

Check if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-16T07:06:17.700947"
}
```

## 👥 Users

### POST /users

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "telegram_username": "johndoe",
  "telegram_id": "123456789",
  "type": "both"  // "buyer", "seller", or "both"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 1
  }
}
```

### GET /users/{user_id}

Get user information by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "telegram_username": "johndoe",
  "telegram_id": "123456789",
  "type": "both",
  "verified": false,
  "created_at": "2025-07-16T07:06:24"
}
```

## 📋 Listings

### GET /listings

Get all active listings with optional filtering.

**Query Parameters:**
- `type` (optional): "buy" or "sell"
- `payment_method` (optional): Filter by payment method
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "message": "Listings retrieved successfully",
  "data": {
    "listings": [
      {
        "id": 1,
        "user_id": 2,
        "type": "sell",
        "amount": "100.00",
        "rate": "125.50",
        "payment_method": "Bank Transfer",
        "contact": "Telegram: @testuser",
        "min_amount": null,
        "max_amount": null,
        "description": "Test listing for USDT sale",
        "status": "active",
        "created_at": "2025-07-16T07:06:30",
        "updated_at": "2025-07-16T07:06:30",
        "user": {
          "name": "Test User",
          "telegram_username": "testuser",
          "verified": false
        }
      }
    ],
    "total": 1,
    "buy_orders": 0,
    "sell_orders": 1
  }
}
```

### POST /listings

Create a new trade listing.

**Request Body:**
```json
{
  "user_id": 2,
  "type": "sell",
  "amount": 100.00,
  "rate": 125.50,
  "payment_method": "Bank Transfer",
  "contact": "Telegram: @testuser",
  "min_amount": 10.00,
  "max_amount": 1000.00,
  "description": "Selling USDT for ETB via bank transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Listing created successfully",
  "data": {
    "listing_id": 1
  }
}
```

### GET /listings/{listing_id}

Get specific listing by ID.

**Response:**
```json
{
  "id": 1,
  "user_id": 2,
  "type": "sell",
  "amount": "100.00",
  "rate": "125.50",
  "payment_method": "Bank Transfer",
  "contact": "Telegram: @testuser",
  "min_amount": null,
  "max_amount": null,
  "description": "Test listing for USDT sale",
  "status": "active",
  "created_at": "2025-07-16T07:06:30",
  "updated_at": "2025-07-16T07:06:30",
  "user": {
    "name": "Test User",
    "telegram_username": "testuser",
    "verified": false
  }
}
```

### PUT /listings/{listing_id}

Update an existing listing.

**Request Body:**
```json
{
  "amount": 150.00,
  "rate": 126.00,
  "description": "Updated listing description"
}
```

### DELETE /listings/{listing_id}

Deactivate a listing.

**Response:**
```json
{
  "success": true,
  "message": "Listing deactivated successfully"
}
```

## 💼 Deals

### POST /deals

Create a new deal from a listing.

**Request Body:**
```json
{
  "listing_id": 1,
  "buyer_id": 1,
  "seller_id": 2,
  "usdt_amount": 50.00,
  "etb_amount": 6275.00,
  "payment_method": "Bank Transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deal created successfully",
  "data": {
    "deal_id": 1,
    "trade_code": "#EZ742",
    "escrow_wallet": "TXxxxxxx",
    "expires_at": "2025-07-16T08:36:38.255692"
  }
}
```

### GET /deals/{trade_code}

Get deal information by trade code.

**Response:**
```json
{
  "id": 1,
  "listing_id": 1,
  "buyer_id": 1,
  "seller_id": 2,
  "trade_code": "#EZ742",
  "usdt_amount": "50.00",
  "etb_amount": "6275.00",
  "payment_method": "Bank Transfer",
  "escrow_wallet": "TXxxxxxx",
  "status": "pending",
  "commission_amount": "0.75",
  "expires_at": "2025-07-16T08:36:38.255692",
  "created_at": "2025-07-16T07:06:38",
  "updated_at": "2025-07-16T07:06:38",
  "listing": {
    "type": "sell",
    "amount": "100.00",
    "rate": "125.50",
    "user": {
      "name": "Test User",
      "telegram_username": "testuser"
    }
  },
  "buyer": {
    "name": "Admin",
    "telegram_username": "admin"
  },
  "seller": {
    "name": "Test User",
    "telegram_username": "testuser"
  }
}
```

### POST /confirm-payment

Confirm that ETB payment has been received (seller action).

**Request Body:**
```json
{
  "trade_code": "#EZ742",
  "user_id": 2,
  "notes": "Payment received via bank transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully",
  "data": {
    "trade_code": "#EZ742",
    "status": "paid"
  }
}
```

## 🔧 Admin Endpoints

### POST /admin/release-funds

Release USDT funds to buyer (admin only).

**Request Body:**
```json
{
  "trade_code": "#EZ742",
  "release_secret": "secure_key_here",
  "notes": "Funds released after payment confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Funds released successfully",
  "data": {
    "trade_code": "#EZ742",
    "usdt_amount": "50.00",
    "commission": "0.75"
  }
}
```

### GET /admin/pending-deals

Get deals pending admin action.

**Query Parameters:**
- `status` (optional): Filter by status ("paid", "escrowed", etc.)
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Pending deals retrieved successfully",
  "data": [
    {
      "id": 1,
      "trade_code": "#EZ742",
      "usdt_amount": "50.00",
      "status": "paid",
      "created_at": "2025-07-16T07:06:38",
      "buyer": {
        "name": "Admin",
        "telegram_username": "admin"
      },
      "seller": {
        "name": "Test User",
        "telegram_username": "testuser"
      }
    }
  ]
}
```

### GET /admin/stats

Get platform statistics (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_users": 5,
    "total_listings": 12,
    "active_listings": 8,
    "total_deals": 25,
    "completed_deals": 20,
    "pending_deals": 3,
    "total_volume": "15000.00",
    "total_commission": "225.00"
  }
}
```

## 📝 Logs

### POST /logs

Create a new log entry.

**Request Body:**
```json
{
  "deal_id": 1,
  "action": "payment_confirmed",
  "notes": "Seller confirmed ETB payment received"
}
```

### GET /logs/{deal_id}

Get all logs for a specific deal.

**Response:**
```json
{
  "success": true,
  "message": "Logs retrieved successfully",
  "data": [
    {
      "id": 1,
      "deal_id": 1,
      "action": "deal_created",
      "notes": "Deal created with trade code #EZ742",
      "timestamp": "2025-07-16T07:06:38"
    },
    {
      "id": 2,
      "deal_id": 1,
      "action": "payment_confirmed",
      "notes": "Seller confirmed ETB payment received",
      "timestamp": "2025-07-16T07:15:22"
    }
  ]
}
```

## ❌ Error Responses

### Error Format
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

### Example Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid trade code format",
  "data": null
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Deal not found",
  "data": null
}
```

**422 Validation Error:**
```json
{
  "success": false,
  "message": "Validation error",
  "data": {
    "detail": [
      {
        "loc": ["body", "amount"],
        "msg": "ensure this value is greater than 0",
        "type": "value_error.number.not_gt"
      }
    ]
  }
}
```

## 🔄 Deal Status Flow

```
pending → escrowed → paid → completed
    ↓         ↓        ↓        ↓
cancelled  cancelled  cancelled  -
```

**Status Descriptions:**
- `pending`: Deal created, waiting for USDT escrow
- `escrowed`: USDT sent to escrow wallet
- `paid`: ETB payment confirmed by seller
- `completed`: USDT released to buyer
- `cancelled`: Deal cancelled or expired

## 📊 Rate Limiting

Current implementation doesn't include rate limiting, but for production deployment, consider:

- **General API**: 100 requests per minute per IP
- **Admin endpoints**: 50 requests per minute per IP
- **Deal creation**: 10 requests per minute per user

## 🔐 Security Considerations

### Input Validation
- All monetary amounts are validated as positive decimals
- Trade codes follow specific format (#XXXXX)
- User IDs are validated as positive integers
- Payment methods are validated against allowed list

### Data Sanitization
- All text inputs are sanitized to prevent XSS
- SQL injection protection via SQLAlchemy ORM
- Input length limits enforced

### Authentication (Future)
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

## 🧪 Testing

### Example cURL Commands

**Create User:**
```bash
curl -X POST http://localhost:8000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "telegram_username": "testuser", "telegram_id": "123456", "type": "both"}'
```

**Get Listings:**
```bash
curl http://localhost:8000/listings
```

**Create Deal:**
```bash
curl -X POST http://localhost:8000/deals \
  -H "Content-Type: application/json" \
  -d '{"listing_id": 1, "buyer_id": 1, "seller_id": 2, "usdt_amount": 50.00, "etb_amount": 6275.00, "payment_method": "Bank Transfer"}'
```

**Confirm Payment:**
```bash
curl -X POST http://localhost:8000/confirm-payment \
  -H "Content-Type: application/json" \
  -d '{"trade_code": "#EZ742", "user_id": 2, "notes": "Payment confirmed"}'
```

**Release Funds (Admin):**
```bash
curl -X POST http://localhost:8000/admin/release-funds \
  -H "Content-Type: application/json" \
  -d '{"trade_code": "#EZ742", "release_secret": "secure_key_here", "notes": "Funds released"}'
```

## 📚 SDK Examples

### Python SDK Example
```python
import requests

class P2PTradingAPI:
    def __init__(self, base_url):
        self.base_url = base_url
    
    def create_user(self, name, telegram_username, telegram_id, user_type):
        response = requests.post(f"{self.base_url}/users", json={
            "name": name,
            "telegram_username": telegram_username,
            "telegram_id": telegram_id,
            "type": user_type
        })
        return response.json()
    
    def get_listings(self, listing_type=None):
        params = {"type": listing_type} if listing_type else {}
        response = requests.get(f"{self.base_url}/listings", params=params)
        return response.json()
    
    def create_deal(self, listing_id, buyer_id, seller_id, usdt_amount, etb_amount, payment_method):
        response = requests.post(f"{self.base_url}/deals", json={
            "listing_id": listing_id,
            "buyer_id": buyer_id,
            "seller_id": seller_id,
            "usdt_amount": usdt_amount,
            "etb_amount": etb_amount,
            "payment_method": payment_method
        })
        return response.json()

# Usage
api = P2PTradingAPI("http://localhost:8000")
user = api.create_user("John Doe", "johndoe", "123456789", "both")
listings = api.get_listings("sell")
```

### JavaScript SDK Example
```javascript
class P2PTradingAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async createUser(name, telegramUsername, telegramId, type) {
        const response = await fetch(`${this.baseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                telegram_username: telegramUsername,
                telegram_id: telegramId,
                type
            })
        });
        return response.json();
    }
    
    async getListings(type = null) {
        const params = type ? `?type=${type}` : '';
        const response = await fetch(`${this.baseUrl}/listings${params}`);
        return response.json();
    }
    
    async createDeal(listingId, buyerId, sellerId, usdtAmount, etbAmount, paymentMethod) {
        const response = await fetch(`${this.baseUrl}/deals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                listing_id: listingId,
                buyer_id: buyerId,
                seller_id: sellerId,
                usdt_amount: usdtAmount,
                etb_amount: etbAmount,
                payment_method: paymentMethod
            })
        });
        return response.json();
    }
}

// Usage
const api = new P2PTradingAPI('http://localhost:8000');
const user = await api.createUser('John Doe', 'johndoe', '123456789', 'both');
const listings = await api.getListings('sell');
```

---

**For more information or support, please refer to the main README.md file or contact the development team.**

