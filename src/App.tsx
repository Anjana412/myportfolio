import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import Skills from './components/sections/Skills/Skills';
import Projects from './components/sections/Projects/Projects';
import Experience from './components/sections/Experience/Experience';
import Contact from './components/sections/Contact/Contact';
import './scroll-rise.css'; // delete this line to turn the rising scroll effect off
import Preloader from './components/ui/Preloader';
import FloatingConnect from './components/ui/FloatingConnect';

export default function App() {
  return (
    <>
      <Navbar />
      <Preloader />
      <FloatingConnect />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}
