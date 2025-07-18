import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Clock, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  MessageCircle,
  DollarSign
} from 'lucide-react'

const Homepage = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Admin-controlled manual escrow ensures safe transactions for both buyers and sellers."
    },
    {
      icon: Clock,
      title: "Fast Trading",
      description: "Complete trades within 90 minutes with our streamlined process."
    },
    {
      icon: Users,
      title: "Verified Users",
      description: "Trade with confidence using our user verification system."
    },
    {
      icon: MessageCircle,
      title: "Telegram Integration",
      description: "Manage trades and get notifications through our Telegram bot."
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Browse Listings",
      description: "Find buy/sell offers that match your requirements"
    },
    {
      number: "2",
      title: "Create Deal",
      description: "Initiate a trade with the counterparty"
    },
    {
      number: "3",
      title: "Escrow USDT",
      description: "Seller sends USDT to admin escrow wallet"
    },
    {
      number: "4",
      title: "Pay ETB",
      description: "Buyer sends Ethiopian Birr to seller"
    },
    {
      number: "5",
      title: "Confirm & Release",
      description: "Admin releases USDT to buyer after confirmation"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-primary text-primary-foreground p-4 rounded-2xl">
                <DollarSign className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              P2P USDT Trading
              <span className="block text-primary">for Ethiopia</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Secure, fast, and reliable peer-to-peer USDT trading platform. 
              Trade USDT for Ethiopian Birr with manual escrow protection and Telegram integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/listings">
                  View Listings <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/post-ad">
                  Post Trade Ad
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Ethiopian market with security and ease of use in mind.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple 5-step process to complete secure USDT trades
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-1/2 transform translate-x-8 w-8">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1.5%</div>
              <div className="text-lg opacity-90">Commission Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">90min</div>
              <div className="text-lg opacity-90">Trade Timeout</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Admin Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our secure P2P USDT trading platform and start trading with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/listings">
                Browse Listings
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage

