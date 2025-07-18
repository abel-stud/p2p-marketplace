from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sqlite3
import random
import string
from datetime import datetime, timedelta
from decimal import Decimal
import json

app = Flask(__name__)
CORS(app)

# Configuration
ESCROW_WALLET = os.getenv("ESCROW_WALLET_ADDRESS", "TXxxxxxx")
COMMISSION_PERCENT = float(os.getenv("COMMISSION_PERCENT", "1.5"))
RELEASE_SECRET = os.getenv("RELEASE_SECRET", "p2p_secure_release_key_2024")
ADMIN_ID = os.getenv("TELEGRAM_ADMIN_ID", "340425758")

# Database setup
def init_db():
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            telegram_username TEXT,
            telegram_id TEXT,
            type TEXT NOT NULL,
            verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            rate DECIMAL(10,2) NOT NULL,
            payment_method TEXT NOT NULL,
            contact TEXT NOT NULL,
            min_amount DECIMAL(10,2),
            max_amount DECIMAL(10,2),
            description TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER NOT NULL,
            buyer_id INTEGER NOT NULL,
            seller_id INTEGER NOT NULL,
            trade_code TEXT UNIQUE NOT NULL,
            usdt_amount DECIMAL(10,2) NOT NULL,
            etb_amount DECIMAL(10,2) NOT NULL,
            payment_method TEXT NOT NULL,
            escrow_wallet TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            commission_amount DECIMAL(10,2),
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (listing_id) REFERENCES listings (id),
            FOREIGN KEY (buyer_id) REFERENCES users (id),
            FOREIGN KEY (seller_id) REFERENCES users (id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            deal_id INTEGER,
            action TEXT NOT NULL,
            notes TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (deal_id) REFERENCES deals (id)
        )
    ''')
    
    # Create admin user if not exists
    cursor.execute('SELECT id FROM users WHERE telegram_id = ?', (ADMIN_ID,))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO users (name, telegram_username, telegram_id, type, verified)
            VALUES (?, ?, ?, ?, ?)
        ''', ("Admin", "admin", ADMIN_ID, "both", True))
    
    conn.commit()
    conn.close()

def generate_trade_code():
    return "#" + "".join(random.choices(string.ascii_uppercase + string.digits, k=5))

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO users (name, telegram_username, telegram_id, type)
        VALUES (?, ?, ?, ?)
    ''', (data['name'], data['telegram_username'], data['telegram_id'], data['type']))
    
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "User created successfully",
        "data": {"user_id": user_id}
    })

@app.route('/listings', methods=['GET'])
def get_listings():
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT l.*, u.name, u.telegram_username, u.verified
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE l.status = 'active'
        ORDER BY l.created_at DESC
    ''')
    
    listings = []
    for row in cursor.fetchall():
        listing = {
            "id": row[0],
            "user_id": row[1],
            "type": row[2],
            "amount": str(row[3]),
            "rate": str(row[4]),
            "payment_method": row[5],
            "contact": row[6],
            "min_amount": str(row[7]) if row[7] else None,
            "max_amount": str(row[8]) if row[8] else None,
            "description": row[9],
            "status": row[10],
            "created_at": row[11],
            "updated_at": row[12],
            "user": {
                "name": row[13],
                "telegram_username": row[14],
                "verified": bool(row[15])
            }
        }
        listings.append(listing)
    
    buy_orders = len([l for l in listings if l['type'] == 'buy'])
    sell_orders = len([l for l in listings if l['type'] == 'sell'])
    
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Listings retrieved successfully",
        "data": {
            "listings": listings,
            "total": len(listings),
            "buy_orders": buy_orders,
            "sell_orders": sell_orders
        }
    })

@app.route('/listings', methods=['POST'])
def create_listing():
    data = request.json
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO listings (user_id, type, amount, rate, payment_method, contact, min_amount, max_amount, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data['user_id'], data['type'], data['amount'], data['rate'], 
          data['payment_method'], data['contact'], data.get('min_amount'), 
          data.get('max_amount'), data.get('description')))
    
    listing_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Listing created successfully",
        "data": {"listing_id": listing_id}
    })

@app.route('/deals', methods=['POST'])
def create_deal():
    data = request.json
    trade_code = generate_trade_code()
    expires_at = datetime.now() + timedelta(minutes=90)
    commission = float(data['usdt_amount']) * (COMMISSION_PERCENT / 100)
    
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO deals (listing_id, buyer_id, seller_id, trade_code, usdt_amount, etb_amount, 
                          payment_method, escrow_wallet, commission_amount, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (data['listing_id'], data['buyer_id'], data['seller_id'], trade_code,
          data['usdt_amount'], data['etb_amount'], data['payment_method'],
          ESCROW_WALLET, commission, expires_at))
    
    deal_id = cursor.lastrowid
    
    # Log deal creation
    cursor.execute('''
        INSERT INTO logs (deal_id, action, notes)
        VALUES (?, ?, ?)
    ''', (deal_id, "deal_created", f"Deal created with trade code {trade_code}"))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Deal created successfully",
        "data": {
            "deal_id": deal_id,
            "trade_code": trade_code,
            "escrow_wallet": ESCROW_WALLET,
            "expires_at": expires_at.isoformat()
        }
    })

