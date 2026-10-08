import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import { useGetProducts } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { resolveProduct } from '@/components/site/product';
import { CtaBand, EmptyBlock, ErrorBlock, Eyebrow, ImagePanel, LoadingBlock, PageHero, Section, SectionHeading } from '@/components/site/ui';
import { HARNESS_SLUG, orderBySlug } from '@/content/catalogue';
import { additionalMarkets, harnessCapabilities, harnessTypes, industries, lifecycle } from '@/content/company';

const harnessApproach = [
  'Designed in-house with dedicated engineers',
  '1:1 drawing creation, used in routings for complex harnesses',
  'Backshell connections, metal braiding, backpotting and soldering for medium harnesses',
  'Big looms with all types of connector, with soldering and critical processes',
  'Built to Print, or Built to Specification from performance and functional requirements',
  'Product development, prototyping, testing and qualification',
];

export default function About() {
  const productsQuery = useGetProducts();
  const products = orderBySlug(productsQuery.data ?? []);

  return (
    <Layout>
      <main>
        <PageHero eyebrow="About Airlink Aviation" title="Engineering and manufacturing for aerospace and defence.">
          <span>
            Airlink Aviation Pvt Ltd offers design and in-house manufacturing, with capability across all types of harness and system integration, for defence, aerospace, naval and military applications.
          </span>
        </PageHero>

        {/* Company overview */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <SectionHeading eyebrow="Company overview" title="Designed and built in-house." />
            <div className="grid gap-6 lg:pt-10">
              <p className="copy">
                Airlink designs in-house with dedicated engineers. Development covers product development, prototyping, testing and qualification, and manufacturing is carried out in-house across cable and wire harnesses, electronic sub-systems and integration assemblies.
              </p>
              <p className="copy">
                Alongside its harness work, Airlink designs and manufactures radio simulators and simulator boards, RF and fiber optic cable assemblies, multifunctional displays and control panels, and supports sourcing of connectors, cables and other BOM parts.
              </p>
              <p className="copy">
                The company works from Bengaluru, Karnataka, and serves aerospace, defence, UAV and EV markets, as well as naval and military applications.
              </p>
            </div>
          </div>
        </Section>

        {/* Cable & wire harness: core engineering capability */}
        <Section tone="navy" id="cable-wire-harness">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-[3rem] font-semibold leading-none text-orange">01</span>
                <Eyebrow dark>Core engineering capability</Eyebrow>
              </div>
              <h2 className="mt-7 text-[clamp(2rem,3.8vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.035em]">Cable &amp; Wire Harness Solutions</h2>
              <div className="copy-light mt-7 grid max-w-xl gap-5">
                <p>
                  Cable and wire harnessing is the foundation of Airlink’s engineering. The in-house harness capability offers custom harness solutions of any make and any OEM, with standard MIL cable and specific cable and connector harness solutions.
                </p>
                <p>
                  The capability includes Electrical Wiring Interconnection Systems, high-precision electromechanical systems and mission-critical electronic control systems. Airlink also specialises in RF and flat cable interconnections and provides rugged compact systems for airborne applications, built to meet stringent environmental and operational standards.
                </p>
                <p>Under the Built to Print model, Airlink provides end-to-end EMS solutions for cable and wire harnesses and electronic sub-systems.</p>
              </div>
              <Link href={`/products/${HARNESS_SLUG}`} className="btn btn-accent mt-10" data-testid="link-about-harness">
                View Harness Solutions <ArrowRight size={15} />
              </Link>
            </div>
            <ImagePanel src="/images/products/cable-harness-complex.jpg" alt="Complex multi-branch cable harness assembly" tone="light" className="aspect-[5/4] w-full" padding="p-8 md:p-12" />
          </div>

          <div className="mt-20 grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {harnessCapabilities.map((item) => (
              <article key={item.title} className="bg-navy p-7">
                <span className="block h-[2px] w-7 bg-orange" />
                <h3 className="mt-5 text-[1rem] font-semibold leading-snug">{item.title}</h3>
                <p className="copy-light mt-3">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-20 grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Eyebrow dark>Engineering approach</Eyebrow>
              <h3 className="mt-5 text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.025em]">How harness work is carried out.</h3>
            </div>
            <ul className="grid gap-4">
              {harnessApproach.map((item) => (
                <li key={item} className="flex gap-3 border-b border-white/15 pb-4 text-[12px] leading-6 text-[#d4dfe4]">
                  <Check size={14} className="mt-1 shrink-0 text-orange" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {harnessTypes.map((type, index) => (
              <article key={type.title} className="border border-white/15 p-8">
                <p className="eyebrow eyebrow-light">Category {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 text-[1.35rem] font-semibold">{type.title}</h3>
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

        {/* Approach */}
        <Section>
          <SectionHeading eyebrow="Engineering & production" title="One continuous approach." />
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

        {/* Portfolio */}
        <Section tone="paper">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Portfolio" title="A connected set of capabilities." />
            <Link href="/products" className="link-arrow shrink-0">
              View all products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12">
            {productsQuery.isLoading ? (
              <LoadingBlock />
            ) : productsQuery.isError ? (
              <ErrorBlock retry={() => productsQuery.refetch()} label="Product information could not be loaded." />
            ) : products.length ? (
              <ul className="divide-y divide-line border-y border-line bg-white">
                {products.map((product) => {
                  const view = resolveProduct(product);
                  return (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} className="group grid items-center gap-2 px-4 py-6 transition hover:bg-paper md:grid-cols-[60px_1fr_1.4fr_auto] md:gap-8 md:px-6">
                        <span className="font-display text-[13px] font-semibold text-orange-ink">{view.number}</span>
                        <span className="text-[1.1rem] font-semibold text-ink group-hover:text-orange-ink">{view.name}</span>
                        <span className="copy">{product.shortDescription}</span>
                        <ArrowRight size={16} className="hidden text-navy md:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyBlock label="Products will appear here once published." />
            )}
          </div>
        </Section>

        {/* Markets */}
        <Section>
          <SectionHeading eyebrow="Market & application" title="Work across demanding industries." />
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {industries.map((industry) => (
              <figure key={industry.title}>
                <div className="aspect-[4/3] overflow-hidden bg-navy">
                  <img src={industry.image} alt={industry.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-4 text-[1.1rem] font-semibold text-ink">{industry.title}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-8 text-[12px] text-steel">
            Also serving <span className="font-semibold text-ink">{additionalMarkets.join(' and ')}</span> applications.
          </p>
        </Section>

        <CtaBand title="Talk to the Airlink engineering team." testId="link-about-contact">
          Share your harness or system requirement and we will respond.
        </CtaBand>
      </main>
    </Layout>
  );
}
