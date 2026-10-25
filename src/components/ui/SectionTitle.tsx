import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useFitText } from '../../hooks/useFitText';

/** A small icon that sits on the heading. x and y are percentages of the heading, r is a tilt in degrees. */
export interface TitleDecor {
  icon: ReactNode;
  x: number;
  y: number;
  r?: number;
}

interface SectionTitleProps {
  word: string;
  decor?: TitleDecor[];
}

export default function SectionTitle({ word, decor = [] }: SectionTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  useFitText(ref, { max: 96 }); // always fits between the page margins, never bigger than 96px type

  return (
    <div className="mx-auto max-w-[1100px] select-none px-4 text-center">
      <h2
        ref={ref}
        className="relative m-0 inline-block whitespace-nowrap font-display text-[clamp(2rem,8vw,6rem)] font-extrabold uppercase leading-none tracking-[-0.02em] text-transparent [-webkit-text-stroke:2px_var(--accent)] max-[640px]:[-webkit-text-stroke-width:1.5px]"
      >
        {word}
        {decor.map((d, i) => (
          <span
            key={i}
            className="pointer-events-none absolute size-[.3em] animate-deco-float text-accent [rotate:var(--r,0deg)] max-[640px]:size-[.26em] motion-reduce:animate-none [&>svg]:block [&>svg]:size-full"
            aria-hidden="true"
            style={{ left: `${d.x}%`, top: `${d.y}%`, '--r': `${d.r ?? 0}deg`, animationDelay: `${i * 0.8}s` } as CSSProperties}
          >
            {d.icon}
          </span>
        ))}
      </h2>
    </div>
  );
}