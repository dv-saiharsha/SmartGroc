import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">SmartGrocer</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your intelligent grocery management solution. Shop smart, manage inventory, and optimize your business.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-muted-foreground hover:text-foreground">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@smartgrocer.cloud</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon-Fri 9AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SmartGrocer Cloud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer