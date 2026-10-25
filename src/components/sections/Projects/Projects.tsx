import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FaArrowUpRightFromSquare, FaCode, FaGithub, FaLaptopCode, FaRocket } from 'react-icons/fa6';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';

import { projects } from '../../../data/projects';
import SectionTitle from '../../ui/SectionTitle';
import type { TitleDecor } from '../../ui/SectionTitle';

const decor: TitleDecor[] = [
  { icon: <FaCode />, x: 15, y: 15, r: -12 },
  { icon: <FaLaptopCode />, x: 82, y: 20, r: 10 },
  { icon: <FaRocket />, x: 72, y: 85, r: -15 },
];

const STEP = 10; // % of card width each waiting card peeks out
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// ---- shared classes ----
const frame =
  'relative aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-white shadow-[0_30px_50px_-26px_rgba(42,27,77,0.45)] ' +
  'before:pointer-events-none before:absolute before:inset-0 before:z-[2] before:border before:shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_0_34px_rgba(224,64,200,0.09)] ' +
  'before:transition-[border-color,box-shadow] before:duration-[250ms] motion-reduce:before:transition-none ' +
  'group-hover/card:before:border-accent group-hover/card:before:shadow-[0_0_0_1px_rgba(255,255,255,0.24)_inset,0_0_42px_rgba(224,64,200,0.28)] ' +
  'group-focus-visible/card:before:border-accent group-focus-visible/card:before:shadow-[0_0_0_1px_rgba(255,255,255,0.24)_inset,0_0_42px_rgba(224,64,200,0.28)]';

const tag =
  'rounded-[3px] border border-[rgba(224,64,200,0.24)] bg-white/30 px-[9px] py-[5px] font-body text-[10px] font-semibold leading-[1.2] text-ink lg:px-3 lg:py-1.5 lg:text-xs max-[900px]:[&:nth-child(n+5)]:hidden';

const link =
  'inline-flex items-center gap-[7px] font-body text-xs font-bold leading-[1.4] text-ink no-underline transition-colors duration-[180ms] hover:text-accent-deep motion-reduce:transition-none lg:text-sm ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [&>svg]:text-[13px] [&>svg]:text-accent';

interface ProjectPanelProps {
  project: (typeof projects)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean | null;
  active: boolean;
  onSelect: () => void;
}

