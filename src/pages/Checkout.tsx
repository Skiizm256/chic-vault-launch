import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Payment form (UI only — not real card data in this version)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  });

  const shipping = totalPrice >= 150 ? 0 : 15;
  const total = totalPrice + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (e.target.name === 'cardNumber') {
      val = val.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    if (e.target.name === 'expiry') {
      val = val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1 / $2').slice(0, 7);
    }
    if (e.target.name === 'cvv') {
      val = val.replace(/\D/g, '').slice(0, 4);
    }
    setPaymentData({ ...paymentData, [e.target.name]: val });
  };

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode', 'country'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in all required fields`);
        return;
      }
    }
    // Basic email check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
      toast.error('Please fill in all payment fields');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await ordersApi.place({
        email: formData.email,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone || undefined,
        },
        // Only pass last 4 digits — NEVER real card data to backend
        paymentInfo: {
          method: 'card',
          last4: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
        },
      });

      clearCart();
      navigate('/order-confirmation', { state: { order: response.order } });
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const inputClass =
    'w-full px-4 py-3 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth';

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="container py-8 lg:py-12">
          {/* Back link */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-smooth"
          >
            <ChevronLeft size={16} />
            Back to Cart
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {step > 1 ? <CheckCircle2 size={14} /> : '1'}
              </span>
              Shipping
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className={`flex items-center gap-2 text-sm font-medium ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                2
              </span>
              Payment
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Forms */}
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              {step === 1 ? (
                <form onSubmit={handleSubmitShipping} className="space-y-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Shipping Information
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                      >
                        <option value="">Select country</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="UG">Uganda</option>
                        <option value="NG">Nigeria</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="GH">Ghana</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 gradient-accent text-primary-foreground text-sm font-medium rounded-md hover:shadow-card transition-smooth"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Payment Details
                  </h2>

                  {/* Shipping summary */}
                  <div className="p-4 bg-secondary/50 rounded-lg text-sm">
                    <p className="text-muted-foreground mb-1">Shipping to</p>
                    <p className="text-foreground font-medium">
                      {formData.firstName} {formData.lastName} · {formData.address}, {formData.city} {formData.postalCode}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="p-5 bg-card/80 rounded-lg border border-primary/15 shadow-soft space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <CreditCard size={20} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Credit / Debit Card</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        placeholder="As shown on card"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentData.expiry}
                          onChange={handlePaymentChange}
                          placeholder="MM / YY"
                          maxLength={7}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength={4}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock size={14} />
                    <span>Your payment information is secure and encrypted (demo mode — no real charges)</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 bg-transparent text-foreground text-sm font-medium border border-border rounded-md hover:bg-secondary transition-smooth"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-6 py-4 gradient-accent text-primary-foreground text-sm font-medium rounded-md hover:shadow-card disabled:opacity-50 transition-smooth"
                    >
                      {isProcessing ? 'Processing...' : `Place Order · $${total.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="p-6 bg-card/90 rounded-lg border border-primary/15 shadow-card lg:sticky lg:top-24">
                <h2 className="font-display text-lg font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 pb-6 border-b border-border">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      className="flex gap-4"
                    >
                      <div className="w-16 aspect-[3/4] rounded bg-secondary overflow-hidden flex-shrink-0 ring-1 ring-primary/10">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: {item.selectedSize} · Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-2">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {totalPrice < 150 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(150 - totalPrice).toFixed(2)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between pt-6">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-semibold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Checkout;
