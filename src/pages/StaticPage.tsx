/**
 * Generic static page component — used for About, Contact, FAQ, Shipping, etc.
 * Each page is defined by the path and renders appropriate content.
 */
import { useLocation, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

const pages: Record<string, { title: string; content: React.FC }> = {
  '/about': {
    title: 'About MAISON',
    content: () => (
      <div className="max-w-3xl mx-auto space-y-10">
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            MAISON was founded with a singular vision: to bring the elegance of Parisian fashion houses to the modern,
            globally-connected wardrobe. We believe that timeless style isn't exclusive — it's an attitude, a way of
            choosing quality over quantity and craft over trend.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Our Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every piece in our collection is selected for its craftsmanship, fabric quality, and longevity. We work
            with artisans across Europe and beyond who share our commitment to slow fashion — creating garments meant
            to be worn for years, not seasons.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 pt-4">
          {[
            { label: 'Founded', value: '2020' },
            { label: 'Countries', value: '24+' },
            { label: 'Artisan Partners', value: '40+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card/80 rounded-lg border border-primary/15">
              <p className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold mb-4">Sustainability</h2>
          <p className="text-muted-foreground leading-relaxed">
            We're committed to reducing our environmental footprint — using natural fibres, minimal packaging, and
            carbon-offset shipping on all orders. Learn more on our{' '}
            <Link to="/sustainability" className="text-primary hover:underline">sustainability page</Link>.
          </p>
        </div>
      </div>
    ),
  },
  '/contact': {
    title: 'Contact Us',
    content: () => {
      const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
      const [sending, setSending] = useState(false);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        await new Promise((r) => setTimeout(r, 1000));
        toast.success('Message sent! We\'ll reply within 24 hours.');
        setForm({ name: '', email: '', subject: '', message: '' });
        setSending(false);
      };

      return (
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed">
                We'd love to hear from you. Fill in the form and our team will respond within 24 hours.
              </p>
            </div>
            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Our Address', value: '12 Rue du Faubourg, Paris, France 75008' },
                { icon: Mail, label: 'Email', value: 'hello@maisonstore.com' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 234 5678' },
                { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–6pm CET' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-card/80 rounded-xl border border-primary/15 shadow-soft">
            {[
              { name: 'name', label: 'Full Name', type: 'text' },
              { name: 'email', label: 'Email Address', type: 'email' },
              { name: 'subject', label: 'Subject', type: 'text' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md hover:shadow-card disabled:opacity-60 transition-smooth"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      );
    },
  },
  '/shipping': {
    title: 'Shipping & Returns',
    content: () => (
      <div className="max-w-3xl mx-auto space-y-10">
        {[
          {
            title: 'Shipping',
            items: [
              ['Standard Shipping (5–7 days)', '$15 · Free on orders over $150'],
              ['Express Shipping (2–3 days)', '$25'],
              ['Overnight Shipping', '$45'],
              ['International Shipping', 'Rates calculated at checkout'],
            ],
          },
          {
            title: 'Returns',
            items: [
              ['Return Window', '30 days from delivery'],
              ['Condition', 'Unworn, unwashed, with original tags'],
              ['Process', 'Initiate via your account or email us'],
              ['Refund Timeline', '5–7 business days after we receive the item'],
            ],
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="rounded-lg border border-primary/15 overflow-hidden">
              {section.items.map(([label, value], i) => (
                <div key={i} className={`flex justify-between px-5 py-4 text-sm ${i % 2 === 0 ? 'bg-card/60' : 'bg-card/30'}`}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          Questions? <Link to="/contact" className="text-primary hover:underline">Contact our team</Link>.
        </p>
      </div>
    ),
  },
  '/faq': {
    title: 'Frequently Asked Questions',
    content: () => {
      const faqs = [
        { q: 'What sizes do you carry?', a: 'We carry sizes XS–XXL for clothing, with numeric sizing for trousers and footwear. See our Size Guide for detailed measurements.' },
        { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. International shipping rates and estimated delivery times are shown at checkout.' },
        { q: 'Can I change or cancel my order?', a: 'Orders can be cancelled within 1 hour of placement. After that, please contact us and we\'ll do our best to help.' },
        { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number by email. You can also check your order history in your account.' },
        { q: 'Are your products sustainable?', a: 'We\'re committed to sustainability. All our natural-fibre products are certified, and we use recycled packaging. See our Sustainability page for more.' },
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay. All transactions are secured with SSL encryption.' },
      ];
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group p-5 bg-card/80 rounded-lg border border-primary/15 cursor-pointer">
              <summary className="font-medium text-foreground list-none flex justify-between items-center">
                {faq.q}
                <span className="ml-4 text-primary text-lg group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      );
    },
  },
  '/sustainability': {
    title: 'Sustainability',
    content: () => (
      <div className="max-w-3xl mx-auto space-y-10">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Sustainability isn't a marketing strategy for us — it's a founding principle. Here's what we do.
        </p>
        {[
          { title: '🌿 Natural & Recycled Materials', body: 'Over 80% of our collection uses certified natural fibres — organic cotton, European linen, Grade-A cashmere, and vegetable-tanned leather. We\'re moving toward 100% by 2027.' },
          { title: '📦 Minimal Packaging', body: 'All our packaging is recycled or recyclable. We\'ve eliminated single-use plastics from our supply chain and ship everything in tissue and kraft paper.' },
          { title: '✈️ Carbon Offset Shipping', body: 'We offset 100% of the carbon emissions from all domestic and international shipments through certified reforestation projects.' },
          { title: '🤝 Ethical Partners', body: 'Every factory we work with is audited for fair wages, safe working conditions, and environmental compliance. We publish our supplier list annually.' },
        ].map((item) => (
          <div key={item.title} className="p-6 bg-card/80 rounded-lg border border-primary/15">
            <h3 className="font-display text-lg font-semibold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{item.body}</p>
          </div>
        ))}
      </div>
    ),
  },
  '/size-guide': {
    title: 'Size Guide',
    content: () => (
      <div className="max-w-3xl mx-auto space-y-10">
        <p className="text-muted-foreground">All measurements are in centimetres unless stated otherwise.</p>
        {[
          {
            title: 'Women\'s Clothing',
            headers: ['Size', 'Bust', 'Waist', 'Hip'],
            rows: [['XS', '80–84', '62–66', '88–92'], ['S', '84–88', '66–70', '92–96'], ['M', '88–92', '70–74', '96–100'], ['L', '92–96', '74–78', '100–104'], ['XL', '96–102', '78–84', '104–110']],
          },
          {
            title: 'Men\'s Clothing',
            headers: ['Size', 'Chest', 'Waist', 'Shoulder'],
            rows: [['S', '88–92', '74–78', '43–44'], ['M', '92–96', '78–82', '44–46'], ['L', '96–102', '82–86', '46–48'], ['XL', '102–108', '86–92', '48–50'], ['XXL', '108–116', '92–98', '50–52']],
          },
        ].map((table) => (
          <div key={table.title}>
            <h2 className="font-display text-xl font-semibold mb-4">{table.title}</h2>
            <div className="rounded-lg border border-primary/15 overflow-hidden text-sm">
              <div className="grid grid-cols-4 bg-primary/10 font-medium text-foreground">
                {table.headers.map((h) => <div key={h} className="px-4 py-3">{h}</div>)}
              </div>
              {table.rows.map((row, i) => (
                <div key={i} className={`grid grid-cols-4 ${i % 2 === 0 ? 'bg-card/60' : 'bg-card/30'}`}>
                  {row.map((cell) => <div key={cell} className="px-4 py-3 text-muted-foreground">{cell}</div>)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  '/privacy': {
    title: 'Privacy Policy',
    content: () => (
      <div className="max-w-3xl mx-auto prose prose-sm text-muted-foreground space-y-6">
        <p>This Privacy Policy describes how MAISON collects, uses, and protects your personal information.</p>
        {[
          { title: 'Information We Collect', body: 'We collect information you provide (name, email, address, payment details) and automatic data (browsing behaviour, device info) to operate our service.' },
          { title: 'How We Use It', body: 'To process orders, send order confirmations, personalise your experience, send marketing emails (only with your consent), and improve our services.' },
          { title: 'Data Sharing', body: 'We never sell your data. We share it only with our delivery partners and payment processors as necessary to fulfil your order.' },
          { title: 'Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us at privacy@maisonstore.com.' },
          { title: 'Cookies', body: 'We use essential cookies for functionality and optional analytics cookies (with your consent) to understand how our site is used.' },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
        <p className="text-xs">Last updated: May 2026</p>
      </div>
    ),
  },
  '/terms': {
    title: 'Terms of Service',
    content: () => (
      <div className="max-w-3xl mx-auto space-y-6 text-sm text-muted-foreground">
        <p>By using MAISON you agree to these Terms. Please read them carefully.</p>
        {[
          { title: 'Use of Service', body: 'MAISON is for personal, non-commercial use. You must be 18+ to purchase. You are responsible for maintaining the confidentiality of your account.' },
          { title: 'Orders & Payment', body: 'All orders are subject to acceptance and availability. Prices are in USD and subject to change. We reserve the right to cancel orders if a pricing error occurs.' },
          { title: 'Intellectual Property', body: 'All content on this site — text, images, logos — is owned by MAISON and may not be reproduced without permission.' },
          { title: 'Liability Limitation', body: 'MAISON is not liable for indirect or consequential damages. Our total liability is limited to the amount paid for the affected order.' },
          { title: 'Governing Law', body: 'These terms are governed by the laws of France. Any disputes will be resolved in the courts of Paris.' },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
        <p className="text-xs">Last updated: May 2026</p>
      </div>
    ),
  },
};

// Fallback for unknown static pages
const FallbackPage: React.FC<{ path: string }> = ({ path }) => (
  <div className="max-w-lg mx-auto text-center py-20">
    <p className="font-display text-4xl font-bold text-primary/20 mb-4">Coming Soon</p>
    <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
      {path.slice(1).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </h2>
    <p className="text-muted-foreground mb-8">This page is under construction.</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-3 gradient-accent text-primary-foreground text-sm font-medium rounded-md transition-smooth"
    >
      Back to Home
    </Link>
  </div>
);

const StaticPage = () => {
  const location = useLocation();
  const page = pages[location.pathname];

  const title = page?.title ?? location.pathname.slice(1).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const Content = page?.content ?? (() => <FallbackPage path={location.pathname} />);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <section className="py-12 lg:py-16 border-b border-primary/20 gradient-luxury-soft">
          <div className="container text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl lg:text-4xl font-semibold text-foreground"
            >
              {title}
            </motion.h1>
          </div>
        </section>
        <section className="py-12 lg:py-16">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Content />
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default StaticPage;
