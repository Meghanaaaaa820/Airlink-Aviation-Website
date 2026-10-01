import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { useCreateEnquiry, useGetProductBySlug, useGetProducts, useGetResources, useGetSiteSummary } from '@workspace/api-client-react';
import type { EnquiryInput, Product, ProductDetail, Resource } from '@workspace/api-client-react';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, CircleAlert, FileText, Menu, MoveUpRight, Orbit, Phone, Plane, ShieldCheck, Target, X } from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import Login from "@/pages/login";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient();

const fallbackSummary = { productCount: 0, capabilityCount: 0, supportLabel: 'Technical support available', qualityLabel: 'Quality-led delivery' };
function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate("/login");
  };

  const links = [
    ["Home", "/"],
    ["About", "/about"],
    ["Capabilities", "/capabilities"],
    ["Products", "/products"],
  ];

  const isActive = (href: string) =>
    location === href ||
    (href === "/products" && location.startsWith("/products/"));

  return (
    <header className="sticky top-0 z-40 border-b border-[#c9d2d1] bg-[#071724]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-10">

        {/* LOGO */}
        <Link
          href="/"
          className="flex w-[190px] items-center"
          data-testid="link-brand"
        >
          <img
            src="/images/airlink-aviation-original-logo.png"
            alt="Airlink Aviation Pvt Ltd"
            className="block h-auto max-h-[52px] w-full object-contain object-left"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          className="hidden items-center gap-6 lg:flex xl:gap-8"
          aria-label="Primary navigation"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`mono-font relative py-2 text-[12px] font-medium uppercase tracking-[.14em] transition-colors duration-200 ${isActive(href)
                  ? "text-[#f39a12]"
                  : "text-[#aebfca] hover:text-[#f39a12]"
                }`}
              data-testid={`link-nav-${label.toLowerCase()}`}
            >
              {label}

              {isActive(href) && (
                <span className="absolute bottom-0 left-0 h-px w-full bg-[#d78b2e]" />
              )}
            </Link>
          ))}
        </nav>

        {/* DESKTOP CTA */}
        <Link
          href="/contact"
          className="hidden min-h-[44px] items-center gap-3 bg-[#d78b2e] px-5 py-3 mono-font text-[9px] font-medium uppercase tracking-[.15em] text-[#193b4b] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c47722] lg:flex"
          data-testid="link-header-contact"
        >
          <span>Request an Enquiry</span>
          <ArrowRight size={13} />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden min-h-[44px] items-center justify-center border border-[#6f8796] px-4 py-3 mono-font text-[9px] font-medium uppercase tracking-[.15em] text-[#eef3f5] transition-all duration-200 hover:border-[#f39a12] hover:text-[#f39a12] lg:flex"
        >
          Logout
        </button>

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center border border-[#b6c8c3] text-[#193b4b] transition-colors hover:bg-[#e7eee8] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {open && (
        <nav
          className="border-t border-[#c9d2d1] bg-[#f5f2e9] px-5 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto grid max-w-[1440px] gap-1">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-[#d5dedb] px-2 py-4 mono-font text-[10px] uppercase tracking-[.14em] transition-colors ${isActive(href)
                  ? "text-[#bd7224]"
                  : "text-[#193b4b] hover:text-[#bd7224]"
                  }`}
                data-testid={`link-mobile-nav-${label.toLowerCase()}`}
              >
                {label}
                <ArrowRight size={13} />
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-between bg-[#d78b2e] px-4 py-4 mono-font text-[10px] uppercase tracking-[.14em] text-[#193b4b]"
              data-testid="link-mobile-contact"
            >
              Request an Enquiry
              <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 w-full border border-[#6f8796] px-4 py-3 text-left mono-font text-[9px] font-medium uppercase tracking-[.15em] text-[#eef3f5] transition-all duration-200 hover:border-[#f39a12] hover:text-[#f39a12]"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
function SiteFooter() {
  const linkedinUrl = "https://in.linkedin.com/company/airlink-aviation-pvt-ltd";

  const address =
    "#526, 3rd Floor, 7th Cross Rd, HAL 3rd Stage, Jeevan Bima Nagar, Bengaluru, Karnataka 560075";

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address);

  return (
    <footer className="bg-[#102f3d] text-[#eef0e7]">

      {/* ENGINEERING CTA */}
      <section className="blueprint-grid border-b border-[#41636b] px-5 py-10 md:px-10 md:py-12">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-7 md:flex-row md:items-end">

          <div>
            <p className="mono-font text-[9px] uppercase tracking-[.18em] text-[#e0a75b]">
              Have a specific requirement?
            </p>

            <h2 className="display-font mt-3 text-3xl font-semibold tracking-[-.04em] text-[#eef0e7] md:text-5xl">
              Let's talk to{" "}
              <span className="text-[#d78b2e]">engineering.</span>
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-3 bg-[#d78b2e] px-5 py-4 mono-font text-[9px] font-medium uppercase tracking-[.14em] text-[#193b4b] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c47722]"
            data-testid="link-footer-engineering"
          >
            Make an enquiry
            <ArrowRight size={14} />
          </Link>

        </div>
      </section>


      {/* MAIN FOOTER */}
      <div className="px-5 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-[1440px]">

          <div className="grid gap-12 md:grid-cols-[1.35fr_1fr_1fr_1.35fr]">

            {/* COMPANY */}
            <div>

              <Link
                href="/"
                className="inline-flex w-fit items-center bg-white"
                data-testid="link-footer-logo"
              >
                <img
                  src="/images/airlink-aviation-original-logo.png?v=2"
                  alt="Airlink Aviation Pvt Ltd"
                  className="block h-auto w-[230px] object-contain"
                  style={{
                    filter: "none",
                    opacity: 1,
                    mixBlendMode: "normal",
                  }}
                />
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#b9cfcd]">
                Engineering the connection between mission intent and dependable
                aerospace and defence hardware.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Airlink Aviation on LinkedIn"
                  className="grid size-10 place-items-center rounded-full border border-[#41636b] text-[#eef0e7] transition-colors hover:border-[#d78b2e] hover:text-[#d78b2e]"
                >
                  <span className="text-sm font-bold">in</span>
                </a>

                <span className="mono-font text-[9px] uppercase tracking-[.14em] text-[#91b1af]">
                  Connect with Airlink
                </span>
              </div>

            </div>


            {/* QUICK LINKS */}
            <div>
              <p className="mono-font mb-5 text-[9px] uppercase tracking-[.18em] text-[#e0a75b]">
                Explore
              </p>

              <div className="grid gap-3 text-sm">

                <Link
                  href="/"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-home"
                >
                  Home
                </Link>

                <Link
                  href="/products"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-products"
                >
                  Product families
                </Link>

                <Link
                  href="/capabilities"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-capabilities"
                >
                  Capabilities
                </Link>

              </div>
            </div>


            {/* COMPANY LINKS */}
            <div>
              <p className="mono-font mb-5 text-[9px] uppercase tracking-[.18em] text-[#e0a75b]">
                Company
              </p>

              <div className="grid gap-3 text-sm">

                <Link
                  href="/about"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-about"
                >
                  About Airlink
                </Link>

                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-contact"
                >
                  Contact engineering
                </Link>

                <Link
                  href="/contact"
                  className="transition-colors hover:text-[#e0a75b]"
                  data-testid="link-footer-enquiry"
                >
                  Request an enquiry
                </Link>

              </div>
            </div>


            {/* CONTACT */}
            <div>

              <p className="mono-font mb-5 text-[9px] uppercase tracking-[.18em] text-[#e0a75b]">
                Contact
              </p>

              <div className="space-y-5 text-sm">

                {/* EMAIL */}
                <div>
                  <p className="mono-font mb-2 text-[8px] uppercase tracking-[.15em] text-[#789b9c]">
                    Email
                  </p>

                  <div className="grid gap-1">

                    <a
                      href="mailto:sales@airlinkaviation.in"
                      className="break-all transition-colors hover:text-[#e0a75b]"
                    >
                      sales@airlinkaviation.in
                    </a>

                    <a
                      href="mailto:info@airlinkaviation.in"
                      className="break-all transition-colors hover:text-[#e0a75b]"
                    >
                      info@airlinkaviation.in
                    </a>

                  </div>
                </div>


                {/* PHONE */}
                <div>
                  <p className="mono-font mb-2 text-[8px] uppercase tracking-[.15em] text-[#789b9c]">
                    Phone
                  </p>

                  <div className="grid gap-1">

                    <a
                      href="tel:+918700454009"
                      className="transition-colors hover:text-[#e0a75b]"
                    >
                      +91-8700454009
                    </a>

                    <a
                      href="tel:+918277908949"
                      className="transition-colors hover:text-[#e0a75b]"
                    >
                      +91-8277908949
                    </a>

                  </div>
                </div>


                {/* ADDRESS */}
                <div>
                  <p className="mono-font mb-2 text-[8px] uppercase tracking-[.15em] text-[#789b9c]">
                    Address
                  </p>

                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-sm leading-6 transition-colors hover:text-[#e0a75b]"
                  >
                    {address}
                  </a>
                </div>


                {/* WEBSITE */}
                <div>
                  <p className="mono-font mb-2 text-[8px] uppercase tracking-[.15em] text-[#789b9c]">
                    Website
                  </p>

                  <a
                    href="https://www.airlinkaviation.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[#e0a75b]"
                  >
                    www.airlinkaviation.in
                  </a>
                </div>

              </div>

            </div>

          </div>


          {/* BOTTOM BAR */}
          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-[#41636b] pt-5 md:flex-row md:items-center">

            <span className="mono-font text-[8px] uppercase tracking-[.12em] text-[#91b1af]">
              © {new Date().getFullYear()} Airlink Aviation Pvt Ltd. All rights reserved.
            </span>

            <div className="flex flex-wrap gap-5 mono-font text-[8px] uppercase tracking-[.12em] text-[#91b1af]">

              <Link
                href="/"
                className="hover:text-[#e0a75b]"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="hover:text-[#e0a75b]"
              >
                About
              </Link>

              <Link
                href="/products"
                className="hover:text-[#e0a75b]"
              >
                Products
              </Link>

              <Link
                href="/contact"
                className="hover:text-[#e0a75b]"
              >
                Contact
              </Link>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e0a75b]"
              >
                LinkedIn
              </a>

            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="noise min-h-[100dvh] bg-[#061522] text-[#eef3f5]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-[#234052] bg-[#081923] px-5 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
      <div className="mx-auto max-w-[1440px]">

        <p className="line-marker mono-font mb-7 ml-4 text-[10px] uppercase tracking-[.2em] text-[#f39a12]">
          {eyebrow}
        </p>

        <h1 className="display-font max-w-4xl text-5xl font-semibold leading-[.98] tracking-[-.055em] text-[#eef3f5] md:text-7xl">
          {title}
        </h1>

        {children && (
          <div className="mt-7 max-w-xl text-base leading-7 text-[#aebfca]">
            {children}
          </div>
        )}

      </div>
    </section>
  );
}
function LoadingBlock({ label = 'Loading technical content' }: { label?: string }) { return <div className="space-y-4" data-testid="status-loading"><div className="h-4 w-28 animate-pulse bg-[#dbe2dc]" /><div className="h-28 w-full animate-pulse bg-[#e8ebe4]" /><p className="mono-font text-[10px] uppercase tracking-[.15em] text-[#738b8d]">{label}</p></div>; }
function ErrorBlock({ retry, label = 'We could not load this content.' }: { retry?: () => void; label?: string }) { return <div className="border border-[#d3a18c] bg-[#fbf3ed] p-7" data-testid="status-error"><CircleAlert className="mb-4 text-[#ad5b43]" size={22} /><p className="mb-5 text-sm text-[#704b43]">{label}</p>{retry && <button onClick={retry} type="button" className="border border-[#ad5b43] px-4 py-2 mono-font text-[10px] uppercase tracking-[.14em] text-[#704b43]" data-testid="button-retry">Try again</button>}</div>; }
function EmptyBlock({ label }: { label: string }) { return <div className="border border-dashed border-[#b7c6c2] p-10 text-center" data-testid="status-empty"><p className="mono-font text-[10px] uppercase tracking-[.15em] text-[#738b8d]">{label}</p></div>; }
function SectionKicker({ children }: { children: ReactNode }) { return <p className="mono-font text-[10px] uppercase tracking-[.2em] text-[#bd7224]">{children}</p>; }

function InstrumentPanel({ summary }: { summary: typeof fallbackSummary }) {
  return (
    <div className="relative min-h-[520px] overflow-hidden md:min-h-[650px]">
      <img
        src="/hero-hanger.png"
        alt="Aircraft inside an aerospace hangar"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#061522]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061522]/35 via-transparent to-transparent" />
    </div>
  );
}


const productImageBySlug: Record<string, string> = {
  'aircraft-hmi-control-panels': '/images/products/aircraft-hmi-control-panels.png',
  'multifunctional-displays': '/images/products/multifunctional-displays.png',
  'radio-simulators': '/images/products/radio-simulator.png',
  'rf-cable-assemblies': '/images/products/rf-cable-assemblies.png',
  'fiber-optic-interconnect-solutions': '/images/products/fiber-optic-interconnect-solutions.png',
  'mil-grade-circular-connectors': '/images/products/mil-grade-circular-connectors.png',
  'control-panels': '/images/products/control-panels.jpeg',
  'microd-connectors': '/images/products/microd-connectors.jpeg',
};

function ProductVisual({
  product,
  large = false,
  card = false,
}: {
  product: Product | ProductDetail;
  large?: boolean;
  card?: boolean;
}) {
  const image = product.image?.startsWith("/")
    ? product.image
    : productImageBySlug[product.slug];

  return (
    <div
      className={`group relative overflow-hidden bg-[#dce4df] ${large
        ? "min-h-[340px] md:min-h-[550px]"
        : card
          ? "h-[210px] md:h-[220px]"
          : "aspect-[1.1]"
        } site-grid`}
    >
      {image && (
        <img
          src={image}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-contain mix-blend-multiply opacity-95 transition-transform duration-700 group-hover:scale-[1.04] ${large
            ? "p-8 md:p-12"
            : card
              ? "p-5 md:p-6"
              : "p-5 md:p-8"
            }`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#dce4df]/45 via-transparent to-white/10" />
    </div>
  );
}

