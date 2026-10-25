import type { ExperienceItem } from '../types';

// Oldest first: college, then the internships (this feeds the Experience section). To add an entry, copy one block and fill it in.
// For a certificate pop-up, put the image in public/certificates and list it under `certificates`.
export const experience: ExperienceItem[] = [
  {
    kind: 'education',
    title: 'BSc Computer Science',
    year: 'Aug 2022 – Mar 2025',
    // TODO: your résumé says Kannur University, your old site named this college. Check this line.
    place: 'Co-operative Arts and Science College, Pilathara (Kannur University)',
    desc: 'Studied data structures, algorithms and web development.',
  },
  {
    kind: 'internship',
    title: 'MERN Stack Intern',
    year: 'Jun 2025 – Dec 2025',
    place: 'Softroniics, Kozhikode',
    desc: 'Built full-stack apps and REST APIs with the MERN stack.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    certificates: [
      { src: '/certificates/softroniics-certificate.jpg', label: 'Internship certificate' },
      { src: '/certificates/softroniics-letter.jpg', label: 'Experience letter' },
    ],
  },
  {
    kind: 'internship',
    title: 'Full Stack Developer Intern',
    year: 'Apr 2026 – Oct 2026',
    place: '4 Hand Studio Pvt. Ltd, Kochi',
    desc: 'Worked on a multi-tenant CRM app: chat and notification features.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'Prisma'],
    certificates: [{ src: '/certificates/4-hand-studio.jpg', label: 'Internship certificate' }],
  },
];
