import { useState } from 'react';
import type { FormEvent } from 'react';
import { FaEnvelope, FaLinkedinIn, FaGithub, FaRegCopy, FaCheck, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import { SITE, SOCIALS } from '../../../data/site';
import { shortenUrl } from '../../../utils';

const links = [
  { label: 'LinkedIn', href: SOCIALS.linkedin, icon: <FaLinkedinIn /> },
  { label: 'GitHub', href: SOCIALS.github, icon: <FaGithub /> },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

const mono = 'font-mono text-[.75rem] uppercase tracking-[.06em]';
const title = 'font-display font-extrabold uppercase leading-[1.05]';
const field = 'grid min-w-0 gap-[7px]';
const label = `${mono} text-[rgba(42,27,77,0.75)]`;
const input =
  'box-border w-full rounded-[10px] border border-line bg-[#FBF9FF] px-4 py-2.5 font-body text-base text-ink transition duration-200 ' +
  'placeholder:text-[rgba(42,27,77,0.45)] focus:border-ink focus:bg-white focus:shadow-[0_0_0_3px_rgba(42,27,77,0.12)] focus:outline-none motion-reduce:transition-none';
const row = 'group flex items-center gap-3.5 border-t border-white/[0.14] py-3 text-white no-underline';
const rowIcon = 'flex size-[38px] flex-none items-center justify-center rounded-[10px] bg-white/10';
const rowLabel = `${mono} mb-0.5 block text-white/55`;
const rowValue = 'block font-semibold [overflow-wrap:anywhere] group-hover:underline';

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE.email}`; // clipboard blocked: open the email app instead
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('company')) return; // hidden field only bots fill in
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim() || `Message from ${name}`;
    const message = String(data.get('message') ?? '').trim();

    if (!SITE.formEndpoint) {
      // no form service set up: open the visitor's email app with everything filled in
      const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section !pb-[90px] !pt-12">   
       <div className="mx-auto grid max-w-[1280px] grid-cols-[1.5fr_1fr] items-stretch gap-6 max-[860px]:grid-cols-1">
        {/* left: the form */}
        <form
          className="grid content-start gap-3 rounded-[24px] border border-line bg-white p-6 max-[860px]:p-5"
          onSubmit={onSubmit}
        >
          <div className={`${mono} flex justify-between gap-3 text-[rgba(42,27,77,0.6)]`}>
            <span>Quick message</span>
            <span>Direct to inbox</span>
          </div>
          <h3 className={`${title} text-[clamp(1.4rem,2.6vw,1.8rem)]`}>Send a message</h3>

          <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <div className={field}>
              <label className={label} htmlFor="ct-name">Your name <b className="font-bold text-[#B3261E]">*</b></label>
              <input className={input} id="ct-name" name="name" type="text" placeholder="Name" autoComplete="name" required />
            </div>
            <div className={field}>
              <label className={label} htmlFor="ct-email">Your email <b className="font-bold text-[#B3261E]">*</b></label>
              <input className={input} id="ct-email" name="email" type="email" placeholder="name@somemail.com" autoComplete="email" required />
            </div>
          </div>
          <div className={field}>
            <label className={label} htmlFor="ct-subject">Subject</label>
            <input className={input} id="ct-subject" name="subject" type="text" placeholder="Job opportunity / Project inquiry" />
          </div>
          <div className={field}>
            <label className={label} htmlFor="ct-message">Message <b className="font-bold text-[#B3261E]">*</b></label>
            <textarea
              className={`${input} min-h-[96px] resize-y`}
              id="ct-message"
              name="message"
              placeholder="Tell me about the role, your project, or anything on your mind..."
              required
            />
          </div>

          <input className="absolute -left-[9999px] size-px overflow-hidden" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" className={`btn btn--dark btn--sq group justify-self-start ${mono}`} disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
            <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
          </button>
          <p
            className={`m-0 min-h-[1.4em] text-[.92rem] font-semibold ${status === 'sent' ? 'text-[#1D7A46]' : status === 'error' ? 'text-[#B3261E]' : ''}`}
            aria-live="polite"
          >
            {status === 'sent' && 'Thanks! Your message is on its way.'}
            {status === 'error' && `Something went wrong. Please email me at ${SITE.email}.`}
          </p>
        </form>

        {/* right: dark card with the details and links */}
        <div className="flex flex-col rounded-[24px] bg-[#151515] p-6 text-white max-[860px]:p-5">
          <h3 className={`${title} text-[clamp(1.4rem,2.4vw,1.8rem)]`}>Let's work together.</h3>
          <p className="mt-3 leading-[1.6] text-white/75">
            Open to {SITE.openTo.toLowerCase()}. Send a message, or reach me directly below.
          </p>

          <ul className="mt-4">
            <li className="flex justify-between gap-4 border-t border-white/[0.14] py-3">
              <span className={`${mono} text-white/55`}>Location</span>
              <span className="text-right font-semibold">{SITE.location}</span>
            </li>
            <li className="flex justify-between gap-4 border-t border-white/[0.14] py-3">
              <span className={`${mono} text-white/55`}>Time zone</span>
              <span className="text-right font-semibold">IST (UTC +5:30)</span>
            </li>
          </ul>

          <ul>
            <li className={row}>
              <span className={rowIcon} aria-hidden="true"><FaEnvelope /></span>
              <a className="min-w-0 text-inherit no-underline" href={`mailto:${SITE.email}`}>
                <span className={rowLabel}>Email</span>
                <span className={rowValue}>{SITE.email}</span>
              </a>
              <button
                type="button"
                className={`${mono} ml-auto inline-flex flex-none cursor-pointer items-center gap-[7px] rounded-lg border border-white/40 bg-transparent px-3 py-[7px] text-white transition-colors duration-200 hover:bg-white hover:text-[#151515] motion-reduce:transition-none`}
                onClick={copyEmail}
              >
                {copied ? <FaCheck aria-hidden="true" /> : <FaRegCopy aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </li>
            {links.map((link) => (
              <li key={link.label}>
                <a className={row} href={link.href} target="_blank" rel="noopener noreferrer">
                  <span className={rowIcon} aria-hidden="true">{link.icon}</span>
                  <span className="min-w-0">
                    <span className={rowLabel}>{link.label}</span>
                    <span className={rowValue}>{shortenUrl(link.href)}</span>
                  </span>
                  <FaExternalLinkAlt
                    className="ml-auto flex-none text-white/55 transition duration-200 group-hover:-translate-y-[3px] group-hover:translate-x-[3px] group-hover:text-white motion-reduce:transition-none"
                    size={13}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}