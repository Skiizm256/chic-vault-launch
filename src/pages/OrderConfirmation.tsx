import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { Order } from '@/lib/api';

interface LocationState {
  order: Order;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state?.order) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.order) return null;

  const { order } = state;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="container py-16 lg:py-24 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center"
          >
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-3">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Thank you for your purchase. A confirmation has been sent to{' '}
              <strong className="text-foreground">{order.email}</strong>.
            </p>

            {/* Order summary card */}
            <div className="text-left p-6 bg-card/80 rounded-xl border border-primary/15 shadow-card mb-8">
              <div className="flex items-center gap-3 mb-5">
                <Package size={20} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Order Number</p>
                  <p className="font-mono font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-5 border-b border-border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.productName} × {item.quantity}
                      <span className="ml-1.5 text-xs opacity-60">({item.selectedSize})</span>
                    </span>
                    <span className="font-medium text-foreground">${item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Shipping To</p>
                <p className="text-sm text-foreground">
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}<br />
                  {order.shippingInfo.address}, {order.shippingInfo.city} {order.shippingInfo.postalCode}<br />
                  {order.shippingInfo.country}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md shadow-card hover:shadow-hover transition-smooth"
              >
                <Home size={16} />
                Back to Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary/25 text-foreground text-sm font-medium rounded-md hover:bg-secondary transition-smooth"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default OrderConfirmation;
