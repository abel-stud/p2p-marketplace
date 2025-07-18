import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Clock, 
  Users, 
  MessageCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

const HowItWorks = () => {
  const tradingSteps = [
    {
      number: "1",
      title: "Browse or Post Listings",
      description: "Find existing buy/sell offers or create your own trade advertisement",
      icon: TrendingUp,
      details: [
        "Browse active listings on the marketplace",
        "Filter by buy/sell type and payment method",
        "Post your own ad with competitive rates",
        "Set minimum and maximum trade amounts"
      ]
    },
    {
      number: "2",
      title: "Initiate Trade",
      description: "Contact the counterparty and create a deal with unique trade code",
      icon: MessageCircle,
      details: [
        "Contact trader via provided contact information",
        "Agree on trade terms and amount",
        "System generates unique trade code (e.g., #EZ104)",
        "Deal expires in 90 minutes if not completed"
      ]
    },
    {
      number: "3",
      title: "Escrow USDT",
      description: "Seller sends USDT to admin-controlled escrow wallet",
      icon: Wallet,
      details: [
        "Seller sends USDT to provided escrow address",
        "Include trade code as transaction memo",
        "Admin verifies USDT receipt",
        "Deal status updates to 'escrowed'"
      ]
    },
    {
      number: "4",
      title: "ETB Payment",
      description: "Buyer sends Ethiopian Birr to seller via agreed payment method",
      icon: DollarSign,
      details: [
        "Buyer sends ETB to seller's account",
        "Use agreed payment method (bank transfer, mobile money, etc.)",
        "Keep payment receipt as proof",
        "Communicate with seller to confirm payment"
      ]
    },
    {
      number: "5",
      title: "Confirm & Release",
      description: "Seller confirms ETB receipt, admin releases USDT to buyer",
      icon: CheckCircle,
      details: [
        "Seller confirms ETB payment via Telegram bot",
        "Admin verifies confirmation and releases USDT",
        "1.5% commission deducted from USDT amount",
        "Trade completed successfully"
      ]
    }
  ]

  const safetyTips = [
    {
      title: "Verify Counterparty",
      description: "Always verify the identity and reputation of your trading partner",
      icon: Users
    },
    {
      title: "Use Escrow",
      description: "Never trade without using the platform's escrow service",
      icon: Shield
    },
    {
      title: "Keep Records",
      description: "Save all payment receipts and communication records",
      icon: MessageCircle
    },
    {
      title: "Report Issues",
      description: "Contact admin immediately if you encounter any problems",
      icon: AlertTriangle
    }
  ]

  const faqItems = [
    {
      question: "What is the commission rate?",
      answer: "The platform charges a 1.5% commission on completed trades, deducted from the USDT amount."
    },
    {
      question: "How long do I have to complete a trade?",
      answer: "Trades must be completed within 90 minutes of creation, or they will automatically expire."
    },
    {
      question: "What payment methods are supported?",
      answer: "We support various Ethiopian payment methods including bank transfers, mobile money, and major Ethiopian banks."
    },
    {
      question: "What happens if there's a dispute?",
      answer: "Contact the admin immediately via Telegram. All trades are logged and can be reviewed for dispute resolution."
    },
    {
      question: "Is my USDT safe in escrow?",
      answer: "Yes, USDT is held in admin-controlled wallets and only released when both parties confirm the trade completion."
    },
    {
      question: "Can I cancel a trade?",
      answer: "Trades can be cancelled before USDT is sent to escrow. After escrow, cancellation requires admin approval."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          How P2P USDT Trading Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn how to safely trade USDT for Ethiopian Birr using our secure escrow system
        </p>
      </div>

      {/* Trading Process */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Trading Process
        </h2>
        <div className="space-y-8">
          {tradingSteps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl flex items-center">
                      <step.icon className="h-6 w-6 mr-2" />
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Safety & Security Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyTips.map((tip, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-red-100 text-red-600 p-3 rounded-full w-fit">
                  <tip.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{tip.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Notices */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Important Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Trade Timeout:</strong> All trades must be completed within 90 minutes or they will automatically expire.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <strong>Commission:</strong> A 1.5% commission is charged on all completed trades, deducted from the USDT amount.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Escrow Protection:</strong> USDT is held securely in admin-controlled wallets until trade completion.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Need Help?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Our admin team is available 24/7 to assist with trades and resolve disputes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center space-x-2 mb-4">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Telegram: @admin_telegram</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              For support, disputes, account verification, or general questions
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default HowItWorks

