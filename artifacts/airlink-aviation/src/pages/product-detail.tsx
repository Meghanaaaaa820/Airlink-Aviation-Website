import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'wouter';
import { useGetProductBySlug, useGetProducts } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { DetailBlocks, ProductCard, resolveProduct } from '@/components/site/product';
import { CtaBand, ErrorBlock, Eyebrow, ImagePanel, LoadingBlock, Section, SectionHeading } from '@/components/site/ui';

export default function ProductDetailPage({ slug }: { slug: string }) {
  const query = useGetProductBySlug(slug);
  const allQuery = useGetProducts();
  const product = query.data;

  if (query.isLoading) {
    return (
      <Layout>
        <main className="mx-auto max-w-[1360px] px-5 py-24 md:px-10">
          <LoadingBlock label="Loading product" />
        </main>
      </Layout>
    );
  }

  if (query.isError || !product) {
    return (
      <Layout>
        <main className="mx-auto max-w-[1360px] px-5 py-24 md:px-10">
          <ErrorBlock retry={() => query.refetch()} label="This product is unavailable or has not been published." />
          <Link href="/products" className="link-arrow mt-8">
            <ArrowRight size={14} className="rotate-180" /> Back to products
          </Link>
        </main>
      </Layout>
    );
  }

  const view = resolveProduct(product);
  const entry = view.entry;
  const blocks = entry?.blocks ?? [];

  // Related solutions: catalogue-defined first, otherwise whatever the API returns.
  const catalogueRelated = (entry?.related ?? [])
    .map((relatedSlug) => (allQuery.data ?? []).find((candidate) => candidate.slug === relatedSlug))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));
  const related = catalogueRelated.length ? catalogueRelated : (product.relatedProducts ?? []);

  const hasSpecs = Boolean(product.specifications?.length);
  const hasApplications = Boolean(product.applications?.length);
  const detailTone = blocks.length % 2 === 1 ? 'white' : 'paper';
  const relatedTone = detailTone === 'white' ? 'paper' : 'white';

  return (
    <Layout>
      <main>
        {/* Hero */}
        <section className="border-b border-line bg-paper px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
          <div className="mx-auto max-w-[1360px]">
            <Link href="/products" className="link-arrow text-steel" data-testid="link-back-products">
              <ArrowRight size={14} className="rotate-180" /> All products
            </Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div>
                <div className="flex items-center gap-4">
                  {view.number && <span className="font-display text-[3rem] font-semibold leading-none text-orange">{view.number}</span>}
                  <Eyebrow>{view.label}</Eyebrow>
                </div>
                <h1 className="mt-7 text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">{view.name}</h1>
                <p className="copy mt-6 max-w-lg text-[13px]">{entry?.tagline ?? product.shortDescription}</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="btn btn-accent" data-testid="link-product-enquiry">
                    Request an Enquiry <ArrowRight size={15} />
                  </Link>
                  <Link href="/products" className="btn btn-outline">
                    Browse products
                  </Link>
                </div>
              </div>
              {view.image && <ImagePanel src={view.image} alt={view.name} tone={view.tone} className="aspect-[4/3] w-full border border-line" padding="p-8 md:p-12" />}
            </div>
          </div>
        </section>

        {/* Quick facts */}
        {entry && entry.facts.length > 0 && (
          <section className="border-b border-line bg-white px-5 md:px-10">
            <dl className="mx-auto grid max-w-[1360px] sm:grid-cols-2 lg:grid-cols-4">
              {entry.facts.map((fact, index) => (
                <div key={fact.label} className={`py-8 sm:px-6 ${index === 0 ? 'lg:pl-0' : ''} ${index ? 'lg:border-l lg:border-line' : ''}`}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-steel">{fact.label}</dt>
                  <dd className="mt-2 font-display text-[1rem] font-semibold leading-snug text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Overview + features */}
        <Section>
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
            <SectionHeading eyebrow="Overview" title="What this solution covers.">
              {product.description}
            </SectionHeading>
            <div>
              <p className="eyebrow">Features</p>
              {product.features?.length ? (
                <ul className="mt-6 grid gap-4">
                  {product.features.map((feature, index) => (
                    <li key={`${feature}-${index}`} className="flex gap-3 border-b border-line pb-4 text-[12px] leading-6 text-[#46565f]">
                      <Check className="mt-1 shrink-0 text-orange-ink" size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="copy mt-6">Contact Airlink for the features relevant to your requirement.</p>
              )}
            </div>
          </div>
        </Section>

        {/* Structured, PPT-sourced technical detail */}
        <DetailBlocks blocks={blocks} startTone="paper" />

        {/* Applications and specifications */}
        {(hasApplications || hasSpecs) && (
          <Section tone={detailTone}>
            <div className={`grid gap-14 ${hasApplications && hasSpecs ? 'lg:grid-cols-[.8fr_1.2fr]' : ''}`}>
              {hasApplications && (
                <div>
                  <SectionHeading eyebrow="Applications" title="Where it is used." />
                  <ul className="mt-10 flex flex-wrap gap-2.5">
                    {product.applications.map((item, index) => (
                      <li key={`${item}-${index}`} className="border border-line bg-white px-4 py-2 text-[12px] font-medium text-navy">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hasSpecs && (
                <div>
                  <SectionHeading eyebrow="Specifications" title="Technical specifications." />
                  <dl className="mt-10 divide-y divide-line border-y border-line bg-white">
                    {product.specifications.map((specification, index) => (
                      <div key={`${specification.label}-${index}`} className="grid gap-1 px-4 py-5 sm:grid-cols-[.8fr_1.2fr] sm:gap-6">
                        <dt className="text-[11px] font-bold uppercase tracking-[0.12em] text-steel">{specification.label}</dt>
                        <dd className="text-[12px] font-semibold leading-6 text-ink">{specification.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Related solutions */}
        {related.length > 0 && (
          <Section tone={hasApplications || hasSpecs ? (detailTone === 'white' ? 'paper' : 'white') : relatedTone}>
            <SectionHeading eyebrow="Related solutions" title="Often considered together." />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </Section>
        )}

        <CtaBand title={`Enquire about ${view.name}.`} label="Request an Enquiry" href={`/contact?product=${encodeURIComponent(product.slug)}`} testId="link-detail-contact">
          Share the application and the information you have, and the Airlink team will respond.
        </CtaBand>
      </main>
    </Layout>
  );
}
