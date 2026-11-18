import type { ReactNode } from 'react';

/**
 * The title at the top of a plain page (Settings, Privacy, Suggest): a flat green field, the name in huge capitals, one short line.
 * Give it a picture (a glyph) when the page has one.
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
