import { useEffect } from 'react';
import type { RefObject } from 'react';
import { clamp, prefersReducedMotion } from '../utils';

// Tuning: change these to alter the feel.
const GRAVITY = 2400; // px/s^2, how hard the card drops
const STRAP_SPRING = 160; // how stiff the strap is when it stretches on landing
const STRAP_DAMPING = 7;
const SWING_SPRING = 24; // pendulum stiffness (higher = faster, tighter swing)
const SWING_DAMPING = 1.5; // higher = settles sooner
const MOUSE_PUSH = 0.0022; // how much a mouse movement pushes the card
const MOUSE_LEAN = 0.12; // radians the card leans toward the cursor (about 7 degrees at the screen edges)
const MAX_ANGLE = 0.5; // radians

/**
 * Drops the card the first time its section scrolls into view, then lets it swing
 * as the mouse moves. Clicking or tapping the card gives it a push.
 */
export function useIdCardPhysics(
  sectionRef: RefObject<HTMLElement | null>,
  swingRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const section = sectionRef.current;
    const swing = swingRef.current;
    if (!section || !swing) return;

    // Reduced motion: show the card at rest, no fall, no swing.
    if (prefersReducedMotion()) {
      swing.style.visibility = 'visible';
      return;
    }

    let y = 0; // vertical offset: negative = above its resting place, positive = strap stretched
    let vy = 0;
    let theta = 0; // swing angle in radians
    let omega = 0; // swing speed
    let bias = 0; // where the swing is currently leaning
    let started = false;
    let landed = false;
    let visible = false;
    let raf = 0;
    let last = 0;

    const render = () => {
      swing.style.setProperty('--s', `${Math.max(y, 0)}px`);
      swing.style.transform = `translate3d(0, ${Math.min(y, 0)}px, 0) rotate(${theta}rad)`;
    };

    const step = (h: number) => {
      if (!started) return;
      if (!landed) {
        vy += GRAVITY * h;
        y += vy * h;
        if (y >= 0) {
          y = 0;
          vy *= 0.22; // small rebound as the strap stretches
          landed = true;
          omega += (Math.random() < 0.5 ? -1 : 1) * 0.6; // the landing sets it swinging
        }
      } else {
        vy += (-STRAP_SPRING * y - STRAP_DAMPING * vy) * h;
        y += vy * h;
        if (y < 0) {
          y = 0;
          vy = 0;
        }
      }
      omega += (-SWING_SPRING * (theta - bias) - SWING_DAMPING * omega) * h;
      theta = clamp(theta + omega * h, -MAX_ANGLE, MAX_ANGLE);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const n = Math.max(1, Math.ceil(dt * 120));
      for (let i = 0; i < n; i++) step(dt / n);
      render();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const startFall = () => {
      started = true;
      y = -(swing.offsetHeight + 60); // start fully above the section
      vy = 0;
      render();
      swing.style.visibility = 'visible';
    };

    const io = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        visible = entry.isIntersecting;
        if (visible) {
        if (!started && (entry.intersectionRatio >= 0.25 || entry.intersectionRect.height >= window.innerHeight * 0.5)) startFall();          run();
        } else {
          stop();
        }
      },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    io.observe(section);

    const onMove = (e: PointerEvent) => {
      if (!visible || !started || e.pointerType !== 'mouse') return;
      // moving right pushes the card right (negative angle = swing to the right)
      omega -= clamp(e.movementX * MOUSE_PUSH, -0.25, 0.25);
      bias = -(e.clientX / window.innerWidth - 0.5) * MOUSE_LEAN;
    };
    const onPoke = () => {
      if (started) omega += (Math.random() < 0.5 ? -1 : 1) * 0.9;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    swing.addEventListener('pointerdown', onPoke);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      swing.removeEventListener('pointerdown', onPoke);
    };
  }, [sectionRef, swingRef]);
}
