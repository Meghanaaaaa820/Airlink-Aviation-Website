import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  useCreateEnquiry,
  useGetProductBySlug,
  useGetProducts,
  useGetResources,
  useGetSiteSummary,
} from '@workspace/api-client-react';
import type { EnquiryInput, Product, ProductDetail, Resource } from '@workspace/api-client-react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Menu,
  MoveUpRight,
  Search,
  X,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const primaryLinks = [
  ['Home', '/'],
  ['Cable & wire', '/products'],
  ['Capabilities', '/capabilities'],
  ['Resources', '/resources'],
  ['About', '/about'],
];

function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (href: string) => location === href || (href === '/products' && location.startsWith('/products/'));

  return (
    <header className="sticky top-0 z-40 border-b border-[#d8e0dd] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-8 lg:px-10">
        <Link href="/" className="flex w-[184px] shrink-0 items-center sm:w-[220px]" data-testid="link-brand">
          <img src="/images/airlink-aviation-original-logo.png" alt="Airlink Aviation Pvt Ltd" className="h-auto w-full" />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
          {primaryLinks.map(([label, href], index) => (
            <Link
              key={`${label}-${index}`}
              href={href}
              className={`relative whitespace-nowrap py-3 text-[11px] font-semibold tracking-[.015em] transition-colors ${active(href) ? 'text-[#9A5A00]' : 'text-[#31434D] hover:text-[#9A5A00]'}`}
              data-testid={`link-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {label}
              {active(href) && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#F39A12]" />}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 bg-[#F39A12] px-4 text-[11px] font-bold text-[#071522] transition hover:bg-[#ffad2d]" data-testid="link-header-contact">
            Talk to engineering <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 shrink-0 place-items-center border border-[#cbd5d1] text-[#0D2434] xl:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#d8e0dd] bg-white px-5 py-3 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-[1440px]">
            {primaryLinks.map(([label, href], index) => (
              <Link
                key={`${label}-${index}`}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between border-b border-[#e5eae8] py-3.5 text-[13px] font-medium ${active(href) ? 'text-[#9A5A00]' : 'text-[#263943]'}`}
                data-testid={`link-mobile-nav-${label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {label}<ArrowRight size={15} />
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-4 flex min-h-12 items-center justify-between bg-[#F39A12] px-4 text-[12px] font-bold text-[#071522]" data-testid="link-mobile-contact">
              Talk to engineering <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  const address = '#526, 3rd Floor, 7th Cross Rd, HAL 3rd Stage, Jeevan Bima Nagar, Bengaluru, Karnataka 560075';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  return (
    <footer className="bg-[#071522] text-[#E6ECEF]">
      <section className="blueprint-grid border-b border-white/10 px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#F39A12]">A technical brief starts here</p>
            <h2 className="display-font mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-.04em] text-white md:text-5xl">Bring the requirement to our team.</h2>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 w-fit items-center gap-3 bg-[#F39A12] px-5 text-[11px] font-bold text-[#071522] transition hover:bg-[#ffad2d]" data-testid="link-footer-enquiry">
            Make an enquiry <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <div className="px-5 py-12 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-[1360px] gap-10 md:grid-cols-[1.3fr_.7fr_1fr]">
          <div>
            <Link href="/" className="inline-flex bg-white p-1.5" data-testid="link-footer-logo">
              <img src="/images/airlink-aviation-original-logo.png" alt="Airlink Aviation Pvt Ltd" className="w-[205px]" />
            </Link>
            <p className="mt-5 max-w-md text-[13px] leading-6 text-[#AAB8BF]">Engineering and manufacturing support for aerospace and defence systems, with cable and wire harness solutions at the core.</p>
            <a href="https://in.linkedin.com/company/airlink-aviation-pvt-ltd" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-[11px] text-[#CFD7DB] transition hover:text-[#F39A12]">
              LinkedIn <MoveUpRight size={13} />
            </a>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#F39A12]">Explore</p>
            <div className="grid gap-3 text-[12px] text-[#CFD7DB]">
              <Link href="/about" className="hover:text-[#F39A12]">About Airlink</Link>
              <Link href="/capabilities" className="hover:text-[#F39A12]">Capabilities</Link>
              <Link href="/products" className="hover:text-[#F39A12]">Product catalogue</Link>
              <Link href="/resources" className="hover:text-[#F39A12]">Resources</Link>
              <Link href="/contact" className="hover:text-[#F39A12]">Contact</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#F39A12]">Contact</p>
            <div className="space-y-4 text-[12px] leading-5 text-[#CFD7DB]">
              <p><span className="mb-1 block text-[10px] uppercase tracking-[.13em] text-[#83939C]">Email</span><a href="mailto:sales@airlinkaviation.in" className="hover:text-[#F39A12]">sales@airlinkaviation.in</a><br /><a href="mailto:info@airlinkaviation.in" className="hover:text-[#F39A12]">info@airlinkaviation.in</a></p>
              <p><span className="mb-1 block text-[10px] uppercase tracking-[.13em] text-[#83939C]">Phone</span><a href="tel:+918700454009" className="hover:text-[#F39A12]">+91-8700454009</a><br /><a href="tel:+918277908949" className="hover:text-[#F39A12]">+91-8277908949</a></p>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block max-w-sm hover:text-[#F39A12]">{address}</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1360px] flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] text-[#83939C] sm:flex-row">
          <span>© {new Date().getFullYear()} Airlink Aviation Pvt Ltd. All rights reserved.</span>
          <span>Aerospace · Defence · Engineering</span>
        </div>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <div className="noise min-h-[100dvh] bg-[#F3F5F4] text-[#071522]"><SiteHeader />{children}<SiteFooter /></div>;
}

function Kicker({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return <p className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.18em] ${dark ? 'text-[#F39A12]' : 'text-[#9A5A00]'}`}><span className={`h-px w-7 ${dark ? 'bg-[#F39A12]' : 'bg-[#F39A12]'}`} />{children}</p>;
}

function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b border-[#d8e0dd] bg-[#F3F5F4] px-5 pb-12 pt-12 md:px-10 md:pb-16 md:pt-16">
      <div className="mx-auto max-w-[1360px]">
        <Kicker>{eyebrow}</Kicker>
        <h1 className="display-font mt-6 max-w-5xl text-[clamp(2.7rem,6vw,5.7rem)] font-semibold leading-[.99] tracking-[-.06em] text-[#071522]">{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-[14px] leading-7 text-[#687780]">{children}</div>}
      </div>
    </section>
  );
}

function LoadingBlock({ label = 'Loading published content' }: { label?: string }) {
  return (
    <div className="grid gap-4" data-testid="status-loading" aria-live="polite">
      <div className="h-3 w-32 animate-pulse bg-[#dce3e0]" />
      <div className="h-28 animate-pulse bg-[#e7ecea]" />
      <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#687780]">{label}</p>
    </div>
  );
}

function ErrorBlock({ retry, label = 'We could not load this content.' }: { retry?: () => void; label?: string }) {
  return (
    <div className="border border-[#dfb4a5] bg-[#fff7f2] p-6" data-testid="status-error" role="alert">
      <CircleAlert size={19} className="mb-3 text-[#a34e37]" />
      <p className="text-[13px] leading-6 text-[#70483e]">{label}</p>
      {retry && <button type="button" onClick={retry} className="mt-4 border border-[#ad5b43] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#70483e] transition hover:bg-[#f8e7dd]" data-testid="button-retry">Try again</button>}
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return <div className="border border-dashed border-[#b9c6c2] bg-white/40 px-6 py-12 text-center" data-testid="status-empty"><p className="text-[12px] text-[#687780]">{label}</p></div>;
}

function productImage(product: Product | ProductDetail): string | undefined {
  const hint = `${product.slug} ${product.name}`.toLowerCase();
  if (hint.includes('harness') || hint.includes('cable-wire')) return '/images/products/cable-harness-solutions.jpg';
  if (hint.includes('radio') || hint.includes('simulator')) return '/images/products/radio-simulators.jpg';
  if (hint.includes('rf')) return '/images/products/rf-cable-assemblies.jpg';
  if (hint.includes('fiber') || hint.includes('fibre')) return '/images/products/fiber-optic-solutions.jpg';
  if (hint.includes('display') || hint.includes('mfd')) return '/images/products/multifunctional-displays.jpg';
  if (hint.includes('panel') || hint.includes('hmi')) return '/images/products/control-panels.jpg';
  return product.image?.startsWith('/') ? product.image : undefined;
}

function ProductVisual({ product, large = false }: { product: Product | ProductDetail; large?: boolean }) {
  const source = productImage(product);
  return (
    <div className={`site-grid relative overflow-hidden bg-[#e9eeec] ${large ? 'min-h-[310px] md:min-h-[500px]' : 'aspect-[1.45]'}`}>
      {source && <img src={source} alt={product.name} className={`absolute inset-0 h-full w-full object-contain mix-blend-multiply ${large ? 'p-8 md:p-12' : 'p-5 md:p-7'}`} />}
      <span className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-[8px] font-bold uppercase tracking-[.14em] text-[#617078]">Airlink / {product.category}</span>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index?: number }) {
  return (
    <Link href={`/products/${product.slug}`} className="ui-card group block overflow-hidden transition duration-300 hover:-translate-y-1" data-testid={`card-product-${product.id}`}>
      <ProductVisual product={product} />
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[.14em] text-[#9A5A00]">
          <span>{product.eyebrow || product.category}</span>
          <span className="text-[#87949A]">{String(index ?? product.id).padStart(2, '0')}</span>
        </div>
        <h2 className="display-font mt-3 text-xl font-semibold leading-tight tracking-[-.035em] text-[#0D2434] transition-colors group-hover:text-[#9A5A00]">{product.name}</h2>
        <p className="mt-3 min-h-[54px] text-[12px] leading-6 text-[#687780]">{product.shortDescription}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[#e0e6e3] pt-4">
          <span className="text-[10px] text-[#75838a]">{product.category}</span>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0D2434] group-hover:text-[#9A5A00]">View family <ArrowRight size={14} /></span>
        </div>
      </div>
    </Link>
  );
}

function productRank(product: Pick<Product, 'name' | 'slug'>) {
  const hint = `${product.name} ${product.slug}`.toLowerCase();
  const families = [
    ['harness', 'cable-wire'],
    ['radio', 'simulator'],
    ['rf', 'coax'],
    ['fiber', 'fibre'],
    ['display', 'mfd'],
    ['control panel', 'control-panels'],
    ['integration', 'aircraft-hmi'],
    ['connector', 'sourcing'],
    ['assembly', 'bom', 'parts'],
  ];
  const rank = families.findIndex((tokens) => tokens.some((token) => hint.includes(token)));
  return rank === -1 ? families.length : rank;
}

function orderProducts<T extends Pick<Product, 'name' | 'slug'>>(products: T[]) {
  return [...products].sort((a, b) => productRank(a) - productRank(b) || a.name.localeCompare(b.name));
}

function isHarness(product: Product) {
  return productRank(product) === 0;
}

function Home() {
  const summaryQuery = useGetSiteSummary();
  const featuredQuery = useGetProducts({ featured: true });
  const allProductsQuery = useGetProducts();
  const allProducts = orderProducts(allProductsQuery.data ?? []);
  const apiFeatured = orderProducts(featuredQuery.data ?? []);
  const products = (apiFeatured.length ? apiFeatured : allProducts).slice(0, 4);
  const summary = summaryQuery.data;
  const harness = allProducts.find(isHarness);

  return (
    <Layout>
      <main>
        <section className="relative isolate min-h-[640px] overflow-hidden bg-[#071522] text-white md:min-h-[740px]">
          <img src="/hero-hanger.png" alt="Aircraft inside an aerospace hangar" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,21,34,.97)_0%,rgba(7,21,34,.84)_37%,rgba(7,21,34,.38)_72%,rgba(7,21,34,.18)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(7,21,34,.84),transparent_52%)]" />
          <div className="mx-auto flex min-h-[640px] max-w-[1440px] flex-col justify-between px-5 pb-0 pt-14 md:min-h-[740px] md:px-10 md:pt-20">
            <div className="airlink-fade-up max-w-[760px]">
              <Kicker dark>Airlink Aviation / Engineering & manufacturing</Kicker>
              <h1 className="display-font mt-7 max-w-3xl text-[clamp(3.5rem,8vw,7.7rem)] font-semibold leading-[.91] tracking-[-.075em] text-white">Connections<br />for critical<br /><span className="text-[#F39A12]">systems.</span></h1>
              <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-[#d4dfe4] md:text-[16px]">Cable and wire harness capability at the core of an engineering portfolio spanning simulation, interconnects, displays, control panels and system integration.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="inline-flex min-h-12 items-center gap-3 bg-[#F39A12] px-5 text-[11px] font-bold text-[#071522] transition hover:bg-[#ffad2d]" data-testid="link-hero-products">Explore cable & wire solutions <ArrowRight size={15} /></Link>
                <Link href="/capabilities" className="inline-flex min-h-12 items-center gap-3 border border-white/45 bg-[#071522]/30 px-5 text-[11px] font-semibold text-white transition hover:border-[#F39A12] hover:text-[#F39A12]" data-testid="link-hero-capabilities">Our capabilities <ArrowUpRight size={15} /></Link>
              </div>
            </div>
            <div className="mt-16 grid border-t border-white/25 bg-[#071522]/35 backdrop-blur-sm sm:grid-cols-2 md:grid-cols-4">
              {[
                ['01', 'Harness systems', 'Simple through complex assemblies'],
                ['02', 'RF & fiber', 'Interconnect solutions'],
                ['03', 'Simulation', 'Radio simulators and boards'],
                ['04', 'Integration', 'Displays, panels and assemblies'],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex items-start gap-4 border-b border-white/10 px-4 py-5 sm:even:border-l md:border-b-0 md:border-l md:px-6 md:py-6 first:md:border-l-0">
                  <span className="mt-0.5 text-[9px] font-bold tracking-[.15em] text-[#F39A12]">{num}</span>
                  <div><p className="display-font text-[15px] font-semibold text-white">{title}</p><p className="mt-1 text-[11px] leading-5 text-[#bfccd2]">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#d6dfdc] bg-white px-5 py-7 md:px-10">
          <div className="mx-auto grid max-w-[1360px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Published product families', summaryQuery.isLoading ? '—' : summary?.productCount],
              ['Capability areas', summaryQuery.isLoading ? '—' : summary?.capabilityCount],
              ['Support', summary?.supportLabel],
              ['Quality focus', summary?.qualityLabel],
            ].map(([label, value], index) => (
              <div key={String(label)} className={`min-h-[68px] ${index ? 'lg:border-l lg:border-[#dce3e0] lg:pl-6' : ''}`}>
                <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#78868c]">{label}</p>
                <p className="display-font mt-2 text-[17px] font-semibold text-[#0D2434]">{value || '—'}</p>
              </div>
            ))}
          </div>
          {summaryQuery.isError && <p className="mx-auto mt-2 max-w-[1360px] text-[11px] text-[#8a6b5e]">Summary information is temporarily unavailable.</p>}
        </section>

        <section className="bg-[#F3F5F4] px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1360px]">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div><Kicker>Core capability / Cable & wire</Kicker><h2 className="display-font mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] text-[#071522] md:text-6xl">The connection<br />starts here.</h2></div>
              <div className="max-w-2xl md:justify-self-end">
                <p className="text-[14px] leading-7 text-[#687780]">Airlink’s harness capability includes simple, medium and complex wiring assemblies, alongside RF and flat cable interconnections. From pigtail and back-to-back harnesses to multi-branch looms with routing, the work is shaped around the defined requirement.</p>
                <Link href={harness ? `/products/${harness.slug}` : '/capabilities'} className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.1em] text-[#0D2434] hover:text-[#9A5A00]" data-testid="link-home-harness">Explore harness capability <ArrowRight size={15} /></Link>
              </div>
            </div>
            <div className="mt-10 grid overflow-hidden border border-[#d5dedb] bg-white md:grid-cols-[1.05fr_.95fr]">
              <div className="relative min-h-[280px] bg-[#e9eeec] md:min-h-[430px]">
                <img src="/images/products/cable-harness-solutions.jpg" alt="Cable and wire harness assembly with circular connector" className="absolute inset-0 h-full w-full object-contain p-6 md:p-12" />
                <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[.14em] text-[#596970]">Airlink / harness assembly</span>
              </div>
              <div className="flex flex-col justify-between bg-[#0D2434] p-7 text-white md:p-10">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#F39A12]">In-house harness capability</p>
                  <h3 className="display-font mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-[-.045em] md:text-4xl">Built around the drawing, the build route, and the application.</h3>
                  <p className="mt-5 max-w-xl text-[13px] leading-6 text-[#bdcbd1]">Harness solutions for any make and OEM, using standard MIL cable and specified cable and connector combinations. The capability includes electrical wiring interconnection systems and electromechanical assemblies.</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {['Simple harness', 'Medium harness', 'Complex harness'].map((item) => <span key={item} className="border border-white/20 px-3 py-2 text-[10px] text-[#d4dfe4]">{item}</span>)}
                  <Link href="/capabilities" className="ml-auto inline-flex items-center gap-2 self-center text-[10px] font-bold uppercase tracking-[.1em] text-[#F39A12]" data-testid="link-home-harness-details">Capability details <ArrowRight size={14} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1360px]">
            <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><Kicker>Product families / Current catalogue</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.05em] text-[#071522] md:text-5xl">Engineering across the system.</h2></div>
              <Link href="/products" className="inline-flex w-fit items-center gap-2 border-b border-[#F39A12] pb-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#0D2434]" data-testid="link-featured-all">Browse all products <ArrowRight size={14} /></Link>
            </div>
            {allProductsQuery.isLoading || featuredQuery.isLoading ? <div className="grid gap-5 md:grid-cols-2"><LoadingBlock /><LoadingBlock /></div>
              : allProductsQuery.isError ? <ErrorBlock retry={() => allProductsQuery.refetch()} label="The product catalogue could not be loaded." />
                : products.length ? <div className="grid gap-5 md:grid-cols-2">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index + 1} />)}</div>
                  : <EmptyBlock label="Published product families will appear here." />}
          </div>
        </section>

        <section className="blueprint-grid px-5 py-16 text-white md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1360px] gap-10 md:grid-cols-[.85fr_1.15fr]">
            <div><Kicker dark>Engineering models</Kicker><h2 className="display-font mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-.05em] md:text-5xl">Two ways to shape the build.</h2><p className="mt-5 max-w-lg text-[13px] leading-7 text-[#b9c8ce]">The manufacturing model follows the information and responsibility defined for each requirement.</p></div>
            <div className="grid gap-0 border-t border-white/20 sm:grid-cols-2">
              <div className="py-6 sm:pr-7"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#F39A12]">Built to Print</p><h3 className="display-font mt-3 text-2xl font-semibold">Build to the supplied design.</h3><p className="mt-3 text-[12px] leading-6 text-[#c2cdd2]">The customer supplies detailed designs, drawings and specifications; the provider manufactures the system, components or assemblies to that definition.</p></div>
              <div className="border-t border-white/15 py-6 sm:border-l sm:border-t-0 sm:pl-7"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#F39A12]">Built to Specification</p><h3 className="display-font mt-3 text-2xl font-semibold">Engineer from requirements.</h3><p className="mt-3 text-[12px] leading-6 text-[#c2cdd2]">The customer provides performance and functional requirements; the manufacturer handles design, engineering, production and assembly of the finished product.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-[#F3F5F4] px-5 py-16 md:px-10 md:py-20">
          <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-8 md:flex-row md:items-end">
            <div><Kicker>Next step</Kicker><h2 className="display-font mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-.05em] md:text-5xl">A requirement is a good place to begin.</h2></div>
            <Link href="/contact" className="inline-flex min-h-12 w-fit items-center gap-3 bg-[#0D2434] px-5 text-[11px] font-bold text-white transition hover:bg-[#153a52]" data-testid="link-home-contact">Talk to Airlink <ArrowRight size={15} /></Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function Products() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const params = useMemo(() => category === 'All' && !search.trim()
    ? undefined
    : { category: category === 'All' ? undefined : category, search: search.trim() || undefined }, [category, search]);
  const allQuery = useGetProducts();
  const resultsQuery = useGetProducts(params);
  const products = allQuery.data ?? [];
  const searchResults = resultsQuery.data ?? [];
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b))], [products]);
  const visible = useMemo(() => {
    const filtered = searchResults.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const searchText = `${product.name} ${product.category} ${product.eyebrow} ${product.shortDescription}`.toLowerCase();
      const matchesSearch = !search.trim() || searchText.includes(search.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
    return orderProducts(filtered);
  }, [searchResults, category, search]);
  const retry = () => { void allQuery.refetch(); void resultsQuery.refetch(); };

  return (
    <Layout><main>
      <PageIntro eyebrow="Product catalogue / Published systems" title="Systems, interconnects, and assemblies."><span>Search published Airlink product families, filter by category, and open a family for its available technical information.</span></PageIntro>
      <section className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-8 flex flex-col gap-5 border-b border-[#d5dedb] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="mb-3 text-[9px] font-bold uppercase tracking-[.15em] text-[#718088]">Filter by family</p><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-9 border px-3.5 text-[10px] font-semibold transition ${category === item ? 'border-[#0D2434] bg-[#0D2434] text-white' : 'border-[#ccd6d2] bg-white text-[#42535c] hover:border-[#0D2434]'}`} data-testid={`button-filter-${item.toLowerCase().replace(/\s/g, '-')}`}>{item}</button>)}</div></div>
            <label className="flex min-h-11 items-center gap-3 border-b border-[#aab8b5] lg:w-[320px]">
              <Search size={16} className="text-[#687780]" />
              <span className="sr-only">Search products</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product families" className="w-full bg-transparent py-2 text-[12px] outline-none placeholder:text-[#88969b]" data-testid="input-product-search" />
              {search && <button type="button" onClick={() => setSearch('')} className="text-[10px] font-bold uppercase text-[#687780] hover:text-[#071522]" aria-label="Clear product search" data-testid="button-clear-product-search">Clear</button>}
            </label>
          </div>
          {allQuery.isLoading || resultsQuery.isLoading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><LoadingBlock /><LoadingBlock /><LoadingBlock /></div>
            : allQuery.isError || resultsQuery.isError ? <ErrorBlock retry={retry} label="The product catalogue could not be loaded." />
              : visible.length ? <><p className="mb-5 text-[11px] text-[#687780]" data-testid="text-product-count">{visible.length} {visible.length === 1 ? 'product family' : 'product families'}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((product, index) => <ProductCard key={product.id} product={product} index={index + 1} />)}</div></>
                : <EmptyBlock label={products.length ? 'No published product families match those filters.' : 'Product families are not yet published.'} />}
        </div>
      </section>
    </main></Layout>
  );
}

function DetailSupplement({ product }: { product: ProductDetail }) {
  const hint = `${product.name} ${product.slug}`.toLowerCase();
  if (hint.includes('harness') || hint.includes('cable-wire')) {
    const levels = [
      { name: 'Simple harness', image: '/images/products/cable-harness-solutions.jpg', notes: ['Pigtail harness', 'Back-to-back harness', 'Non-EMI/EMC harness', 'Lacing and bundling'] },
      { name: 'Medium harness', image: '/images/products/cable-harness-medium.png', notes: ['Connecting with backshell', 'Metal braiding', 'Backpotting solution', 'Soldering process'] },
      { name: 'Complex harness', image: '/images/products/cable-harness-complex.jpg', notes: ['Multiple branches with routing', '1:1 drawing creation and use in routing', 'Large looms with connector types, soldering and critical processes'] },
    ];
    return <section className="mt-14 border-t border-[#d7dfdc] pt-10"><Kicker>Harness build categories</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.04em] text-[#071522]">Simple, medium, complex.</h2><div className="mt-7 grid gap-4 lg:grid-cols-3">{levels.map((level) => <article key={level.name} className="overflow-hidden border border-[#d9e1de] bg-white"><div className="h-44 bg-[#e9eeec]"><img src={level.image} alt={`${level.name} cable harness example`} className="h-full w-full object-contain p-4" /></div><div className="p-5"><h3 className="display-font text-xl font-semibold text-[#0D2434]">{level.name}</h3><ul className="mt-4 space-y-2">{level.notes.map((note) => <li key={note} className="flex gap-2 text-[11px] leading-5 text-[#687780]"><span className="mt-2 size-1 shrink-0 bg-[#F39A12]" />{note}</li>)}</ul></div></article>)}</div></section>;
  }
  if (hint.includes('radio') || hint.includes('simulator')) {
    return <TechnicalNotes title="Radio simulator configurations" kicker="Radio simulation">
      <div className="grid gap-4 sm:grid-cols-3">
        <TechNote title="Matrix configurations" text="6 × 6 and 4 × 4 channel radio simulator configurations." />
        <TechNote title="Connection" text="MIL-grade circular connector." />
        <TechNote title="Station setup" text="10 TOS and 10 IOS station configuration for cross-talk with PTT." />
      </div>
    </TechnicalNotes>;
  }
  if (hint.includes('rf')) {
    return <TechnicalNotes title="RF cable assemblies" kicker="RF interconnect">
      <p className="max-w-3xl text-[13px] leading-7 text-[#687780]">Coaxial cable assemblies connect devices with different RF connector interfaces, including SMA, N-Type, BNC, MMCX, MCX and TNC. Semi-rigid and rigid RF cable harnesses are also part of the stated capability.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <TechNote title="Impedance" text="50 Ω and 75 Ω cable harness options." />
        <TechNote title="Frequency range" text="The presentation states DC to 67+ GHz." />
        <TechNote title="Connector families" text="SMA, N-Type, BNC, MMCX, MCX, TNC and other RF connector combinations." />
      </div>
    </TechnicalNotes>;
  }
  if (hint.includes('fiber') || hint.includes('fibre')) {
    return <TechnicalNotes title="Fiber connector and breakout details" kicker="Fiber optic interconnect">
      <p className="max-w-3xl text-[13px] leading-7 text-[#687780]">Connector families in the source material include single-fiber contacts, bayonet and screw-in styles, ST, FC, SC, EC, LC, MTP/MPO, D3899, ARINC-801 termini and expanded-beam termini.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-[.72fr_1.28fr]">
        <div className="border border-[#d9e1de] bg-white p-5"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#9A5A00]">MT ferrule</p><p className="display-font mt-3 text-3xl font-semibold text-[#0D2434]">12–72 fibers</p><p className="mt-2 text-[11px] leading-5 text-[#687780]">A high-density option for containing 12 to 72 fibers inside one MT ferrule, where applicable.</p></div>
        <figure className="border border-[#d9e1de] bg-white p-4">
          <img src="/images/products/fiber-optic-breakout.png" alt="Fiber optic multi-channel connector breaking out to individual fiber pigtails" className="w-full object-contain" />
          <figcaption className="mt-3 text-[10px] leading-5 text-[#687780]">Multi-channel connector to individual fiber pigtails (fan-out), as illustrated in the Airlink source material.</figcaption>
        </figure>
      </div>
    </TechnicalNotes>;
  }
  if (hint.includes('display') || hint.includes('mfd')) {
    return <TechnicalNotes title="Multifunctional display integration" kicker="Display systems"><div className="grid gap-4 sm:grid-cols-2"><TechNote title="Integrated information" text="Combines data from multiple sensors and systems on a single screen." /><TechNote title="Configurable views" text="Views can be configured for data pages such as moving maps, system status and weather." /></div></TechnicalNotes>;
  }
  if (hint.includes('integration') || hint.includes('aircraft-hmi')) {
    return <TechnicalNotes title="Electronic system and panel integration" kicker="System integration">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <TechNote title="Panel integration" text="Integration of panels according to the supplied specification." />
        <TechNote title="Electronic modules" text="Design and development of electronic modules, including LRU and PDU systems." />
        <TechNote title="PCB development" text="PCB development as part of Airlink’s stated electronic-system capability." />
      </div>
    </TechnicalNotes>;
  }
  if (hint.includes('panel') || hint.includes('hmi')) {
    return <TechnicalNotes title="Control panel design and build" kicker="Control panels">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{['Define system needs', 'Create electrical schematics and layouts', 'Select PLCs, HMIs, contactors and breakers', 'Assemble hardware in steel, aluminium or plastic enclosure', 'Wire the assembly', 'Test the completed panel'].map((note) => <TechNote key={note} title={note} text="" />)}</div>
    </TechnicalNotes>;
  }
  return null;
}

function TechnicalNotes({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return <section className="mt-14 border-t border-[#d7dfdc] pt-10"><Kicker>{kicker}</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.04em] text-[#071522]">{title}</h2><div className="mt-6">{children}</div></section>;
}

function TechNote({ title, text }: { title: string; text: string }) {
  return <div className="border border-[#d9e1de] bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#9A5A00]">{title}</p>{text && <p className="mt-3 text-[12px] leading-6 text-[#687780]">{text}</p>}</div>;
}

function ProductDetailPage({ slug }: { slug: string }) {
  const query = useGetProductBySlug(slug);
  const product = query.data;
  if (query.isLoading) return <Layout><main className="mx-auto max-w-[1360px] px-5 py-16 md:px-10"><LoadingBlock label="Loading product brief" /></main></Layout>;
  if (query.isError || !product) return <Layout><main className="mx-auto max-w-[1360px] px-5 py-16 md:px-10"><ErrorBlock retry={() => query.refetch()} label="This product brief is unavailable or has not been published." /></main></Layout>;
  return (
    <Layout><main>
      <section className="border-b border-[#d7dfdc] bg-white px-5 py-9 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1360px]">
          <Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#687780] hover:text-[#9A5A00]" data-testid="link-back-products"><ArrowRight size={14} className="rotate-180" />Product catalogue</Link>
          <div className="mt-8 grid gap-9 md:grid-cols-[.95fr_1.05fr] md:items-center">
            <ProductVisual product={product} large />
            <div>
              <Kicker>{product.eyebrow} / {product.category}</Kicker>
              <h1 className="display-font mt-5 text-[clamp(2.8rem,5.5vw,5.5rem)] font-semibold leading-[.96] tracking-[-.065em] text-[#071522]">{product.name}</h1>
              <p className="mt-6 text-[14px] leading-7 text-[#687780]">{product.description}</p>
              <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="mt-7 inline-flex min-h-12 items-center gap-3 bg-[#F39A12] px-5 text-[11px] font-bold text-[#071522] hover:bg-[#ffad2d]" data-testid="link-product-enquiry">Enquire about this product <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1360px] gap-12 md:grid-cols-[.82fr_1.18fr]">
          <div>
            <Kicker>Published technical brief</Kicker>
            <h2 className="display-font mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] text-[#071522] md:text-4xl">Scope and application.</h2>
            <div className="mt-9 grid gap-7 border-t border-[#d7dfdc] pt-6">
              {[
                ['Features', product.features],
                ['Applications', product.applications],
              ].map(([label, items]) => (
                <div key={String(label)}>
                  <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">{label}</p>
                  {(items as string[]).length ? <ul className="mt-4 grid gap-3">{(items as string[]).map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-[12px] leading-6 text-[#52636b]"><Check className="mt-1 shrink-0 text-[#9A5A00]" size={14} />{item}</li>)}</ul> : <p className="mt-3 text-[12px] text-[#687780]">No {String(label).toLowerCase()} have been published for this product.</p>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="border border-[#d9e1de] bg-white p-5 md:p-7">
              <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">Published specifications</p>
              {product.specifications?.length ? <div className="mt-5 divide-y divide-[#e1e7e4]">{product.specifications.map((specification, index) => <div className="grid gap-2 py-4 text-[12px] sm:grid-cols-[.8fr_1.2fr]" key={`${specification.label}-${index}`}><span className="text-[#687780]">{specification.label}</span><span className="font-semibold text-[#0D2434] sm:text-right">{specification.value}</span></div>)}</div> : <p className="mt-4 text-[12px] leading-6 text-[#687780]">Specifications are not currently published for this family. Contact Airlink for information relevant to your requirement.</p>}
            </div>
            <div className="mt-5 border-l-2 border-[#F39A12] bg-[#E9EEEC] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#9A5A00]">Discuss your requirement</p>
              <p className="mt-2 text-[12px] leading-6 text-[#687780]">Share your intended application and the technical information you have available.</p>
              <Link href={`/contact?product=${encodeURIComponent(product.slug)}`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0D2434] hover:text-[#9A5A00]" data-testid="link-detail-contact">Contact engineering <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[1360px]"><DetailSupplement product={product} /></div>
      </section>

      {product.relatedProducts && product.relatedProducts.length > 0 && <section className="border-t border-[#d7dfdc] bg-white px-5 py-12 md:px-10 md:py-16"><div className="mx-auto max-w-[1360px]"><Kicker>Related product families</Kicker><div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{product.relatedProducts.map((related, index) => <ProductCard key={related.id} product={related} index={index + 1} />)}</div></div></section>}
    </main></Layout>
  );
}

function About() {
  const productsQuery = useGetProducts();
  const products = orderProducts(productsQuery.data ?? []);
  const harness = products.find(isHarness);
  return (
    <Layout><main>
      <PageIntro eyebrow="About Airlink / Company overview" title="Engineering and manufacturing for aerospace and defence."><span>Airlink Aviation presents engineering capability across cable and wire harnesses, radio simulation, interconnects, displays, control panels, system integration and sourcing.</span></PageIntro>
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[.8fr_1.2fr]">
          <div><Kicker>Core capability</Kicker><h2 className="display-font mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.05em] md:text-5xl">Cable & wire harness solutions.</h2><Link href={harness ? `/products/${harness.slug}` : '/capabilities'} className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.11em] text-[#0D2434] hover:text-[#9A5A00]" data-testid="link-about-harness">Explore harness capability <ArrowRight size={14} /></Link></div>
          <div className="space-y-5 text-[13px] leading-7 text-[#687780]">
            <p>The Airlink presentation describes in-house harness capability for custom solutions, including standard MIL cable and specified cable and connector harness combinations.</p>
            <p>Alongside harness assemblies, Airlink’s portfolio includes radio simulators and boards, RF and fiber optic cable assemblies, multifunctional displays, control panels and integration assemblies.</p>
            <p>Engineering work described by Airlink includes product development, prototyping, testing and qualification, as well as redesign and upgrades in response to requirements.</p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-[1280px] overflow-hidden border border-[#d7dfdc] bg-white md:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[270px] bg-[#e9eeec] md:min-h-[390px]"><img src="/images/products/cable-harness-complex.jpg" alt="Complex branched cable harness assembly" className="absolute inset-0 h-full w-full object-contain p-6 md:p-10" /></div>
          <div className="flex flex-col justify-center bg-[#0D2434] p-7 text-white md:p-10"><Kicker dark>In-house harness capability</Kicker><h3 className="display-font mt-5 text-3xl font-semibold leading-tight tracking-[-.04em] md:text-4xl">From a pigtail to a routed, multi-branch loom.</h3><p className="mt-4 max-w-lg text-[12px] leading-6 text-[#c2cdd2]">Airlink describes simple, medium and complex harness categories, including braiding, backshell connections, routing, soldering and critical processes.</p><Link href="/capabilities" className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#F39A12]" data-testid="link-about-capabilities">See capability detail <ArrowRight size={14} /></Link></div>
        </div>
      </section>
      <section className="border-y border-[#d7dfdc] bg-white px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><Kicker>Portfolio</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.05em] md:text-5xl">A connected set of capabilities.</h2></div><Link href="/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0D2434]">View product catalogue <ArrowRight size={14} /></Link></div>
          {productsQuery.isLoading ? <div className="mt-8"><LoadingBlock /></div> : productsQuery.isError ? <div className="mt-8"><ErrorBlock retry={() => productsQuery.refetch()} label="Product family information could not be loaded." /></div> : products.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((product, index) => <ProductCard key={product.id} product={product} index={index + 1} />)}</div> : <div className="mt-8"><EmptyBlock label="Published product families will appear here." /></div>}
        </div>
      </section>
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-9 md:grid-cols-[.8fr_1.2fr]">
          <div><Kicker>Application areas</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.05em] md:text-4xl">Work across demanding industries.</h2></div>
          <div className="grid grid-cols-2 gap-px border border-[#d7dfdc] bg-[#d7dfdc] sm:grid-cols-3">
            {['Aerospace', 'Defence', 'UAV', 'EV', 'Naval', 'Military'].map((sector, index) => <div key={sector} className="bg-[#F3F5F4] p-5 md:p-6"><span className="text-[9px] font-bold text-[#9A5A00]">{String(index + 1).padStart(2, '0')}</span><p className="display-font mt-3 text-lg font-semibold text-[#0D2434]">{sector}</p></div>)}
          </div>
        </div>
      </section>
    </main></Layout>
  );
}

function Capabilities() {
  const lifecycle = [
    ['01', 'Design', 'Design and in-house manufacturing capability across harness and system integration work.'],
    ['02', 'Development', 'Product development, prototyping, testing and qualification. Redesign and upgrades in response to requirements.'],
    ['03', 'Manufacturing', 'End-to-end cable and wire harness and electronic sub-system manufacturing solutions.'],
    ['04', 'Integration', 'Integration of avionics, LRUs, chassis and other electronic panels; development of electronic modules such as LRU and PDU systems.'],
  ];
  const levels = [
    { title: 'Simple harness', image: '/images/products/cable-harness-solutions.jpg', details: ['Pigtail harness', 'Back-to-back harness', 'Non-EMI/EMC harness', 'Lacing and bundling'] },
    { title: 'Medium harness', image: '/images/products/cable-harness-medium.png', details: ['Connection with backshell', 'Metal braiding', 'Backpotting solution', 'Soldering process'] },
    { title: 'Complex harness', image: '/images/products/cable-harness-complex.jpg', details: ['Multiple branches with routing', '1:1 drawing creation and use in routing', 'Large looms with connector types, soldering and critical processes'] },
  ];
  return (
    <Layout><main>
      <PageIntro eyebrow="Capabilities / Engineering and manufacturing" title="Capability from design through integration."><span>Airlink’s stated capability spans product development, prototyping, testing and qualification, harness manufacturing, control panels, and system integration.</span></PageIntro>
      <section id="cable-harness-solutions" className="bg-[#0D2434] px-5 py-12 text-white md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><Kicker dark>Priority capability / Cable & wire</Kicker><h2 className="display-font mt-5 text-4xl font-semibold leading-tight tracking-[-.055em] md:text-6xl">Harness solutions at the core.</h2></div>
          <div><p className="max-w-2xl text-[13px] leading-7 text-[#c3cfd4]">Custom harness solutions for any make and OEM, using standard MIL cable and specific cable and connector combinations. Airlink describes capabilities that include electrical wiring interconnection systems, high-precision electromechanical systems, mission-critical electronic control systems, RF and flat cable interconnections, and rugged compact systems for airborne applications.</p><Link href="/products" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#F39A12]" data-testid="link-capability-harness-catalogue">Browse harness product family <ArrowRight size={14} /></Link></div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1360px] gap-4 lg:grid-cols-3">{levels.map((level) => <article key={level.title} className="overflow-hidden border border-white/15 bg-white text-[#071522]"><div className="h-48 bg-[#e8eeeb]"><img src={level.image} alt={`${level.title} harness example`} className="h-full w-full object-contain p-4" /></div><div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">Harness category</p><h3 className="display-font mt-2 text-2xl font-semibold">{level.title}</h3><ul className="mt-4 grid gap-2">{level.details.map((detail) => <li key={detail} className="flex gap-2 text-[11px] leading-5 text-[#596a72]"><span className="mt-2 size-1 shrink-0 bg-[#F39A12]" />{detail}</li>)}</ul></div></article>)}</div>
      </section>
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1360px]"><Kicker>Engineering and production sequence</Kicker><div className="mt-7 grid border-t border-[#d5dedb] sm:grid-cols-2 lg:grid-cols-4">{lifecycle.map(([number, title, description]) => <article key={number} className="border-b border-[#d5dedb] py-6 sm:px-5 first:sm:pl-0 lg:border-b-0 lg:border-l lg:py-4 lg:first:border-l-0 lg:first:pl-0"><p className="text-[10px] font-bold text-[#9A5A00]">{number}</p><h3 className="display-font mt-3 text-xl font-semibold text-[#0D2434]">{title}</h3><p className="mt-3 text-[12px] leading-6 text-[#687780]">{description}</p></article>)}</div></div>
      </section>
      <section className="border-y border-[#d7dfdc] bg-white px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="max-w-2xl"><Kicker>Manufacturing models</Kicker><h2 className="display-font mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] md:text-5xl">Built to Print.<br />Built to Specification.</h2></div>
          <div className="mt-8 grid gap-px border border-[#d7dfdc] bg-[#d7dfdc] md:grid-cols-2">
            <article className="bg-[#F3F5F4] p-6 md:p-9"><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">Customer-defined design</span><h3 className="display-font mt-4 text-2xl font-semibold text-[#0D2434]">Built to Print</h3><p className="mt-4 max-w-xl text-[12px] leading-6 text-[#687780]">The customer provides detailed designs, drawings and specifications. The manufacturer builds the complex electronic systems, components or assemblies to that supplied definition.</p></article>
            <article className="bg-[#F3F5F4] p-6 md:p-9"><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">Requirement-defined solution</span><h3 className="display-font mt-4 text-2xl font-semibold text-[#0D2434]">Built to Specification</h3><p className="mt-4 max-w-xl text-[12px] leading-6 text-[#687780]">The customer provides performance and functional requirements. The manufacturer handles design, engineering, production and assembly of the finished electronic product.</p></article>
          </div>
        </div>
      </section>
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-[1360px] gap-8 md:grid-cols-[.75fr_1.25fr]"><div><Kicker>Supporting capability</Kicker><h2 className="display-font mt-4 text-3xl font-semibold leading-tight tracking-[-.05em] md:text-4xl">Engineering across the product system.</h2></div><div className="grid gap-px border border-[#d7dfdc] bg-[#d7dfdc] sm:grid-cols-2">{[
          ['Radio simulators', 'Design and manufacture of radio simulators and simulator boards.'],
          ['RF and fiber interconnects', 'RF cable assemblies and fiber optic connectors and cable assemblies.'],
          ['Displays', 'Multifunctional displays for avionics, naval and ground systems, with configurable views.'],
          ['Control panels', 'Design, development and manufacture, including electrical layouts, component selection, wiring and testing.'],
          ['System integration', 'Integration assemblies for avionics, LRUs, chassis and electronic panels.'],
          ['Sourcing', 'Sourcing of connectors from OEMs, cables and other BOM parts.'],
        ].map(([title, text]) => <article key={title} className="bg-[#F3F5F4] p-5 md:p-6"><h3 className="display-font text-lg font-semibold text-[#0D2434]">{title}</h3><p className="mt-2 text-[11px] leading-5 text-[#687780]">{text}</p></article>)}</div></div>
      </section>
      <section className="bg-[#0D2434] px-5 py-12 text-white md:px-10 md:py-16"><div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-6 md:flex-row md:items-end"><div><Kicker dark>Next step</Kicker><h2 className="display-font mt-4 max-w-2xl text-3xl font-semibold tracking-[-.05em] md:text-4xl">Have a defined technical requirement?</h2></div><Link href="/contact" className="inline-flex min-h-12 w-fit items-center gap-2 bg-[#F39A12] px-5 text-[10px] font-bold uppercase tracking-[.1em] text-[#071522]" data-testid="link-capabilities-contact">Start an enquiry <ArrowRight size={14} /></Link></div></section>
    </main></Layout>
  );
}

function Resources() {
  const [category, setCategory] = useState('All');
  const allQuery = useGetResources();
  const resultsQuery = useGetResources(category === 'All' ? undefined : { category });
  const resources = allQuery.data ?? [];
  const categories = useMemo(() => ['All', ...Array.from(new Set(resources.map((resource) => resource.category))).sort((a, b) => a.localeCompare(b))], [resources]);
  const visible = (resultsQuery.data ?? []).filter((resource) => category === 'All' || resource.category === category);
  const retry = () => { void allQuery.refetch(); void resultsQuery.refetch(); };
  return (
    <Layout><main>
      <PageIntro eyebrow="Resources / Technical reference" title="Reference material for the next decision."><span>Browse the resources published by Airlink. If you need a document or technical reference not shown here, send the team an enquiry.</span></PageIntro>
      <section className="px-5 py-10 md:px-10 md:py-16"><div className="mx-auto max-w-[1150px]">
        <div className="mb-7 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-9 border px-3.5 text-[10px] font-semibold transition ${category === item ? 'border-[#0D2434] bg-[#0D2434] text-white' : 'border-[#ccd6d2] bg-white text-[#42535c] hover:border-[#0D2434]'}`} data-testid={`button-resource-filter-${item.toLowerCase().replace(/\s/g, '-')}`}>{item}</button>)}</div>
        {allQuery.isLoading || resultsQuery.isLoading ? <LoadingBlock label="Loading published resources" /> : allQuery.isError || resultsQuery.isError ? <ErrorBlock retry={retry} label="The resource library could not be loaded." /> : visible.length ? <div className="divide-y divide-[#d7dfdc] border-y border-[#d7dfdc]">{visible.map((resource) => <ResourceRow key={resource.id} resource={resource} />)}</div> : <EmptyBlock label={resources.length ? 'No resources are published in this category.' : 'Technical resources are not yet published.'} />}
      </div></section>
    </main></Layout>
  );
}

function ResourceRow({ resource }: { resource: Resource }) {
  const external = /^https?:\/\//i.test(resource.href);
  return (
    <article className="grid gap-4 py-6 md:grid-cols-[140px_1fr_auto] md:items-center">
      <div><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">{resource.type}</p><p className="mt-2 text-[11px] text-[#75838a]">{resource.category}</p></div>
      <div><h2 className="display-font text-xl font-semibold tracking-[-.03em] text-[#0D2434]">{resource.title}</h2><p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#687780]">{resource.description}</p></div>
      {external ? <a href={resource.href} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0D2434] hover:text-[#9A5A00]" data-testid={`link-resource-${resource.id}`}>{resource.actionLabel}<MoveUpRight size={14} /></a> : <Link href={resource.href} className="inline-flex w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#0D2434] hover:text-[#9A5A00]" data-testid={`link-resource-${resource.id}`}>{resource.actionLabel}<ArrowRight size={14} /></Link>}
    </article>
  );
}

function Contact() {
  const [location] = useLocation();
  const requestedProduct = useMemo(() => new URLSearchParams(location.split('?')[1] ?? '').get('product'), [location]);
  const productsQuery = useGetProducts();
  const enquiry = useCreateEnquiry();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<EnquiryInput>(() => ({
    productSlug: requestedProduct,
    name: '',
    company: '',
    email: '',
    phone: '',
    requirement: '',
    message: '',
  }));
  useEffect(() => {
    if (requestedProduct) setForm((current) => ({ ...current, productSlug: requestedProduct }));
  }, [requestedProduct]);
  const products = orderProducts(productsQuery.data ?? []);
  const chosenProduct = products.find((product) => product.slug === form.productSlug);
  const setField = (key: keyof EnquiryInput, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError('');
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors.name = 'Name must contain at least 2 characters.';
    if (form.company.trim().length < 2) errors.company = 'Company must contain at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid work email.';
    if (form.phone.trim().length < 7) errors.phone = 'Please enter a valid phone number.';
    if (form.requirement.trim().length < 2) errors.requirement = 'Please enter your requirement.';
    if (form.message.trim().length < 10) errors.message = 'Message must contain at least 10 characters.';
    const firstError = Object.values(errors).find(Boolean);
    if (firstError) {
      setFormError(firstError);
      return;
    }
    setFormError('');
    const payload: EnquiryInput = {
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      requirement: form.requirement.trim(),
      message: form.message.trim(),
      ...(form.productSlug ? { productSlug: form.productSlug } : {}),
    };
    enquiry.mutate({ data: payload }, {
      onSuccess: () => { setSubmitted(true); setFormError(''); },
      onError: () => setFormError('We could not send your enquiry. Please review the details and try again.'),
    });
  };
  const resetForm = () => {
    setSubmitted(false);
    setFormError('');
    enquiry.reset();
    setForm({ productSlug: requestedProduct, name: '', company: '', email: '', phone: '', requirement: '', message: '' });
  };

  return (
    <Layout><main>
      <PageIntro eyebrow="Contact / Enquiry desk" title="Bring us the technical requirement."><span>Tell the Airlink team what you are working on. A clear operating context helps make the first response useful.</span></PageIntro>
      <section className="px-5 py-10 md:px-10 md:py-16"><div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[.7fr_1.3fr]">
        <aside>
          <Kicker>Engineering enquiry</Kicker><h2 className="display-font mt-5 text-3xl font-semibold leading-tight tracking-[-.05em] text-[#0D2434] md:text-4xl">A clear brief<br />gets a clear reply.</h2>
          <p className="mt-5 text-[12px] leading-6 text-[#687780]">Use this form for a product enquiry, technical question or early-stage requirement. Include the application and the decision ahead, if known.</p>
          <div className="mt-8 border-t border-[#d7dfdc] pt-5"><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9A5A00]">Useful context</p><ul className="mt-4 grid gap-3">{['The operating requirement or application', 'Product family, if already identified', 'Relevant drawings or information available', 'The next decision or timeline'].map((item) => <li key={item} className="flex gap-2 text-[11px] leading-5 text-[#596a72]"><Check size={14} className="mt-0.5 shrink-0 text-[#9A5A00]" />{item}</li>)}</ul></div>
          <div className="mt-8 border-t border-[#d7dfdc] pt-5 text-[11px] leading-6 text-[#596a72]"><p className="font-semibold text-[#0D2434]">Direct contact</p><a className="mt-2 block hover:text-[#9A5A00]" href="mailto:sales@airlinkaviation.in">sales@airlinkaviation.in</a><a className="block hover:text-[#9A5A00]" href="tel:+918700454009">+91-8700454009</a></div>
        </aside>
        {submitted ? <div className="blueprint-grid flex min-h-[420px] flex-col items-start justify-center p-7 text-white md:p-12" data-testid="status-enquiry-success"><div className="grid size-12 place-items-center border border-[#F39A12] text-[#F39A12]"><Check size={22} /></div><Kicker dark>Enquiry received</Kicker><h2 className="display-font mt-4 text-3xl font-semibold tracking-[-.04em] md:text-4xl">Thank you. The brief is with us.</h2><p className="mt-4 max-w-lg text-[12px] leading-6 text-[#c3cfd4]">Your enquiry has been submitted. Reference: <span className="font-semibold text-[#F39A12]">{enquiry.data?.id ?? 'submitted'}</span></p><button type="button" onClick={resetForm} className="mt-7 border border-white/35 px-4 py-3 text-[10px] font-bold uppercase tracking-[.12em] hover:border-[#F39A12] hover:text-[#F39A12]" data-testid="button-new-enquiry">Send another enquiry</button></div>
          : <form onSubmit={submit} className="border border-[#d6dfdc] bg-white p-5 md:p-8" data-testid="form-enquiry">
            <div className="mb-6 border-l-2 border-[#F39A12] bg-[#F3F5F4] px-4 py-3">
              <label className="grid gap-2"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#687780]">Product family <span className="font-normal normal-case tracking-normal">(optional)</span></span>
                <select value={form.productSlug ?? ''} onChange={(event) => setField('productSlug', event.target.value)} className="min-h-10 border border-[#d1dad7] bg-white px-3 text-[12px] outline-none focus:border-[#0D2434]" data-testid="select-enquiry-product">
                  <option value="">General enquiry</option>
                  {products.map((product) => <option key={product.id} value={product.slug}>{product.name}</option>)}
                </select>
              </label>
              {chosenProduct && <p className="mt-2 text-[10px] text-[#687780]">Enquiry about <span className="font-semibold text-[#0D2434]">{chosenProduct.name}</span></p>}
              {requestedProduct && !chosenProduct && <p className="mt-2 text-[10px] text-[#687780]">Product reference: {requestedProduct}</p>}
              {productsQuery.isLoading && <p className="mt-2 text-[10px] text-[#687780]" data-testid="status-enquiry-products-loading">Loading product families…</p>}
              {productsQuery.isError && <div className="mt-2 flex items-center gap-3"><p className="text-[10px] text-[#8a6b5e]" data-testid="status-enquiry-products-error">Product family choices are temporarily unavailable.</p><button type="button" onClick={() => productsQuery.refetch()} className="text-[10px] font-bold text-[#0D2434] underline underline-offset-2" data-testid="button-retry-enquiry-products">Retry</button></div>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" value={form.name} onChange={(value) => setField('name', value)} required testId="input-name" />
              <Field label="Company" value={form.company} onChange={(value) => setField('company', value)} required testId="input-company" />
              <Field label="Work email" type="email" value={form.email} onChange={(value) => setField('email', value)} required testId="input-email" />
              <Field label="Phone" type="tel" value={form.phone} onChange={(value) => setField('phone', value)} required testId="input-phone" />
              <Field label="Requirement" value={form.requirement} onChange={(value) => setField('requirement', value)} required wide testId="input-requirement" />
              <label className="grid gap-2 sm:col-span-2"><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#687780]">Message <span className="text-[#9A5A00]">*</span></span><textarea value={form.message} onChange={(event) => setField('message', event.target.value)} required minLength={10} rows={5} placeholder="Share the application, constraints and context." className="resize-y border border-[#d1dad7] bg-[#fbfcfb] px-3.5 py-3 text-[12px] outline-none placeholder:text-[#8a969b] focus:border-[#0D2434]" data-testid="input-message" /></label>
            </div>
            {formError && <p className="mt-5 flex gap-2 text-[12px] leading-5 text-[#a34e37]" data-testid="status-enquiry-error" role="alert"><CircleAlert size={16} className="mt-0.5 shrink-0" />{formError}</p>}
            {enquiry.isError && !formError && <p className="mt-5 text-[12px] text-[#a34e37]" data-testid="status-enquiry-error">Unable to send the enquiry. Please try again.</p>}
            <button type="submit" disabled={enquiry.isPending} className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#0D2434] px-5 text-[10px] font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#153a52] disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-enquiry">{enquiry.isPending ? 'Sending enquiry…' : 'Send enquiry'} <ArrowRight size={14} /></button>
          </form>}
      </div></section>
    </main></Layout>
  );
}

function Field({ label, value, onChange, type = 'text', required, wide, testId }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; wide?: boolean; testId: string }) {
  return <label className={`grid gap-2 ${wide ? 'sm:col-span-2' : ''}`}><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#687780]">{label} {required && <span className="text-[#9A5A00]">*</span>}</span><input id={testId} name={testId} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 border border-[#d1dad7] bg-[#fbfcfb] px-3.5 text-[12px] outline-none focus:border-[#0D2434]" data-testid={testId} /></label>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const pathname = location.split('?')[0] || '/';
    const slug = pathname.startsWith('/products/') ? pathname.slice('/products/'.length) : '';
    const titleMap: Record<string, string> = {
      '/': 'Cable & Wire Harness Engineering',
      '/about': 'About Airlink Aviation',
      '/capabilities': 'Engineering Capabilities',
      '/products': 'Product Catalogue',
      '/resources': 'Technical Resources',
      '/contact': 'Contact Airlink Engineering',
    };
    const pageName = titleMap[pathname] ?? (slug
      ? slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : 'Page not found');
    const title = `${pageName} | Airlink Aviation`;
    const description = slug
      ? `Explore Airlink Aviation’s ${pageName.toLowerCase()} product brief, applications and published technical information.`
      : 'Aerospace and defence engineering and manufacturing, with cable and wire harness solutions at the core.';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  }, [location]);
  return null;
}

function Router() {
  return <><PageMetadata /><RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/products" component={Products} />
    <Route path="/products/:slug">{(params) => <ProductDetailPage slug={params.slug} />}</Route>
    <Route path="/resources" component={Resources} />
    <Route path="/about" component={About} />
    <Route path="/capabilities" component={Capabilities} />
    <Route path="/contact" component={Contact} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary></>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ScrollToTop /><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;