import { useState, useEffect } from 'react';
import { 
  Shield, TrendingUp, Users, Moon, Sun, Menu, X,
  Cpu, Lock, CheckCircle2, LogIn, ChevronDown, ArrowRight, Star
} from 'lucide-react';

export function Landing() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgClass = isDark 
    ? 'bg-black text-white' 
    : 'bg-white text-black';
  const cardBgClass = isDark 
    ? 'bg-slate-900/40 border border-slate-800/50 backdrop-blur-md' 
    : 'bg-slate-50/40 border border-slate-200/50 backdrop-blur-md';
  const textMutedClass = isDark ? 'text-slate-500' : 'text-slate-600';
  const dividerClass = isDark ? 'border-slate-800/30' : 'border-slate-200/30';

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-500`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }
        .animate-slideDown { animation: slideDown 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .cyber-line {
          position: relative;
        }
        .cyber-line::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          opacity: 0.3;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
        }
        .gradient-line {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          height: 1px;
        }
      `}</style>

      {/* Minimalist Navigation */}
      <nav className={`fixed w-full top-0 z-50 backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-white/80'} border-b ${dividerClass} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          {/* Logo - Ultra Minimal */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-6 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
            <span className="font-light tracking-widest text-sm">EXPLICIT</span>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center gap-12 text-xs font-light tracking-wide`}>
            <a href="#features" className={`${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>Features</a>
            <a href="#testimonials" className={`${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>Testimonials</a>
            <a href="#security" className={`${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors duration-200`}>Security</a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 transition-all ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className={`hidden sm:flex px-6 py-2 text-xs font-light tracking-wide border transition-all hover-lift
              ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'}`}>
              Access Platform
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${dividerClass} p-8 space-y-6 animate-slideDown`}>
            <a href="#features" className="block text-sm font-light">Features</a>
            <a href="#testimonials" className="block text-sm font-light">Testimonials</a>
            <a href="#security" className="block text-sm font-light">Security</a>
            <button className={`w-full px-6 py-2.5 text-xs font-light tracking-wide border transition-all
              ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-black/20 text-black hover:bg-black/5'}`}>
              Access Platform
            </button>
          </div>
        )}
      </nav>

      {/* Ultra-Minimal Hero Section */}
      <section className="relative w-full pt-32 pb-32 px-8 overflow-hidden">
        {/* Subtle Grid */}
        <div className={`absolute inset-0 -z-10 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.02]'}`} 
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Hero Text */}
          <div className="text-center mb-20 animate-slideDown" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-7xl md:text-8xl font-light tracking-tighter mb-8 leading-tight">
              Trade<br />
              <span className={`${isDark ? 'text-white/40' : 'text-black/40'}`}>at scale.</span>
            </h1>
            <p className={`text-lg font-light tracking-wide ${textMutedClass} max-w-2xl mx-auto mb-12 leading-relaxed`}>
              Institutional infrastructure for professional traders. AI-powered execution, <br />real-time analytics, and proven signal sources.
            </p>
            
            {/* CTA - Minimal */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <button className={`group px-8 py-3 text-sm font-light tracking-wide transition-all border-2 flex items-center gap-2 hover-lift
                ${isDark ? 'border-white text-white hover:bg-white/5' : 'border-black text-black hover:bg-black/5'}`}>
                Start Trading
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className={`px-8 py-3 text-sm font-light tracking-wide transition-all hover-lift
                ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-black'}`}>
                View Demo → 
              </button>
            </div>
          </div>

          {/* Hero Image Placeholder - Cyber Visual */}
          <div className={`mt-24 rounded-lg overflow-hidden border ${dividerClass} hover-lift`}>
            <div className={`w-full aspect-video ${isDark ? 'bg-gradient-to-br from-slate-900/50 to-black' : 'bg-gradient-to-br from-slate-100 to-slate-50'} 
              flex items-center justify-center relative overflow-hidden`}>
              {/* Cyber Grid Effect */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Placeholder text for image */}
              <div className="text-center z-10">
                <div className={`text-4xl font-light mb-4 ${isDark ? 'text-white/20' : 'text-black/20'}`}>∿ ∿ ∿</div>
                <p className={`text-sm font-light ${textMutedClass}`}>Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Features Section - Minimal Grid */}
      <section id="features" className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">The Platform</h2>
            <p className={`text-sm font-light ${textMutedClass} tracking-wide`}>Purpose-built for institutions and professional traders</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Cpu,
                title: 'AI Trading Engine',
                desc: 'Neural networks process real-time market data for autonomous execution with precision timing.',
              },
              {
                icon: TrendingUp,
                title: 'Signal Intelligence',
                desc: 'Access curated signals from institutional providers with 85%+ accuracy rates.',
              },
              {
                icon: Users,
                title: 'Copy Trading',
                desc: 'Mirror elite trader strategies with advanced position sizing and risk controls.',
              },
              {
                icon: Lock,
                title: 'Institutional Grade',
                desc: 'SOC 2 certified, regulatory compliant, AES-256 encryption across all operations.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`p-8 border rounded-lg ${cardBgClass} hover-lift group`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-8 h-8 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-black/40 group-hover:text-black/60'} mb-6 transition-colors`}>
                    <Icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-light tracking-wide mb-3">{feature.title}</h3>
                  <p className={`text-sm font-light leading-relaxed ${textMutedClass}`}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Stats Section - Ultra Minimal */}
      <section className="w-full py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '$2.5T', label: 'Annual Volume' },
              { value: '2.5M+', label: 'Active Traders' },
              { value: '99.99%', label: 'Uptime SLA' },
              { value: '24/7', label: 'Global Support' },
            ].map((stat, i) => (
              <div key={i} className="animate-fadeIn" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`text-3xl font-light tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-black'}`}>{stat.value}</div>
                <div className={`text-xs font-light tracking-widest ${textMutedClass}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Trusted by Leaders</h2>
            <p className={`text-sm font-light ${textMutedClass} tracking-wide`}>Testimonials from institutional traders and hedge funds</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The execution speed and accuracy is unmatched. We've increased our daily trading volume by 300%.",
                author: 'Marcus Chen',
                role: 'CTO, Sigma Hedge Fund',
                stars: 5,
              },
              {
                quote: "Finally, a platform built for professionals. The signal integration alone has improved our ROI by 45%.",
                author: 'Elena Rodriguez',
                role: 'Head of Trading, Vertex Capital',
                stars: 5,
              },
              {
                quote: "Infrastructure this solid is rare. 99.99% uptime is not a promise—it's a guarantee.",
                author: 'James Mitchell',
                role: 'Portfolio Manager, Titan Investments',
                stars: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className={`p-8 border rounded-lg ${cardBgClass} hover-lift`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className={`text-sm font-light leading-relaxed mb-8 ${textMutedClass}`}>"{testimonial.quote}"</p>

                {/* Author */}
                <div className="border-t border-slate-800/20 pt-6">
                  <p className="text-sm font-light">{testimonial.author}</p>
                  <p className={`text-xs font-light ${textMutedClass} mt-1`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Security Section */}
      <section id="security" className="w-full py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light tracking-tight mb-8">Enterprise Security</h2>
              <div className="space-y-6">
                {[
                  { title: 'AES 256-bit Encryption', desc: 'Military-grade data protection' },
                  { title: 'FINRA & SEC Compliant', desc: 'Full regulatory oversight' },
                  { title: 'SOC 2 Type II', desc: 'Annual third-party audited' },
                  { title: 'Cold Storage', desc: 'Offline asset protection' },
                ].map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-light mb-1">{item.title}</p>
                    <p className={`text-xs font-light ${textMutedClass}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Image Placeholder */}
            <div className={`rounded-lg border ${dividerClass} overflow-hidden hover-lift`}>
              <div className={`w-full aspect-square ${isDark ? 'bg-gradient-to-br from-slate-900/50 to-black' : 'bg-gradient-to-br from-slate-100 to-slate-50'} 
                flex items-center justify-center relative`}>
                {/* Lock Icon Large */}
                <Lock className={`w-32 h-32 ${isDark ? 'text-white/20' : 'text-black/20'}`} strokeWidth={0.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Final CTA */}
      <section className="w-full py-24 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-light tracking-tighter mb-8">Ready to trade<br />at scale?</h2>
          <p className={`text-base font-light ${textMutedClass} mb-12 tracking-wide`}>Access institutional-grade infrastructure in minutes</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-10 py-3 text-sm font-light tracking-wide border-2 transition-all hover-lift
              ${isDark ? 'border-white text-white hover:bg-white/5' : 'border-black text-black hover:bg-black/5'}`}>
              Start Free Trial
            </button>
            <button className={`px-10 py-3 text-sm font-light tracking-wide transition-all hover-lift
              ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-600 hover:text-black'}`}>
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className={`w-full h-px ${dividerClass}`}></div>

      {/* Footer */}
      <footer className={`w-full py-16 px-8 ${isDark ? 'bg-slate-950/50' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { title: 'Product', links: ['Features', 'Security', 'Pricing', 'API Docs'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'Compliance', 'Disclosures'] },
              { title: 'Social', links: ['Twitter', 'Discord', 'LinkedIn', 'GitHub'] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-xs font-light tracking-widest mb-4 opacity-60">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={`border-t ${dividerClass} pt-8 flex flex-col md:flex-row items-center justify-between`}>
            <p className={`text-xs font-light ${textMutedClass}`}>© 2025 Explicit Market. All rights reserved.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <a href="#" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Security</a>
              <a href="#" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Compliance</a>
              <a href="#" className={`text-xs font-light ${textMutedClass} hover:${isDark ? 'text-white' : 'text-black'} transition-colors`}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
