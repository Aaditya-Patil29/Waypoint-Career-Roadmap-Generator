import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Single SVG path that winds from top to bottom of the page
// Waypoints are placed along the path at key positions
const PATH_D =
  "M 100 0 C 100 80 300 80 300 200 C 300 320 60 320 60 480 C 60 640 340 640 340 800 C 340 960 80 960 80 1100 C 80 1260 320 1260 320 1400";

const WAYPOINTS = [
  { x: 100, y: 0 },
  { x: 300, y: 200 },
  { x: 60, y: 480 },
  { x: 340, y: 800 },
  { x: 80, y: 1100 },
  { x: 320, y: 1400 },
];

export default function PathLine({ height = 1400 }: { height?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const { scrollYProgress } = useScroll();

  // Total path length is approximated; dashoffset goes from full length to 0
  const pathLength = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 400 ${height}`}
      width="400"
      height={height}
      aria-hidden="true"
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <motion.path
        d={PATH_D}
        className="path-line"
        style={{ pathLength }}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
      {WAYPOINTS.map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.x}
          cy={pt.y}
          r={5}
          className="waypoint-marker"
          style={{
            fill: useTransform(
              scrollYProgress,
              [i / WAYPOINTS.length, (i + 0.5) / WAYPOINTS.length],
              ["var(--paper)", "var(--accent)"]
            ),
          }}
        />
      ))}
    </svg>
  );
}
