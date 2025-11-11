import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Cart = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cart functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Cart