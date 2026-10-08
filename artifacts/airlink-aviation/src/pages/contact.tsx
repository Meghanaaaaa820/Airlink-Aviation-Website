import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCreateEnquiry, useGetProducts } from '@workspace/api-client-react';
import type { EnquiryInput } from '@workspace/api-client-react';
import { Layout } from '@/components/site/layout';
import { resolveProduct } from '@/components/site/product';
import { Eyebrow, PageHero, Section } from '@/components/site/ui';
import { orderBySlug } from '@/content/catalogue';
import { company } from '@/content/company';

function Field({
  label,
  value,
  onChange,
  type = 'text',
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
    <label className={`grid gap-2 ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="field-label">
        {label} {required && <span className="text-orange-ink">*</span>}
      </span>
      <input
        id={testId}
        name={testId}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
        data-testid={testId}
      />
    </label>
  );
}

export default function Contact() {
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

  const products = orderBySlug(productsQuery.data ?? []);
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
    enquiry.mutate(
      { data: payload },
      {
        onSuccess: () => {
          setSubmitted(true);
          setFormError('');
        },
        onError: () => setFormError('We could not send your enquiry. Please review the details and try again.'),
      },
    );
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormError('');
    enquiry.reset();
    setForm({ productSlug: requestedProduct, name: '', company: '', email: '', phone: '', requirement: '', message: '' });
  };

  return (
    <Layout>
      <main>
        <PageHero eyebrow="Contact" title="Request an enquiry.">
          <span>Tell the Airlink team what you are working on. A clear description of the application helps us make the first response useful.</span>
        </PageHero>

        <Section>
          <div className="grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
            <aside>
              <Eyebrow>Engineering enquiry</Eyebrow>
              <h2 className="mt-5 text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">A clear brief gets a clear reply.</h2>
              <p className="copy mt-5">Use this form for a product enquiry, a technical question or an early-stage requirement.</p>

              <div className="mt-10 border-t border-line pt-6">
                <p className="eyebrow">Useful context</p>
                <ul className="mt-5 grid gap-3">
                  {['The operating requirement or application', 'The product or solution, if already identified', 'Drawings or specifications available', 'The next decision or timeline'].map((item) => (
                    <li key={item} className="flex gap-2.5 text-[12px] leading-5 text-[#46565f]">
                      <Check size={14} className="mt-0.5 shrink-0 text-orange-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 border-t border-line pt-6 text-[12px] leading-6 text-[#46565f]">
                <p className="eyebrow">Direct contact</p>
                <div className="mt-4 grid gap-1">
                  {company.emails.map((email) => (
                    <a key={email} className="hover:text-orange-ink" href={`mailto:${email}`}>{email}</a>
                  ))}
                  {company.phones.map((phone) => (
                    <a key={phone.href} className="hover:text-orange-ink" href={phone.href}>{phone.label}</a>
                  ))}
                </div>
                <p className="mt-4 max-w-xs">{company.address}</p>
              </div>
            </aside>

            {submitted ? (
              <div className="flex min-h-[440px] flex-col items-start justify-center bg-navy p-8 text-white md:p-14" data-testid="status-enquiry-success">
                <div className="grid size-12 place-items-center border border-orange text-orange">
                  <Check size={22} />
                </div>
                <p className="eyebrow eyebrow-light mt-8">Enquiry received</p>
                <h2 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.03em]">Thank you. Your enquiry is with us.</h2>
                <p className="copy-light mt-4 max-w-lg">
                  Your enquiry has been submitted. Reference: <span className="font-semibold text-orange">{enquiry.data?.id ?? 'submitted'}</span>
                </p>
                <button type="button" onClick={resetForm} className="btn btn-outline-light mt-8" data-testid="button-new-enquiry">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="border border-line bg-white p-6 md:p-10" data-testid="form-enquiry">
                <div className="mb-8 border-l-2 border-orange bg-paper px-5 py-4">
                  <label className="grid gap-2">
                    <span className="field-label">
                      Product <span className="font-normal normal-case tracking-normal">(optional)</span>
                    </span>
                    <select
                      value={form.productSlug ?? ''}
                      onChange={(event) => setField('productSlug', event.target.value)}
                      className="field-input"
                      data-testid="select-enquiry-product"
                    >
                      <option value="">General enquiry</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.slug}>
                          {resolveProduct(product).name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {chosenProduct && (
                    <p className="mt-2 text-[11px] text-steel">
                      Enquiry about <span className="font-semibold text-ink">{resolveProduct(chosenProduct).name}</span>
                    </p>
                  )}
                  {requestedProduct && !chosenProduct && !productsQuery.isLoading && <p className="mt-2 text-[11px] text-steel">Product reference: {requestedProduct}</p>}
                  {productsQuery.isLoading && (
                    <p className="mt-2 text-[11px] text-steel" data-testid="status-enquiry-products-loading">
                      Loading products…
                    </p>
                  )}
                  {productsQuery.isError && (
                    <div className="mt-2 flex items-center gap-3">
                      <p className="text-[11px] text-[#8a6b5e]" data-testid="status-enquiry-products-error">
                        Product choices are temporarily unavailable.
                      </p>
                      <button type="button" onClick={() => productsQuery.refetch()} className="text-[11px] font-bold text-navy underline underline-offset-2" data-testid="button-retry-enquiry-products">
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Name" value={form.name} onChange={(value) => setField('name', value)} required testId="input-name" />
                  <Field label="Company" value={form.company} onChange={(value) => setField('company', value)} required testId="input-company" />
                  <Field label="Work email" type="email" value={form.email} onChange={(value) => setField('email', value)} required testId="input-email" />
                  <Field label="Phone" type="tel" value={form.phone} onChange={(value) => setField('phone', value)} required testId="input-phone" />
                  <Field label="Requirement" value={form.requirement} onChange={(value) => setField('requirement', value)} required wide testId="input-requirement" />
                  <label className="grid gap-2 sm:col-span-2">
                    <span className="field-label">
                      Message <span className="text-orange-ink">*</span>
                    </span>
                    <textarea
                      value={form.message}
                      onChange={(event) => setField('message', event.target.value)}
                      required
                      minLength={10}
                      rows={6}
                      placeholder="Share the application, constraints and context."
                      className="field-input resize-y py-3 leading-6"
                      data-testid="input-message"
                    />
                  </label>
                </div>

                {formError && (
                  <p className="mt-6 flex gap-2 text-[12px] leading-5 text-[#a34e37]" data-testid="status-enquiry-error" role="alert">
                    <CircleAlert size={16} className="mt-0.5 shrink-0" />
                    {formError}
                  </p>
                )}
                {enquiry.isError && !formError && (
                  <p className="mt-6 text-[12px] text-[#a34e37]" data-testid="status-enquiry-error">
                    Unable to send the enquiry. Please try again.
                  </p>
                )}
                <button type="submit" disabled={enquiry.isPending} className="btn btn-accent mt-8 disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-enquiry">
                  {enquiry.isPending ? 'Sending enquiry…' : 'Send Enquiry'} <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </Section>
      </main>
    </Layout>
  );
}
