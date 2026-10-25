import { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedinIn, FaIdBadge, FaCoffee, FaLightbulb, FaHeart } from 'react-icons/fa';
import { SITE, SOCIALS } from '../../../data/site';
import { useIdCardPhysics } from '../../../hooks/useIdCardPhysics';
import { shortenUrl } from '../../../utils';
import SectionTitle from '../../ui/SectionTitle';
import type { TitleDecor } from '../../ui/SectionTitle';
import photo from '../../../assets/images/mypic.png';

// the middle of the heading is left free for the card's strap
const decor: TitleDecor[] = [
  { icon: <FaIdBadge />, x: 4, y: 6, r: -10 },
  { icon: <FaCoffee />, x: 25, y: 62, r: 12 },
  { icon: <FaLightbulb />, x: 70, y: 4, r: 8 },
  { icon: <FaHeart />, x: 90, y: 60, r: -10 },
];

const facts = [
  { label: 'Based in', value: SITE.location },
  { label: 'Focus', value: 'Full-stack web apps' },
  { label: 'Main stack', value: 'MongoDB, Express, React, Node.js' },
  { label: 'Open to', value: SITE.openTo },
];

const heading = 'mb-[18px] font-display text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold leading-[1.1]';
const para = 'mb-4 max-w-[470px] text-[1.05rem] leading-[1.7] max-[960px]:max-w-none';
const social =
  'inline-flex size-[42px] items-center justify-center rounded-full border border-line bg-white text-[1.1rem] text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white motion-reduce:transition-none';
const chip =
  'absolute rounded-lg bg-white/95 px-[9px] py-1 font-mono text-xs font-bold text-ink shadow-[0_6px_12px_-6px_rgba(42,27,77,0.5)]';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  useIdCardPhysics(sectionRef, swingRef);

  // tell the CSS how tall the heading is, so the strap can start inside it
  useEffect(() => {
    const inner = innerRef.current;
    const title = inner?.querySelector('h2');
    if (!inner || !title) return;
    const update = () => inner.style.setProperty('--title-h', `${title.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section overflow-clip !pb-[110px] !pt-[100px] [--strap:150px] max-[960px]:[--strap:120px]"    >
      <div
        ref={innerRef}
        className="relative mx-auto min-h-[calc(var(--title-h,100px)_*_.3_+_var(--strap)_+_480px)] max-w-[1100px]"
      >
      <div className="rise-item relative">
          <SectionTitle word="About me" decor={decor} />
          {/* the card hangs from a pin inside the top of the heading */}
          <div className="absolute left-1/2 top-[calc(var(--title-h,100px)_*_.3_-_10px)] z-[2] -ml-[150px] w-[300px]">
            <div
              ref={swingRef}
              className="idcard-swing invisible origin-[50%_10px] touch-manipulation will-change-transform"
              role="img"
              aria-label={`ID card: ${SITE.name}, ${SITE.role}`}
            >
              {/* pin */}
              <div className="relative z-[3] -mb-2.5 mx-auto size-5 rounded-full bg-[image:radial-gradient(circle_at_35%_30%,#fff,#bdbdd0_45%,#75758c)] shadow-[0_2px_5px_rgba(42,27,77,0.45)] after:absolute after:left-1/2 after:top-1/2 after:-ml-1 after:-mt-px after:h-0.5 after:w-2 after:-rotate-[35deg] after:rounded-[1px] after:bg-[rgba(42,27,77,0.55)]" />
              {/* strap (its length grows with --s, which the physics hook sets) */}
              <div className="idcard-strap relative mx-auto h-[calc(var(--strap)_+_var(--s,0px))] w-[34px] bg-ink bg-[image:repeating-linear-gradient(180deg,rgba(255,255,255,0.14)_0_6px,transparent_6px_12px)]" />
              {/* clip and ring */}
              <div className="relative z-[2] -mt-0.5 mx-auto h-7 w-[46px] rounded-[7px] bg-[image:linear-gradient(#d4d4de,#8c8ca0)] shadow-[0_2px_4px_rgba(42,27,77,0.3)]" />
              <div className="relative z-[3] -mb-3.5 -mt-2 mx-auto size-[26px] rounded-full border-[5px] border-[#9a9aae]" />

              <div className="relative flex h-[430px] w-[300px] cursor-grab select-none flex-col rounded-[22px] border border-[color:var(--line-soft)] bg-white px-3.5 pb-[18px] pt-[38px] shadow-[0_34px_50px_-22px_rgba(42,27,77,0.5)]">
                <div className="absolute left-1/2 top-3.5 -ml-[37px] h-2.5 w-[74px] rounded-md bg-[#E9DEFF] shadow-[inset_0_1px_2px_rgba(42,27,77,0.28)]" />
                <div className="relative h-[250px] overflow-hidden rounded-[14px] bg-[image:linear-gradient(135deg,var(--accent)_0%,#FF8A3D_100%)] before:absolute before:left-1/2 before:top-2.5 before:-ml-[113px] before:size-[226px] before:rounded-full before:border-2 before:border-white/40">
                  <img
                    className="pointer-events-none absolute left-1/2 top-[18px] h-auto w-[232px] max-w-none -translate-x-1/2"
                    src={photo}
                    alt=""
                    draggable={false}
                  />
                  <span className={`${chip} left-3.5 top-3.5 -rotate-[8deg]`}>&lt;/&gt;</span>
                  <span className={`${chip} bottom-3.5 right-3.5 rotate-[6deg]`}>{'{ }'}</span>
                </div>
                <p className="mb-1 mt-4 font-display text-[30px] font-extrabold leading-none">
                  {SITE.name.split(' ')[0]} <span className="text-accent">{SITE.name.split(' ').slice(1).join(' ')}</span>
                </p>
                <p className="m-0 text-[13px] text-[rgba(42,27,77,0.7)]">{SITE.role}</p>
                <div className="mt-auto flex items-center gap-2 border-t border-[#EFE7FD] pt-2.5 text-[13px]">
                  <FaGithub aria-hidden="true" />
                  {shortenUrl(SOCIALS.github)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-[1fr_300px_1fr] items-start gap-10 max-[960px]:mt-[calc(var(--strap)_+_490px_-_var(--title-h,60px)_*_.7)] max-[960px]:grid-cols-1 max-[960px]:gap-9">
          <div className='rise-item'>
            <h3 className={heading}>Who am I</h3>
            <p className={para}>
              Hi, I'm <strong>{SITE.name}</strong>, a passionate full-stack web developer who loves turning
              ideas into interactive web experiences.
            </p>
            <p className={para}>
              I specialize in responsive design, clean code, and creative UI effects. I enjoy solving logic
              puzzles, refining layouts, and building visually engaging websites that reflect strong brand
              identity.
            </p>
            <div className="mt-[22px] flex gap-3">
              <a className={social} href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a className={social} href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
          </div>

          <div className="max-[960px]:hidden" aria-hidden="true" />

          <div className='rise-item'>
            <h3 className={heading}>At a glance</h3>
            <dl className="m-0">
              {facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-5 border-b border-line py-[15px] first:border-t">
                  <dt className="text-[.88rem] text-[rgba(42,27,77,0.62)]">{f.label}</dt>
                  <dd className="m-0 text-right font-semibold">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}