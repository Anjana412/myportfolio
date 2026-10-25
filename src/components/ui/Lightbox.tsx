import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import type { Certificate } from '../../types';

interface LightboxProps {
  title: string;
  items: Certificate[];
  onClose: () => void;
}

const tab =
  'cursor-pointer rounded-full border border-white/50 px-3.5 py-[7px] font-body text-[.85rem] font-semibold transition-colors duration-200 hover:bg-white hover:text-ink motion-reduce:transition-none';

/** Full-size image viewer. Esc, the close button, or a click outside the image closes it; with several images, tabs and the arrow keys switch between them. */
export default function Lightbox({ title, items, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const current = items[index];

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // keep the page from scrolling behind it

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(items.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (e.key !== 'Tab') return;
      // keep keyboard focus inside the viewer
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, items.length]);

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[300] flex animate-lb-fade items-center justify-center bg-[rgba(32,18,60,0.86)] p-7 backdrop-blur-[4px] motion-reduce:animate-none max-[520px]:p-[18px]"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: ${current.label}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-w-[min(94vw,1100px)] animate-lb-pop flex-col gap-3.5 motion-reduce:animate-none">
        <button
          ref={closeRef}
          type="button"
          className="absolute -right-4 -top-4 flex size-[42px] cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[1.1rem] text-ink shadow-[0_8px_18px_-6px_rgba(0,0,0,0.5)] max-[520px]:-right-2 max-[520px]:-top-3"
          aria-label="Close"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <img
          className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full rounded-xl bg-white object-contain shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] max-[520px]:max-h-[62vh]"
          src={current.src}
          alt={`${current.label}: ${title}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-[18px] gap-y-2.5 font-body text-white">
          {items.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  className={`${tab} ${i === index ? 'bg-white text-ink' : 'bg-transparent text-white'}`}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="font-bold">{current.label}</span>
          )}
          <a className="text-[.9rem] text-white" href={current.src} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}