import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import { useGetProducts } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { ProductCard } from '@/components/site/product';
import { CtaBand, EmptyBlock, ErrorBlock, Eyebrow, ImagePanel, LoadingBlock, Section, SectionHeading } from '@/components/site/ui';
import { HARNESS_SLUG, orderBySlug } from '@/content/catalogue';
import { additionalMarkets, company, harnessCapabilities, harnessTypes, industries, lifecycle, manufacturingModels } from '@/content/company';

const harnessImages = [
  { src: '/images/products/cable-harness-solutions-clean.jpg', tone: 'light' as const, alt: 'Simple cable harness with circular connector' },
  { src: '/images/products/cable-harness-medium.png', tone: 'dark' as const, alt: 'Medium cable harness with backshell connectors' },
  { src: '/images/products/cable-harness-complex.jpg', tone: 'light' as const, alt: 'Complex multi-branch cable harness' },
];

export default function Home() {
  const productsQuery = useGetProducts();
  const products = orderBySlug(productsQuery.data ?? []).slice(0, 6);

  return (
    <Layout>
      <main>
        {/* 1. Hero */}
        <section className="relative isolate overflow-hidden bg-ink text-white">
          <img src="/hero-hanger.png" alt="Aircraft inside an aerospace hangar at dusk" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,34,.94)_0%,rgba(7,21,34,.78)_40%,rgba(7,21,34,.25)_100%)]" />
          <div className="mx-auto flex min-h-[620px] max-w-[1360px] flex-col justify-center px-5 py-24 md:min-h-[720px] md:px-10">
            <div className="airlink-fade-up max-w-[680px]">
              <Eyebrow dark>Airlink Aviation Pvt Ltd</Eyebrow>
              <h1 className="mt-7 text-[clamp(2.6rem,5.6vw,4.9rem)] font-semibold leading-[1.04] tracking-[-0.04em]">
                Engineered connections for aerospace and defence.
              </h1>
              <p className="mt-7 max-w-[520px] text-[13px] leading-[1.9] text-[#d4dfe4]">
                Design and in-house manufacturing of cable and wire harnesses, electronic sub-systems and system integration, designed by dedicated in-house engineers.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/products/${HARNESS_SLUG}`} className="btn btn-accent" data-testid="link-hero-harness">
                  Cable &amp; Wire Harness Solutions <ArrowRight size={15} />
                </Link>
                <Link href="/capabilities" className="btn btn-outline-light" data-testid="link-hero-capabilities">
                  Our capabilities
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/15 bg-ink/50 backdrop-blur-sm">
            <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-10 gap-y-2 px-5 py-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9d6dc] md:px-10">
              <span className="text-orange">Markets</span>
              {industries.map((item) => (
                <span key={item.title}>{item.title}</span>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Positioning */}
        <Section>
          <div className="grid gap-12 md:grid-cols-[1.25fr_.75fr] md:items-end">
            <div>
              <Eyebrow>Who we are</Eyebrow>
              <p className="mt-6 text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold leading-[1.28] tracking-[-0.03em] text-ink">
                Design and in-house manufacturing, with capability across every type of harness and system integration.
              </p>
            </div>
            <div className="grid gap-6 border-l-2 border-orange pl-7">
              {['We design in-house with dedicated engineers', 'Product development, prototyping, testing and qualification', 'End-to-end solutions for cable and wire harnesses and electronic sub-systems'].map((item) => (
                <p key={item} className="copy">{item}</p>
              ))}
            </div>
          </div>
        </Section>

        {/* 3. Cable & Wire Harness Solutions: primary capability */}
        <Section tone="navy" id="cable-wire-harness">
          <div className="grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-[3rem] font-semibold leading-none text-orange">01</span>
                <Eyebrow dark>Core capability</Eyebrow>
              </div>
              <h2 className="mt-7 text-[clamp(2rem,3.8vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.035em]">Cable &amp; Wire Harness Solutions</h2>
              <p className="copy-light mt-6 max-w-xl">
                Airlink’s in-house harness capability delivers custom harness solutions of any make and any OEM, using standard MIL cable and specific cable and connector solutions. It extends to specialty RF and flat cable interconnections and rugged compact systems for airborne applications, built to meet stringent environmental and operational standards.
              </p>
              <ul className="mt-9 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {harnessCapabilities.map((item) => (
                  <li key={item.title} className="flex gap-2.5 text-[12px] leading-5 text-[#dbe5e9]">
                    <Check size={14} className="mt-[3px] shrink-0 text-orange" />
                    {item.title}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/products/${HARNESS_SLUG}`} className="btn btn-accent" data-testid="link-home-harness">
                  View Details <ArrowRight size={15} />
                </Link>
                <Link href={`/contact?product=${HARNESS_SLUG}`} className="btn btn-outline-light">
                  Request an Enquiry
                </Link>
              </div>
            </div>
            <ImagePanel src="/images/products/cable-harness-solutions-clean.jpg" alt="Cable and wire harness with circular connector" tone="light" className="aspect-[5/4] w-full" padding="p-6 md:p-10" />
          </div>

          <div className="mt-20 grid gap-px bg-white/15 md:grid-cols-3">
            {harnessTypes.map((type, index) => (
              <article key={type.title} className="bg-navy p-8 md:p-10">
                <ImagePanel src={harnessImages[index].src} alt={harnessImages[index].alt} tone={harnessImages[index].tone} className="mb-8 h-44" padding="p-3" />
                <p className="eyebrow eyebrow-light">Category {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-[1.35rem] font-semibold">{type.title}</h3>
                <ul className="mt-5 grid gap-2.5">
                  {type.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[12px] leading-5 text-[#b9c7ce]">
                      <span className="mt-[9px] h-px w-3 shrink-0 bg-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        {/* 4. Core capabilities */}
        <Section>
          <SectionHeading eyebrow="Core capabilities" title="From design to integration, under one roof.">
            Airlink designs, develops, manufactures and integrates in-house.
          </SectionHeading>
          <div className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {lifecycle.map((step) => (
              <article key={step.number} className="border-b border-line py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-l lg:first:border-l-0">
                <p className="font-display text-[13px] font-semibold text-orange-ink">{step.number}</p>
                <h3 className="mt-3 text-[1.35rem] font-semibold text-ink">{step.title}</h3>
                <p className="copy mt-3">{step.text}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* 5. Featured products */}
        <Section tone="paper">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Products & solutions" title="Engineering across the system." />
            <Link href="/products" className="link-arrow shrink-0" data-testid="link-featured-all">
              View all products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-14">
            {productsQuery.isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <LoadingBlock />
                <LoadingBlock />
                <LoadingBlock />
              </div>
            ) : productsQuery.isError ? (
              <ErrorBlock retry={() => productsQuery.refetch()} label="The product catalogue could not be loaded." />
            ) : products.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyBlock label="Products will appear here once published." />
            )}
          </div>
        </Section>

        {/* 6. Built to Print / Built to Specification */}
        <Section tone="ink">
          <SectionHeading eyebrow="Manufacturing models" title="Built to Print. Built to Specification." dark>
            The manufacturing model follows what the customer provides: a detailed design, or the performance and functional requirements.
          </SectionHeading>
          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-2">
            {Object.values(manufacturingModels).map((model) => (
              <article key={model.title} className="bg-ink p-8 md:p-12">
                <p className="eyebrow eyebrow-light">{model.label}</p>
                <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.025em]">{model.title}</h3>
                <p className="mt-2 text-[12px] font-semibold text-orange">{model.summary}</p>
                <p className="copy-light mt-5">{model.text}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* 7. Industries and applications */}
        <Section>
          <SectionHeading eyebrow="Market & application" title="Built for demanding applications." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry, index) => (
              <article key={industry.title} className="group relative aspect-[4/5] overflow-hidden bg-navy">
                <img src={industry.image} alt={industry.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className="font-display text-[12px] font-semibold text-orange">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-[1.4rem] font-semibold">{industry.title}</h3>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-[12px] text-steel">
            Also serving <span className="font-semibold text-ink">{additionalMarkets.join(' and ')}</span> applications.
          </p>
        </Section>

        {/* 8. Capability statement */}
        <Section tone="paper">
          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Airlink Aviation Pvt Ltd</Eyebrow>
            <p className="mt-7 text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-ink">{company.statement}</p>
          </div>
        </Section>

        {/* 9. CTA */}
        <CtaBand title="Have a harness or system requirement?" testId="link-home-contact">
          Share the requirement and the Airlink engineering team will respond.
        </CtaBand>
      </main>
    </Layout>
  );
}
