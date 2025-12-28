import ProductForm from '@/app/ui/product/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById, fetchProductById, fetchLkpSparam } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getFooterYearRange } from '@/app/lib/utils/utils';

export const metadata: Metadata = {
  title: 'Edit',
};


export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  console.log('edit page' + id);
  const [product] = await Promise.all([
    fetchProductById(id)  
  ]);
  if (!product) {
    notFound();
  }

   // Fetch the dollat to point convertion rate
      const dollarConvertion = await fetchLkpSparam();
      let dollarPoints = 1;
      dollarConvertion.forEach((sparam) => {
          if (sparam.system === 'DOLLARTOPOINTS' && sparam.key === 'DOLLAR') {
              dollarPoints = Number(sparam.value);
              return;
          }
      });

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/product' },
          {
            label: 'Edit Product',
            href: `/dashboard/product/${id}/edit`,
            active: true,
          },
        ]}
      />
      <ProductForm product={product} dollarPoints={dollarPoints} ></ProductForm>
      <footer className="mt-8 text-center text-sm text-gray-500">
        © {getFooterYearRange(2024)} 7Horse. All rights reserved.
      </footer>
    </main>
  );
}