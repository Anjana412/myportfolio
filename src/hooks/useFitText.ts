import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface FitOptions {
  /** share of the available width the text should fill (1 = all of it); a function lets it change with the screen size */
  fill?: number | (() => number);
  /** biggest font size allowed, in px */
  max?: number;
  /** measure the element's children added together instead of its own text (used for the hero letters).
   *  A child marked data-fixed keeps its own width instead of scaling with the font;
   *  a visible child marked data-break starts a new line, and the longest line decides the size. */
  children?: boolean;
  /** called after every fit, e.g. to position something relative to the text */
  onFit?: () => void;
}

/**
 * Sizes the text so it fits the width of its parent exactly, whatever the font and screen.
 * It measures the text at 100px, then scales the font size to fit.
 */
export function useFitText(ref: RefObject<HTMLElement | null>, { fill = 1, max = Infinity, children = false, onFit }: FitOptions = {}) {
  const onFitRef = useRef(onFit);
  onFitRef.current = onFit;

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let lastWidth = -1;
    const fit = () => {
      el.style.fontSize = '100px';
      let natural = 0; // width that grows with the font
      let fixed = 0; // width that does not
      if (children) {
        let line = 0;
        Array.from(el.children).forEach(child => {
          const node = child as HTMLElement;
          if (node.dataset.fixed !== undefined) {
            fixed += node.offsetWidth;
          } else if (node.dataset.break !== undefined && getComputedStyle(node).display !== 'none') {
            natural = Math.max(natural, line);
            line = 0;
          } else {
            line += node.offsetWidth;
          }
        });
        natural = Math.max(natural, line);
      } else {
        natural = el.offsetWidth; // layout width: not changed by scale or slide animations
      }
      const style = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const room = available * (typeof fill === 'function' ? fill() : fill) - fixed;
      if (natural > 0 && room > 0) {
        el.style.fontSize = `${Math.min(max, (100 * room) / natural)}px`;
      }
      lastWidth = parent.clientWidth;
      onFitRef.current?.();
    };

    fit();
    document.fonts?.ready.then(fit); // measure again once the web font has loaded
    document.fonts?.addEventListener('loadingdone', fit); // and whenever another font finishes loading
    const observer = new ResizeObserver(() => {
      if (parent.clientWidth !== lastWidth) fit();
    });
    observer.observe(parent);
    window.addEventListener('resize', fit); // the photo size depends on the window height too
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', fit);
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [ref, fill, max, children]);
}
