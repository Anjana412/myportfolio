import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const HOLD_MS = 1800; // how long the welcome stays before it breaks apart
const LETTERS = 'Welcome'.split('');
const MID = (LETTERS.length - 1) / 2;
const ease = [0.76, 0, 0.24, 1] as const;

export default function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden'; // no scrolling while the welcome shows
    Promise.all([document.fonts.ready, new Promise((r) => setTimeout(r, HOLD_MS))]).then(() => setLeaving(true));
    return () => {
      root.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] grid place-items-center bg-ink text-center text-paper"
      aria-hidden="true"
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={leaving ? { duration: 0.7, delay: 0.45, ease: 'easeInOut' } : { duration: 0 }}
      onAnimationComplete={() => {
        if (leaving) {
          document.documentElement.style.overflow = '';
          setDone(true);
        }
      }}
    >
      <div>
        <p
          className="m-0 flex justify-center text-[clamp(4.5rem,22vw,12rem)] leading-[1.1]"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
              animate={
                leaving
                  ? reduce
                    ? { opacity: 0 }
                    : { x: `${(i - MID) * 12}vw`, y: -30, rotate: (i - MID) * 7, opacity: 0, filter: 'blur(10px)' }
                  : { x: 0, y: 0, rotate: 0, opacity: 1, filter: 'blur(0px)' }
              }
              transition={
                leaving ? { duration: 0.9, ease } : { duration: 0.7, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {ch}
            </motion.span>
          ))}
        </p>
        <motion.p
          className="m-0 mt-2 text-[clamp(.75rem,2vw,1rem)] uppercase tracking-[.3em] text-accent"
          initial={{ y: 16, opacity: 0 }}
          animate={leaving ? { y: 10, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={leaving ? { duration: 0.5 } : { duration: 0.7, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          to my portfolio
        </motion.p>
      </div>
    </motion.div>
  );
}