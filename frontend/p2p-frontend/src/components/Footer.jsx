import { Link } from 'react-router-dom'
import { DollarSign, MessageCircle, Shield, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">
                P2P USDT Ethiopia
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Secure peer-to-peer USDT trading platform for Ethiopia. 
              Trade USDT for Ethiopian Birr with manual escrow protection.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary">
                  View Listings
                </Link>
              </li>
              <li>
                <Link to="/post-ad" className="text-sm text-muted-foreground hover:text-primary">
                  Post Trade Ad
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact Admin</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>@admin_telegram</span>
              </div>
              <p className="text-xs text-muted-foreground">
                For support, disputes, or account verification
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025 P2P USDT Ethiopia. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2 md:mt-0">
              Trade responsibly. Always verify counterparty details.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

