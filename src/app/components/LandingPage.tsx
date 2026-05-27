import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

const logoSrc =
  "blob:https://www.figma.com/137e4b3f-97bc-4267-947d-d33375f88388";

const favicon =
  "blob:https://www.figma.com/6f072b93-db10-4e04-8f30-108fe91508f1";

const heroImageSrc =
  "blob:https://www.figma.com/d60b07fe-2f7e-4de8-9a1e-ee010f15c140";

export default function LandingPage() {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  const [openStep, setOpenStep] = useState(0);

  const navItems = [
    { label: "Cases", href: "#cases" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Product", href: "#product" },
    { label: "Team", href: "#team" },
  ];

  const caseFeed = [
    {
      type: "Lost",
      name: "Luna",
      detail: "Golden Retriever · Quezon City",
      note: "Last seen near Barangay Hall. Wearing a red collar.",
      time: "12 min ago",
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&h=1100&fit=crop",
    },
    {
      type: "Found",
      name: "Mochi",
      detail: "White Cat · Pasig",
      note: "Safe with finder. Owner verification needed.",
      time: "28 min ago",
      image:
        "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=900&h=1100&fit=crop",
    },
    {
      type: "Sighting",
      name: "Unknown",
      detail: "Small brown dog · Mandaluyong",
      note: "Seen near a convenience store, moving toward the main road.",
      time: "41 min ago",
      image:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&h=1100&fit=crop",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Make one clear report",
      copy: "Photos, location, status, identifying marks, and safe contact details are captured in one structured case.",
    },
    {
      step: "02",
      title: "Let nearby people help",
      copy: "The report becomes searchable by area, pet details, and case status, so the right people can act quickly.",
    },
    {
      step: "03",
      title: "Connect the clues",
      copy: "Sightings, comments, found posts, and possible matches stay attached to the case instead of getting scattered.",
    },
    {
      step: "04",
      title: "Close the loop",
      copy: "Once confirmed, the report can be marked reunited so the community knows the search is complete.",
    },
  ];

  const features = [
    {
      title: "Case-first reporting",
      copy: "Every lost or found post follows the same structure, making urgent information easier to scan and compare.",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&h=700&fit=crop",
    },
    {
      title: "Location-aware search",
      copy: "Browse by nearby areas, last-seen locations, and active reports instead of relying on chance.",
      image:
        "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=900&h=700&fit=crop",
    },
    {
      title: "Possible match signals",
      copy: "Similar reports, sightings, and comments can point owners and finders toward the same case.",
      image:
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&h=700&fit=crop",
    },
    {
      title: "Status clarity",
      copy: "Lost, found, sighting, possible match, and reunited states keep the next action clear.",
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&h=700&fit=crop",
    },
    {
      title: "Community updates",
      copy: "Helpful comments and sightings stay with the report, giving owners a cleaner timeline of what happened.",
      image:
        "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=900&h=700&fit=crop",
    },
    {
      title: "Moderation support",
      copy: "Flagged, duplicate, suspicious, or incomplete reports can be reviewed before they confuse the search.",
      image:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&h=700&fit=crop",
    },
  ];

  const marqueeFeatures = [...features, ...features];

  const safety = [
    "Protect contact details until useful",
    "Reduce duplicate and misleading posts",
    "Keep status changes visible",
    "Make owner verification easier",
  ];

  const developers = [
    {
      name: "Lester Jude Garingalo",
      role: "Full-Stack Developer",
      image:
        "blob:https://www.figma.com/320286b3-5af2-4f0f-97d7-4f8a999cea60",
    },
    {
      name: "Andrea Sai Malicdem",
      role: "Documentation",
      image:
        "blob:https://www.figma.com/6e2e89ab-952c-49ee-92fa-2b81df5d1190",
    },
    {
      name: "Cornelius James Lasala",
      role: "Documentation",
      image:
        "blob:https://www.figma.com/b865d7c6-895f-48c0-87c2-c3f2c3c9379d",
    },
    {
      name: "Ruy Inigo Fajutagana",
      role: "Documentation",
      image:
        "blob:https://www.figma.com/35eeea56-92d4-4361-af55-36335cb6d7e8",
    },
    {
      name: "Carlvin Cabug-os",
      role: "Documentation",
      image:
        "blob:https://www.figma.com/f5539f81-b1e5-4676-86cb-6a86abc93342",
    },
  ];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8F5EF] font-['Nunito',sans-serif] text-[#1F2937] selection:bg-[#C28A45] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Parkinsans:wght@400;500;600;700;800&display=swap');

        @keyframes pawnectMarquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        .pawnect-marquee-track {
          animation: pawnectMarquee 36s linear infinite;
        }

        .pawnect-marquee:hover .pawnect-marquee-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .pawnect-marquee-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between rounded-full border border-[#1F2937]/10 bg-white/78 px-4 shadow-[0_18px_60px_rgba(31,41,55,0.10)] backdrop-blur-2xl sm:px-5">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <img
                src={favicon}
                alt="Pawnect logo"
                className="h-6 w-auto object-contain"
              />
            </span>

            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1F2937]/62 md:block">
              Pawnect
            </span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((nav) => (
              <a
                key={nav.label}
                href={nav.href}
                className="text-[13px] font-medium text-[#1F2937]/58 transition-colors hover:text-[#1F2937]"
              >
                {nav.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goToLogin}
              className="hidden text-[13px] font-medium text-[#1F2937]/58 transition-colors hover:text-[#1F2937] sm:block"
            >
              Log in
            </button>

            <button
              type="button"
              onClick={goToLogin}
              className="rounded-full bg-[#263143] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#334155]"
            >
              Start a report
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="px-4 pb-14 pt-[138px] sm:px-6 lg:pb-20">
          <div className="mx-auto max-w-[1320px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex min-h-[520px] w-full flex-col justify-center overflow-hidden rounded-[32px] bg-gradient-to-r from-[#242E3F] via-[#3B4C66] to-[#687E9F] shadow-[0_24px_70px_rgba(31,41,55,0.22)] sm:min-h-[560px] lg:min-h-[600px]"
            >
              <div className="absolute inset-y-0 right-0 w-[90%] md:w-[85%] lg:w-[75%]">
                <img
                  src={heroImageSrc}
                  alt="Woman hugging a golden retriever"
                  className="h-full w-full object-cover object-[right_top]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 20%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 20%)",
                  }}
                />
              </div>

              {/* Content Container - Anchored to the left */}
              <div className="relative z-10 w-full max-w-[640px] px-7 py-12 sm:px-12 lg:px-16">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={stagger}
                  className="text-white"
                >
                  <motion.p
                    variants={item}
                    className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D8B47E]"
                  >
                    Pawnect
                  </motion.p>

                  <motion.h1
                    variants={item}
                    className="font-['Parkinsans',sans-serif] text-[4rem] font-semi leading-[1.05] tracking-tight"
                  >
                    Bring them back into reach
                  </motion.h1>

                  <motion.div
                    variants={item}
                    className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
                  >
                    <button
                      type="button"
                      onClick={goToLogin}
                      className="rounded-[30px] bg-[#C28A45] px-8 py-4 text-[15px] font-semibold text-white transition-all hover:-translate-y-1 hover:bg-[#A87435] hover:shadow-lg"
                    >
                      Report a pet
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById("cases")
                          ?.scrollIntoView({
                            behavior: "smooth",
                          })
                      }
                      className="rounded-[30px] border border-white/20 bg-white/[0.03] px-8 py-4 text-[15px] font-semibold text-white/90 transition-all hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      View sample cases
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* EDITORIAL STATEMENT */}
        <section className="px-4 py-18 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-[28px] font-semibold uppercase tracking-[0.28em] text-[#C28A45]"
            >
              Why it exists
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.16] tracking-[-0.032em] text-[#1F2937]">
                When a pet is missing, people do not need
                another feed. They need a clearer way to
                coordinate.
              </h2>

              <p className="mt-9 max-w-3xl text-base leading-relaxed text-[#1F2937]/56 sm:text-lg">
                Pawnect is designed around the real recovery
                journey: report what happened, make the case
                searchable, collect sightings, reduce duplicate
                noise, and make the next best action obvious.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CASES */}
        <section
          id="cases"
          className="px-3 py-10 sm:px-4 md:px-6"
        >
          <div className="mx-auto max-w-[1500px] rounded-[28px] bg-[#FFFFFF] p-4 shadow-[0_24px_90px_rgba(31,41,55,0.06)] sm:rounded-[42px] sm:p-6 lg:p-9">
            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="flex min-h-[560px] flex-col justify-between rounded-[26px] bg-[#263143] p-7 text-white sm:rounded-[34px] sm:p-10"
              >
                <div>
                  <p className="mb-7 text-[28px] font-semibold uppercase tracking-[0.28em] text-[#F0D7B0]">
                    Live case board
                  </p>

                  <h2 className="font-['Parkinsans',sans-serif] max-w-2xl text-[clamp(2rem,4.2vw,4.2rem)] font-semibold leading-[1.14] tracking-[-0.035em]">
                    Urgent details, without the noise.
                  </h2>
                </div>

                <p className="max-w-lg text-base leading-relaxed text-white/62 sm:text-lg">
                  Each case is built for scanning: animal photo,
                  status, location, update time, and the most
                  useful note stay visible first.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="grid gap-4 md:grid-cols-3 lg:gap-5"
              >
                {caseFeed.map((report) => (
                  <motion.article
                    key={`${report.name}-${report.type}`}
                    variants={item}
                    className="group overflow-hidden rounded-[28px] bg-[#F8F5EF] shadow-[0_16px_50px_rgba(31,41,55,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(31,41,55,0.10)]"
                  >
                    <div className="relative h-[360px] overflow-hidden bg-[#ECE7DE] sm:h-[440px] lg:h-full lg:min-h-[560px]">
                      <img
                        src={report.image}
                        alt={`${report.name} ${report.type} pet`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937]/78 via-[#1F2937]/18 to-transparent" />

                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <p className="rounded-full bg-white/86 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1F2937] backdrop-blur-xl">
                          {report.detail}
                        </p>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-['Parkinsans',sans-serif] mb-4 text-4xl font-semibold leading-none tracking-[-0.055em] text-white">
                          {report.name}
                        </h3>

                        <p className="mb-5 text-sm leading-relaxed text-white/74">
                          {report.note}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-full bg-[#C28A45] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white">
                            {report.type}
                          </span>

                          <span className="rounded-full bg-white/18 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white backdrop-blur-xl">
                            {report.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="px-4 py-18 sm:px-6 lg:py-24"
        >
          <div className="mx-auto max-w-[1320px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-16 max-w-4xl"
            >
              <p className="mb-7 text-[28px] font-semibold uppercase tracking-[0.28em] text-[#C28A45]">
                How it works
              </p>

              <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4.2vw,4.2rem)] font-semibold leading-[1.16] tracking-[-0.035em] text-[#1F2937]">
                Designed for the first hour of searching.
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="border-y border-[#1F2937]/10"
            >
              {process.map((step, index) => {
                const isOpen = openStep === index;

                return (
                  <motion.article
                    key={step.title}
                    variants={item}
                    className="border-b border-[#1F2937]/10 last:border-b-0"
                  >
                    <div className="grid w-full gap-5 py-8 text-left md:grid-cols-[0.22fr_1fr_56px] md:items-start lg:py-10">
                      <p className="text-4xl font-semibold tracking-[-0.05em] text-[#1F2937]/18 sm:text-5xl">
                        {step.step}
                      </p>

                      <div className="max-w-3xl">
                        <h3 className="font-['Parkinsans',sans-serif] text-2xl font-semibold leading-snug tracking-[-0.03em] text-[#1F2937] sm:text-3xl">
                          {step.title}
                        </h3>

                        <motion.p
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0,
                            marginTop: isOpen ? 18 : 0,
                          }}
                          transition={{
                            duration: 0.34,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden text-base leading-relaxed text-[#1F2937]/56 sm:text-lg"
                        >
                          {step.copy}
                        </motion.p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenStep(isOpen ? -1 : index)
                        }
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${step.title}`}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1F2937]/12 text-2xl font-light text-[#1F2937] transition-all hover:border-[#C28A45] hover:bg-[#C28A45] hover:text-white md:justify-self-end"
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* PRODUCT */}
        <section
          id="product"
          className="px-3 py-10 sm:px-4 md:px-6"
        >
          <div className="mx-auto max-w-[1500px] overflow-hidden rounded-[28px] bg-[#263143] text-white sm:rounded-[42px]">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.78fr_1.22fr] lg:p-14">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                className="flex flex-col justify-between"
              >
                <div>
                  <p className="mb-7 text-[28px] font-semibold uppercase tracking-[0.28em] text-[#F0D7B0]">
                    Product system
                  </p>

                  <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4.2vw,4.2rem)] font-semibold leading-[1.16] tracking-[-0.035em]">
                    Not a post. A recovery case.
                  </h2>
                </div>

                <p className="mt-9 max-w-xl text-base leading-relaxed text-white/62 sm:text-lg lg:mt-20">
                  The product is made of connected recovery
                  tools — reporting, search, map context,
                  updates, matching, and moderation — moving as
                  one system.
                </p>
              </motion.div>

              <div className="pawnect-marquee relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1E293B] py-5">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#1E293B] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#1E293B] to-transparent" />

                <div className="pawnect-marquee-track flex w-max gap-4 px-4">
                  {marqueeFeatures.map((feature, index) => (
                    <article
                      key={`${feature.title}-${index}`}
                      className="group h-[390px] w-[300px] shrink-0 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.055] transition-colors hover:bg-white/[0.085] sm:w-[360px]"
                    >
                      <div className="relative h-[176px] overflow-hidden bg-white/5">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#263143]/70 via-transparent to-transparent" />

                        <p className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0D7B0] backdrop-blur-xl">
                          F.0{(index % features.length) + 1}
                        </p>
                      </div>

                      <div className="flex h-[214px] flex-col justify-between p-6 sm:p-7">
                        <h3 className="font-['Parkinsans',sans-serif] text-xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-2xl">
                          {feature.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-white/56">
                          {feature.copy}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAP / UI MOMENT */}
        <section className="px-4 py-18 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="mb-7 text-[28px] font-semibold uppercase tracking-[0.28em] text-[#C28A45]">
                Location context
              </p>

              <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.16] tracking-[-0.032em] text-[#1F2937]">
                The map is not decoration. It is the search
                surface.
              </h2>

              <p className="mt-9 max-w-xl text-base leading-relaxed text-[#1F2937]/56 sm:text-lg">
                Lost pet recovery is local. Pawnect makes area,
                time, and movement visible so users can
                understand where attention is needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-[32px] bg-[#FFFFFF] p-3 shadow-[0_26px_90px_rgba(31,41,55,0.08)]"
            >
              <div className="overflow-hidden rounded-[26px] border border-[#1F2937]/8 bg-[#1E293B]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                      Map view
                    </p>

                    <h3 className="font-['Parkinsans',sans-serif] mt-2 text-xl font-semibold leading-snug tracking-[-0.03em] text-white">
                      Nearby reports
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={goToLogin}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1F2937]"
                  >
                    Open
                  </button>
                </div>

                <div className="relative h-[480px] bg-[linear-gradient(135deg,#334155,#111827)]">
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px]" />

                  <div className="absolute left-[21%] top-[32%] h-5 w-5 rounded-full bg-[#C28A45] ring-[18px] ring-[#C28A45]/20" />
                  <div className="absolute left-[63%] top-[26%] h-4 w-4 rounded-full bg-white ring-[14px] ring-white/15" />
                  <div className="absolute left-[54%] top-[66%] h-4 w-4 rounded-full bg-[#F0D7B0] ring-[14px] ring-[#F0D7B0]/18" />

                  <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/12 bg-black/48 p-5 backdrop-blur-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0D7B0]">
                      Search radius
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                      {[
                        ["3", "active reports"],
                        ["1", "possible match"],
                        ["6", "recent sightings"],
                      ].map(([value, label]) => (
                        <div key={label}>
                          <p className="text-4xl tracking-[-0.06em] text-white">
                            {value}
                          </p>

                          <p className="mt-1 text-xs text-white/46">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SAFETY */}
        <section
          id="safety"
          className="px-3 py-10 sm:px-4 md:px-6"
        >
          <div className="mx-auto max-w-[1500px] rounded-[28px] bg-[#FFFFFF] p-6 sm:rounded-[42px] sm:p-10 lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p className="mb-7 text-[28px] font-semibold uppercase tracking-[0.28em] text-[#C28A45]">
                  Trust and safety
                </p>

                <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.16] tracking-[-0.032em] text-[#1F2937]">
                  Helpful does not mean chaotic.
                </h2>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={stagger}
                className="divide-y divide-[#1F2937]/10 border-y border-[#1F2937]/10"
              >
                {safety.map((point) => (
                  <motion.div
                    key={point}
                    variants={item}
                    className="grid gap-5 py-7 sm:grid-cols-[40px_1fr] sm:items-center"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#263143] text-sm font-semibold text-white">
                      ✓
                    </span>

                    <p className="text-2xl font-semibold leading-snug tracking-[-0.035em] text-[#1F2937] sm:text-3xl">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section
          id="team"
          className="px-4 py-18 sm:px-6 lg:py-24"
        >
          <div className="mx-auto max-w-[1320px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]"
            >
              <p className="text-[28px] font-semibold uppercase tracking-[0.28em] text-[#C28A45]">
                Capstone team
              </p>

              <h2 className="font-['Parkinsans',sans-serif] text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.16] tracking-[-0.032em] text-[#1F2937]">
                Built by a team focused on clearer community
                response.
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              {developers.map((developer) => (
                <motion.article
                  key={developer.name}
                  variants={item}
                  className="rounded-[28px] border border-[#1F2937]/8 bg-[#FFFFFF] p-5 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_60px_rgba(31,41,55,0.06)]"
                >
                  <div className="relative mb-10 h-14 w-14">
                    {developer.image && (
                      <img
                        src={developer.image}
                        alt={`${developer.name}'s avatar`}
                        className="absolute inset-0 z-10 h-full w-full rounded-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#263143] text-lg text-white">
                      {getInitials(developer.name)}
                    </div>
                  </div>

                  <h3 className="font-['Parkinsans',sans-serif] text-lg font-semibold leading-snug tracking-[-0.035em] text-[#1F2937]">
                    {developer.name}
                  </h3>

                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1F2937]/35">
                    {developer.role}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="w-full overflow-hidden bg-[#1F2937]">
          <img
            src="blob:https://www.figma.com/17476e2d-8894-4eea-8e61-9270e74ee3b9"
            alt="Pawnect footer"
            className="block h-auto w-full"
          />
        </div>

        <div className="bg-white px-4 py-6 sm:px-6">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logoSrc}
                alt="Pawnect logo"
                className="h-6 w-auto object-contain opacity-70 grayscale"
              />

              <p className="text-xs font-medium text-[#1F2937]/70">
                A location-based pet recovery platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-7 text-xs font-medium text-[#1F2937]/70">
              {navItems.map((nav) => (
                <a
                  key={nav.label}
                  href={nav.href}
                  className="transition-colors hover:text-[#1F2937]"
                >
                  {nav.label}
                </a>
              ))}
            </div>

            <p className="text-xs font-medium text-[#1F2937]/70">
              © 2026 Pawnect. Capstone prototype.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}