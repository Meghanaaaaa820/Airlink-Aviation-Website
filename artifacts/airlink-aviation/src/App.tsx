import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getCatalogueEntry } from '@/content/catalogue';
import About from '@/pages/about';
import Capabilities from '@/pages/capabilities';
import Contact from '@/pages/contact';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';
import ProductDetailPage from '@/pages/product-detail';
import Products from '@/pages/products';
import Resources from '@/pages/resources';

const queryClient = new QueryClient();

const pageTitles: Record<string, string> = {
  '/': 'Cable & Wire Harness Solutions',
  '/about': 'About Airlink Aviation',
  '/capabilities': 'Capabilities',
  '/products': 'Products',
  '/resources': 'Resources',
  '/contact': 'Contact',
};

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

function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const pathname = location.split('?')[0] || '/';
    const slug = pathname.startsWith('/products/') ? pathname.slice('/products/'.length) : '';
    const entry = slug ? getCatalogueEntry(slug) : undefined;
    const pageName =
      pageTitles[pathname] ??
      entry?.displayName ??
      (slug ? slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Page not found');
    const title = `${pageName} | Airlink Aviation`;
    const description = entry
      ? `${entry.displayName}: ${entry.tagline}`
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
  return (
    <>
      <PageMetadata />
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/capabilities" component={Capabilities} />
          <Route path="/products" component={Products} />
          <Route path="/products/:slug">{(params) => <ProductDetailPage slug={params.slug} />}</Route>
          <Route path="/resources" component={Resources} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
