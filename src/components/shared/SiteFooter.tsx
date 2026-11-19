import { Logo } from './Logo';

/** One slim black strip at the bottom of every page, the same as PMC ID. */
export function SiteFooter() {
  return (
    <footer className="foot">
      <a className="foot-mark" href="https://pmcstudios.uk/" aria-label="PMC Studios"><Logo className="mark" label="PMC" /></a>
      <span className="c">&copy; 2026 PMC Studios</span>
      <a href="https://pmcstudios.uk/privacy">Privacy</a>
      <a href="https://pmcstudios.uk/terms">Terms</a>
    </footer>
  );
}
