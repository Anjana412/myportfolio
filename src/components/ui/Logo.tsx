import { Link } from 'react-scroll';
import { SITE } from '../../data/site';

/** "Anjana T": scrolls back to the top. Size it with the className. */
export default function Logo({ className = '' }: { className?: string }) {
  const [first, ...rest] = SITE.name.split(' ');
  return (
    <Link
      to="portfolio"
      smooth
      duration={500}
      className={`logo cursor-pointer font-display font-extrabold leading-none text-ink no-underline ${className}`}
      aria-label="Back to top"
    >
      {first} <span className="ml-[.25em] text-accent">{rest.join(' ')}</span>
    </Link>
  );
}