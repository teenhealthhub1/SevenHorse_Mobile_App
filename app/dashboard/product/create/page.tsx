import ProductForm from '@/app/ui/product/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchLkpSparam } from '@/app/lib/data';
import { Metadata } from 'next';
import { getFooterYearRange } from '@/app/lib/utils/utils';

export const metadata: Metadata = {
    title: 'Create',
};


export default async function page() {
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
            <Breadcrumbs breadcrumbs={
                [
                    { label: 'Product', href: '/dashboard/product' },
                    { label: 'Create product', href: '/dashboard/product/create', active: true },
                ]
            } />
            <ProductForm dollarPoints={dollarPoints}></ProductForm>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>);
}