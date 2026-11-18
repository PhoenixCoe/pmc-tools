import type { ReactNode } from 'react';

/**
 * The title block at the top of a page: a plain paper field, the name in big capitals, one short line, and the halftone in the corner.
 * Give it a picture (a glyph in a coloured tile) when the page has one.
 */
export function Band({ title, line, icon }: { title: string; line?: string; icon?: ReactNode; g?: string; tone?: 'ink' | 'gold' | 'cream'; back?: boolean }) {
  return (
    <header className="tb">
      <div className="ht ht-s" aria-hidden><i /><i /><i /></div>
      <div className="wrap tb-in">
        {icon && <span className="tb-ic" aria-hidden>{icon}</span>}
        <div className="tb-t">
          <h1 className="d">{title}</h1>
          {line && <p className="tx">{line}</p>}
        </div>
      </div>
    </header>
  );
}
