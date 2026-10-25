import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaBriefcase, FaCode, FaEnvelope, FaFolderOpen, FaHome, FaUser } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { NAV_LINKS } from '../../data/site';

const NAV_ICONS: Record<string, IconType> = {
  portfolio: FaHome,
  about: FaUser,
  skills: FaCode,
  projects: FaFolderOpen,
  experience: FaBriefcase,
  contact: FaEnvelope,
};

// the plum tab, with concave "shoulders" that flow into the top edge
const tab =
  'pointer-events-auto relative mx-auto flex w-fit items-center justify-center rounded-b-[26px] bg-ink transition-[padding] duration-300 motion-reduce:transition-none ' +
  'before:absolute before:-left-[26px] before:top-0 before:size-[26px] before:bg-[image:radial-gradient(circle_at_0_100%,transparent_26px,var(--ink)_26.5px)] ' +
  'after:absolute after:-right-[26px] after:top-0 after:size-[26px] after:bg-[image:radial-gradient(circle_at_100%_100%,transparent_26px,var(--ink)_26.5px)]';

const padTop = 'px-14 pt-4 pb-5 max-[1023px]:px-[26px] max-[1023px]:pt-2 max-[1023px]:pb-3';
const padScrolled = 'px-11 pt-2.5 pb-3.5 max-[1023px]:px-6 max-[1023px]:pt-1.5 max-[1023px]:pb-2.5';

// one link: text on wide screens, icon under 1024px, fuchsia dot when active or hovered
const link =
  'relative cursor-pointer py-1.5 font-medium text-[rgba(247,243,255,0.7)] no-underline transition-colors duration-200 hover:text-paper aria-[current=true]:text-paper motion-reduce:transition-none ' +
  'after:absolute after:-bottom-1.5 after:left-1/2 after:-ml-[3px] after:size-1.5 after:scale-0 after:rounded-full after:bg-accent after:transition-transform after:duration-150 hover:after:scale-100 aria-[current=true]:after:scale-100 motion-reduce:after:transition-none ' +
  'max-[1023px]:grid max-[1023px]:place-items-center max-[1023px]:px-2.5 max-[1023px]:py-[13px] max-[1023px]:after:bottom-0';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(NAV_LINKS[0].to);
  const lock = useRef<number | undefined>(undefined);

  // jump the dot straight to the clicked link and ignore the scroll-spy until the scroll ends
  const go = (to: string) => {
    setActive(to);
    window.clearTimeout(lock.current);
    lock.current = window.setTimeout(() => {
      lock.current = undefined;
    }, 700);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(lock.current);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
      <div className={`${tab} ${scrolled ? padScrolled : padTop}`}>
        <nav aria-label="Main">
          <ul className="flex gap-[30px] max-[1023px]:gap-1">
            {NAV_LINKS.map(({ to, name }) => {
              const Icon = NAV_ICONS[to];
              return (
                <li key={to}>
                  <Link
                    to={to}
                    smooth
                    spy
                    duration={500}
                    offset={-70}
                    className={link}
                    onSetActive={(t) => {
                      if (lock.current === undefined) setActive(t);
                    }}
                    onClick={() => go(to)}
                    aria-current={active === to ? 'true' : undefined}
                    aria-label={name}
                    title={name}
                  >
                    <span className="max-[1023px]:hidden">{name}</span>
                    {Icon && <Icon className="hidden text-[1.15rem] max-[1023px]:block" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}