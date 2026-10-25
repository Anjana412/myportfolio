import type { Project } from '../types';
import hrmsImage from '../assets/images/hrms.png';
import expenseImage from '../assets/images/expensetracker.png';
import zerowindImage from '../assets/images/zerowind.png';
import handloomImage from '../assets/images/handloom.png';
import fragranziaImage from '../assets/images/fragranziapro.png';
import portfolioImage from '../assets/images/portfoliopro.png';

// All your projects, in the order they appear in the slider. To add one, copy a block.
// `link` and `github` are optional: without a link the card says "Live link coming soon".
export const projects: Project[] = [
  {
    name: 'HRMS',
    subtitle: 'Human Resource Management System',
    description:
      'A web-based application designed to manage employee information and HR activities. It includes features for employee management, task tracking, and organizing workplace operations. Built using the MERN stack.',
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    color: '#C2410C',
    image: hrmsImage,
    // link: 'https://...',   // add the live link when it is ready
  },
  {
    name: 'Expense Tracker',
    description:
      'A full-stack MERN application for managing personal expenses with role-based access for Users, Admins, and Super Admins. It includes expense management, dashboards, and data visualization using charts. Built with React, Node.js, Express.js, MongoDB, Tailwind CSS, and Recharts.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Recharts'],
    color: '#1B6AAE',
    image: expenseImage,
    link: 'https://expense-tracker-client-jet.vercel.app',
  },
  {
    name: 'ZeroWind',
    description:
      'A responsive web project focused on creating an engaging and modern user interface. Built using React, Tailwind CSS, and Framer Motion, with animations and interactive elements to improve the user experience.',
    tags: ['React.js', 'Tailwind CSS', 'Framer Motion'],
    color: '#B52AA3',
    image: zerowindImage,
    link: 'https://zerowind-frontend.vercel.app',
  },
  {
    name: 'Kuriyapilly Weavers',
    subtitle: 'Society (Handloom)',
    description:
      "A handloom-focused website designed to showcase traditional weaving, products, and the weavers' community. The original project was built using HTML, CSS, and JavaScript, with plans to rebuild it using React and TypeScript and expand it with additional pages.",
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#2E7D5B',
    image: handloomImage,
    // link: 'https://...',   // add the live link when it is ready
  },
  
{
  name: 'Fragranzia',
  description:
    'A fragrance website designed to showcase perfumes through an elegant and visually appealing interface. Built with React, featuring a responsive layout and an engaging browsing experience.',
  tags: ['React', 'CSS', 'JavaScript'],
  color: '#8E44AD',
  image: fragranziaImage,
  link: 'https://anjana412.github.io/fragranzia/',
},

  {
    name: 'Portfolio Site',
    description: 'My earlier personal portfolio website, built with HTML, CSS, Bootstrap, JavaScript, React, and Tailwind CSS.',
    tags: ['React', 'Tailwind CSS', 'Bootstrap'],
    color: '#3B2A5A',
    image: portfolioImage,
    link: 'https://portfolio-anjana-ts-projects.vercel.app/',
  },
];
