import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { QueryClient, QueryClientProvider } from 'react-query'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import CategoryProducts from './pages/CategoryProducts'
import Discover from './pages/Discover'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import TrackOrder from './pages/TrackOrder'
import Orders from './pages/Orders'
import Offers from './pages/Offers'
import SellerDashboard from './pages/SellerDashboard'
import Analytics from './pages/Analytics'
import Contact from './pages/Contact'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-background flex flex-col w-full">
                <Navbar />
                <main className="flex-1 w-full">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/category/:category" element={<CategoryProducts />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/track-order/:orderId" element={<TrackOrder />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/seller" element={<SellerDashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App