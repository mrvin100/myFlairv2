import { Header, Footer } from "@/components/layout";
import { PaymentDetailsForm } from "@/components/shop/steps/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentStep() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto my-12 space-y-6">
        <h1 className="mt-8 font-medium ">Payment</h1>
        <p className="text-sm text-muted-foreground">
          Donate to our project 💖
        </p>
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Details de facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentDetailsForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