@app.route('/deals/<trade_code>', methods=['GET'])
def get_deal(trade_code):
    if not trade_code.startswith('#'):
        trade_code = '#' + trade_code
    
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT d.*, l.type, l.amount as listing_amount, l.rate,
               u1.name as buyer_name, u1.telegram_username as buyer_username,
               u2.name as seller_name, u2.telegram_username as seller_username
        FROM deals d
        JOIN listings l ON d.listing_id = l.id
        JOIN users u1 ON d.buyer_id = u1.id
        JOIN users u2 ON d.seller_id = u2.id
        WHERE d.trade_code = ?
    ''', (trade_code,))
    
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({"success": False, "message": "Deal not found"}), 404
    
    deal = {
        "id": row[0],
        "listing_id": row[1],
        "buyer_id": row[2],
        "seller_id": row[3],
        "trade_code": row[4],
        "usdt_amount": str(row[5]),
        "etb_amount": str(row[6]),
        "payment_method": row[7],
        "escrow_wallet": row[8],
        "status": row[9],
        "commission_amount": str(row[10]),
        "expires_at": row[11],
        "created_at": row[12],
        "updated_at": row[13],
        "listing": {
            "type": row[14],
            "amount": str(row[15]),
            "rate": str(row[16])
        },
        "buyer": {
            "name": row[17],
            "telegram_username": row[18]
        },
        "seller": {
            "name": row[19],
            "telegram_username": row[20]
        }
    }
    
    conn.close()
    return jsonify(deal)

@app.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    data = request.json
    trade_code = data['trade_code']
    
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('UPDATE deals SET status = ? WHERE trade_code = ?', ('paid', trade_code))
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({"success": False, "message": "Deal not found"}), 404
    
    # Log payment confirmation
    cursor.execute('SELECT id FROM deals WHERE trade_code = ?', (trade_code,))
    deal_id = cursor.fetchone()[0]
    
    cursor.execute('''
        INSERT INTO logs (deal_id, action, notes)
        VALUES (?, ?, ?)
    ''', (deal_id, "payment_confirmed", data.get('notes', 'Payment confirmed')))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Payment confirmed successfully",
        "data": {"trade_code": trade_code, "status": "paid"}
    })

@app.route('/admin/release-funds', methods=['POST'])
def release_funds():
    data = request.json
    
    if data.get('release_secret') != RELEASE_SECRET:
        return jsonify({"success": False, "message": "Invalid release secret"}), 403
    
    trade_code = data['trade_code']
    
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT usdt_amount, commission_amount FROM deals WHERE trade_code = ?', (trade_code,))
    result = cursor.fetchone()
    
    if not result:
        conn.close()
        return jsonify({"success": False, "message": "Deal not found"}), 404
    
    usdt_amount, commission = result
    
    cursor.execute('UPDATE deals SET status = ? WHERE trade_code = ?', ('completed', trade_code))
    
    # Log fund release
    cursor.execute('SELECT id FROM deals WHERE trade_code = ?', (trade_code,))
    deal_id = cursor.fetchone()[0]
    
    cursor.execute('''
        INSERT INTO logs (deal_id, action, notes)
        VALUES (?, ?, ?)
    ''', (deal_id, "funds_released", data.get('notes', 'Funds released by admin')))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Funds released successfully",
        "data": {
            "trade_code": trade_code,
            "usdt_amount": str(usdt_amount),
            "commission": str(commission)
        }
    })

@app.route('/admin/pending-deals', methods=['GET'])
def get_pending_deals():
    status = request.args.get('status', 'paid')
    limit = int(request.args.get('limit', 50))
    
    conn = sqlite3.connect('p2p_trading.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT d.*, u1.name as buyer_name, u1.telegram_username as buyer_username,
               u2.name as seller_name, u2.telegram_username as seller_username
        FROM deals d
        JOIN users u1 ON d.buyer_id = u1.id
        JOIN users u2 ON d.seller_id = u2.id
        WHERE d.status = ?
        LIMIT ?
    ''', (status, limit))
    
    deals = []
    for row in cursor.fetchall():
        deal = {
            "id": row[0],
            "trade_code": row[4],
            "usdt_amount": str(row[5]),
            "status": row[9],
            "created_at": row[12],
            "buyer": {
                "name": row[14],
                "telegram_username": row[15]
            },
            "seller": {
                "name": row[16],
                "telegram_username": row[17]
            }
        }
        deals.append(deal)
    
    conn.close()
    
    return jsonify({
        "success": True,
        "message": "Pending deals retrieved successfully",
        "data": deals
    })

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

