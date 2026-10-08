import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import type { Product, ProductDetail } from '@workspace/api-client-react';
import { type Block, type ImageTone, HARNESS_SLUG, getCatalogueEntry } from '@/content/catalogue';
import { ImagePanel, Section, SectionHeading } from './ui';

type ProductLike = Pick<Product, 'slug' | 'name' | 'category' | 'shortDescription'> & { image?: string };

/** Merge the API record with catalogue presentation data (number, imagery, highlights). */
export function resolveProduct(product: ProductLike | ProductDetail) {
  const entry = getCatalogueEntry(product.slug);
  const apiImage = product.image && product.image.startsWith('/') ? product.image : undefined;
  return {
    entry,
    name: entry?.displayName ?? product.name,
    number: entry?.number,
    label: entry?.label ?? product.category,
    image: entry?.image ?? apiImage,
    tone: (entry?.imageTone ?? 'light') as ImageTone,
    highlights: entry?.highlights ?? [],
  };
}

export function isHarnessProduct(product: Pick<Product, 'slug'>) {
  return product.slug === HARNESS_SLUG;
}

export function ProductCard({ product }: { product: Product }) {
  const view = resolveProduct(product);
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col border border-line bg-white transition duration-300 hover:border-navy hover:shadow-[0_18px_40px_rgba(7,21,34,0.08)]"
      data-testid={`card-product-${product.id}`}
    >
      {view.image && <ImagePanel src={view.image} alt={view.name} tone={view.tone} className="aspect-[4/3]" padding="p-6 md:p-8" />}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow">{view.label}</span>
          {view.number && <span className="font-display text-[13px] font-semibold text-steel/70">{view.number}</span>}
        </div>
        <h3 className="mt-4 text-[1.3rem] font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-orange-ink">{view.name}</h3>
        <p className="copy mt-3">{product.shortDescription}</p>
        {view.highlights.length > 0 && (
          <ul className="mt-5 grid gap-2">
            {view.highlights.map((item) => (
              <li key={item} className="flex gap-2.5 text-[12px] leading-5 text-[#46565f]">
                <Check size={13} className="mt-[3px] shrink-0 text-orange-ink" />
                {item}
              </li>
            ))}
          </ul>
        )}
        <span className="link-arrow mt-auto pt-7">
          View Details <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

/** Large first-position card used for Cable & Wire Harness Solutions in the catalogue. */
export function FeaturedHarnessCard({ product }: { product: Product }) {
  const view = resolveProduct(product);
  return (
    <article className="grid overflow-hidden bg-navy text-white lg:grid-cols-[1.05fr_.95fr]" data-testid={`card-product-${product.id}`}>
      <Link href={`/products/${product.slug}`} className="block" aria-label={`${view.name} details`}>
        {view.image && <ImagePanel src={view.image} alt={view.name} tone={view.tone} className="min-h-[320px] lg:h-full lg:min-h-[520px]" padding="p-6 md:p-10" />}
      </Link>
      <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
        <div className="flex items-center gap-4">
          <span className="font-display text-[3rem] font-semibold leading-none text-orange">{view.number}</span>
          <span className="eyebrow eyebrow-light">{view.label}</span>
        </div>
        <h2 className="mt-6 text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.03em]">{view.name}</h2>
        <p className="copy-light mt-5 max-w-xl">{product.shortDescription}</p>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            'Simple, medium and complex harnesses',
            'Custom and OEM make-specific harnesses',
            'Standard MIL cables and connectors',
            'EWIS and electromechanical systems',
            'Mission-critical electronic control systems',
            'RF and flat cable interconnections',
          ].map((item) => (
            <li key={item} className="flex gap-2.5 text-[12px] leading-5 text-[#d4dfe4]">
              <Check size={13} className="mt-[3px] shrink-0 text-orange" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={`/products/${product.slug}`} className="btn btn-accent" data-testid="link-featured-harness-details">
            View Details <ArrowRight size={15} />
          </Link>
          <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="btn btn-outline-light">
            Request an Enquiry
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Structured detail blocks                                            */
/* ------------------------------------------------------------------ */

function BlockBody({ block }: { block: Block }) {
  switch (block.type) {
    case 'tiles': {
      const cols = block.columns ?? 3;
      const grid = cols === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
      return (
        <div className={`mt-12 grid gap-px border border-line bg-line ${grid}`}>
          {block.items.map((item) => (
            <article key={item.title} className="bg-white p-7 md:p-8">
              <span className="block h-[2px] w-7 bg-orange" />
              <h3 className="mt-5 text-[1.05rem] font-semibold leading-snug text-ink">{item.title}</h3>
              {item.text && <p className="copy mt-3">{item.text}</p>}
            </article>
          ))}
        </div>
      );
    }
    case 'columns': {
      const grid = block.columns.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : block.columns.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';
      return (
        <div className={`mt-12 grid gap-6 ${grid}`}>
          {block.columns.map((column) => (
            <article key={column.title} className="flex flex-col overflow-hidden border border-line bg-white">
              {column.image && <ImagePanel src={column.image} alt={column.imageAlt ?? column.title} tone={column.imageTone} className="h-52" padding="p-4" />}
              <div className="p-7">
                {column.label && <p className="eyebrow">{column.label}</p>}
                <h3 className="mt-4 text-[1.3rem] font-semibold leading-snug text-ink">{column.title}</h3>
                <ul className="mt-5 grid gap-3">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[12px] leading-5 text-[#46565f]">
                      <span className="mt-[9px] h-px w-3 shrink-0 bg-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      );
    }
    case 'steps':
      return (
        <ol className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {block.steps.map((step, index) => (
            <li key={step.title} className="bg-white p-7 md:p-8">
              <span className="font-display text-[13px] font-semibold text-orange-ink">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-[1.05rem] font-semibold leading-snug text-ink">{step.title}</h3>
              {step.text && <p className="copy mt-3">{step.text}</p>}
            </li>
          ))}
        </ol>
      );
    case 'chips':
      return (
        <div className="mt-12 grid gap-8">
          {block.groups.map((group) => (
            <div key={group.label} className="grid gap-4 border-t border-line pt-6 md:grid-cols-[220px_1fr]">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-steel">{group.label}</p>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="border border-line bg-white px-4 py-2 text-[12px] font-medium text-navy">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case 'figure':
      return (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <figure>
            <ImagePanel src={block.image} alt={block.alt} tone={block.tone} className="aspect-[16/10] border border-line" padding="p-6 md:p-10" />
            <figcaption className="mt-4 text-[11px] leading-5 text-steel">{block.caption}</figcaption>
          </figure>
          {block.facts && (
            <dl className="divide-y divide-line border-y border-line">
              {block.facts.map((fact) => (
                <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[.9fr_1.1fr] sm:gap-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">{fact.label}</dt>
                  <dd className="text-[12px] font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      );
    case 'table':
      return (
        <dl className="mt-12 divide-y divide-line border-y border-line bg-white">
          {block.rows.map((row) => (
            <div key={row.label} className="grid gap-1 px-1 py-5 md:grid-cols-[260px_1fr] md:gap-8 md:px-4">
              <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">{row.label}</dt>
              <dd className="text-[12px] font-semibold leading-6 text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

export function DetailBlocks({ blocks, startTone = 'white' }: { blocks: Block[]; startTone?: 'white' | 'paper' }) {
  return (
    <>
      {blocks.map((block, index) => {
        const paper = (index % 2 === 0) === (startTone === 'paper');
        return (
          <Section key={`${block.type}-${block.title}`} tone={paper ? 'paper' : 'white'}>
            <SectionHeading eyebrow={block.kicker} title={block.title}>
              {block.intro}
            </SectionHeading>
            <BlockBody block={block} />
          </Section>
        );
      })}
    </>
  );
}
