import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { User, Package, Heart, LogOut, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

type Tab = 'profile' | 'orders' | 'wishlist';

const Account = () => {
  const { user, isAuthenticated, isLoading, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersApi.myOrders(),
    enabled: isAuthenticated,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        if (!form.firstName || !form.lastName) {
          toast.error('Please fill in all fields');
          return;
        }
        await register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        });
        toast.success('Account created successfully!');
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  // ─── Auth form (not logged in) ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 lg:pt-20">
          <div className="container py-16 lg:py-24 max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-card/80 rounded-xl border border-primary/15 shadow-card"
            >
              <h1 className="font-display text-2xl font-semibold text-center mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                {authMode === 'login'
                  ? 'Sign in to your MAISON account'
                  : 'Join MAISON for a personalised experience'}
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 pr-12 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md hover:shadow-card disabled:opacity-50 transition-smooth"
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : authMode === 'login'
                    ? 'Sign In'
                    : 'Create Account'}
                </button>
              </form>

              <p className="text-sm text-center text-muted-foreground mt-6">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-primary hover:underline font-medium"
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Or continue as a{' '}
                <Link to="/checkout" className="text-primary hover:underline">
                  guest
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ─── Authenticated account dashboard ──────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <div className="container py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-semibold text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user!.firstName}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <nav className="space-y-1 p-4 bg-card/70 rounded-lg border border-primary/15 shadow-soft">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-md text-sm font-medium transition-smooth ${
                      tab === t.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <t.icon size={18} />
                      {t.label}
                    </div>
                    <ChevronRight size={14} />
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              {tab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-card/80 rounded-lg border border-primary/15 shadow-soft"
                >
                  <h2 className="font-display text-xl font-semibold mb-6">Personal Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">First Name</p>
                      <p className="font-medium text-foreground">{user!.firstName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Name</p>
                      <p className="font-medium text-foreground">{user!.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                      <p className="font-medium text-foreground">{user!.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Type</p>
                      <p className="font-medium text-foreground capitalize">{user!.role}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-xl font-semibold mb-6">Order History</h2>
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : !orders || orders.length === 0 ? (
                    <div className="text-center py-16 p-6 bg-card/80 rounded-lg border border-primary/15">
                      <Package size={40} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md transition-smooth"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-5 bg-card/80 rounded-lg border border-primary/15 shadow-soft"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'long', day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-primary/10 text-primary'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                              <p className="font-semibold text-foreground mt-2">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.productName} × {item.quantity}
                                  <span className="ml-2 text-xs opacity-60">({item.selectedSize})</span>
                                </span>
                                <span className="text-foreground">${item.lineTotal.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === 'wishlist' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display text-xl font-semibold mb-6">My Wishlist</h2>
                  <div className="text-center py-16 p-6 bg-card/80 rounded-lg border border-primary/15">
                    <Heart size={40} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Sign in and use the ♡ button on products to save them here.
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md transition-smooth"
                    >
                      Browse Products
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Account;
