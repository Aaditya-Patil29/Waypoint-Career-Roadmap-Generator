import { forwardRef, useRef } from "react";
import { motion, useInView } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    num: "01",
    title: "Tell us about you",
    desc: "Eight quick questions about your branch, year, interests and time.",
  },
  {
    num: "02",
    title: "Get your plan",
    desc: "A phase by phase roadmap shaped around the hours you have.",
  },
  {
    num: "03",
    title: "Change anything",
    desc: "Ask for it lighter, heavier or more focused, in plain words.",
  },
  {
    num: "04",
    title: "Keep it",
    desc: "Tick off progress, download it, or print it for your wall.",
  },
];

const HowItWorks = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="how-it-works bg-paper"
      style={{ paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="content-width">
        <div className="font-mono-meta text-muted mb-10">How it works</div>

        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          {STEPS.map((step, i) => (
            <StepRow key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";
export default HowItWorks;

function StepRow({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-baseline gap-8 py-8 border-b"
      style={{ borderColor: "var(--line)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.04 }}
    >
      <span className="font-mono-meta text-muted w-10 flex-shrink-0">{step.num}</span>
      <div className="flex-1">
        <div
          className="font-display text-ink mb-1"
          style={{ fontSize: "clamp(22px, 3vw, 28px)" }}
        >
          {step.title}
        </div>
        <p className="text-muted" style={{ fontSize: 16, margin: 0 }}>
          {step.desc}
        </p>
      </div>
    </motion.div>
  );
}
