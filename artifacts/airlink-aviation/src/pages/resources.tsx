import { useMemo, useState } from 'react';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { useGetResources } from '@workspace/api-client-react';
import type { Resource } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { CtaBand, EmptyBlock, ErrorBlock, LoadingBlock, PageHero, Section, SectionHeading } from '@/components/site/ui';

/** Quick references drawn directly from the Airlink presentation. */
const quickReferences: { title: string; product: string; href: string; rows: { label: string; value: string }[] }[] = [
  {
    title: 'Cable harness categories',
    product: 'Cable & Wire Harness Solutions',
    href: '/products/cable-wire-harness-solutions',
    rows: [
      { label: 'Simple', value: 'Pig tail, back-to-back, non-EMI/EMC, lacing and bundling' },
      { label: 'Medium', value: 'Backshell connections, metal braiding, backpotting, soldering' },
      { label: 'Complex', value: 'Multiple branches with routings, 1:1 drawings, big looms with critical processes' },
    ],
  },
  {
    title: 'RF cable assemblies',
    product: 'RF Cable Assemblies',
    href: '/products/rf-cable-assemblies',
    rows: [
      { label: 'Connectors', value: 'SMA, N-Type, BNC, MMCX, MCX, TNC and other RF connectors' },
      { label: 'Impedance', value: '50Ω and 75Ω cable harnesses' },
      { label: 'Semi-rigid / rigid', value: 'EMI shielding, phase stability and low loss, DC to 67+ GHz' },
    ],
  },
  {
    title: 'Fiber optic colour coding',
    product: 'Fiber Optic Cable Assemblies',
    href: '/products/fiber-optic-interconnect-solutions',
    rows: [
      { label: 'Blue', value: 'Single-Mode PC' },
      { label: 'Green', value: 'Single-Mode APC' },
      { label: 'Beige', value: 'Multimode PC' },
      { label: 'Aqua', value: 'Multimode PC with OM3 or OM4 fiber' },
    ],
  },
  {
    title: 'Fiber optic fan-out dimensions',
    product: 'Fiber Optic Cable Assemblies',
    href: '/products/fiber-optic-interconnect-solutions',
    rows: [
      { label: 'Fan-out length', value: '12 inches typical; can be specified' },
      { label: 'Fan-out tolerance', value: '+2.0 in / −0.0 in typical' },
      { label: 'Breakout behind plug', value: '6 inches standard; ±1.0 in typical' },
    ],
  },
];

function ResourceRow({ resource }: { resource: Resource }) {
  const external = /^https?:\/\//i.test(resource.href);
  const linkClass = 'link-arrow w-fit';
  return (
    <article className="grid gap-4 py-8 md:grid-cols-[160px_1fr_auto] md:items-center md:gap-8">
      <div>
        <p className="eyebrow">{resource.type}</p>
        <p className="mt-2 text-[11px] text-steel">{resource.category}</p>
      </div>
      <div>
        <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{resource.title}</h3>
        <p className="copy mt-2 max-w-2xl">{resource.description}</p>
      </div>
      {external ? (
        <a href={resource.href} target="_blank" rel="noopener noreferrer" className={linkClass} data-testid={`link-resource-${resource.id}`}>
          {resource.actionLabel}
          <MoveUpRight size={14} />
        </a>
      ) : (
        <Link href={resource.href} className={linkClass} data-testid={`link-resource-${resource.id}`}>
          {resource.actionLabel}
          <ArrowRight size={14} />
        </Link>
      )}
    </article>
  );
}

export default function Resources() {
  const [category, setCategory] = useState('All');
  const allQuery = useGetResources();
  const resultsQuery = useGetResources(category === 'All' ? undefined : { category });
  const resources = allQuery.data ?? [];
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(resources.map((resource) => resource.category))).sort((a, b) => a.localeCompare(b))],
    [resources],
  );
  const visible = (resultsQuery.data ?? []).filter((resource) => category === 'All' || resource.category === category);
  const retry = () => {
    void allQuery.refetch();
    void resultsQuery.refetch();
  };

  return (
    <Layout>
      <main>
        <PageHero eyebrow="Resources" title="Technical reference for the next decision.">
          <span>Quick references drawn from Airlink’s product information, and the resources published by the team. If you need a document or reference not shown here, send us an enquiry.</span>
        </PageHero>

        <Section>
          <SectionHeading eyebrow="Quick reference" title="Key technical information at a glance." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {quickReferences.map((reference) => (
              <article key={reference.title} className="flex flex-col border border-line bg-white p-8">
                <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{reference.title}</h3>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  {reference.rows.map((row) => (
                    <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[.7fr_1.3fr] sm:gap-4">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">{row.label}</dt>
                      <dd className="text-[12px] font-semibold leading-6 text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={reference.href} className="link-arrow mt-auto pt-7">
                  {reference.product} <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section tone="paper">
          <SectionHeading eyebrow="Published resources" title="Documents and references." />
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`min-h-10 border px-4 text-[11px] font-semibold transition ${category === item ? 'border-navy bg-navy text-white' : 'border-line bg-white text-[#42535c] hover:border-navy'}`}
                data-testid={`button-resource-filter-${item.toLowerCase().replace(/\s/g, '-')}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-8">
            {allQuery.isLoading || resultsQuery.isLoading ? (
              <LoadingBlock label="Loading published resources" />
            ) : allQuery.isError || resultsQuery.isError ? (
              <ErrorBlock retry={retry} label="The resource library could not be loaded." />
            ) : visible.length ? (
              <div className="divide-y divide-line border-y border-line">
                {visible.map((resource) => (
                  <ResourceRow key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <EmptyBlock label={resources.length ? 'No resources are published in this category.' : 'No additional documents are published yet. Send an enquiry for any technical reference you need.'} />
            )}
          </div>
        </Section>

        <CtaBand title="Need a specific technical document?" testId="link-resources-contact">
          Tell the Airlink team what you are looking for.
        </CtaBand>
      </main>
    </Layout>
  );
}
