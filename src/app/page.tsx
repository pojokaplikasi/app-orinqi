"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useAuth } from "@/components/providers/AuthProvider"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function Page() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/70 px-6 py-4 backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <span className="font-['STKaiti','KaiTi',serif] text-sm font-bold">命</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Orinqi</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it Works</Link>
          <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
        </div>
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 py-1.5 pl-1.5 pr-4 text-sm font-medium transition-colors hover:bg-card"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
                  {userData?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="max-w-[100px] truncate">{userData?.name || "User"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border/50 bg-card p-1 shadow-xl backdrop-blur-xl">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border/50 mb-1">
                      Signed in as<br/>
                      <strong className="text-foreground truncate block">{user.email}</strong>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sign In
            </Link>
          )}
          <Link href="/calculate-v2">
            <Button className="rounded-full bg-gradient-to-r from-primary to-[#F97316] px-6 shadow-[0_8px_20px_rgba(233,75,75,0.2)] transition-colors hover:shadow-[0_12px_25px_rgba(233,75,75,0.3)]">
              Calculate Now
            </Button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#F97316]/5 blur-[100px]" />
        
        <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              New Version 2.0 Available
            </div>
            <h1 className="text-5xl leading-[1.1] font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Discover Your <br />
              <span className="bg-gradient-to-r from-primary to-[#F97316] bg-clip-text text-transparent">Destiny Code</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Professional BaZi calculation with modern precision. Uncover the hidden patterns of your life, career, and relationships through the ancient wisdom of the Four Pillars of Destiny.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/calculate-v2">
                <Button size="lg" className="h-14 rounded-full bg-gradient-to-r from-primary to-[#F97316] px-8 text-base shadow-[0_10px_30px_rgba(233,75,75,0.25)] transition-colors hover:shadow-[0_15px_40px_rgba(233,75,75,0.35)]">
                  Start Free Analysis
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 rounded-full border-border/50 bg-card/50 px-8 text-base backdrop-blur-md transition-colors hover:bg-card">
                View Sample Report
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
                ))}
              </div>
              <p>Trusted by <strong className="text-foreground">10,000+</strong> users worldwide</p>
            </div>
          </div>
          
          {/* Hero Illustration Area */}
          <div className="relative hidden h-[600px] w-full lg:block">
            <div className="absolute inset-0 rounded-[40px] border border-white/20 bg-gradient-to-br from-card/80 to-card/20 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-3xl">
              {/* Abstract BaZi Representation */}
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[24px] border border-border/50 bg-background/50">
                <svg viewBox="0 0 400 400" className="h-full w-full max-h-[500px] max-w-[500px]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Background Rings */}
                  <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" strokeDasharray="4 4" />
                  <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/30" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/40" strokeDasharray="2 4" />
                  
                  {/* Center Core */}
                  <circle cx="200" cy="200" r="40" fill="url(#hero-grad)" filter="url(#glow)" className="animate-pulse" />
                  <circle cx="200" cy="200" r="30" fill="currentColor" className="text-background" />
                  <text x="200" y="208" textAnchor="middle" className="fill-primary font-['STKaiti'] text-2xl font-bold">命</text>

                  {/* Orbiting Elements */}
                  <g className="animate-[spin_30s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
                    {/* Wood */}
                    <g transform="translate(200, 40)">
                      <circle cx="0" cy="0" r="18" fill="#4CAF50" filter="url(#glow)" opacity="0.8" />
                      <circle cx="0" cy="0" r="14" fill="#1a1a1a" />
                      <text x="0" y="5" textAnchor="middle" fill="#4CAF50" className="font-['STKaiti'] text-sm">木</text>
                    </g>
                    {/* Fire */}
                    <g transform="translate(352, 150)">
                      <circle cx="0" cy="0" r="18" fill="#f44336" filter="url(#glow)" opacity="0.8" />
                      <circle cx="0" cy="0" r="14" fill="#1a1a1a" />
                      <text x="0" y="5" textAnchor="middle" fill="#f44336" className="font-['STKaiti'] text-sm">火</text>
                    </g>
                    {/* Earth */}
                    <g transform="translate(294, 329)">
                      <circle cx="0" cy="0" r="18" fill="#bc8a60" filter="url(#glow)" opacity="0.8" />
                      <circle cx="0" cy="0" r="14" fill="#1a1a1a" />
                      <text x="0" y="5" textAnchor="middle" fill="#bc8a60" className="font-['STKaiti'] text-sm">土</text>
                    </g>
                    {/* Metal */}
                    <g transform="translate(106, 329)">
                      <circle cx="0" cy="0" r="18" fill="#96a6ae" filter="url(#glow)" opacity="0.8" />
                      <circle cx="0" cy="0" r="14" fill="#1a1a1a" />
                      <text x="0" y="5" textAnchor="middle" fill="#96a6ae" className="font-['STKaiti'] text-sm">金</text>
                    </g>
                    {/* Water */}
                    <g transform="translate(48, 150)">
                      <circle cx="0" cy="0" r="18" fill="#2196F3" filter="url(#glow)" opacity="0.8" />
                      <circle cx="0" cy="0" r="14" fill="#1a1a1a" />
                      <text x="0" y="5" textAnchor="middle" fill="#2196F3" className="font-['STKaiti'] text-sm">水</text>
                    </g>
                    
                    {/* Connecting Lines (Pentagram) */}
                    <path d="M200 40 L294 329 L48 150 L352 150 L106 329 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted Highlights ── */}
      <section className="border-y border-border/50 bg-card/30 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { 
                title: "High Precision", 
                desc: "Solar time calculation", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> 
              },
              { 
                title: "Traditional Roots", 
                desc: "Authentic algorithms", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> 
              },
              { 
                title: "Deep Analysis", 
                desc: "10 Gods & Life Stages", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> 
              },
              { 
                title: "Privacy First", 
                desc: "No data stored", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {item.icon}
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Everything You Need for Complete Analysis</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our calculator provides professional-grade tools wrapped in a beautiful, easy-to-understand interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                title: "Four Pillars", 
                desc: "Accurate calculation of Year, Month, Day, and Hour pillars based on true solar time.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="4" width="3" height="16" rx="1"/><rect x="8" y="4" width="3" height="16" rx="1"/><rect x="13" y="4" width="3" height="16" rx="1"/><rect x="18" y="4" width="3" height="16" rx="1"/></svg> 
              },
              { 
                title: "Ten Gods Analysis", 
                desc: "Detailed breakdown of the 10 Gods relationships and their strengths in your chart.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg> 
              },
              { 
                title: "Luck Pillars (Da Yun)", 
                desc: "Explore your 10-year luck cycles and how they interact with your natal chart.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m2 12 20 0"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> 
              },
              { 
                title: "Element Balance", 
                desc: "Visual radar charts showing the distribution of the Five Elements in your destiny.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 22 8.5 18.2 22 5.8 22 2 8.5"/><polygon points="12 6 18 10.5 15.5 18 8.5 18 6 10.5"/><line x1="12" y1="22" x2="12" y2="2"/><line x1="22" y1="8.5" x2="2" y2="8.5"/></svg> 
              },
              { 
                title: "Hidden Combinations", 
                desc: "Advanced detection of clashes, harms, punishments, and hidden combinations.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> 
              },
              { 
                title: "Lucky Stars", 
                desc: "Identify Nobleman, Peach Blossom, Sky Horse, and other significant symbolic stars.", 
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> 
              },
            ].map((feature, i) => (
              <div key={i} className="group rounded-[24px] border border-border/50 bg-card/50 p-8 transition-colors duration-300 hover:bg-card hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="bg-card/30 py-32">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get your complete destiny chart in three simple steps.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 hidden h-0.5 w-full bg-border md:block" />
            
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { step: "01", title: "Enter Details", desc: "Input your birth date, time, and location." },
                { step: "02", title: "Generate Chart", desc: "Our algorithm calculates your exact pillars." },
                { step: "03", title: "Explore Destiny", desc: "Analyze your elements, luck cycles, and stars." },
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full border-8 border-background bg-card shadow-sm">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "What is BaZi?", a: "BaZi, also known as the Four Pillars of Destiny, is a traditional Chinese astrological concept that maps a person's destiny based on their birth year, month, day, and hour." },
              { q: "Is the calculation accurate?", a: "Yes. Our calculator uses precise astronomical algorithms to determine the exact solar terms and true local time, ensuring professional-grade accuracy." },
              { q: "Do I need to know my exact birth time?", a: "While an exact time provides the most accurate chart (including the Hour Pillar), you can still generate a partial chart using just your birth date." },
              { q: "Is my data stored?", a: "No. All calculations are performed instantly and your personal birth data is never stored on our servers, ensuring complete privacy." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-2">
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-[40px] bg-card px-6 py-20 text-center shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:px-12 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[#F97316]/5" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Ready to Decode Your Destiny?</h2>
              <p className="mb-10 text-lg text-muted-foreground">
                Join thousands of users who have discovered their life's blueprint. Start your journey of self-discovery today.
              </p>
              <Link href="/calculate-v2">
                <Button size="lg" className="h-16 rounded-full bg-gradient-to-r from-primary to-[#F97316] px-10 text-lg shadow-[0_10px_30px_rgba(233,75,75,0.25)] transition-colors hover:shadow-[0_15px_40px_rgba(233,75,75,0.35)]">
                  Calculate Your BaZi Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-card/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <span className="font-['STKaiti'] text-[10px] font-bold">命</span>
                </div>
                <span className="font-bold">Orinqi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional BaZi calculation with modern precision and elegant design.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Navigation</h4>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary">How it Works</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Legal</h4>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Orinqi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
