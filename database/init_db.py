#!/usr/bin/env python3
"""
Database initialization script for P2P USDT Trading Platform
"""

import sqlite3
import os
from pathlib import Path

def init_database():
    """Initialize the SQLite database with schema"""
    
    # Get the database directory
    db_dir = Path(__file__).parent
    db_path = db_dir / "p2p_trading.db"
    schema_path = db_dir / "schema.sql"
    
    # Create database directory if it doesn't exist
    db_dir.mkdir(exist_ok=True)
    
    # Connect to database (creates file if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Read and execute schema
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
        
        # Execute schema (split by semicolon to handle multiple statements)
        statements = schema_sql.split(';')
        for statement in statements:
            statement = statement.strip()
            if statement:
                cursor.execute(statement)
        
        conn.commit()
        print(f"✅ Database initialized successfully at: {db_path}")
        
        # Verify tables were created
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"📊 Created tables: {[table[0] for table in tables]}")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        conn.rollback()
        raise
    
    finally:
        conn.close()

if __name__ == "__main__":
    init_database()

