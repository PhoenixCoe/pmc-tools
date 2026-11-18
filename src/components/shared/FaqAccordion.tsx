import type { FaqItem } from '@/lib/types';

/** Three questions as a ruled list inside a plate. Native <details>: indexable, keyboard-friendly, no JavaScript. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <section className="faqs" aria-labelledby="faq-title">
      <h2 id="faq-title" className="sec-t">Questions</h2>
      <div className="panel faq">
        <ul className="decisions">
          {items.map((f) => (
            <li key={f.q}>
              <details>
                <summary><h3>{f.q}</h3></summary>
                <p className="tx">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
