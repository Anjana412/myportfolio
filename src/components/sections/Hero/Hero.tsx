import { Fragment, useCallback, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { FaGithub, FaLinkedinIn, FaEnvelope, FaReact, FaNodeJs, FaDownload } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';
import { Link } from 'react-scroll';
import { SITE, SOCIALS } from '../../../data/site';
import { useFitText } from '../../../hooks/useFitText';
import photo from '../../../assets/images/mypic.png';

const WORD = 'DEVELOPER'.split('');
// each letter sits at its own slight angle; E and P are drawn as outlines
const TILT = [-4, 3, -2, 4, -3, 2, -4, 3, -2];
const OUTLINED = new Set([1, 6]);
// wide screens: the photo stands in a gap between "DEVEL" and "OPER".
// phones and tablets: the word breaks onto two lines at the same place, "DEVEL" over "OPER".
const SPLIT_BEFORE = 5;

// small tech chips that float around the photo on phones and tablets
const CHIPS: { label: string; icon: ReactNode; color: string; style: CSSProperties }[] = [
  { label: 'React', icon: <FaReact />, color: '#0891B2', style: { left: '2%', top: '12%' } },
  { label: 'Node.js', icon: <FaNodeJs />, color: '#3C873A', style: { right: '2%', top: '34%' } },
  { label: 'MongoDB', icon: <SiMongodb />, color: '#2E8B3E', style: { left: '5%', bottom: '14%' } },
];

// how much of the width the letters fill: a little less on small screens
const letterFill = () => (window.innerWidth < 1024 ? 0.95 : 0.92);

const rise = 'animate-rise motion-reduce:animate-none';
const iconBtn = 'max-lg:size-11 max-lg:justify-center max-lg:rounded-full max-lg:p-0 max-lg:text-[1.1rem]';
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  // wide screens: keep the photo centred in the gap of the word, wherever the letters end up
  const placePhoto = useCallback(() => {
    const hero = heroRef.current;
    const gap = wordRef.current?.querySelector<HTMLElement>('[data-gap]');
    if (!hero || !gap) return;
    const h = hero.getBoundingClientRect();
    const g = gap.getBoundingClientRect();
    if (g.width === 0) {
      hero.style.removeProperty('--photo-x'); // small screens have no gap
      return;
    }
    hero.style.setProperty('--photo-x', `${g.left - h.left + g.width / 2}px`);
  }, []);

  useFitText(wordRef, { fill: letterFill, max: 240, children: true, onFit: placePhoto });

  return (
    <section
      id="portfolio"
      ref={heroRef}
      className={
        'relative flex min-h-svh flex-col items-center overflow-hidden bg-paper px-5 pb-8 pt-[88px] text-ink ' +
        '[--ratio:0.32] [--ph:min(124vh,1080px)] [--pw:calc(var(--ph)_*_var(--ratio))] [--fig:clamp(250px,70vw,420px)] ' +
        'lg:block lg:p-0'
      }
    >
      <h1 className="pointer-events-none relative z-[1] w-full max-w-[620px] font-display font-extrabold uppercase lg:absolute lg:inset-0 lg:max-w-none">
        <span className="sr-only">{SITE.role}</span>

        <span
          className={`${rise} mb-2 flex flex-col text-[clamp(2.6rem,15vw,5.4rem)] leading-[.86] tracking-[-.02em] [&>span:last-child]:ml-[.16em] lg:absolute lg:left-[5vw] lg:top-[16vh] lg:mb-0 lg:text-[clamp(2.2rem,min(7.2vw,calc((var(--photo-x,50vw)_-_var(--pw)_/_2_+_40px_-_5vw_-_24px)_/_7.2)),7rem)] lg:leading-[.88]`}
          aria-hidden="true"
        >
          <span>Full</span>
          <span>Stack</span>
        </span>

        <span
          ref={wordRef}
          className="flex flex-wrap items-center justify-start gap-x-[.035em] whitespace-nowrap text-[clamp(2.2rem,9vw,9rem)] leading-[.98] lg:absolute lg:inset-x-[2vw] lg:top-[42%] lg:flex-nowrap lg:justify-between lg:gap-x-0 lg:leading-none"
          aria-hidden="true"
        >
          {WORD.map((ch, i) => (
            <Fragment key={i}>
              {i === SPLIT_BEFORE && (
                <>
                  <span className="hidden w-[calc(var(--pw)_*_.56)] flex-none lg:block" data-gap="true" data-fixed="true" />
                  <span className="block h-0 basis-full lg:hidden" data-break="true" />
                </>
              )}
              <span
                className="pointer-events-auto inline-block transition-transform duration-[350ms] ease-[cubic-bezier(.3,1.6,.5,1)] [transform:rotate(var(--r))] hover:[transform:rotate(0deg)_translateY(-8px)] motion-reduce:transition-none"
                style={{ '--r': `${TILT[i]}deg` } as CSSProperties}
              >
                <span
                  className={`${rise} inline-block ${OUTLINED.has(i) ? 'text-transparent [-webkit-text-stroke:clamp(2px,.28vw,4px)_var(--ink)]' : ''}`}
                  style={{ animationDelay: `${i * 70 + 150}ms` }}
                >
                  {ch}
                </span>
              </span>
            </Fragment>
          ))}
        </span>
      </h1>

      {/* wide screens: only the photo shows. phones and tablets: a round backdrop and floating chips join it */}
      <div className="relative mt-[18px] block h-[var(--fig)] w-full max-w-[620px] overflow-hidden lg:contents">
        <span
          className="absolute -bottom-[40%] left-1/2 block aspect-square w-[min(92%,440px)] -translate-x-1/2 rounded-full bg-[#EADFFD] after:absolute after:-inset-3.5 after:animate-spin-slow after:rounded-full after:border-2 after:border-dashed after:border-line motion-reduce:after:animate-none lg:hidden"
          aria-hidden="true"
        />
        <img
          className="pointer-events-none absolute left-1/2 top-1.5 z-[2] h-[calc(var(--fig)_*_1.95)] w-auto max-w-none -translate-x-1/2 animate-photo-in motion-reduce:animate-none lg:left-[var(--photo-x,50%)] lg:top-[8vh] lg:h-[var(--ph)]"
          src={photo}
          alt={SITE.name}
        />
        {CHIPS.map((chip, i) => (
          <span
            key={chip.label}
            className="absolute z-[3] inline-flex animate-bob items-center gap-1.5 rounded-full border border-line bg-white py-[7px] pl-2.5 pr-[13px] text-[.82rem] font-bold shadow-[0_10px_18px_-10px_rgba(42,27,77,0.45)] motion-reduce:animate-none lg:hidden [&>svg]:text-[1.05rem] [&>svg]:text-[color:var(--c)]"
            aria-hidden="true"
            style={{ ...chip.style, '--c': chip.color, animationDelay: `${i * 0.9}s` } as CSSProperties}
          >
            {chip.icon}
            {chip.label}
          </span>
        ))}
      </div>

            {/* wide screens: the two parts sit in the bottom corners; on small screens everything flows in one wrapping row */}
      <div className="mt-[22px] flex w-full max-w-[620px] flex-wrap items-center gap-x-3 lg:contents">
        <div
          className={`${rise} max-lg:contents lg:absolute lg:bottom-[6vh] lg:left-[5vw] lg:z-[3] lg:max-w-[310px]`}
          style={{ animationDelay: '.7s' }}
        >
          <p className="mb-3 flex items-center gap-2.5 text-[.85rem] font-medium max-lg:w-full">
            <span
              className="size-[9px] flex-none animate-pulse-ring rounded-full bg-accent shadow-[0_0_0_0_rgba(224,64,200,0.5)] motion-reduce:animate-none"
              aria-hidden="true"
            />
            Open to {SITE.openTo.toLowerCase()}
          </p>
          <p className="mb-[18px] text-[1.05rem] leading-[1.55] max-lg:w-full">
            I'm {SITE.name.split(' ')[0]}. I build full-stack web apps with React, Node.js and MongoDB.
          </p>
          <Link to="projects" smooth duration={500} offset={-80} className="btn btn--dark max-lg:px-5">
            See my projects
          </Link>
        </div>

        <div
          className={`${rise} flex items-center gap-2 lg:absolute lg:bottom-[6vh] lg:right-[5vw] lg:z-[3] lg:flex-wrap lg:justify-end lg:gap-2.5`}
          style={{ animationDelay: '.85s' }}
        >
          <a className={`btn btn--light btn--sq ${iconBtn}`} href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub aria-hidden="true" /> <span className="max-lg:sr-only">GitHub</span>
          </a>
          <a className={`btn btn--light btn--sq ${iconBtn}`} href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn aria-hidden="true" /> <span className="max-lg:sr-only">LinkedIn</span>
          </a>
          <a className={`btn btn--light btn--sq ${iconBtn}`} href={SITE.resume} target="_blank" rel="noopener noreferrer" aria-label="Résumé (PDF)">
            <FaDownload className="lg:hidden" aria-hidden="true" /> <span className="max-lg:sr-only">Résumé</span>
          </a>
          <Link to="contact" smooth duration={500} offset={-80} className="btn btn--dark btn--sq max-lg:hidden">
            <FaEnvelope aria-hidden="true" /> Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}