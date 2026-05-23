import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

const logoSrc =
  'https://raw.githubusercontent.com/JudeGaringalo/Pawnect-assets/main/logo.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const goToLogin = () => navigate('/login');

  const navItems = [
    { label: 'Product', href: '#product' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Community', href: '#community' },
    { label: 'Developers', href: '#developers' },
  ];

  const reports = [
    {
      status: 'Lost',
      statusClass: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
      name: 'Luna',
      meta: 'Golden Retriever · Quezon City',
      time: '12 min ago',
      note: 'Last seen near Barangay Hall.',
    },
    {
      status: 'Found',
      statusClass: 'bg-sky-500/10 text-sky-600 border border-sky-500/20',
      name: 'Mochi',
      meta: 'White Cat · Pasig',
      time: '28 min ago',
      note: 'Safe and currently with finder.',
    },
    {
      status: 'Reunited',
      statusClass: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      name: 'Bella',
      meta: 'Aspin · Makati',
      time: '2 hrs ago',
      note: 'Owner confirmed and picked up.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Report a case',
      copy: 'Share a lost or found pet report with photo, location, and the key details people need to help.',
    },
    {
      number: '02',
      title: 'Search nearby',
      copy: 'Browse reports through a clean feed and a map-based view to quickly spot likely matches nearby.',
    },
    {
      number: '03',
      title: 'Reconnect faster',
      copy: 'Use comments, reactions, and status updates to coordinate sightings and reunite pets with their families.',
    },
  ];

  const features = [
    {
      label: 'F.01',
      title: 'Smart search',
      copy: 'Search by pet name, breed, color, status, or area.',
    },
    {
      label: 'F.02',
      title: 'Map-based discovery',
      copy: 'See reports pinned on a map for faster local matching.',
    },
    {
      label: 'F.03',
      title: 'Community updates',
      copy: 'Comment on reports and share helpful sightings.',
    },
    {
      label: 'F.04',
      title: 'Relevant notifications',
      copy: 'Stay updated when reports change or a match appears nearby.',
    },
    {
      label: 'F.05',
      title: 'Admin moderation',
      copy: 'Flagged or duplicate reports can be reviewed cleanly.',
    },
    {
      label: 'F.06',
      title: 'Reunited tracking',
      copy: 'Mark successful reunions and show community impact.',
    },
  ];

  const productHighlights = [
    { label: 'Searchable reports' },
    { label: 'Location pins' },
    { label: 'Status tracking' },
    { label: 'Community alerts' },
  ];

  const reunitedStories = [
    {
      name: 'Luna',
      location: 'Quezon City',
      time: 'Reunited in 2 hours',
      story:
        'A nearby resident recognized Luna from the report and shared the location immediately.',
      image:
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&h=700&fit=crop',
    },
    {
      name: 'Mochi',
      location: 'Pasig',
      time: 'Reunited in 5 hours',
      story:
        'A found-cat post helped the owner connect with the finder and confirm the match quickly.',
      image:
        'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=900&h=700&fit=crop',
    },
    {
      name: 'Bella',
      location: 'Makati',
      time: 'Reunited in 1 day',
      story:
        'Location updates and community comments helped narrow the search area until Bella was found.',
      image:
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&h=700&fit=crop',
    },
  ];

  const developers = [
    { name: 'Maria Santos', role: 'Project Lead' },
    { name: 'Juan Dela Cruz', role: 'Frontend Developer' },
    { name: 'Sofia Reyes', role: 'UI/UX Designer' },
    { name: 'Miguel Torres', role: 'Backend Developer' },
    { name: 'Ana Castillo', role: 'QA Specialist' },
  ];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  // Framer Motion Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 40, damping: 12 } },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#ff6b35] selection:text-white font-sans">
      
      {/* NAV */}
      <nav className="fixed left-0 right-0 top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3 font-medium text-slate-900">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logoSrc} alt="Pawnect logo" className="h-8 w-auto object-contain" />
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-sm tracking-wide">Hello@pawnect.ph</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item, i) => (
              <div key={item.label} className="flex items-center gap-8">
                <a href={item.href} className="text-sm font-medium tracking-wide text-slate-600 transition-colors hover:text-slate-900">
                  {item.label}
                </a>
                {i < navItems.length - 1 && <span className="h-1 w-1 rounded-full bg-slate-300" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={goToLogin} className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 md:block">
              Log in
            </button>
            <button onClick={goToLogin} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium tracking-wide text-slate-900 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-50 active:scale-95">
              Get it Now — It's Free
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#e6e8e9] px-6 py-16 md:px-16 lg:py-20 shadow-sm">
            
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />

            <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
              
              {/* LEFT CONTENT */}
              <div className="flex flex-col items-start lg:pr-8">
                <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg">
                    <span className="text-xl font-serif leading-none italic">+</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium leading-tight text-slate-900">12k+ Cases</h3>
                    <p className="text-sm font-normal text-slate-600 underline decoration-slate-400 underline-offset-4 cursor-pointer hover:text-black">
                      Read Our <span className="font-medium text-black">Success Stories</span>
                    </p>
                  </div>
                </motion.div>

                <motion.h1 initial="hidden" animate="show" variants={fadeUp} className="relative font-serif text-[6rem] font-medium leading-[0.85] tracking-tight text-slate-900 md:text-[8rem] lg:text-[10rem]">
                  Paw<span className="absolute -right-10 top-0 font-sans text-[3rem] font-normal md:-right-14 md:text-[4rem] lg:-right-16 lg:text-[5rem]">+</span>
                </motion.h1>

                <div className="my-8 h-[1px] w-full max-w-md bg-slate-300/80" />

                <motion.p initial="hidden" animate="show" variants={fadeUp} className="max-w-md text-xl font-normal leading-relaxed text-slate-700">
                  Drive Pet Recovery, And Harness Local Community Networks — Up To 50x Faster.
                </motion.p>

                <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-8 flex items-center gap-5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white shadow-sm">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-center gap-5">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Loved the performance</p>
                      <p className="text-sm font-normal text-slate-500">100% Satisfied</p>
                    </div>
                    <div className="text-slate-300 font-light text-xl">/</div>
                    <div className="text-sm font-medium text-slate-900">
                      ★ 4.9
                    </div>
                  </div>
                </motion.div>

                <div className="my-8 h-[1px] w-full max-w-md bg-slate-300/80" />

                <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-wrap items-center gap-6">
                  <button onClick={goToLogin} className="flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 active:scale-95">
                    Get Started — It's Free
                  </button>
                  <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="group flex items-center gap-2 text-sm font-medium text-slate-900 transition-opacity hover:opacity-70">
                    How it works <span className="transition-transform group-hover:translate-x-1">—</span>
                  </button>
                </motion.div>
              </div>

              {/* RIGHT CONTENT */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative flex h-[550px] w-full items-end justify-center rounded-[2rem] bg-gradient-to-br from-[#ff6b35] to-[#f7c59f] p-4 lg:h-[700px]">
                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80" alt="Dog" className="absolute bottom-0 w-[85%] object-contain" style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.3))' }} />

                <motion.button animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute left-[-1.5rem] top-1/2 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl md:left-[-2.5rem]">
                  <span className="font-serif text-lg italic tracking-widest text-black">Play</span>
                </motion.button>

                <div className="absolute left-[-2rem] top-[15%] flex flex-col gap-3 md:left-[-4rem]">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="flex items-center gap-3 rounded-full border border-white/50 bg-white/60 px-5 py-3 shadow-xl backdrop-blur-xl">
                    <div className="h-2 w-2 rounded-full bg-[#ff6b35]"></div>
                    <span className="text-sm font-medium text-slate-900">Is this the missing dog?</span>
                  </motion.div>
                  <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="ml-8 flex items-center gap-3 rounded-full border border-white/50 bg-white/60 px-5 py-3 shadow-xl backdrop-blur-xl">
                    <div className="h-2 w-2 rounded-full bg-[#3b82f6]"></div>
                    <span className="text-sm font-medium text-slate-900">Yes! That's Luna!</span>
                  </motion.div>
                </div>

                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute right-[-1rem] top-[10%] w-[180px] rounded-[1.5rem] border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-2xl md:right-[-2rem]">
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-slate-800">— UP TO</p>
                  <h4 className="text-5xl font-medium tracking-tighter text-slate-900">80%</h4>
                  <p className="mt-2 text-xs font-normal leading-tight text-slate-800">Faster reunions this week</p>
                </motion.div>

                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-[10%] right-[-1.5rem] flex w-[280px] items-center gap-4 rounded-[1.5rem] border border-white/40 bg-white/40 p-4 shadow-2xl backdrop-blur-2xl md:right-[-3rem]">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-inner">
                     <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop" alt="Luna" className="h-full w-full rounded-lg object-cover" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium leading-tight text-slate-900">Lost Pet Report<br/>Luna</h4>
                    <p className="mt-1 text-xl font-medium tracking-tight text-slate-900">Reward</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-900 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-900" /> Confirmed
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* LOGOS STRIP */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center justify-center gap-x-16 gap-y-6 px-6 text-slate-400 md:justify-between">
          <span className="text-xl font-medium tracking-tighter text-slate-800">Rakuten</span>
          <span className="flex items-center gap-2 text-xl font-medium tracking-tighter text-slate-800"><div className="h-5 w-5 rotate-45 rounded-full border-2 border-slate-800 border-r-transparent"></div> NCR</span>
          <span className="text-xl font-medium tracking-tighter text-slate-800">monday.com</span>
          <span className="font-serif text-2xl font-medium italic tracking-tighter text-slate-800">Disney</span>
          <span className="flex items-center gap-2 text-xl font-medium tracking-tighter text-slate-800"><div className="h-5 w-5 bg-slate-800"></div> Dropbox</span>
        </motion.div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white px-6 py-20 shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:px-16 lg:py-24">
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#ff6b35]">How it works</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Built around the way<br />communities actually help.
              </h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <motion.div key={step.title} variants={staggerItem} className="group rounded-[2rem] border border-slate-100 bg-[#fafafa] p-10 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div className="mb-6 font-serif text-5xl font-medium text-slate-200 transition-colors group-hover:text-[#ff6b35]">
                    {step.number}
                  </div>
                  <h3 className="mb-4 text-xl font-medium tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <div className="mb-4 h-[1px] w-12 bg-slate-200 transition-all group-hover:w-24 group-hover:bg-[#ff6b35]" />
                  <p className="text-base font-normal leading-relaxed text-slate-500">
                    {step.copy}
                  </p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. PRODUCT */}
      <section id="product" className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] px-6 py-20 text-white md:px-16 lg:py-24">
            
            <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#ff6b35]/10 blur-[150px]" />

            <div className="relative z-10 grid items-center gap-20 lg:grid-cols-[1fr_1.2fr]">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#ff6b35]">Product Features</p>
                <h2 className="font-serif text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
                  Search, map, comment, & track.
                </h2>
                <div className="my-8 h-[1px] w-full max-w-sm bg-white/10" />
                <p className="text-lg font-normal leading-relaxed text-slate-400">
                  Pawnect turns scattered posts into structured pet recovery cases with clearer locations, real updates, and practical moderation.
                </p>

                <div className="mt-12 flex flex-wrap gap-4">
                  {productHighlights.map(({ label }) => (
                    <div key={label} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b35]" />
                      <span className="text-sm font-medium text-slate-200">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="relative">
                <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                  
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">Map intelligence</p>
                      <h3 className="font-serif text-3xl font-medium tracking-tight">Nearby cases</h3>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium tracking-wide backdrop-blur-sm">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b35]" />
                      Live
                    </div>
                  </div>

                  <div className="relative h-80 overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
                    <div className="absolute left-[28%] top-[38%] h-5 w-5 rounded-full bg-[#ff6b35] ring-8 ring-[#ff6b35]/30" />
                    <div className="absolute left-[68%] top-[46%] h-5 w-5 rounded-full bg-amber-500 ring-8 ring-amber-500/30" />
                    <div className="absolute left-[46%] top-[70%] h-5 w-5 rounded-full bg-rose-500 ring-8 ring-rose-500/30 animate-pulse" />

                    <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-black/60 p-5 backdrop-blur-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="mb-2 inline-flex rounded-md border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-rose-300">
                            Lost
                          </span>
                          <h4 className="mb-1 text-lg font-medium leading-none tracking-tight">
                            Luna · Golden Retriever
                          </h4>
                          <p className="text-xs font-normal text-slate-400">
                            Last seen near Barangay Hall, Quezon City
                          </p>
                        </div>
                        <button onClick={goToLogin} className="rounded-full bg-white px-6 py-3 text-xs font-medium text-black transition-all hover:scale-105 active:scale-95">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Features Grid */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={staggerItem} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10">
                  <div className="mb-6 text-sm font-medium tracking-widest text-[#ff6b35]">
                    {feature.label}
                  </div>
                  <h3 className="mb-3 text-lg font-medium tracking-tight text-white">{feature.title}</h3>
                  <p className="text-sm font-normal leading-relaxed text-slate-400">{feature.copy}</p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. COMMUNITY */}
      <section id="community" className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="rounded-[2.5rem] bg-[#f8f9fa] px-6 py-20 md:px-16 lg:py-24">
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mb-16 flex flex-col items-start md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#ff6b35]">Reunited cases</p>
                <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">
                  Every update can lead<br />to a reunion.
                </h2>
              </div>
              <button onClick={goToLogin} className="mt-6 flex items-center gap-2 border-b border-slate-900 pb-1 text-sm font-medium text-slate-900 transition-opacity hover:opacity-60 md:mt-0">
                View all stories <span className="text-lg leading-none">—</span>
              </button>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-6 md:grid-cols-3">
              {reunitedStories.map((story) => (
                <motion.article key={story.name} variants={staggerItem} className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-black/5 transition-colors group-hover:bg-transparent" />
                    <img src={story.image} alt={story.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/80 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-900 backdrop-blur-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Reunited
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-medium tracking-tight text-slate-900">{story.name}</h3>
                    <p className="mt-2 text-sm font-normal text-slate-500">{story.location} · {story.time}</p>
                    <div className="my-6 h-[1px] w-full bg-slate-100" />
                    <p className="text-sm font-normal leading-relaxed text-slate-600">{story.story}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. DEVELOPERS */}
      <section id="developers" className="py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white px-6 py-20 text-center md:px-16 lg:py-24">
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="mx-auto mb-20 max-w-2xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-[#ff6b35]">Capstone team</p>
              <h2 className="font-serif text-4xl font-medium tracking-tight text-slate-900 md:text-5xl">
                Built by a team focused on community impact.
              </h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {developers.map((developer) => (
                <motion.div key={developer.name} variants={staggerItem} className="group flex flex-col items-center rounded-[2rem] border border-slate-100 bg-[#fafafa] p-8 transition-all hover:border-slate-200 hover:bg-white hover:shadow-lg">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white font-serif text-xl font-medium text-slate-900 shadow-sm transition-transform group-hover:scale-110">
                    {getInitials(developer.name)}
                  </div>
                  <h3 className="font-medium text-slate-900">{developer.name}</h3>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    {developer.role}
                  </p>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-12 pb-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#ff6b35] to-[#f7c59f] px-6 py-24 text-center shadow-lg md:py-32">
            
            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mx-auto mb-10 flex justify-center">
                <img src={logoSrc} alt="Pawnect logo" className="h-12 w-auto object-contain brightness-0 invert" />
              </div>
              <h2 className="font-serif text-5xl font-medium tracking-tight text-white md:text-7xl">
                Help a pet find home today.
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-lg font-normal leading-relaxed text-white/90">
                Start searching, report a pet, or follow nearby cases in your community through Pawnect.
              </p>
              <button onClick={goToLogin} className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95">
                Get started
                <span className="text-lg leading-none">—</span>
              </button>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logoSrc} alt="Pawnect logo" className="h-6 w-auto object-contain opacity-60 grayscale transition-opacity hover:opacity-100" />
            </button>
            <span className="text-slate-300">/</span>
            <p className="text-xs font-medium text-slate-500">
              A location-based pet reporting platform.
            </p>
          </div>

          <div className="flex gap-8 text-xs font-medium text-slate-500">
            <a href="#product" className="transition-colors hover:text-slate-900">Product</a>
            <a href="#how-it-works" className="transition-colors hover:text-slate-900">How it works</a>
            <a href="#community" className="transition-colors hover:text-slate-900">Community</a>
            <a href="#developers" className="transition-colors hover:text-slate-900">Developers</a>
          </div>

          <p className="text-xs font-medium text-slate-400">
            © 2026 Pawnect. Capstone prototype.
          </p>
        </div>
      </footer>
    </div>
  );
}