function ProjectPanel({ project, index, total, progress, reduceMotion, active, onSelect }: ProjectPanelProps) {
  // 0 = in front, positive = waiting behind it, negative = already passed
  const offset = useTransform(progress, (v) => index - v * (total - 1));
  const x = useTransform(offset, (o) => (o >= 0 ? `${Math.min(o, 3) * STEP}%` : `${Math.max(o, -2) * 75}%`));
  const y = useTransform(offset, (o) => -clamp(o, 0, 3) * 14);
  const rotateY = useTransform(offset, (o) => (reduceMotion ? 0 : clamp(o, -1, 1) * 16));
  const scale = useTransform(offset, (o) => (o >= 0 ? 1 - Math.min(o, 3) * 0.07 : Math.max(0.9, 1 + o * 0.08)));
  const opacity = useTransform(offset, (o) => (o >= 0 ? clamp(3.4 - o, 0, 1) : clamp(1 + o * 1.6, 0, 1)));
  const filter = useTransform(offset, (o) => `brightness(${1 - clamp(o, 0, 3) * 0.06})`);
  const zIndex = useTransform(offset, (o) => Math.round(o >= 0 ? 100 - o * 10 : 120 + o * 10));
  const pointerEvents = useTransform(offset, (o) => (o > 3 || o < -0.8 ? 'none' : 'auto'));

  return (
    <motion.button
      type="button"
      className="group/card col-start-1 row-start-1 w-[74%] cursor-pointer border-0 bg-transparent p-0 text-inherit will-change-[transform,opacity] [-webkit-tap-highlight-color:transparent] focus-visible:rounded-[14px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[10px] focus-visible:outline-accent max-[900px]:w-[68%]"
      style={{ x, y, rotateY, scale, opacity, filter, zIndex, pointerEvents }}
      onClick={onSelect}
      aria-label={`View ${project.name}`}
      aria-current={active ? 'true' : undefined}
    >
      <article className="relative w-full" aria-label={`Project ${index + 1}: ${project.name}`}>
        <div
          className={`${frame} ${active ? 'before:border-accent' : 'before:border-[rgba(224,64,200,0.26)]'}`}
          style={{ '--project-color': project.color } as CSSProperties}
        >
          {project.image ? (
            <img
              className="pointer-events-none block size-full select-none object-cover object-top saturate-[.94] [transition:filter_300ms_ease,transform_500ms_ease] group-hover/card:scale-[1.025] group-hover/card:saturate-[1.08] motion-reduce:transition-none"
              src={project.image}
              alt={`${project.name} project preview`}
              draggable={false}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-[18px] bg-[image:radial-gradient(ellipse,color-mix(in_srgb,var(--project-color)_16%,transparent),transparent_70%)] text-accent">
              <FaLaptopCode className="text-[46px]" aria-hidden="true" />
              <span className="font-display text-[18px] font-bold leading-[1.2]">{project.name}</span>
            </div>
          )}
          <span className="absolute bottom-2.5 right-[13px] z-[3] font-body text-[10px] font-semibold leading-none tracking-[0.15em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </article>
    </motion.button>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const total = projects.length;

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextIndex = Math.round(value * Math.max(0, total - 1));
    setActiveIndex(Math.min(Math.max(0, nextIndex), total - 1));
  });

  // coming back up from the section below: skip the whole stack and land at the top of Projects
  const fromBelow = useRef(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const y = window.scrollY;
      const goingUp = y < lastY.current;
      lastY.current = y;
      const rect = el.getBoundingClientRect();
      const below = rect.bottom < window.innerHeight - 4; // the end of the section has scrolled out of view
      if (goingUp && fromBelow.current && !below) {
        window.scrollTo({ top: y + rect.top, behavior: 'instant' as ScrollBehavior });
      }
      fromBelow.current = below;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToProject = useCallback(
    (index: number) => {
      const section = sectionRef.current;
      if (!section || total <= 1) return;

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress = index / (total - 1);

      window.scrollTo({
        top: sectionTop + scrollableDistance * progress,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    },
    [reduceMotion, total],
  );

  if (total === 0) {
    return (
      <section id="projects" className="section max-[900px]:-mb-[20vh]">
        <SectionTitle word="Projects" decor={decor} />
        <p className="text-center text-[#746b8e]">Projects are coming soon.</p>
      </section>
    );
  }

  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-[700vh] overflow-clip bg-paper px-5 text-ink max-[900px]:min-h-[550vh] max-[900px]:px-3"
      aria-label="Projects gallery"
    >
      <div className="sticky top-0 isolate h-screen max-h-[1000px] min-h-[640px] overflow-hidden max-[900px]:min-h-[620px]">
        <header className="pointer-events-none absolute inset-x-0 top-[clamp(20px,4vh,48px)] z-20 max-[900px]:top-[72px]">
          <SectionTitle word="Projects" decor={decor} />
          <p className="mt-2 flex items-center justify-center gap-[9px] font-body text-[10px] font-bold leading-none tracking-[0.2em] text-[#746b8e]">
            SCROLL TO EXPLORE{' '}
            <span className="animate-wall-hint text-[17px] text-accent motion-reduce:animate-none" aria-hidden="true">
              ↕
            </span>
          </p>
        </header>

        <div className="absolute inset-0 overflow-hidden">
          {/* every card starts in the same grid cell; the scroll fans them out */}
          <div className="absolute bottom-[12%] left-[36%] right-[4%] top-1/4 grid place-items-center [perspective:1400px] max-[900px]:bottom-auto max-[900px]:left-0 max-[900px]:right-0 max-[900px]:top-[200px] max-[900px]:h-[42.5vw]">
            {projects.map((project, index) => (
              <ProjectPanel
                key={project.name}
                project={project}
                index={index}
                total={total}
                progress={scrollYProgress}
                reduceMotion={reduceMotion}
                active={activeIndex === index}
                onSelect={() => goToProject(index)}
              />
            ))}
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-[clamp(24px,5vw,80px)] top-[58%] z-[25] w-[min(400px,34vw)] -translate-y-1/2 lg:w-[min(520px,36vw)] max-[900px]:inset-x-5 max-[900px]:bottom-auto max-[900px]:top-[calc(200px_+_42.5vw_+_16px)] max-[900px]:w-auto max-[900px]:translate-y-0"
          aria-live="polite"
        >
          <div className="animate-wall-info motion-reduce:animate-none" key={activeProject.name}>
            <span className="mb-3 inline-block font-body text-[10px] font-bold leading-[1.4] tracking-[0.18em] text-accent-deep lg:text-xs">
              SELECTED WORK / {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <h3 className="m-0 font-display text-[clamp(28px,3.2vw,46px)] font-bold leading-[1.05] tracking-[-0.045em] text-ink [overflow-wrap:anywhere] lg:text-[clamp(40px,4vw,64px)] max-[900px]:text-[clamp(26px,7vw,36px)]">
              {activeProject.name}
            </h3>

            {activeProject.subtitle && (
              <p className="mt-2 font-body text-sm font-medium leading-[1.4] text-[#746b8e] lg:text-lg">{activeProject.subtitle}</p>
            )}

            <p className="mt-3 line-clamp-3 overflow-hidden font-body text-[13px] leading-[1.65] text-ink opacity-[.78] lg:line-clamp-4 lg:text-base max-[900px]:line-clamp-none max-[900px]:text-[13px]">
              {activeProject.description}
            </p>

            <div className="mt-[13px] flex flex-wrap gap-1.5">
              {activeProject.tags.map((t) => (
                <span key={t} className={tag}>
                  {t}
                </span>
              ))}
            </div>

            <div className="pointer-events-auto mt-[17px] flex flex-wrap items-center gap-[18px]">
              {activeProject.link ? (
                <a className={link} href={activeProject.link} target="_blank" rel="noopener noreferrer">
                  Explore project <FaArrowUpRightFromSquare aria-hidden="true" />
                </a>
              ) : (
                <span className="text-xs text-[#746b8e] lg:text-sm">Project preview</span>
              )}

              {activeProject.github && (
                <a
                  className={link}
                  href={activeProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${activeProject.name} source code on GitHub`}
                >
                  <FaGithub aria-hidden="true" /> Source
                </a>
              )}
            </div>
          </div>

          <nav className="pointer-events-auto mt-[22px] flex items-center gap-[7px]" aria-label="Choose project">
            {projects.map((project, index) => (
              <button
                type="button"
                key={project.name}
                onClick={() => goToProject(index)}
                className={`h-[3px] cursor-pointer rounded-[3px] border-0 p-0 transition-[width,background-color] duration-[250ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none ${
                  index === activeIndex
                    ? 'w-[38px] bg-accent shadow-[0_0_12px_rgba(224,64,200,0.45)]'
                    : 'w-[18px] bg-[rgba(42,27,77,0.2)]'
                }`}
                aria-label={`Go to project ${index + 1}: ${project.name}`}
                aria-current={index === activeIndex ? 'step' : undefined}
              />
            ))}
          </nav>
        </div>

        <span
          className="absolute bottom-[clamp(35px,7vh,80px)] right-[clamp(24px,6vw,90px)] flex items-center gap-2.5 font-body text-[11px] font-semibold leading-none tracking-[0.1em] text-[#746b8e] max-[900px]:hidden"
          aria-hidden="true"
        >
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="block h-px w-[35px] bg-[rgba(42,27,77,0.25)]" />
          {String(total).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}