export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 'https://www.linkedin.com/in/me/' becomes 'linkedin.com/in/me' */
export const shortenUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
