import FORM from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
import { getFooterYearRange } from '@/app/lib/utils/utils';
 
export const metadata: Metadata = {
    title: 'Create',
  };
  

export default async function page(){
const customers = await fetchCustomers();
return (
    <main>
    <Breadcrumbs breadcrumbs={
        [
            {label: 'Inovices', href: '/dashboard/invoices'},
            {label: 'Create Invoice', href: '/dashboard/invoices/create', active: true}, 
        ]
    }/>
    <FORM customers={customers}></FORM>
       <footer className="mt-8 text-center text-sm text-gray-500">
            © {getFooterYearRange(2024)} 7Horse. All rights reserved.
          </footer>
    </main>);
}