function Home() {
  const summaryQuery = useGetSiteSummary();
  const productsQuery = useGetProducts({ featured: true });
  const summary = summaryQuery.data ?? fallbackSummary;
  const products = productsQuery.data ?? [];

  return (
    <Layout>
      <main>

        {/* =========================================================
            HERO — DARK PROFESSIONAL
            ========================================================= */}
        <section className="relative isolate min-h-[760px] overflow-hidden bg-[#061522] text-[#f5f7f8]">

          {/* FULL HERO AIRCRAFT IMAGE */}
          <img
            src="/hero-hanger.png"
            alt="Aircraft inside an aerospace hangar"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />

          {/* DARK OVERLAYS */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,17,28,.97)_0%,rgba(4,17,28,.87)_28%,rgba(4,17,28,.48)_55%,rgba(4,17,28,.10)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,17,28,.20)_0%,rgba(4,17,28,.05)_50%,rgba(4,17,28,.78)_100%)]" />

          <div className="mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-between px-5 pb-0 pt-14 md:px-10 md:pt-20">

            {/* HERO TEXT */}
            <div className="max-w-2xl animate-rise">

              <SectionKicker>
                Airlink Aviation / Engineering partner
              </SectionKicker>

              <h1 className="display-font mt-7 max-w-3xl text-[3.6rem] font-semibold leading-[.91] tracking-[-.07em] text-[#f5f7f8] sm:text-6xl md:text-[6.7rem]">
                Built for the
                <br />
                <span className="text-[#f39a12]">mission</span> ahead.
              </h1>

              <p className="mt-8 max-w-lg text-lg leading-8 text-[#d0dce3]">
                Technical systems and product families for teams who cannot
                afford uncertainty in the air, at sea, or on the ground.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <Link
                  href="/products"
                  className="inline-flex min-h-[48px] items-center gap-3 bg-[#f39a12] px-5 py-4 mono-font text-[10px] font-medium uppercase tracking-[.15em] text-[#102333] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffad2f]"
                  data-testid="link-hero-products"
                >
                  Explore product families
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-[48px] items-center gap-3 border border-[#a2b4c0] bg-[#071724]/45 px-5 py-4 mono-font text-[10px] font-medium uppercase tracking-[.15em] text-[#f5f7f8] transition-all duration-200 hover:border-[#f39a12] hover:text-[#f7b34b]"
                  data-testid="link-hero-contact"
                >
                  Talk to engineering
                  <MoveUpRight size={15} />
                </Link>

              </div>
            </div>

            {/* HERO FEATURE STRIP */}
            <div className="mt-16 border-t border-[#91a6b4]/35 bg-[#061522]/30 backdrop-blur-[2px]">

              <div className="grid md:grid-cols-5">

                {[
                  {
                    title: "Aerospace",
                    detail: "Flight proven solutions",
                    icon: Plane,
                  },
                  {
                    title: "Defence",
                    detail: "Mission critical systems",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Engineering",
                    detail: "From concept to reality",
                    icon: Target,
                  },
                  {
                    title: "Simulation",
                    detail: "Train. Test. Excel.",
                    icon: Orbit,
                  },
                  {
                    title: "Support",
                    detail: "Through every mission",
                    icon: Phone,
                  },
                ].map(({ title, detail, icon: Icon }, i) => (
                  <div
                    key={title}
                    className={`flex items-center gap-4 px-5 py-5 md:flex-col md:items-center md:justify-center md:gap-3 md:py-7 md:text-center ${i
                      ? "md:border-l md:border-[#91a6b4]/30"
                      : ""
                      }`}
                  >
                    <Icon
                      aria-hidden="true"
                      className="shrink-0 text-[#eef3f5]"
                      size={26}
                      strokeWidth={1.35}
                    />

                    <div>
                      <h2 className="display-font text-base font-medium text-[#f4f6f7]">
                        {title}
                      </h2>

                      <p className="mt-1 text-[11px] leading-5 text-[#afc0cb]">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </section>


        {/* =========================================================
            SUMMARY STRIP
            ========================================================= */}
        <section className="border-y border-[#234052] bg-[#091d2c] px-5 py-8 text-[#f3f6f7] md:px-10 md:py-0">

          <div className="mx-auto grid max-w-[1440px] gap-7 md:grid-cols-4">

            {[
              ["Product families", summary.productCount],
              ["Capability areas", summary.capabilityCount],
              ["Support", summary.supportLabel],
              ["Quality focus", summary.qualityLabel],
            ].map(([label, value], i) => (
              <div
                key={String(label)}
                className={`border-[#234052] py-2 ${i ? "md:border-l md:pl-7" : ""
                  }`}
              >

                <p className="mono-font text-[9px] uppercase tracking-[.17em] text-[#8faab8]">
                  {label}
                </p>

                <p
                  className={`mt-3 ${i > 1
                    ? "text-base"
                    : "display-font text-4xl"
                    } font-semibold text-[#f3f6f7]`}
                  data-testid={`text-summary-${i}`}
                >
                  {value || "—"}
                </p>

              </div>
            ))}

          </div>
        </section>


        {/* =========================================================
            FEATURED CAPABILITY — CABLE HARNESS SOLUTIONS
            ========================================================= */}
        <section className="bg-[#061522] px-5 py-16 md:px-10 md:py-20">

          <div className="mx-auto max-w-[1440px]">

            <Link
              href="/capabilities"
              className="group relative block overflow-hidden border border-[#d78b2e]/70 bg-[#0b2231] transition-all duration-300 hover:border-[#f39a12] hover:-translate-y-0.5"
              data-testid="card-cable-harness-capability"
            >

              {/* TECHNICAL BACKGROUND */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-[8%] top-[20%] h-px w-[84%] bg-[#6d8795]/40" />
                <div className="absolute left-[8%] top-[52%] h-px w-[72%] bg-[#6d8795]/25" />
                <div className="absolute left-[15%] top-[15%] h-[70%] w-px bg-[#6d8795]/25" />
                <div className="absolute right-[18%] top-[10%] h-[80%] w-px bg-[#6d8795]/20" />
                <div className="absolute right-[8%] top-[32%] h-[28%] w-[28%] rounded-full border border-[#d78b2e]/30" />
                <div className="absolute right-[12%] top-[38%] h-[16%] w-[20%] rounded-full border border-dashed border-[#d78b2e]/25" />
              </div>

              <div className="relative z-10 grid gap-10 p-7 md:grid-cols-[1.15fr_.85fr] md:p-12">

                {/* LEFT */}
                <div>

                  <div className="flex items-center gap-3">
                    <span className="h-px w-10 bg-[#f39a12]" />
                    <span className="mono-font text-[10px] uppercase tracking-[.2em] text-[#f39a12]">
                      Core capability / 03
                    </span>
                  </div>

                  <h2 className="display-font mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                    Precision wiring &
                    <br />
                    <span className="text-[#f39a12]">
                      cable harness solutions.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-[#aec0cb] md:text-lg">
                    Precision wiring and cable harness solutions for demanding
                    aerospace and defence applications.
                  </p>

                  <div className="mt-8 inline-flex items-center gap-3 mono-font text-[10px] font-medium uppercase tracking-[.16em] text-[#eef3f5]">
                    Explore cable harness capability
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>

                </div>

                {/* RIGHT — TECHNICAL FEATURE */}
                <div className="relative flex min-h-[220px] items-center justify-center border-l border-[#234052] md:min-h-[280px]">

                  <div className="relative h-40 w-full max-w-[390px]">

                    {/* HARNESS ROUTES */}
                    <div className="absolute left-[8%] top-1/2 h-1 w-[84%] rounded-full bg-[#91a6b4]/45" />
                    <div className="absolute left-[17%] top-[43%] h-1 w-[58%] rounded-full bg-[#d78b2e]/70" />

                    {/* CONNECTOR ENDS */}
                    <div className="absolute left-[4%] top-[39%] h-7 w-12 border border-[#a9beca] bg-[#152f3e]" />
                    <div className="absolute right-[4%] top-[39%] h-7 w-12 border border-[#a9beca] bg-[#152f3e]" />

                    {/* NODE DETAILS */}
                    <div className="absolute left-[26%] top-[28%] h-9 w-9 rounded-full border border-[#a9beca] bg-[#0d2433]" />
                    <div className="absolute left-[43%] top-[54%] h-7 w-7 rounded-full border border-[#f39a12] bg-[#0d2433]" />
                    <div className="absolute right-[28%] top-[33%] h-8 w-8 rounded-full border border-[#a9beca] bg-[#0d2433]" />

                    <span className="absolute bottom-0 left-0 mono-font text-[8px] uppercase tracking-[.14em] text-[#7f99a8]">
                      Harness routing
                    </span>

                    <span className="absolute bottom-0 right-0 mono-font text-[8px] uppercase tracking-[.14em] text-[#f39a12]">
                      Airlink / aerospace
                    </span>

                  </div>

                </div>

              </div>
            </Link>

          </div>
        </section>


        {/* =========================================================
            SELECTED SYSTEMS
            ========================================================= */}
        <section className="bg-[#081923] px-5 py-20 text-[#eef3f5] md:px-10 md:py-24">

          <div className="mx-auto max-w-[1440px]">

            <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">

              <div>

                <SectionKicker>
                  Selected systems
                </SectionKicker>

                <h2 className="display-font mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                  The right hardware
                  <br />
                  changes the equation.
                </h2>

              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 self-start border-b border-[#bd7224] pb-2 mono-font text-[10px] font-medium uppercase tracking-[.15em] text-[#eef3f5] transition-colors hover:text-[#bd7224]"
                data-testid="link-featured-all"
              >
                View all products
                <ArrowRight size={14} />
              </Link>

            </div>


            {productsQuery.isLoading ? (

              <LoadingBlock />

            ) : productsQuery.isError ? (

              <ErrorBlock retry={() => productsQuery.refetch()} />

            ) : products.length === 0 ? (

              <EmptyBlock label="Featured product families are not yet published." />

            ) : (

              <div className="grid gap-3 md:grid-cols-2">

                {products.slice(0, 4).map((product, i) => (

                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    className="group grid min-h-[270px] overflow-hidden border border-[#234052] bg-[#0d2433] transition-all duration-300 hover:-translate-y-1 hover:border-[#557587] hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)] md:grid-cols-[1fr_1fr]"
                    data-testid={`card-featured-product-${product.id}`}
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="h-[230px] md:h-full">
                      <ProductVisual product={product} />
                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="flex min-h-[230px] flex-col justify-between p-5 md:min-h-0 md:p-7">

                      <div>

                        <div className="flex items-center justify-between gap-4">

                          <p className="mono-font text-[9px] font-medium uppercase tracking-[.16em] text-[#bd7224]">
                            {product.eyebrow}
                          </p>

                          <span className="mono-font text-[8px] tracking-[.12em] text-[#7f99a8]">
                            FIG. {String(i + 1).padStart(2, "0")}
                          </span>

                        </div>

                        <h3 className="display-font mt-3 text-xl font-semibold leading-[1.12] tracking-[-.04em] text-[#eef3f5] transition-colors duration-200 group-hover:text-[#f3a02d] md:text-2xl">
                          {product.name}
                        </h3>

                        <p className="mt-4 max-w-sm text-[13px] leading-6 text-[#a9bdc9]">
                          {product.shortDescription}
                        </p>

                      </div>

                      <div className="mt-6 border-t border-[#234052] pt-4">

                        <span className="inline-flex items-center gap-2 mono-font text-[9px] font-medium uppercase tracking-[.15em] text-[#eef3f5] transition-all duration-200 group-hover:gap-3 group-hover:text-[#bd7224]">
                          View system
                          <ArrowRight size={14} />
                        </span>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            )}

          </div>
        </section>


        {/* =========================================================
            AIRLINK APPROACH
            ========================================================= */}
        <section className="blueprint-grid px-5 py-20 text-[#e6eee8] md:px-10 md:py-28">

          <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[.8fr_1.2fr] md:items-end">

            <div>

              <SectionKicker>
                01 / The Airlink approach
              </SectionKicker>

              <h2 className="display-font mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                Calm under
                <br />
                technical pressure.
              </h2>

            </div>

            <div className="grid gap-6 border-t border-[#789b9c]/50 pt-6 md:grid-cols-3">

              <div>
                <ShieldCheck
                  className="mb-5 text-[#e2ac5a]"
                  size={25}
                  strokeWidth={1.5}
                />

                <h3 className="display-font text-xl text-[#eef3f5]">
                  Verified thinking
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#abc5c1]">
                  A practical catalogue built around considered products,
                  clear information, and honest technical boundaries.
                </p>
              </div>

              <div>
                <Target
                  className="mb-5 text-[#e2ac5a]"
                  size={25}
                  strokeWidth={1.5}
                />

                <h3 className="display-font text-xl text-[#eef3f5]">
                  Mission context
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#abc5c1]">
                  We start with the operating requirement, not a shelf of
                  disconnected parts.
                </p>
              </div>

              <div>
                <Phone
                  className="mb-5 text-[#e2ac5a]"
                  size={25}
                  strokeWidth={1.5}
                />

                <h3 className="display-font text-xl text-[#eef3f5]">
                  Human support
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#abc5c1]">
                  When the requirement is specific, a serious conversation
                  is only a few lines away.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* =========================================================
            FINAL ENQUIRY CTA
            ========================================================= */}
        <section className="border-t border-[#234052] bg-[#061522] px-5 py-20 text-[#eef3f5] md:px-10 md:py-28">

          <div className="mx-auto grid max-w-[1440px] gap-10 md:grid-cols-[1.1fr_.9fr] md:items-end">

            <div>

              <SectionKicker>
                02 / Start with the requirement
              </SectionKicker>

              <h2 className="display-font mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                No theatre.
                <br />
                Just a useful next step.
              </h2>

            </div>

            <div>

              <p className="text-base leading-7 text-[#aebfca]">
                Whether you are qualifying a product family or shaping a
                new technical requirement, give us the working context.
                We will come back with a clear route forward.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-3 bg-[#d78b2e] px-5 py-4 mono-font text-[10px] font-medium uppercase tracking-[.15em] text-[#102333] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f0a03a]"
                data-testid="link-home-enquiry"
              >
                Make an enquiry
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>
        </section>

      </main>
    </Layout>
  );
}
function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group ui-card block overflow-hidden"
      data-testid={`card-product-${product.id}`}
    >
      <ProductVisual product={product} />

      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="mono-font text-[9px] font-medium uppercase tracking-[.15em] text-[#bd7224]">
            {product.eyebrow}
          </p>

          <span className="mono-font text-[9px] tracking-[.12em] text-[#8aa09f]">
            {String(product.id).padStart(2, "0")}
          </span>
        </div>

        <h2 className="display-font mt-3 text-xl font-semibold leading-tight tracking-[-.035em] text-[#193b4b] transition-colors duration-200 group-hover:text-[#bd7224] md:text-[22px]">
          {product.name}
        </h2>

        <p className="mt-3 min-h-[72px] text-[13px] leading-6 text-[#637b7c]">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#234052] pt-4">
          <span className="mono-font text-[8px] uppercase tracking-[.13em] text-[#718a8b]">
            {product.category}
          </span>

          <span className="flex items-center gap-2 mono-font text-[9px] font-medium uppercase tracking-[.13em] text-[#eef3f5] transition-all duration-200 group-hover:gap-3 group-hover:text-[#bd7224]">
            View details
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Products() {
  const query = useGetProducts();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const products = query.data ?? [];
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const filtered = products.filter((p) => (category === 'All' || p.category === category) && (!search || `${p.name} ${p.shortDescription}`.toLowerCase().includes(search.toLowerCase())));
  return <Layout><main><PageIntro eyebrow="Product catalogue / Published systems" title="Hardware with a job to do."><span>Explore the current Airlink product families. Filter by discipline, then open a system to see the information currently available.</span></PageIntro><section className="px-5 py-12 md:px-10 md:py-20"><div className="mx-auto max-w-[1440px]"><div className="mb-10 flex flex-col gap-5 border-b border-[#c7d2ce] pb-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-4 py-2 mono-font text-[10px] uppercase tracking-[.13em] ${category === item ? 'border-[#193b4b] bg-[#193b4b] text-[#f5f2e9]' : 'border-[#b6c8c3] text-[#c2d0da] hover:border-[#193b4b]'}`} data-testid={`button-filter-${item.toLowerCase().replace(/\s/g, '-')}`}>{item}</button>)}</div><label className="flex items-center gap-3 border-b border-[#9eb2ae] pb-2 lg:w-64"><span className="mono-font text-[9px] uppercase tracking-[.12em] text-[#718a8b]">Find</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Product or application" className="w-full bg-transparent text-sm outline-none placeholder:text-[#9eafad]" data-testid="input-product-search" /></label></div>{query.isLoading ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><LoadingBlock /><LoadingBlock /><LoadingBlock /></div> : query.isError ? <ErrorBlock retry={() => query.refetch()} /> : filtered.length === 0 ? <EmptyBlock label={products.length ? 'No product families match that search.' : 'Product families are not yet published.'} /> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>}</div></section></main></Layout>;
}

function ProductDetailPage({ slug }: { slug: string }) {
  const query = useGetProductBySlug(slug);
  const product = query.data;
  if (query.isLoading) return <Layout><main className="mx-auto max-w-[1440px] px-5 py-20 md:px-10"><LoadingBlock label="Loading product brief" /></main></Layout>;
  if (query.isError || !product) return <Layout><main className="mx-auto max-w-[1440px] px-5 py-20 md:px-10"><ErrorBlock retry={() => query.refetch()} label="This product brief is unavailable or has not been published." /></main></Layout>;
  return <Layout><main><section className="border-b border-[#cad4d1] px-5 py-10 md:px-10 md:py-14"><div className="mx-auto max-w-[1440px]"><Link href="/products" className="mono-font text-[10px] uppercase tracking-[.15em] text-[#718a8b] hover:text-[#bd7224]" data-testid="link-back-products">← Product catalogue</Link><div className="mt-10 grid gap-10 md:grid-cols-[.9fr_1.1fr] md:items-center"><ProductVisual product={product} large /><div><SectionKicker>{product.eyebrow} / {product.category}</SectionKicker><h1 className="display-font mt-5 text-5xl font-semibold leading-[.96] tracking-[-.06em] text-[#193b4b] md:text-7xl">{product.name}</h1><p className="mt-7 text-lg leading-8 text-[#587177]">{product.description}</p><Link href={`/contact?product=${product.slug}`} className="mt-8 inline-flex items-center gap-3 bg-[#d78b2e] px-5 py-4 mono-font text-[10px] uppercase tracking-[.15em] text-[#193b4b]" data-testid="link-product-enquiry">Discuss this system <ArrowRight size={15} /></Link></div></div></div></section><section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto grid max-w-[1440px] gap-14 md:grid-cols-[.85fr_1.15fr]"><div><SectionKicker>System brief</SectionKicker><h2 className="display-font mt-4 text-4xl font-semibold leading-tight tracking-[-.05em] text-[#193b4b]">Designed around<br />the use case.</h2><div className="mt-10 grid gap-7 border-t border-[#c7d2ce] pt-6">{[['Features', product.features], ['Applications', product.applications]].map(([label, items]) => <div key={String(label)}><p className="mono-font text-[9px] uppercase tracking-[.16em] text-[#bd7224]">{label}</p><ul className="mt-4 grid gap-3">{(items as string[]).map((item, i) => <li key={i} className="flex gap-3 text-sm leading-6 text-[#526e73]"><Check className="mt-1 shrink-0 text-[#bd7224]" size={15} />{item}</li>)}</ul></div>)}</div></div><div><div className="border border-[#c7d2ce] bg-[#e7eee8] p-6 md:p-8"><p className="mono-font text-[9px] uppercase tracking-[.16em] text-[#bd7224]">Published specifications</p>{product.specifications?.length ? <div className="mt-6 divide-y divide-[#c4d3cd]">{product.specifications.map((spec, i) => <div className="flex justify-between gap-5 py-4 text-sm" key={i}><span className="text-[#718a8b]">{spec.label}</span><span className="text-right font-semibold text-[#193b4b]">{spec.value}</span></div>)}</div> : <p className="mt-6 text-sm leading-6 text-[#587177]">Technical specifications are not yet published for this system. Contact engineering for the current qualification package.</p>}</div><div className="mt-8 border-t border-[#c7d2ce] pt-6"><SectionKicker>Need a closer fit?</SectionKicker><p className="mt-3 text-sm leading-6 text-[#587177]">Our catalogue is a starting point. Share your operating context and we can discuss the requirement.</p><Link href="/contact" className="mt-5 inline-flex items-center gap-2 mono-font text-[10px] uppercase tracking-[.15em] text-[#193b4b] underline decoration-[#bd7224] underline-offset-8" data-testid="link-detail-contact">Contact engineering <ArrowRight size={14} /></Link></div></div></div></section>{product.relatedProducts?.length > 0 && <section className="border-t border-[#cad4d1] px-5 py-16 md:px-10"><div className="mx-auto max-w-[1440px]"><SectionKicker>Related systems</SectionKicker><div className="mt-8 grid gap-5 md:grid-cols-3">{product.relatedProducts.map((related) => <ProductCard key={related.id} product={related} />)}</div></div></section>}</main></Layout>;
}

function Resources() {
  const query = useGetResources();
  const resources = query.data ?? [];
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(resources.map((r) => r.category)))], [resources]);
  const visible = resources.filter((r) => category === 'All' || r.category === category);
  return <Layout><main><PageIntro eyebrow="Technical resources / Reference library" title="Information for the next decision."><span>Access the published guides, documents, and technical reference material available from Airlink.</span></PageIntro><section className="px-5 py-12 md:px-10 md:py-20"><div className="mx-auto max-w-[1100px]"><div className="mb-10 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`border px-4 py-2 mono-font text-[10px] uppercase tracking-[.13em] ${category === item ? 'border-[#193b4b] bg-[#193b4b] text-[#f5f2e9]' : 'border-[#b6c8c3] text-[#587177]'}`} data-testid={`button-resource-filter-${item.toLowerCase().replace(/\s/g, '-')}`}>{item}</button>)}</div>{query.isLoading ? <LoadingBlock label="Indexing resource library" /> : query.isError ? <ErrorBlock retry={() => query.refetch()} /> : visible.length === 0 ? <EmptyBlock label="Technical resources are not yet published." /> : <div className="divide-y divide-[#c7d2ce] border-y border-[#c7d2ce]">{visible.map((resource) => <ResourceRow key={resource.id} resource={resource} />)}</div>}</div></section><section className="blueprint-grid px-5 py-16 text-[#e6eee8] md:px-10 md:py-20"><div className="mx-auto flex max-w-[1100px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><SectionKicker>Resource request</SectionKicker><h2 className="display-font mt-4 max-w-xl text-4xl font-semibold tracking-[-.05em] md:text-5xl">Looking for something specific?</h2></div><Link href="/contact" className="inline-flex items-center gap-2 self-start border border-[#8eafad] px-5 py-4 mono-font text-[10px] uppercase tracking-[.15em] hover:bg-[#284f5d]" data-testid="link-resource-request">Ask engineering <ArrowRight size={14} /></Link></div></section></main></Layout>;
}
function ResourceRow({ resource }: { resource: Resource }) { const external = resource.href.startsWith('http'); return <div className="grid gap-5 py-7 md:grid-cols-[130px_1fr_auto] md:items-center"><div><p className="mono-font text-[9px] uppercase tracking-[.15em] text-[#bd7224]">{resource.type}</p><p className="mt-2 text-xs text-[#839796]">{resource.category}</p></div><div><h2 className="display-font text-2xl font-semibold tracking-[-.04em] text-[#193b4b]">{resource.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#a9bdc9]">{resource.description}</p></div>{external ? <a href={resource.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mono-font text-[10px] uppercase tracking-[.13em] text-[#193b4b] underline decoration-[#bd7224] underline-offset-8" data-testid={`link-resource-${resource.id}`}>{resource.actionLabel} <MoveUpRight size={14} /></a> : <Link href={resource.href} className="inline-flex items-center gap-2 mono-font text-[10px] uppercase tracking-[.13em] text-[#193b4b] underline decoration-[#bd7224] underline-offset-8" data-testid={`link-resource-${resource.id}`}>{resource.actionLabel} <ArrowRight size={14} /></Link>}</div>; }

function About() {
  return (
    <Layout>
      <main>

        {/* PAGE INTRO */}
        <PageIntro
          eyebrow="About Airlink / Who we are"
          title="Engineering technology for environments where reliability matters."
        >
          <span>
            Airlink Aviation is an aerospace and defence technology company
            focused on rugged electronic and electromechanical systems for
            mission-critical applications.
          </span>
        </PageIntro>

        {/* =========================================================
            WHO WE ARE
            ========================================================= */}
        <section className="bg-[#061522] px-5 py-16 text-[#eef3f5] md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[0.8fr_1.2fr]">

            <div>
              <SectionKicker>Who we are</SectionKicker>

              <h2 className="display-font mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                Built for systems that cannot afford to compromise.
              </h2>
            </div>

            <div className="space-y-6 text-base leading-8 text-[#aebfca]">

              <p>
                Airlink Aviation develops and supplies rugged electronic and
                electromechanical solutions for aerospace and defence
                applications.
              </p>

              <p>
                Our work brings together product engineering, rugged computing,
                displays, control systems, precision wiring, cable assemblies,
                connectors and simulation solutions.
              </p>

              <p>
                The focus is simple: understand the operating environment,
                engineer for the requirement, and provide dependable technology
                that can support the mission.
              </p>

              <div className="border-l-2 border-[#f39a12] pl-6 text-xl leading-8 text-[#eef3f5]">
                Engineering is not only about building a product. It is about
                building confidence in the system around it.
              </div>

            </div>
          </div>
        </section>


        {/* =========================================================
            WHAT WE DO
            ========================================================= */}
        <section className="site-grid border-y border-[#234052] bg-[#081923] px-5 py-16 text-[#eef3f5] md:px-10 md:py-24">

          <div className="mx-auto max-w-[1200px]">

            <div className="max-w-2xl">
              <SectionKicker>What we do</SectionKicker>

              <h2 className="display-font mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] text-[#eef3f5] md:text-5xl">
                Technology across the mission-critical electronics chain.
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#a9bdc9]">
                From cockpit interfaces and rugged displays to wiring,
                interconnects and simulation equipment, our product areas are
                designed around demanding aerospace and defence environments.
              </p>
            </div>

            <div className="mt-12 grid gap-px border border-[#234052] bg-[#234052] md:grid-cols-2">

              {[
                [
                  "01",
                  "Rugged Computing & Displays",
                  "Rugged electronic computing and display solutions for demanding operating environments.",
                ],
                [
                  "02",
                  "Aircraft HMI & Control Panels",
                  "Human-machine interfaces and control panels designed around operational requirements.",
                ],
                [
                  "03",
                  "Precision Wiring & Harnesses",
                  "Precision wiring and cable harness solutions for aerospace and defence applications.",
                ],
                [
                  "04",
                  "RF & Fiber Interconnects",
                  "RF cable assemblies and fiber optic interconnect solutions for high-performance systems.",
                ],
                [
                  "05",
                  "Military-Grade Connectors",
                  "Circular and MicroD connector solutions for demanding interconnection requirements.",
                ],
                [
                  "06",
                  "Simulation & Training",
                  "Radio simulation and training equipment supporting realistic technical environments.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="bg-[#0d2433] p-7 transition-colors duration-200 hover:bg-[#102d3e] md:p-9"
                >
                  <span className="mono-font text-[11px] tracking-[.15em] text-[#f39a12]">
                    {number}
                  </span>

                  <h3 className="display-font mt-5 text-2xl font-semibold tracking-[-.04em] text-[#eef3f5]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#a9bdc9]">
                    {text}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>


        {/* =========================================================
            WHERE WE WORK
            ========================================================= */}
        <section className="bg-[#061522] px-5 py-16 text-[#eef3f5] md:px-10 md:py-24">

          <div className="mx-auto max-w-[1200px]">

            <div className="grid gap-12 md:grid-cols-[1fr_1fr]">

              <div>
                <SectionKicker>Where our technology fits</SectionKicker>

                <h2 className="display-font mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] text-[#eef3f5] md:text-5xl">
                  Designed around demanding environments.
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">

                {[
                  [
                    "01",
                    "Airborne",
                    "Systems designed for demanding airborne applications.",
                  ],
                  [
                    "02",
                    "Naval",
                    "Technology supporting challenging naval environments.",
                  ],
                  [
                    "03",
                    "Electronic Warfare",
                    "Solutions for specialised electronic environments.",
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="border border-[#234052] bg-[#0d2433] p-6 transition-colors duration-200 hover:border-[#557587]"
                  >
                    <span className="mono-font text-[10px] text-[#f39a12]">
                      {number}
                    </span>

                    <h3 className="display-font mt-5 text-xl font-semibold text-[#eef3f5]">
                      {title}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-[#a9bdc9]">
                      {text}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </section>


        {/* =========================================================
            WHY AIRLINK
            ========================================================= */}
        <section className="blueprint-grid border-y border-[#234052] px-5 py-16 text-[#e6eee8] md:px-10 md:py-24">

          <div className="mx-auto max-w-[1200px]">

            <SectionKicker>Why work with Airlink</SectionKicker>

            <div className="mt-5 grid gap-12 md:grid-cols-[0.9fr_1.1fr]">

              <h2 className="display-font text-4xl font-semibold leading-tight tracking-[-.05em] text-[#eef3f5] md:text-6xl">
                From requirement to reliable technology.
              </h2>

              <div className="grid gap-8 sm:grid-cols-2">

                {[
                  [
                    "Mission focus",
                    "Solutions developed around demanding aerospace and defence requirements.",
                  ],
                  [
                    "Rugged engineering",
                    "A focus on reliability, durability and performance in challenging environments.",
                  ],
                  [
                    "Integrated capability",
                    "Product, wiring, interconnect and simulation capabilities brought together.",
                  ],
                  [
                    "Lifecycle support",
                    "Engineering, testing, repair and lifecycle support across the solution.",
                  ],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="border-t border-[#56777a] pt-5"
                  >
                    <h3 className="display-font text-xl font-semibold text-[#eef3f5]">
                      {title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#abc5c1]">
                      {text}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </section>


        {/* =========================================================
            HOW WE WORK
            ========================================================= */}
        <section className="bg-[#081923] px-5 py-16 text-[#eef3f5] md:px-10 md:py-24">

          <div className="mx-auto max-w-[1200px]">

            <SectionKicker>How we work</SectionKicker>

            <div className="mt-10 grid gap-0 border-t border-[#234052] md:grid-cols-4">

              {[
                [
                  "01",
                  "Understand",
                  "Start with the requirement, environment and intended application.",
                ],
                [
                  "02",
                  "Engineer",
                  "Translate the requirement into a practical technical solution.",
                ],
                [
                  "03",
                  "Integrate",
                  "Bring products, interfaces and interconnects together around the system.",
                ],
                [
                  "04",
                  "Support",
                  "Continue the relationship through testing, repair and lifecycle needs.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="border-b border-[#234052] py-8 md:border-r md:px-7 md:last:border-r-0"
                >
                  <span className="mono-font text-sm text-[#f39a12]">
                    {number}
                  </span>

                  <h3 className="display-font mt-5 text-2xl font-semibold text-[#eef3f5]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#a9bdc9]">
                    {text}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>


        {/* =========================================================
            CTA
            ========================================================= */}
        <section className="border-t border-[#234052] bg-[#061522] px-5 py-16 text-[#eef3f5] md:px-10 md:py-20">

          <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <SectionKicker>Explore Airlink</SectionKicker>

              <h2 className="display-font mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.05em] text-[#eef3f5] md:text-5xl">
                See the capabilities behind the technology.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/capabilities"
                className="inline-flex items-center gap-2 bg-[#f39a12] px-5 py-4 mono-font text-[10px] font-medium uppercase tracking-[.14em] text-[#102333] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ffad2f]"
                data-testid="link-about-capabilities"
              >
                Our capabilities
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-[#6f8796] px-5 py-4 mono-font text-[10px] uppercase tracking-[.14em] text-[#eef3f5] transition-colors hover:border-[#f39a12] hover:text-[#f39a12]"
                data-testid="link-about-contact"
              >
                Talk to Airlink
                <ArrowRight size={14} />
              </Link>

            </div>

          </div>
        </section>

      </main>
    </Layout>
  );
}
function Capabilities() { return <Layout><main><PageIntro eyebrow="Capabilities / Technical partnership" title="From requirement to ready."><span>Airlink supports the work around the product: understanding the need, navigating the technical detail, and helping teams identify a credible next move.</span></PageIntro><section className="px-5 py-16 md:px-10 md:py-24"><div className="mx-auto max-w-[1200px]"><div className="grid gap-0 border-t border-[#c7d2ce]">{[['01', 'Requirements context', 'Start from the operational need. We help make the requirement legible before a product decision is made.'], ['02', 'Product family guidance', 'Navigate the catalogue with clear descriptions, applications, and the technical information currently available.'], ['03', 'Engineering dialogue', 'When the question is specific, bring the constraint to a serious conversation with our team.'], ['04', 'Technical resources', 'Keep the next decision moving with published reference material and a direct route to ask for more.']].map(([number, title, text]) => <div key={number} className="grid gap-5 border-b border-[#c7d2ce] py-8 md:grid-cols-[100px_1fr_1fr] md:items-center"><span className="mono-font text-sm text-[#bd7224]">{number}</span><h2 className="display-font text-3xl font-semibold tracking-[-.04em] text-[#193b4b]">{title}</h2><p className="max-w-md text-sm leading-6 text-[#637b7c]">{text}</p></div>)}</div></div></section><section className="blueprint-grid px-5 py-20 text-[#e6eee8] md:px-10 md:py-28"><div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1fr_1fr] md:items-end"><div><SectionKicker>Built for useful conversations</SectionKicker><h2 className="display-font mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-.05em] md:text-6xl">The brief can begin with a question.</h2></div><div><p className="text-base leading-8 text-[#abc5c1]">Tell us what you are trying to achieve, what you already know, and where the uncertainty sits. That is enough to begin.</p><Link href="/contact" className="mt-7 inline-flex items-center gap-2 bg-[#d78b2e] px-5 py-4 mono-font text-[10px] uppercase tracking-[.14em] text-[#193b4b]" data-testid="link-capabilities-contact">Start a conversation <ArrowRight size={14} /></Link></div></div></section></main></Layout>; }

function Contact() {
  const [location] = useLocation();

  const enquiry = useCreateEnquiry();

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const requestedProduct = new URLSearchParams(
    location.split("?")[1] ?? ""
  ).get("product");

  const [form, setForm] = useState<EnquiryInput>({
    productSlug: requestedProduct,
    name: "",
    company: "",
    email: "",
    phone: "",
    requirement: "",
    message: "",
  });

  const setField = (key: keyof EnquiryInput, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    // Clear validation error when the user starts correcting the form
    setFormError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (form.name.trim().length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    }

    if (form.company.trim().length < 2) {
      errors.company = "Company must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      errors.email = "Please enter your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (form.phone.trim().length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (form.requirement.trim().length < 2) {
      errors.requirement = "Please enter your requirement.";
    }

    if (form.message.trim().length < 10) {
      errors.message = "Message must contain at least 10 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setFormError(Object.values(errors)[0]);
      return;
    }

    setFormError("");

    enquiry.mutate(
      {
        data: {
          ...form,
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          requirement: form.requirement.trim(),
          message: form.message.trim(),
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          setFormError("");
        },
      }
    );
  };

  return (
    <Layout>
      <main>
        <PageIntro
          eyebrow="Contact / Enquiry desk"
          title="Bring us the hard part."
        >
          <span>
            A useful conversation starts with context. Tell us what you are
            working on and a member of the Airlink team will review the
            requirement.
          </span>
        </PageIntro>

        <section className="px-5 py-14 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-[.7fr_1.3fr]">
            <div>
              <SectionKicker>Direct line</SectionKicker>

              <h2 className="display-font mt-5 text-4xl font-semibold leading-tight tracking-[-.05em] text-[#193b4b]">
                A clear brief
                <br />
                gets a clear reply.
              </h2>

              <p className="mt-6 text-sm leading-7 text-[#637b7c]">
                Use the form for a product enquiry, a technical question, or
                an early-stage requirement. The more operating context you can
                share, the more useful our first response can be.
              </p>

              <div className="mt-10 border-t border-[#c7d2ce] pt-5">
                <p className="mono-font text-[9px] uppercase tracking-[.16em] text-[#bd7224]">
                  What to include
                </p>

                <ul className="mt-4 grid gap-3 text-sm text-[#587177]">
                  <li className="flex gap-3">
                    <Check size={15} className="mt-0.5 text-[#bd7224]" />
                    The requirement or mission context
                  </li>

                  <li className="flex gap-3">
                    <Check size={15} className="mt-0.5 text-[#bd7224]" />
                    The product family, if known
                  </li>

                  <li className="flex gap-3">
                    <Check size={15} className="mt-0.5 text-[#bd7224]" />
                    The decision or timeline ahead
                  </li>
                </ul>
              </div>
            </div>

            {submitted ? (
              <div
                className="blueprint-grid flex min-h-[420px] flex-col items-start justify-center p-8 text-[#e6eee8] md:p-14"
                data-testid="status-enquiry-success"
              >
                <div className="grid size-12 place-items-center border border-[#d78b2e] text-[#d78b2e]">
                  <Check size={22} />
                </div>

                <SectionKicker>Enquiry received</SectionKicker>

                <h2 className="display-font mt-4 text-4xl font-semibold tracking-[-.05em]">
                  Thank you. The brief is with us.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#abc5c1]">
                  We have received your enquiry and will review the
                  requirement. Keep this reference for your records:{" "}
                  <span className="mono-font text-[#e2b168]">
                    {enquiry.data?.id ?? "submitted"}
                  </span>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormError("");
                    enquiry.reset();
                  }}
                  className="mt-8 border border-[#8eafad] px-5 py-3 mono-font text-[10px] uppercase tracking-[.14em]"
                  data-testid="button-new-enquiry"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="border border-[#c7d2ce] bg-[#e7eee8] p-6 md:p-10"
                data-testid="form-enquiry"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => setField("name", v)}
                    required
                    testId="input-name"
                  />

                  <Field
                    label="Company"
                    value={form.company}
                    onChange={(v) => setField("company", v)}
                    required
                    testId="input-company"
                  />

                  <Field
                    label="Work email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setField("email", v)}
                    required
                    testId="input-email"
                  />

                  <Field
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setField("phone", v)}
                    required
                    testId="input-phone"
                  />

                  <Field
                    label="Requirement"
                    value={form.requirement}
                    onChange={(v) => setField("requirement", v)}
                    required
                    testId="input-requirement"
                    wide
                  />

                  <label className="grid gap-2 md:col-span-2">
                    <span className="mono-font text-[9px] uppercase tracking-[.15em] text-[#587177]">
                      Message{" "}
                      <span className="text-[#bd7224]">*</span>
                    </span>

                    <textarea
                      value={form.message}
                      onChange={(e) => setField("message", e.target.value)}
                      required
                      minLength={10}
                      rows={5}
                      placeholder="Tell us what you are trying to solve."
                      className="resize-y border border-[#b6c8c3] bg-[#f9f8f2] px-4 py-3 text-sm outline-none placeholder:text-[#9aabaa] focus:border-[#193b4b]"
                      data-testid="input-message"
                    />
                  </label>
                </div>

                {formError && (
                  <p
                    className="mt-5 flex gap-2 text-sm text-[#ad5b43]"
                    data-testid="status-enquiry-error"
                  >
                    <CircleAlert size={16} />
                    {formError}
                  </p>
                )}

                {enquiry.isError && !formError && (
                  <p
                    className="mt-5 flex gap-2 text-sm text-[#ad5b43]"
                    data-testid="status-enquiry-error"
                  >
                    <CircleAlert size={16} />
                    We could not send the enquiry. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={enquiry.isPending}
                  className="mt-7 inline-flex items-center gap-3 bg-[#193b4b] px-5 py-4 mono-font text-[10px] uppercase tracking-[.15em] text-[#f5f2e9] disabled:opacity-60"
                  data-testid="button-submit-enquiry"
                >
                  {enquiry.isPending ? "Sending brief…" : "Send enquiry"}
                  <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  wide,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  wide?: boolean;
  testId: string;
}) {
  return (
    <label className={`grid gap-2 ${wide ? "md:col-span-2" : ""}`}>
      <span className="mono-font text-[9px] uppercase tracking-[.15em] text-[#587177]">
        {label}{" "}
        {required && <span className="text-[#bd7224]">*</span>}
      </span>

      <input
        id={testId}
        name={testId}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#b6c8c3] bg-[#f9f8f2] px-4 py-3 text-sm outline-none focus:border-[#193b4b]"
        data-testid={testId}
      />
    </label>
  );
}
function AuthGuard({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!data.session) {
        navigate("/login");
        return;
      }

      setChecking(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session) {
        navigate("/login");
        return;
      }

      setChecking(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#061522] text-[#eef3f5]">
        <div className="text-center">
          <p className="mono-font text-[10px] uppercase tracking-[.2em] text-[#f39a12]">
            Airlink Aviation
          </p>

          <p className="mt-4 text-sm text-[#9fb1bb]">
            Verifying secure access...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

function Router() {
  const [location] = useLocation();

  return (
    <RoutedErrorBoundary>
      {location === "/login" ? (
        <Login />
      ) : (
        <AuthGuard>
          <Switch>
            <Route path="/" component={Home} />

            <Route path="/products" component={Products} />

            <Route path="/products/:slug">
              {(params) => (
                <ProductDetailPage slug={params.slug} />
              )}
            </Route>

            <Route path="/resources" component={Resources} />

            <Route path="/about" component={About} />

            <Route path="/capabilities" component={Capabilities} />

            <Route path="/contact" component={Contact} />

            <Route component={NotFound} />
          </Switch>
        </AuthGuard>
      )}
    </RoutedErrorBoundary>
  );
}
function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter
          base={import.meta.env.BASE_URL.replace(/\/$/, '')}
        >
          <ScrollToTop />
          <Router />
        </WouterRouter>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
