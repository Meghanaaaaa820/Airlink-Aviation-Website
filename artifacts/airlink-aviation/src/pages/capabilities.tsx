import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import { Layout } from '@/components/site/layout';
import { CtaBand, Eyebrow, ImagePanel, PageHero, Section, SectionHeading } from '@/components/site/ui';
import { HARNESS_SLUG } from '@/content/catalogue';
import { additionalMarkets, harnessCapabilities, harnessTypes, industries, lifecycle, manufacturingModels, services } from '@/content/company';

const harnessImages = [
  { src: '/images/products/cable-harness-solutions-clean.jpg', tone: 'light' as const, alt: 'Simple cable harness with circular connector' },
  { src: '/images/products/cable-harness-medium.png', tone: 'dark' as const, alt: 'Medium cable harness with backshell connectors' },
  { src: '/images/products/cable-harness-complex.jpg', tone: 'light' as const, alt: 'Complex multi-branch cable harness' },
];

export default function Capabilities() {
  return (
    <Layout>
      <main>
        <PageHero eyebrow="Capabilities" title="Capability from design through integration.">
          <span>
            Design and in-house manufacturing, with capability across all types of harness and system integration. Product development, prototyping, testing and qualification are carried out by dedicated engineers.
          </span>
        </PageHero>

        {/* Cable & wire harness: priority capability */}
        <Section tone="navy" id="cable-wire-harness">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-display text-[3rem] font-semibold leading-none text-orange">01</span>
                <Eyebrow dark>Priority capability</Eyebrow>
              </div>
              <h2 className="mt-7 text-[clamp(2rem,3.8vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.035em]">Cable &amp; Wire Harness Solutions</h2>
            </div>
            <div>
              <p className="copy-light max-w-2xl">
                Custom harness solutions of any make and any OEM, using standard MIL cable with specific cable and connector solutions. The capability covers Electrical Wiring Interconnection Systems, high-precision electromechanical systems and mission-critical electronic control systems, with RF and flat cable interconnections and rugged compact systems for airborne applications.
              </p>
              <Link href={`/products/${HARNESS_SLUG}`} className="link-arrow link-arrow-light mt-6" data-testid="link-capability-harness">
                Explore harness solutions <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <ul className="mt-16 grid gap-x-8 gap-y-4 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {harnessCapabilities.map((item) => (
              <li key={item.title} className="flex gap-2.5 text-[12px] leading-5 text-[#dbe5e9]">
                <Check size={14} className="mt-[3px] shrink-0 text-orange" />
                {item.title}
              </li>
            ))}
          </ul>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {harnessTypes.map((type, index) => (
              <article key={type.title} className="overflow-hidden bg-white text-ink">
                <ImagePanel src={harnessImages[index].src} alt={harnessImages[index].alt} tone={harnessImages[index].tone} className="h-56" padding="p-4" />
                <div className="p-8">
                  <p className="eyebrow">Harness category {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 text-[1.4rem] font-semibold">{type.title}</h3>
                  <ul className="mt-5 grid gap-3">
                    {type.items.map((item) => (
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
        </Section>

        {/* Engineering and production sequence */}
        <Section>
          <SectionHeading eyebrow="Engineering & production" title="Design, development, manufacturing and integration." />
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

        {/* Built to Print / Built to Specification */}
        <Section tone="paper">
          <SectionHeading eyebrow="Manufacturing models" title={<>Built to Print.<br />Built to Specification.</>} />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <article className="border border-line bg-white p-8 md:p-12">
              <p className="eyebrow">{manufacturingModels.builtToPrint.label}</p>
              <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.025em]">{manufacturingModels.builtToPrint.title}</h3>
              <p className="mt-2 text-[12px] font-semibold text-orange-ink">{manufacturingModels.builtToPrint.summary}</p>
              <p className="copy mt-6">{manufacturingModels.builtToPrint.text}</p>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                <div className="grid gap-1 py-4 sm:grid-cols-[.7fr_1.3fr] sm:gap-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">Customer provides</dt>
                  <dd className="text-[12px] font-semibold text-ink">Detailed designs, drawings and specifications</dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[.7fr_1.3fr] sm:gap-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">Airlink builds</dt>
                  <dd className="text-[12px] font-semibold text-ink">Complex electronic systems, components or assemblies to that definition</dd>
                </div>
              </dl>
            </article>
            <article className="border border-line bg-white p-8 md:p-12">
              <p className="eyebrow">{manufacturingModels.builtToSpecification.label}</p>
              <h3 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.025em]">{manufacturingModels.builtToSpecification.title}</h3>
              <p className="mt-2 text-[12px] font-semibold text-orange-ink">{manufacturingModels.builtToSpecification.summary}</p>
              <p className="copy mt-6">{manufacturingModels.builtToSpecification.text}</p>
              <dl className="mt-8 divide-y divide-line border-y border-line">
                <div className="grid gap-1 py-4 sm:grid-cols-[.7fr_1.3fr] sm:gap-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">Customer provides</dt>
                  <dd className="text-[12px] font-semibold text-ink">Performance and functional requirements</dd>
                </div>
                <div className="grid gap-1 py-4 sm:grid-cols-[.7fr_1.3fr] sm:gap-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">Airlink handles</dt>
                  <dd className="text-[12px] font-semibold text-ink">Design, engineering, production and assembly of the finished product</dd>
                </div>
              </dl>
            </article>
          </div>
        </Section>

        {/* Services */}
        <Section>
          <SectionHeading eyebrow="Services" title="Engineering across the product system." />
          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="bg-white p-8">
                <span className="block h-[2px] w-7 bg-orange" />
                <h3 className="mt-5 text-[1.1rem] font-semibold leading-snug text-ink">{service.title}</h3>
                <p className="copy mt-3">{service.text}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* Integration and sourcing */}
        <Section tone="paper">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-line bg-white p-8 md:p-12">
              <Eyebrow>System integration</Eyebrow>
              <h3 className="mt-5 text-[1.6rem] font-semibold leading-snug">Integration of systems and panels.</h3>
              <ul className="mt-7 grid gap-3">
                {[
                  'Panel integration of avionics, LRUs, chassis and other electronic panels',
                  'Design and development of electronic modules such as LRUs and PDU systems',
                  'Integration of panels as per the specification, designed as per the need',
                  'Development of PDUs and PCBs',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12px] leading-6 text-[#46565f]">
                    <Check size={14} className="mt-1 shrink-0 text-orange-ink" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/products/aircraft-hmi-control-panels" className="link-arrow mt-8">
                System &amp; panel integration <ArrowRight size={14} />
              </Link>
            </article>
            <article className="border border-line bg-white p-8 md:p-12">
              <Eyebrow>Sourcing &amp; distribution</Eyebrow>
              <h3 className="mt-5 text-[1.6rem] font-semibold leading-snug">Connectors, cables and BOM parts.</h3>
              <ul className="mt-7 grid gap-3">
                {[
                  'Varieties of connectors sourced directly from the OEM and re-sold',
                  'Different makes and types of cables supplied to DRDO labs',
                  'Support for other assemblies and sourcing of any other BOM parts',
                  'Readymade solutions such as electronic components, software and workstations',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[12px] leading-6 text-[#46565f]">
                    <Check size={14} className="mt-1 shrink-0 text-orange-ink" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/products/mil-grade-circular-connectors" className="link-arrow mt-8">
                Connector &amp; cable sourcing <ArrowRight size={14} />
              </Link>
            </article>
          </div>
        </Section>

        {/* Markets */}
        <Section>
          <SectionHeading eyebrow="Market & application" title="Where this capability is applied." />
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

        <CtaBand title="Have a defined technical requirement?" label="Start an Enquiry" testId="link-capabilities-contact">
          Tell the Airlink team what you are working on.
        </CtaBand>
      </main>
    </Layout>
  );
}
