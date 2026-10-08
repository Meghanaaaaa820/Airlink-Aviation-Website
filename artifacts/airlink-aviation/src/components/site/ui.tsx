import type { ReactNode } from 'react';
import { ArrowRight, CircleAlert } from 'lucide-react';
import { Link } from 'wouter';

/** Section wrapper with consistent horizontal gutters and generous vertical rhythm. */
export function Section({
  children,
  tone = 'white',
  id,
  className = '',
}: {
  children: ReactNode;
  tone?: 'white' | 'paper' | 'navy' | 'ink';
  id?: string;
  className?: string;
}) {
  const tones = {
    white: 'bg-white text-ink',
    paper: 'bg-paper text-ink',
    navy: 'bg-navy text-white',
    ink: 'bg-ink text-white',
  };
  return (
    <section id={id} className={`px-5 py-20 md:px-10 md:py-28 ${tones[tone]} ${className}`}>
      <div className="mx-auto max-w-[1360px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`eyebrow ${dark ? 'eyebrow-light' : ''}`}>{children}</p>;
}

/** Eyebrow + heading + optional intro: the standard section opener. */
export function SectionHeading({
  eyebrow,
  title,
  children,
  dark = false,
  className = '',
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={`mt-5 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {children && <div className={`mt-5 max-w-2xl ${dark ? 'copy-light' : 'copy'}`}>{children}</div>}
    </div>
  );
}

/** Page title block used on all inner pages. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-paper px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
      <div className="mx-auto max-w-[1360px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.3rem,5vw,4.2rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-ink">{title}</h1>
        {children && <div className="copy mt-7 max-w-2xl text-[13px]">{children}</div>}
      </div>
    </section>
  );
}

/** Image shown on a neutral, photographic panel. Dark tone suits images with black backgrounds. */
export function ImagePanel({
  src,
  alt,
  tone = 'light',
  className = '',
  fit = 'contain',
  padding = 'p-8 md:p-12',
}: {
  src: string;
  alt: string;
  tone?: 'light' | 'dark';
  className?: string;
  fit?: 'contain' | 'cover';
  padding?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${tone === 'dark' ? 'bg-[#03080d]' : 'bg-[#eef1f0]'} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : `object-contain ${padding}`} ${tone === 'light' && fit === 'contain' ? 'mix-blend-multiply' : ''}`}
      />
    </div>
  );
}

export function CtaBand({
  eyebrow = 'Next step',
  title,
  children,
  label = 'Request an Enquiry',
  href = '/contact',
  testId = 'link-cta-contact',
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  label?: string;
  href?: string;
  testId?: string;
}) {
  return (
    <section className="bg-navy px-5 py-20 text-white md:px-10 md:py-24">
      <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h2 className="mt-5 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.12] tracking-[-0.03em]">{title}</h2>
          {children && <p className="copy-light mt-5 max-w-xl">{children}</p>}
        </div>
        <Link href={href} className="btn btn-accent shrink-0" data-testid={testId}>
          {label} <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

export function LoadingBlock({ label = 'Loading content' }: { label?: string }) {
  return (
    <div className="grid gap-4" data-testid="status-loading" aria-live="polite">
      <div className="h-3 w-32 animate-pulse bg-[#dce3e0]" />
      <div className="h-28 animate-pulse bg-[#e7ecea]" />
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">{label}</p>
    </div>
  );
}

export function ErrorBlock({ retry, label = 'We could not load this content.' }: { retry?: () => void; label?: string }) {
  return (
    <div className="border border-[#dfb4a5] bg-[#fff7f2] p-6" data-testid="status-error" role="alert">
      <CircleAlert size={19} className="mb-3 text-[#a34e37]" />
      <p className="text-[12px] leading-6 text-[#70483e]">{label}</p>
      {retry && (
        <button type="button" onClick={retry} className="btn btn-outline mt-4 min-h-10 border-[#ad5b43] px-4 text-[#70483e]" data-testid="button-retry">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-[#b9c6c2] bg-paper px-6 py-14 text-center" data-testid="status-empty">
      <p className="text-[12px] text-steel">{label}</p>
    </div>
  );
}
