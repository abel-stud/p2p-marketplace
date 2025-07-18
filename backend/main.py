"""
Main FastAPI application for P2P USDT Trading Platform
"""

from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv
from datetime import datetime
import random

from database import get_db, init_database
from models import User, Listing, Deal, Log
from schemas import (
    ListingCreate, ListingResponse, ListingUpdate, ListingsResponse,
    DealCreate, DealResponse, DealUpdate, DealsResponse,
    UserCreate, UserResponse,
    APIResponse, AdminReleaseRequest, ConfirmPaymentRequest,
    LogCreate
)

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="P2P USDT Trading Platform API",
    description="API for P2P USDT trading platform with manual escrow",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
ESCROW_WALLET = os.getenv("ESCROW_WALLET_ADDRESS", "TXxxxxxx")
COMMISSION_PERCENT = float(os.getenv("COMMISSION_PERCENT", "1.5"))
RELEASE_SECRET = os.getenv("RELEASE_SECRET", "secure_key_here")
TELEGRAM_ADMIN_ID = os.getenv("TELEGRAM_ADMIN_ID", "123456789")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()

# Helper functions
def log_action(db: Session, action: str, deal_id: int = None, user_id: int = None, 
               notes: str = None, request: Request = None):
    """Log an action to the database"""
    log_entry = Log(
        deal_id=deal_id,
        user_id=user_id,
        action=action,
        notes=notes,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get("user-agent") if request else None
    )
    db.add(log_entry)
    db.commit()

def generate_unique_trade_code(db: Session) -> str:
    """Generate a unique trade code"""
    while True:
        code = Deal.generate_trade_code()
        existing = db.query(Deal).filter(Deal.trade_code == code).first()
        if not existing:
            return code

def calculate_commission(amount: float) -> float:
    """Calculate commission amount"""
    return amount * (COMMISSION_PERCENT / 100)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "P2P USDT Trading Platform API", "status": "running"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Listings endpoints
