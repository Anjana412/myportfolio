import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { FaTools, FaBolt, FaTerminal, FaPuzzlePiece, FaCogs } from 'react-icons/fa';
import { skillGroups, skills } from '../../../data/skills';
import { useInView } from '../../../hooks/useInView';
import { prefersReducedMotion } from '../../../utils';
import type { Skill, SkillGroup } from '../../../types';
import SectionTitle from '../../ui/SectionTitle';
import type { TitleDecor } from '../../ui/SectionTitle';

const decor: TitleDecor[] = [
  { icon: <FaTools />, x: 5, y: 6, r: -10 },
  { icon: <FaBolt />, x: 26, y: 62, r: 10 },
  { icon: <FaTerminal />, x: 49, y: 6, r: -6 },
  { icon: <FaPuzzlePiece />, x: 70, y: 62, r: 12 },
  { icon: <FaCogs />, x: 90, y: 6, r: -8 },
];

type Filter = 'All' | SkillGroup;
const FILTERS: Filter[] = ['All', ...skillGroups];
const LEAVE_MS = 180; // how long the cards that do not match take to fade out

const rows: { items: Skill[]; reverse: boolean; seconds: number }[] = [
  { items: skills.filter((_, i) => i % 2 === 0), reverse: false, seconds: 50 },
  { items: skills.filter((_, i) => i % 2 === 1), reverse: true, seconds: 58 },
];
const COPIES = 3; // repeated so the loop never shows a gap

const matches = (filter: Filter, group: SkillGroup) => filter === 'All' || filter === group;

const tile = 'flex items-center justify-center bg-ink';
const indReady =
  '[transition:transform_.5s_cubic-bezier(.3,1.3,.5,1),width_.5s_cubic-bezier(.3,1.3,.5,1),height_.5s_ease] motion-reduce:[transition:none]';
const mask = '[-webkit-mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]';

