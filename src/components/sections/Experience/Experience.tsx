import { useCallback, useEffect, useRef, useState } from 'react';
import { FaGraduationCap, FaBriefcase, FaBook, FaPencilAlt, FaAward } from 'react-icons/fa';
import { experience } from '../../../data/experience';
import { useInView } from '../../../hooks/useInView';
import type { ExperienceItem } from '../../../types';
import SectionTitle from '../../ui/SectionTitle';
import type { TitleDecor } from '../../ui/SectionTitle';
import Lightbox from '../../ui/Lightbox';

const decor: TitleDecor[] = [
  { icon: <FaGraduationCap />, x: 5, y: 6, r: -10 },
  { icon: <FaBook />, x: 26, y: 62, r: 10 },
  { icon: <FaPencilAlt />, x: 49, y: 6, r: 14 },
  { icon: <FaAward />, x: 70, y: 62, r: -8 },
  { icon: <FaBriefcase />, x: 90, y: 6, r: 8 },
];

const LINE_SECONDS = 2.2; // how long the line takes to grow to the last dot
const DOT_CENTER = 17; // dot centre from the top of an item (4px top margin + half of the 26px dot)

const KIND: Record<string, string> = {
  internship: 'bg-[#FBE3F7] text-[#8F1F82]',
  education: 'bg-[#FFE8D6] text-[#A3430C]',
};

// the certificate pop-up only exists where there is room beside the card (1340px and up)
const pop =
  'hidden min-[1340px]:block absolute left-[calc(100%_+_24px)] top-1/2 z-[6] m-0 w-[clamp(180px,calc((100vw_-_900px)_/_2_-_44px),250px)] -translate-y-1/2 -rotate-[4deg] scale-[.88] origin-left ' +
  'cursor-zoom-in rounded-[14px] border border-line bg-white p-2 shadow-[0_30px_50px_-20px_rgba(42,27,77,0.5)] ' +
  'invisible opacity-0 pointer-events-none [transition:opacity_.3s_ease,transform_.45s_cubic-bezier(.3,1.5,.5,1),visibility_0s_linear_.45s] motion-reduce:transition-none ' +
  'group-hover/card:visible group-hover/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:rotate-2 group-hover/card:scale-100 group-hover/card:[transition-delay:0s] ' +
  'group-focus-within/card:visible group-focus-within/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:rotate-2 group-focus-within/card:scale-100 group-focus-within/card:[transition-delay:0s] ' +
  // invisible bridge over the gap so the pop-up stays open while the mouse moves to it, and the little arrow
  'after:absolute after:inset-y-0 after:-left-7 after:w-7 ' +
  'before:absolute before:-left-[9px] before:top-1/2 before:size-4 before:-translate-y-1/2 before:rotate-45 before:border-b before:border-l before:border-line before:bg-white';

export default function Experience() {
  const [listRef, seen] = useInView<HTMLDivElement>(0.2);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [viewing, setViewing] = useState<ExperienceItem | null>(null); // the entry whose certificates are open in the viewer
  const [broken, setBroken] = useState<string[]>([]); // entries whose certificate image file is missing

  const openViewer = (item: ExperienceItem) => {
    triggerRef.current = document.activeElement as HTMLElement | null; // so focus can go back afterwards
    setViewing(item);
  };
  const closeViewer = useCallback(() => {
    setViewing(null);
    triggerRef.current?.focus();
  }, []);

  // work out when the growing line reaches each dot, so each point appears right on time
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
      if (items.length === 0) return;
      const dotY = items.map((el) => el.offsetTop + DOT_CENTER);
      const last = dotY[dotY.length - 1];
      list.style.setProperty('--line-h', `${last}px`);
      list.style.setProperty('--line-t', `${LINE_SECONDS}s`);
      items.forEach((el, i) => el.style.setProperty('--d', `${(dotY[i] / last) * LINE_SECONDS}s`));
    };
