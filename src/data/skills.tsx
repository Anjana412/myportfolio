import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaGithub, FaFigma } from 'react-icons/fa';
import {
  SiTypescript, SiBootstrap, SiTailwindcss, SiAntdesign, SiExpress, SiJsonwebtokens,
  SiMongodb, SiMongoose, SiPrisma, SiPostman, SiC,
} from 'react-icons/si';
import { MdApi } from 'react-icons/md';
import { VscVscode } from 'react-icons/vsc';
import type { Skill, SkillGroup } from '../types';

export const skillGroups: SkillGroup[] = ['Frontend', 'Backend', 'Database & ORM', 'Tools & more'];

// Icons sit on a dark tile, so every colour below stays readable.
export const skills: Skill[] = [
  { name: 'HTML5', group: 'Frontend', icon: <FaHtml5 className="text-orange-500" /> },
  { name: 'CSS3', group: 'Frontend', icon: <FaCss3Alt className="text-blue-400" /> },
  { name: 'JavaScript', group: 'Frontend', icon: <FaJs className="text-yellow-400" /> },
  { name: 'TypeScript', group: 'Frontend', icon: <SiTypescript className="text-sky-400" /> },
  { name: 'React.js', group: 'Frontend', icon: <FaReact className="text-cyan-400" /> },
  { name: 'Tailwind CSS', group: 'Frontend', icon: <SiTailwindcss className="text-teal-400" /> },
  { name: 'Bootstrap', group: 'Frontend', icon: <SiBootstrap className="text-violet-300" /> },
  { name: 'Ant Design', group: 'Frontend', icon: <SiAntdesign className="text-red-400" /> },

  { name: 'Node.js', group: 'Backend', icon: <FaNodeJs className="text-green-500" /> },
  { name: 'Express.js', group: 'Backend', icon: <SiExpress className="text-gray-200" /> },
  { name: 'REST APIs', group: 'Backend', icon: <MdApi className="text-emerald-300" /> },
  { name: 'JWT Auth', group: 'Backend', icon: <SiJsonwebtokens className="text-pink-400" /> },

  { name: 'MongoDB', group: 'Database & ORM', icon: <SiMongodb className="text-green-400" /> },
  { name: 'Mongoose', group: 'Database & ORM', icon: <SiMongoose className="text-red-400" /> },
  { name: 'Prisma ORM', group: 'Database & ORM', icon: <SiPrisma className="text-slate-100" /> },

  { name: 'GitHub', group: 'Tools & more', icon: <FaGithub className="text-white" /> },
  { name: 'VS Code', group: 'Tools & more', icon: <VscVscode className="text-sky-400" /> },
  { name: 'Postman', group: 'Tools & more', icon: <SiPostman className="text-orange-500" /> },
  { name: 'Figma', group: 'Tools & more', icon: <FaFigma className="text-fuchsia-400" /> },
  { name: 'C', group: 'Tools & more', icon: <SiC className="text-blue-400" /> },
];
