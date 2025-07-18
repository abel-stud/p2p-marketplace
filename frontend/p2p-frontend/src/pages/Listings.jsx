import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  RefreshCw, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  MessageCircle,
  Clock,
  DollarSign
} from 'lucide-react'

const Listings = ({ listings, loading, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('all')

  const buyListings = listings.filter(listing => listing.type === 'buy')
  const sellListings = listings.filter(listing => listing.type === 'sell')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatETB = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
    }).format(amount) + ' ETB'
  }

  const getTypeIcon = (type) => {
    return type === 'buy' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const getTypeColor = (type) => {
    return type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  const ListingCard = ({ listing }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(listing.type)}>
              {getTypeIcon(listing.type)}
              <span className="ml-1 capitalize">{listing.type}</span>
            </Badge>
            <Badge variant="outline">
              {listing.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatETB(listing.rate)}
            </div>
            <div className="text-sm text-muted-foreground">per USDT</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-semibold">{formatCurrency(listing.amount)} USDT</span>
          </div>
          
          {(listing.min_amount || listing.max_amount) && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Limits:</span>
              <span className="text-sm">
                {listing.min_amount && formatCurrency(listing.min_amount)}
                {listing.min_amount && listing.max_amount && ' - '}
                {listing.max_amount && formatCurrency(listing.max_amount)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Payment:</span>
            <Badge variant="secondary">{listing.payment_method}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Contact:</span>
            <span className="text-sm font-medium">{listing.contact}</span>
          </div>
          
          {listing.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">{listing.description}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(listing.created_at).toLocaleDateString()}
            </div>
            <Button size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Trade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = ({ type }) => (
    <div className="text-center py-12">
      <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No {type} listings available
      </h3>
      <p className="text-muted-foreground mb-6">
        Be the first to post a {type} offer!
      </p>
      <Button asChild>
        <Link to="/post-ad">
          <Plus className="h-4 w-4 mr-2" />
          Post Ad
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            USDT Listings
          </h1>
          <p className="text-muted-foreground">
            Browse active buy and sell offers from verified traders
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/post-ad">
              <Plus className="h-4 w-4 mr-2" />
              Post Ad
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Buy Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{buyListings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sell Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sellListings.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Listings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Listings ({listings.length})</TabsTrigger>
          <TabsTrigger value="buy">Buy Orders ({buyListings.length})</TabsTrigger>
          <TabsTrigger value="sell">Sell Orders ({sellListings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <EmptyState type="trading" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buy" className="mt-6">
          {buyListings.length === 0 ? (
            <EmptyState type="buy" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="mt-6">
          {sellListings.length === 0 ? (
            <EmptyState type="sell" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Listings

