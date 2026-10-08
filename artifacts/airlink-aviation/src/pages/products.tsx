import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useGetProducts } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { FeaturedHarnessCard, ProductCard, isHarnessProduct, resolveProduct } from '@/components/site/product';
import { CtaBand, EmptyBlock, ErrorBlock, LoadingBlock, PageHero } from '@/components/site/ui';
import { orderBySlug } from '@/content/catalogue';

export default function Products() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const params = useMemo(
    () =>
      category === 'All' && !search.trim()
        ? undefined
        : { category: category === 'All' ? undefined : category, search: search.trim() || undefined },
    [category, search],
  );
  const allQuery = useGetProducts();
  const resultsQuery = useGetProducts(params);
  const products = allQuery.data ?? [];
  const searchResults = resultsQuery.data ?? [];

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    orderBySlug(products).forEach((product) => {
      if (!seen.has(product.category)) seen.set(product.category, product.category);
    });
    return ['All', ...seen.keys()];
  }, [products]);

  const visible = useMemo(() => {
    const term = search.toLowerCase().trim();
    const filtered = searchResults.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const view = resolveProduct(product);
      const text = `${product.name} ${view.name} ${product.category} ${product.eyebrow} ${product.shortDescription} ${view.highlights.join(' ')}`.toLowerCase();
      return matchesCategory && (!term || text.includes(term));
    });
    return orderBySlug(filtered);
  }, [searchResults, category, search]);

  const featured = visible.find(isHarnessProduct);
  const rest = visible.filter((product) => !isHarnessProduct(product));
  const retry = () => {
    void allQuery.refetch();
    void resultsQuery.refetch();
  };

  return (
    <Layout>
      <main>
        <PageHero eyebrow="Products & solutions" title="Cable & wire harness solutions, and the systems around them.">
          <span>
            Airlink’s catalogue begins with its core capability, cable and wire harness solutions, and extends to radio simulators, RF and fiber optic assemblies, displays, control panels, system integration and sourcing.
          </span>
        </PageHero>

        <section className="px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1360px]">
            <div className="mb-12 flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-steel">Filter by category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      aria-pressed={category === item}
                      className={`min-h-10 border px-4 text-[11px] font-semibold transition ${
                        category === item ? 'border-navy bg-navy text-white' : 'border-line bg-white text-[#42535c] hover:border-navy'
                      }`}
                      data-testid={`button-filter-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex min-h-11 items-center gap-3 border-b border-[#aab8b5] lg:w-[320px]">
                <Search size={16} className="text-steel" />
                <span className="sr-only">Search products</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent py-2 text-[12px] outline-none placeholder:text-[#88969b]"
                  data-testid="input-product-search"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="text-[10px] font-bold uppercase text-steel hover:text-ink" aria-label="Clear product search" data-testid="button-clear-product-search">
                    Clear
                  </button>
                )}
              </label>
            </div>

            {allQuery.isLoading || resultsQuery.isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <LoadingBlock />
                <LoadingBlock />
                <LoadingBlock />
              </div>
            ) : allQuery.isError || resultsQuery.isError ? (
              <ErrorBlock retry={retry} label="The product catalogue could not be loaded." />
            ) : visible.length ? (
              <>
                <p className="mb-8 text-[11px] text-steel" data-testid="text-product-count">
                  {visible.length} {visible.length === 1 ? 'product' : 'products'}
                </p>
                {featured && (
                  <div className="mb-6">
                    <FeaturedHarnessCard product={featured} />
                  </div>
                )}
                {rest.length > 0 && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rest.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyBlock label={products.length ? 'No products match those filters.' : 'Products are not yet published.'} />
            )}
          </div>
        </section>

        <CtaBand title="Looking for something specific?" testId="link-products-contact">
          Tell us about the harness, assembly or system you need.
        </CtaBand>
      </main>
    </Layout>
  );
}
