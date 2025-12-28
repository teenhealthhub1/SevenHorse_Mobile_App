import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { getFooterYearRange } from '@/app/lib/utils/utils';

// import '@/app/ui/global.css';
// import {inter} from '@/app/ui/fonts';
// import  Metadata from 'next';
 

// export const metadata: typeof Metadata = {
//     title: 'Invoices',
// };
  
export default async function Page( props:{
    searchParams?: Promise<{
     query?:string;
     page?:string;
    } >
  }
){

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage =  Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);
    // return <p>Invoice Page</p>;
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className= {'${lusitana.classname} text-2xl'}>Invoices</h1>
            </div>
            <div className='mt-4 flex w-full items-center justify-between gap-2 md:mt-8 '>
                <Search placeholder="Search Invoice..." />
                {/* <CreateInvoice /> */}
            </div>
            {                 
                <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />} >
                <Table query={query} currentPage={currentPage} />
                </Suspense>                 
            }
     
            <div className="mt-5 flex w-full justify-center">
                {
                <Pagination totalPages={totalPages} />
                }
            </div>
               <footer className="mt-8 text-center text-sm text-gray-500">
                    © {getFooterYearRange(2024)} 7Horse. All rights reserved.
                  </footer>
        </div>
    );
}