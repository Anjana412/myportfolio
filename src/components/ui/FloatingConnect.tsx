import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FaEnvelope } from 'react-icons/fa';
import { scroller } from 'react-scroll';

export default function FloatingConnect() {
  const [show, setShow] = useState(true);
  const reduce = useReducedMotion();

  // hide once the Contact section reaches the middle of the screen
  useEffect(() => {
    const check = () => {
      const el = document.getElementById('contact');
      if (el) setShow(el.getBoundingClientRect().top > window.innerHeight * 0.6);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-[calc(clamp(16px,3vw,32px)_+_env(safe-area-inset-bottom,0px))] right-[clamp(16px,3vw,32px)] z-[90]"
          initial={{ scale: 0, rotate: -120, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        >
          <motion.button
            type="button"
            className="relative grid size-24 cursor-pointer place-items-center rounded-full border border-line bg-paper p-0 text-ink max-[640px]:size-20"
            aria-label="Let’s connect: go to the contact section"
            onClick={() => scroller.scrollTo('contact', { smooth: true, duration: 500, offset: -70 })}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            {!reduce && (
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.svg
              className="absolute inset-0 size-full fill-current font-body text-[10px] font-bold"
              viewBox="0 0 100 100"
              aria-hidden="true"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            >
              <defs>
                <path id="fc-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text>
                <textPath href="#fc-circle" textLength="236" lengthAdjust="spacing">
                  LET’S CONNECT • LET’S CONNECT •{' '}
                </textPath>
              </text>
            </motion.svg>
            <motion.span
              className="relative grid size-[46px] place-items-center rounded-full bg-accent text-[1.1rem] text-white max-[640px]:size-10"
              animate={reduce ? undefined : { rotate: [0, -14, 14, -8, 8, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2.4 }}
            >
              <FaEnvelope aria-hidden="true" />
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}