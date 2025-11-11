import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Offers = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Special Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Special offers coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Offers