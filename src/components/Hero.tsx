import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  onStart: () => void;
  onHowItWorks: () => void;
  heroImage?: string;
}

export default function Hero({ onStart, onHowItWorks, heroImage }: HeroProps) {
  return (
    <section
      className="hero-section bg-paper relative overflow-hidden"
      style={{
        minHeight: "clamp(560px, 80vh, 860px)",
        paddingTop: 66,
      }}
    >
      <div className="content-width h-full flex flex-col justify-center" style={{ paddingTop: 60, paddingBottom: 60 }}>
        {/* Mono date line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="font-mono-meta text-muted mb-6"
        >
          A Career Roadmap Generator. Any Branch. Any Year.
        </motion.div>

        {/* Double rule */}
        <div className="double-rule mb-8" />

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Left */}
          <div className="flex-1">
            <motion.h1
              className="font-display text-ink mb-8"
              style={{
                fontSize: "clamp(44px, 8vw, 108px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            >
              Know what to{" "}
              <span style={{ color: "var(--accent)" }}>learn</span>{" "}
              next.
            </motion.h1>

            <motion.p
              className="font-body text-muted mb-10"
              style={{ maxWidth: "46ch" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            >
              Tell Waypoint where you are, what you enjoy and how many hours
              you really have. It builds a plan in phases, with skills,
              projects and a milestone for each, then helps you adjust it as
              you go.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            >
              <button
                id="hero-start-btn"
                className="btn-primary"
                onClick={onStart}
                aria-label="Build my roadmap"
              >
                <span>Build my roadmap</span>
              </button>
              <button
                onClick={onHowItWorks}
                className="font-body text-muted hover:text-ink transition-colors underline underline-offset-4"
                style={{ fontSize: 15 }}
              >
                See how it works
              </button>
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            className="hidden md:block flex-shrink-0"
            style={{ width: "clamp(280px, 35%, 440px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          >
            {heroImage ? (
            <img
                src={heroImage}
                alt="A desk with a notebook showing a hand-drawn roadmap, a laptop, and a pencil"
                className="w-full rounded"
                style={{ aspectRatio: "4/5", objectFit: "cover" }}
              />
            ) : (
              <div
                className="w-full rounded bg-surface flex items-center justify-center"
                style={{ aspectRatio: "4/5" }}
              >
                <span className="font-mono-meta text-muted">Loading image…</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
