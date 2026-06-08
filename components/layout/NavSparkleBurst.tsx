"use client";

import { motion } from "framer-motion";

type Props = {
  x: number;
  y: number;
};

/**
 * Destellos dorados tipo “polvo mágico” en la posición del clic.
 */
export function NavSparkleBurst({ x, y }: Props) {
  const count = 20;
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const dist = 24 + Math.random() * 56;
    const size = 2 + Math.random() * 3;
    return {
      angle,
      dist,
      size,
      duration: 0.38 + Math.random() * 0.28,
      delay: Math.random() * 0.06,
    };
  });

  return (
    <div
      className="pointer-events-none fixed z-[400]"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden
    >
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-gold-200 to-gold-600 shadow-[0_0_6px_#f4e4bc,0_0_12px_rgba(212,175,55,0.6)]"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={`star-${i}`}
          className="absolute h-0.5 w-0.5 rounded-full bg-white shadow-[0_0_8px_#fff]"
          style={{
            marginLeft: -1,
            marginTop: -1,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1.5 }}
          animate={{
            x: (Math.random() - 0.5) * 70,
            y: (Math.random() - 0.5) * 70,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.04,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