measure();
document.fonts?.ready.then(measure);
window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [listRef]);

  return (
    <>
      <section id="experience" className="section section--white !pb-16"> 
        <SectionTitle word="Experience" decor={decor} />
        <p className="mx-auto mt-[22px] max-w-[520px] text-center text-[1.05rem] leading-[1.6] text-[rgba(42,27,77,0.75)]">
          Where I studied and where I have worked.
        </p>

        <div ref={listRef} className="relative mx-auto mt-14 w-[min(900px,100%)]">
          {/* the line grows downward and stops at the last dot */}
          <div
            aria-hidden="true"
            className={`absolute left-[11px] top-0 h-[var(--line-h,0px)] w-1 origin-top rounded bg-[image:linear-gradient(to_bottom,var(--accent),#FF8A3D)] transition-transform duration-[var(--line-t,2.2s)] ease-linear motion-reduce:transition-none ${seen ? 'scale-y-100' : 'scale-y-0'}`}
          />
          <ol>
            {experience.map((item, i) => {
              const certs = item.certificates ?? [];
              const hasCert = certs.length > 0 && !broken.includes(item.title);
              return (
                <li
                  key={item.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="relative flex gap-7 pb-9 last:pb-0 hover:z-[5] focus-within:z-[5] max-[520px]:gap-4"
                >
                  {/* each dot pops in when the line reaches it (--d is that moment) */}
                  <span
                    aria-hidden="true"
                    className={`relative z-[1] mt-1 box-border size-[26px] flex-none rounded-full border-[5px] border-accent bg-white transition-transform duration-500 ease-[cubic-bezier(0.3,1.7,0.5,1)] delay-[var(--d,0s)] motion-reduce:transition-none ${seen ? 'scale-100' : 'scale-0'}`}
                  />
                  <article
                    className={`group/card relative min-w-0 flex-1 rounded-[18px] border border-line bg-white px-7 py-6 shadow-[0_18px_30px_-22px_rgba(42,27,77,0.4)] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] delay-[calc(var(--d,0s)_+_.12s)] motion-reduce:transition-none max-[520px]:p-[18px] ${seen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
                    tabIndex={hasCert ? 0 : undefined}
                  >
                    <div className="mb-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
                      <span className={`inline-flex items-center gap-[7px] rounded-full px-3 py-1 text-[.8rem] font-bold ${KIND[item.kind]}`}>
                        {item.kind === 'internship' ? <FaBriefcase aria-hidden="true" /> : <FaGraduationCap aria-hidden="true" />}
                        {item.kind === 'internship' ? 'Internship' : 'Education'}
                      </span>
                      <span className="text-[.9rem] font-semibold text-[rgba(42,27,77,0.65)]">{item.year}</span>
                      {hasCert && (
                        <span className="ml-auto hidden text-[.78rem] font-semibold text-[rgba(42,27,77,0.5)] min-[1340px]:inline">
                          Hover to preview
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1.5 font-display text-[clamp(1.1rem,2.2vw,1.4rem)] font-extrabold leading-[1.2]">{item.title}</h3>
                    <p className="mb-2.5 font-semibold">{item.place}</p>
                    {item.desc && <p className="leading-[1.6] text-[rgba(42,27,77,0.8)]">{item.desc}</p>}
                    {item.tags && (
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies used">
                        {item.tags.map((tag) => (
                          <li key={tag} className="rounded-full bg-[#F2E8FF] px-[11px] py-[3px] text-[.78rem] font-semibold text-[#6B2FA8]">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}

                    {hasCert && (
                      <>
                        <button type="button" className="btn btn--outline btn--sm mt-3.5" onClick={() => openViewer(item)}>
                          {certs.length > 1 ? `View certificates (${certs.length})` : 'View certificate'}
                        </button>
                        <figure className={pop} title="Click to enlarge" onClick={() => openViewer(item)}>
                          <img
                            className="block h-auto w-full rounded-lg"
                            src={certs[0].src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            onError={() => setBroken((prev) => [...prev, item.title])}
                          />
                          <figcaption className="mt-2 text-center text-xs font-bold text-[#6B2FA8]">
                            {certs.length > 1 ? `${certs.length} documents · click to view` : 'Certificate · click to enlarge'}
                          </figcaption>
                        </figure>
                      </>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {viewing?.certificates && <Lightbox title={viewing.title} items={viewing.certificates} onClose={closeViewer} />}
    </>
  );
}