import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Copy, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Wallet,
  QrCode,
  RefreshCw
} from 'lucide-react'

const DealPage = () => {
  const { tradeCode } = useParams()
  const [deal, setDeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDeal()
  }, [tradeCode])

  const fetchDeal = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/deals/${tradeCode}`)
      if (response.ok) {
        const data = await response.json()
        setDeal(data)
      } else {
        setError('Deal not found')
      }
    } catch (err) {
      setError('Failed to load deal information')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'escrowed': return 'bg-blue-100 text-blue-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'released': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'disputed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'escrowed': return <Shield className="h-4 w-4" />
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'released': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      case 'disputed': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading deal information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Deal {deal.trade_code}
        </h1>
        <p className="text-muted-foreground">
          Trade details and escrow information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Deal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Trade Status</CardTitle>
                <Badge className={getStatusColor(deal.status)}>
                  {getStatusIcon(deal.status)}
                  <span className="ml-1 capitalize">{deal.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">USDT Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(deal.usdt_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ETB Amount</p>
                  <p className="text-2xl font-bold">{formatETB(deal.etb_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{deal.payment_method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="font-medium">{formatCurrency(deal.commission_amount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escrow Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Escrow Wallet
              </CardTitle>
              <CardDescription>
                Send USDT to this address with the trade code as memo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                      <p className="font-mono text-sm break-all">{deal.escrow_wallet}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(deal.escrow_wallet)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Memo/Reference</p>
                      <p className="font-mono text-lg font-bold">{deal.trade_code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(deal.trade_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {copied && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Copied to clipboard!</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Seller: Send USDT to Escrow</p>
                    <p className="text-sm text-muted-foreground">
                      Send {formatCurrency(deal.usdt_amount)} USDT to the escrow wallet with memo "{deal.trade_code}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Buyer: Send ETB Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Send {formatETB(deal.etb_amount)} via {deal.payment_method} to the seller
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Seller: Confirm Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Use Telegram bot to confirm ETB payment received
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Admin: Release USDT</p>
                    <p className="text-sm text-muted-foreground">
                      Admin releases USDT to buyer (minus 1.5% commission)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timer */}
          {deal.expires_at && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {new Date(deal.expires_at) > new Date() ? 
                      Math.ceil((new Date(deal.expires_at) - new Date()) / (1000 * 60)) + ' min' : 
                      'Expired'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Deal expires at {new Date(deal.expires_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <QrCode className="h-5 w-5 mr-2" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted aspect-square rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    QR code for wallet address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Admin */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Contact admin for support or disputes
              </p>
              <Button variant="outline" className="w-full">
                Contact Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DealPage

