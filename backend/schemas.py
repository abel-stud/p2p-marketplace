"""
Pydantic schemas for API request/response models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# User schemas
class UserBase(BaseModel):
    name: str
    telegram_username: Optional[str] = None
    telegram_id: Optional[str] = None
    type: str = "both"

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Listing schemas
class ListingBase(BaseModel):
    type: str = Field(..., pattern="^(buy|sell)$")
    amount: Decimal = Field(..., gt=0)
    rate: Decimal = Field(..., gt=0)
    payment_method: str
    contact: str
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    description: Optional[str] = None

class ListingCreate(ListingBase):
    user_id: int

class ListingUpdate(BaseModel):
    amount: Optional[Decimal] = None
    rate: Optional[Decimal] = None
    payment_method: Optional[str] = None
    contact: Optional[str] = None
    status: Optional[str] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
    description: Optional[str] = None

class ListingResponse(ListingBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    user: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Deal schemas
class DealBase(BaseModel):
    listing_id: int
    buyer_id: int
    seller_id: int
    usdt_amount: Decimal = Field(..., gt=0)
    etb_amount: Decimal = Field(..., gt=0)
    payment_method: str

class DealCreate(DealBase):
    pass

class DealUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class DealResponse(DealBase):
    id: int
    trade_code: str
    escrow_wallet: str
    status: str
    commission_amount: Decimal
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    listing: Optional[ListingResponse] = None
    buyer: Optional[UserResponse] = None
    seller: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True

# Log schemas
class LogCreate(BaseModel):
    deal_id: Optional[int] = None
    user_id: Optional[int] = None
    action: str
    notes: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class LogResponse(LogCreate):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

# API Response schemas
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

class ListingsResponse(BaseModel):
    success: bool
    data: List[ListingResponse]
    total: int

class DealsResponse(BaseModel):
    success: bool
    data: List[DealResponse]
    total: int

# Admin schemas
class AdminReleaseRequest(BaseModel):
    trade_code: str
    release_secret: str
    notes: Optional[str] = None

class ConfirmPaymentRequest(BaseModel):
    trade_code: str
    user_id: int
    notes: Optional[str] = None

