import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Layout } from '@/components/site/layout';
import { PageHero } from '@/components/site/ui';

export default function NotFound() {
  return (
    <Layout>
      <main>
        <PageHero eyebrow="Page not found" title="This page could not be found.">
          <span>The page you are looking for may have moved. Use the navigation or return to the home page.</span>
        </PageHero>
        <section className="px-5 py-20 md:px-10">
          <div className="mx-auto flex max-w-[1360px] flex-wrap gap-3">
            <Link href="/" className="btn btn-navy">
              Home <ArrowRight size={15} />
            </Link>
            <Link href="/products" className="btn btn-outline">
              Products
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
