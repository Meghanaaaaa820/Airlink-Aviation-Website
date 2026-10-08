import { type ReactNode, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, MoveUpRight, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { company, primaryNav } from '@/content/company';

function isActive(location: string, href: string) {
  const path = location.split('?')[0] || '/';
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}

const slugify = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

export function SiteHeader() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[78px] max-w-[1360px] items-center justify-between gap-6 px-5 md:px-10">
        <Link href="/" className="flex w-[170px] shrink-0 items-center sm:w-[200px]" data-testid="link-brand">
          <img src="/images/airlink-aviation-original-logo.png" alt="Airlink Aviation Pvt Ltd" className="h-auto w-full" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {primaryNav.map(({ label, href }) => {
            const active = isActive(location, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative whitespace-nowrap py-3 text-[12px] font-semibold tracking-[0.01em] transition-colors ${
                  active ? 'text-orange-ink' : 'text-navy hover:text-orange-ink'
                }`}
                data-testid={`link-nav-${slugify(label)}`}
              >
                {label}
                {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-orange" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn btn-accent" data-testid="link-header-contact">
            Request an Enquiry <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 shrink-0 place-items-center border border-line text-navy lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-white px-5 pb-5 pt-2 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-[1360px]">
            {primaryNav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(location, href) ? 'page' : undefined}
                className={`flex items-center justify-between border-b border-line py-4 text-[13px] font-semibold ${
                  isActive(location, href) ? 'text-orange-ink' : 'text-navy'
                }`}
                data-testid={`link-mobile-nav-${slugify(label)}`}
              >
                {label}
                <ArrowRight size={15} />
              </Link>
            ))}
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn btn-accent mt-5 w-full justify-between" data-testid="link-mobile-contact">
              Request an Enquiry <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`;
  return (
    <footer className="bg-ink text-[#e6ecef]">
      <div className="mx-auto max-w-[1360px] px-5 pb-10 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_.7fr_.7fr_1.1fr]">
          <div>
            <Link href="/" className="inline-flex bg-white p-2" data-testid="link-footer-logo">
              <img src="/images/airlink-aviation-original-logo.png" alt="Airlink Aviation Pvt Ltd" className="w-[190px]" />
            </Link>
            <p className="mt-6 max-w-sm text-[12px] leading-7 text-[#aab8bf]">
              Design and in-house manufacturing of cable and wire harnesses, electronic sub-systems and system integration for defence, aerospace, naval and military applications.
            </p>
            <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold text-[#cfd7db] transition hover:text-orange">
              LinkedIn <MoveUpRight size={13} />
            </a>
          </div>

          <div>
            <p className="eyebrow eyebrow-light mb-5">Explore</p>
            <div className="grid gap-3 text-[12px] text-[#cfd7db]">
              {primaryNav.map(({ label, href }) => (
                <Link key={href} href={href} className="transition hover:text-orange">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow eyebrow-light mb-5">Products</p>
            <div className="grid gap-3 text-[12px] text-[#cfd7db]">
              <Link href="/products/cable-wire-harness-solutions" className="transition hover:text-orange">Cable &amp; Wire Harness</Link>
              <Link href="/products/radio-simulators" className="transition hover:text-orange">Radio Simulators</Link>
              <Link href="/products/rf-cable-assemblies" className="transition hover:text-orange">RF Cable Assemblies</Link>
              <Link href="/products/fiber-optic-interconnect-solutions" className="transition hover:text-orange">Fiber Optic</Link>
              <Link href="/products" className="transition hover:text-orange">All products</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow eyebrow-light mb-5">Contact</p>
            <div className="space-y-5 text-[12px] leading-6 text-[#cfd7db]">
              <p>
                {company.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="block transition hover:text-orange">{email}</a>
                ))}
              </p>
              <p>
                {company.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="block transition hover:text-orange">{phone.label}</a>
                ))}
              </p>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block max-w-xs transition hover:text-orange">{company.address}</a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-[#83939c] sm:flex-row">
          <span>© {new Date().getFullYear()} Airlink Aviation Pvt Ltd. All rights reserved.</span>
          <span>Defence · Aerospace · Naval · Military</span>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-white text-ink">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
