import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

const PostAd = ({ onAdPosted }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    type: 'sell',
    amount: '',
    rate: '',
    payment_method: '',
    contact: '',
    min_amount: '',
    max_amount: '',
    description: '',
    user_id: 1 // Default admin user for demo
  })

  const paymentMethods = [
    'Bank Transfer',
    'Mobile Money',
    'Cash Deposit',
    'CBE Birr',
    'Awash Bank',
    'Dashen Bank',
    'Bank of Abyssinia',
    'Wegagen Bank',
    'United Bank',
    'Nib Bank',
    'Cooperative Bank of Oromia',
    'Lion International Bank',
    'Zemen Bank',
    'Bunna Bank',
    'Berhan Bank',
    'Abay Bank',
    'Addis International Bank',
    'Debub Global Bank',
    'Enat Bank',
    'Shabelle Bank'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear errors when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount')
      return false
    }
    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      setError('Please enter a valid rate')
      return false
    }
    if (!formData.payment_method) {
      setError('Please select a payment method')
      return false
    }
    if (!formData.contact.trim()) {
      setError('Please provide contact information')
      return false
    }
    if (formData.min_amount && formData.max_amount) {
      if (parseFloat(formData.min_amount) > parseFloat(formData.max_amount)) {
        setError('Minimum amount cannot be greater than maximum amount')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError('')
    
    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        rate: parseFloat(formData.rate),
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
        max_amount: formData.max_amount ? parseFloat(formData.max_amount) : null
      }

      const response = await fetch('http://localhost:8000/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Your ad has been posted successfully!')
        // Reset form
        setFormData({
          type: 'sell',
          amount: '',
          rate: '',
          payment_method: '',
          contact: '',
          min_amount: '',
          max_amount: '',
          description: '',
          user_id: 1
        })
        // Refresh listings
        if (onAdPosted) onAdPosted()
        // Redirect to listings after 2 seconds
        setTimeout(() => {
          navigate('/listings')
        }, 2000)
      } else {
        setError(data.message || 'Failed to post ad')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Post Trade Advertisement
        </h1>
        <p className="text-muted-foreground">
          Create a new buy or sell offer for USDT trading
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Trade Details</CardTitle>
              <CardDescription>
                Fill in the details for your trade offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trade Type */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Trade Type</Label>
                  <RadioGroup
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell" id="sell" />
                      <Label htmlFor="sell" className="flex items-center space-x-2 cursor-pointer">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span>Sell USDT</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="buy" />
                      <Label htmlFor="buy" className="flex items-center space-x-2 cursor-pointer">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span>Buy USDT</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount and Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USDT) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate (ETB per USDT) *</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      placeholder="120.50"
                      value={formData.rate}
                      onChange={(e) => handleInputChange('rate', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Min/Max Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_amount">Minimum Amount (USDT)</Label>
                    <Input
                      id="min_amount"
                      type="number"
                      step="0.01"
                      placeholder="10.00"
                      value={formData.min_amount}
                      onChange={(e) => handleInputChange('min_amount', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_amount">Maximum Amount (USDT)</Label>
                    <Input
                      id="max_amount"
                      type="number"
                      step="0.01"
                      placeholder="1000.00"
                      value={formData.max_amount}
                      onChange={(e) => handleInputChange('max_amount', e.target.value)}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method *</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => handleInputChange('payment_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information *</Label>
                  <Input
                    id="contact"
                    placeholder="Telegram: @username or Phone: +251..."
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Notes (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Any additional information about your trade offer..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting Ad...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Post Advertisement
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trading Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Set Competitive Rates</h4>
                <p className="text-sm text-muted-foreground">
                  Check current market rates to ensure your offer is competitive.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Clear Contact Info</h4>
                <p className="text-sm text-muted-foreground">
                  Provide accurate Telegram username or phone number for quick communication.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Be Responsive</h4>
                <p className="text-sm text-muted-foreground">
                  Respond quickly to trade requests to build trust and complete deals faster.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1.5%</div>
                <p className="text-sm text-muted-foreground">
                  Platform commission on completed trades
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PostAd