export default function Skills() {
  const [sectionRef, seen] = useInView<HTMLElement>();
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const oldRects = useRef<Map<string, DOMRect>>(new Map());
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);

  const [active, setActive] = useState<Filter>('All'); // everything is shown first
  const [leaving, setLeaving] = useState<string[]>([]);
  const [ind, setInd] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [ready, setReady] = useState(false);

  const visible = skills.filter((s) => matches(active, s.group));

  // the dark pill behind the chosen filter
  useLayoutEffect(() => {
    const place = () => {
      const el = pillRefs.current[FILTERS.indexOf(active)];
      if (el) setInd({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [active]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true)); // no sliding-in on first paint
    return () => cancelAnimationFrame(id);
  }, []);

  // cards that stay glide to their new places instead of jumping
  useLayoutEffect(() => {
    if (oldRects.current.size === 0) return;
    itemRefs.current.forEach((el, name) => {
      const before = oldRects.current.get(name);
      if (!before) return; // a new card: it pops in by itself
      const after = el.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (dx !== 0 || dy !== 0) {
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
          duration: 450,
          easing: 'cubic-bezier(.2,.8,.2,1)',
        });
      }
    });
    oldRects.current = new Map();
  }, [active]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (next: Filter) => {
    if (next === active) return;
    window.clearTimeout(timer.current);
    if (prefersReducedMotion()) {
      setActive(next);
      return;
    }
    // 1. the cards that do not match fade out  2. the rest glide into place and the new ones pop in
    const leavingNow = (next === 'All' ? visible : visible.filter((s) => !matches(next, s.group))).map((s) => s.name);
    setLeaving(leavingNow);
    timer.current = window.setTimeout(
      () => {
        const rects = new Map<string, DOMRect>();
        itemRefs.current.forEach((el, name) => rects.set(name, el.getBoundingClientRect()));
        oldRects.current = rects;
        setLeaving([]);
        setActive(next);
      },
      leavingNow.length > 0 ? LEAVE_MS : 0,
    );
  };

  return (
    <section id="skills" ref={sectionRef} className="section section--white">
      <SectionTitle word="Skills" decor={decor} />

      <div
        className="relative mx-auto mt-[52px] flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-line-soft bg-[#F4EEFF] p-1.5 max-[640px]:rounded-3xl"
        role="group"
        aria-label="Filter skills"
      >
        <span
          className={`pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-ink ${ready ? indReady : ''}`}
          style={{ width: ind.w, height: ind.h, transform: `translate(${ind.x}px, ${ind.y}px)` }}
          aria-hidden="true"
        />
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            type="button"
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            className={`relative z-[1] inline-flex cursor-pointer items-center rounded-full border-0 bg-transparent px-[18px] py-2.5 font-body text-[.92rem] font-bold transition-colors duration-[250ms] motion-reduce:transition-none max-[640px]:px-3.5 max-[640px]:py-[9px] max-[640px]:text-[.86rem] ${active === filter ? 'text-white' : 'text-ink'}`}
            aria-pressed={active === filter}
            onClick={() => choose(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="mt-[18px] text-center text-[.9rem] text-[rgba(42,27,77,0.65)]" aria-live="polite">
        {active === 'All' ? `All ${skills.length} skills` : `Showing ${visible.length} of ${skills.length} skills`}
      </p>

      {active === 'All' ? (
        <div className={`group/marquee -mx-5 mt-9 grid gap-4 overflow-hidden motion-reduce:mx-0 motion-reduce:[-webkit-mask-image:none] motion-reduce:[mask-image:none] ${mask}`}>
          {rows.map((row, r) => (
            <div
              key={r}
              className="flex w-max animate-sk-slide group-hover/marquee:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none"
              style={{ '--t': `${row.seconds}s`, animationDirection: row.reverse ? 'reverse' : 'normal' } as CSSProperties}
            >
              {Array.from({ length: COPIES }, (_, copy) => (
                <ul
                  key={copy}
                  className={`m-0 flex gap-3.5 pr-3.5 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0 ${copy > 0 ? 'motion-reduce:hidden' : ''}`}
                  aria-hidden={copy > 0}
                >
                  {row.items.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-3 whitespace-nowrap rounded-2xl border border-line-soft bg-[#FBF9FF] py-[9px] pl-[9px] pr-6 font-bold transition duration-[250ms] hover:-translate-y-[3px] hover:border-accent hover:bg-white motion-reduce:transition-none"
                    >
                      <span className={`${tile} size-[46px] rounded-xl text-[1.45rem]`} aria-hidden="true">{skill.icon}</span>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <ul className="mx-auto mt-[34px] flex max-w-[1060px] flex-wrap content-start justify-center gap-4 min-[900px]:min-h-[316px] max-[520px]:gap-3">
          {visible.map((skill, i) => (
            <li
              key={skill.name}
              ref={(el) => {
                if (el) itemRefs.current.set(skill.name, el);
                else itemRefs.current.delete(skill.name);
              }}
              className={`group/card box-border flex w-40 flex-col items-center gap-3.5 rounded-[18px] border border-line-soft bg-[#FBF9FF] px-3 pb-[18px] pt-[22px] max-[520px]:w-[calc(50%_-_6px)] [transition-property:opacity,transform,border-color,box-shadow,background-color] ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${
                seen ? 'animate-sk-pop motion-reduce:animate-none' : 'opacity-0 motion-reduce:opacity-100'
              } ${
                leaving.includes(skill.name)
                  ? 'pointer-events-none scale-[.7] !opacity-0 duration-[180ms]'
                  : 'duration-300 hover:-translate-y-[5px] hover:border-accent hover:bg-white hover:shadow-[0_20px_28px_-18px_rgba(42,27,77,0.45)]'
              }`}
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <span
                className={`${tile} size-16 rounded-2xl text-[2rem] transition-transform duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover/card:-rotate-[7deg] group-hover/card:scale-[1.08] motion-reduce:transition-none`}
                aria-hidden="true"
              >
                {skill.icon}
              </span>
              <span className="text-center text-[.98rem] font-bold">{skill.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}