"use client"
import { usePaymentFormContext } from '@/contexts/payment-form';
import { paymentSchema } from '@/schemas';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BankCardInformation() {
  const form = usePaymentFormContext()

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
      <div className="p-4 sm:p-6 md:p-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Détails de carte bancaire</h3>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 sm:p-6">
          <Elements stripe={stripePromise}>
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </Elements>
        </div>
      </div>
    </div>
  );
}