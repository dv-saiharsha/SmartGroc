import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">support@smartgrocer.cloud</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Contact