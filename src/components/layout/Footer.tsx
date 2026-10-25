import { Link } from 'react-scroll';
import { NAV_LINKS, SITE } from '../../data/site';
import Logo from '../ui/Logo';

const linkCls =
  'cursor-pointer text-[.92rem] font-medium text-[rgba(42,27,77,0.72)] no-underline transition-colors duration-200 hover:text-ink hover:underline motion-reduce:transition-none';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white px-7 py-[34px] text-ink">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-[18px] max-[700px]:flex-col max-[700px]:text-center">
        <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2 max-[700px]:justify-center [&_.logo]:text-[1.5rem]">
          <Logo />
          <p className="m-0 text-[.9rem] text-[rgba(42,27,77,0.65)]">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-[26px] gap-y-2 max-[700px]:justify-center">
            {NAV_LINKS.filter((link) => link.to !== 'portfolio').map(({ to, name }) => (
              <li key={to}>
                <Link to={to} smooth duration={500} offset={-70} className={linkCls}>
                  {name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="portfolio" smooth duration={500} className={`${linkCls} !font-bold !text-ink`}>
                Back to top &uarr;
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}