@app.get("/listings", response_model=ListingsResponse)
async def get_listings(
    type: Optional[str] = None,
    status: str = "active",
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get all listings with optional filtering"""
    query = db.query(Listing).filter(Listing.status == status)
    
    if type and type in ["buy", "sell"]:
        query = query.filter(Listing.type == type)
    
    total = query.count()
    listings = query.offset(offset).limit(limit).all()
    
    return ListingsResponse(
        success=True,
        data=listings,
        total=total
    )

@app.post("/listings", response_model=APIResponse)
async def create_listing(
    listing: ListingCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Create a new listing"""
    # Validate user exists
    user = db.query(User).filter(User.id == listing.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create listing
    db_listing = Listing(**listing.dict())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    
    # Log action
    log_action(db, "listing_created", user_id=listing.user_id, 
               notes=f"Created {listing.type} listing for {listing.amount} USDT", 
               request=request)
    
    return APIResponse(
        success=True,
        message="Listing created successfully",
        data={"listing_id": db_listing.id}
    )

@app.put("/listings/{listing_id}", response_model=APIResponse)
async def update_listing(
    listing_id: int,
    listing_update: ListingUpdate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Update a listing"""
    db_listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not db_listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Update fields
    for field, value in listing_update.dict(exclude_unset=True).items():
        setattr(db_listing, field, value)
    
    db.commit()
    
    # Log action
    log_action(db, "listing_updated", user_id=db_listing.user_id,
               notes=f"Updated listing {listing_id}", request=request)
    
    return APIResponse(success=True, message="Listing updated successfully")

# Deals endpoints
@app.post("/deals", response_model=APIResponse)
async def create_deal(
    deal: DealCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Create a new deal"""
    # Validate listing exists and is active
    listing = db.query(Listing).filter(
        Listing.id == deal.listing_id,
        Listing.status == "active"
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Active listing not found")
    
    # Validate users exist
    buyer = db.query(User).filter(User.id == deal.buyer_id).first()
    seller = db.query(User).filter(User.id == deal.seller_id).first()
    if not buyer or not seller:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate unique trade code
    trade_code = generate_unique_trade_code(db)
    
    # Calculate commission
    commission = calculate_commission(float(deal.usdt_amount))
    
    # Create deal
    db_deal = Deal(
        **deal.dict(),
        trade_code=trade_code,
        escrow_wallet=ESCROW_WALLET,
        commission_amount=commission
    )
    db_deal.set_expiry()  # Set 90-minute expiry
    
    db.add(db_deal)
    db.commit()
    db.refresh(db_deal)
    
    # Log action
    log_action(db, "deal_created", deal_id=db_deal.id,
               notes=f"Created deal {trade_code} for {deal.usdt_amount} USDT",
               request=request)
    
    return APIResponse(
        success=True,
        message="Deal created successfully",
        data={
            "deal_id": db_deal.id,
            "trade_code": trade_code,
            "escrow_wallet": ESCROW_WALLET,
            "expires_at": db_deal.expires_at.isoformat()
        }
    )

@app.get("/deals/{trade_code}", response_model=DealResponse)
async def get_deal(trade_code: str, db: Session = Depends(get_db)):
    """Get deal by trade code"""
    deal = db.query(Deal).filter(Deal.trade_code == trade_code).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    return deal

@app.post("/confirm-payment", response_model=APIResponse)
async def confirm_payment(
    payment_request: ConfirmPaymentRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Seller confirms ETB payment received"""
    deal = db.query(Deal).filter(Deal.trade_code == payment_request.trade_code).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Validate user is the seller
    if deal.seller_id != payment_request.user_id:
        raise HTTPException(status_code=403, detail="Only seller can confirm payment")
    
    # Check if deal is in correct status
    if deal.status not in ["pending", "escrowed"]:
        raise HTTPException(status_code=400, detail="Deal cannot be confirmed in current status")
    
    # Update deal status
    deal.status = "paid"
    db.commit()
    
    # Log action
    log_action(db, "payment_confirmed", deal_id=deal.id, user_id=payment_request.user_id,
               notes=payment_request.notes or "Seller confirmed ETB payment received",
               request=request)
    
    return APIResponse(
        success=True,
        message="Payment confirmed successfully",
        data={"trade_code": deal.trade_code, "status": deal.status}
    )

# Admin endpoints
@app.post("/admin/release-funds", response_model=APIResponse)
async def release_funds(
    release_request: AdminReleaseRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Admin releases USDT funds"""
    # Validate release secret
    if release_request.release_secret != RELEASE_SECRET:
        raise HTTPException(status_code=403, detail="Invalid release secret")
    
    deal = db.query(Deal).filter(Deal.trade_code == release_request.trade_code).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    # Check if deal is in correct status
    if deal.status != "paid":
        raise HTTPException(status_code=400, detail="Deal must be in 'paid' status to release funds")
    
    # Update deal status
    deal.status = "released"
    db.commit()
    
    # Log action
    log_action(db, "funds_released", deal_id=deal.id,
               notes=release_request.notes or f"Admin released {deal.usdt_amount} USDT to buyer",
               request=request)
    
    return APIResponse(
        success=True,
        message="Funds released successfully",
        data={
            "trade_code": deal.trade_code,
            "usdt_amount": str(deal.usdt_amount),
            "commission": str(deal.commission_amount)
        }
    )

@app.get("/admin/pending-deals", response_model=DealsResponse)
async def get_pending_deals(
    status: str = "paid",
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get pending deals for admin review"""
    query = db.query(Deal).filter(Deal.status == status)
    total = query.count()
    deals = query.offset(offset).limit(limit).all()
    
    return DealsResponse(
        success=True,
        data=deals,
        total=total
    )

# Users endpoints
@app.post("/users", response_model=APIResponse)
async def create_user(
    user: UserCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """Create a new user"""
    # Check if user already exists
    existing_user = None
    if user.telegram_username:
        existing_user = db.query(User).filter(User.telegram_username == user.telegram_username).first()
    if not existing_user and user.telegram_id:
        existing_user = db.query(User).filter(User.telegram_id == user.telegram_id).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create user
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log action
    log_action(db, "user_created", user_id=db_user.id,
               notes=f"Created user {user.name}", request=request)
    
    return APIResponse(
        success=True,
        message="User created successfully",
        data={"user_id": db_user.id}
    )

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("API_PORT", "8000")),
        reload=True
    )

