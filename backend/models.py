"""
Database models for P2P USDT Trading Platform
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta
import random
import string

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    telegram_username = Column(String(50), unique=True, index=True)
    telegram_id = Column(String(20), unique=True, index=True)
    type = Column(String(10), default="both")  # buyer, seller, both
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    listings = relationship("Listing", back_populates="user")
    buyer_deals = relationship("Deal", foreign_keys="Deal.buyer_id", back_populates="buyer")
    seller_deals = relationship("Deal", foreign_keys="Deal.seller_id", back_populates="seller")
    logs = relationship("Log", back_populates="user")

class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(10), nullable=False)  # buy, sell
    amount = Column(DECIMAL(10, 2), nullable=False)
    rate = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(String(100), nullable=False)
    contact = Column(String(200), nullable=False)
    status = Column(String(20), default="active")  # active, inactive, completed, cancelled
    min_amount = Column(DECIMAL(10, 2))
    max_amount = Column(DECIMAL(10, 2))
    description = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="listings")
    deals = relationship("Deal", back_populates="listing")

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    usdt_amount = Column(DECIMAL(10, 2), nullable=False)
    etb_amount = Column(DECIMAL(10, 2), nullable=False)
    trade_code = Column(String(20), unique=True, nullable=False, index=True)
    escrow_wallet = Column(String(100), nullable=False)
    status = Column(String(20), default="pending")  # pending, escrowed, paid, released, cancelled, disputed
    payment_method = Column(String(100), nullable=False)
    commission_amount = Column(DECIMAL(10, 2), default=0)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    listing = relationship("Listing", back_populates="deals")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="buyer_deals")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="seller_deals")
    logs = relationship("Log", back_populates="deal")
    
    @classmethod
    def generate_trade_code(cls):
        """Generate a unique trade code like #EZ104"""
        prefix = "EZ"
        number = random.randint(100, 999)
        return f"#{prefix}{number}"
    
    def set_expiry(self, hours=1.5):
        """Set deal expiry time (default 90 minutes)"""
        self.expires_at = datetime.utcnow() + timedelta(hours=hours)
    
    def is_expired(self):
        """Check if deal has expired"""
        if self.expires_at:
            return datetime.utcnow() > self.expires_at
        return False

class Log(Base):
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(50), nullable=False)
    notes = Column(Text)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    deal = relationship("Deal", back_populates="logs")
    user = relationship("User", back_populates="logs")

