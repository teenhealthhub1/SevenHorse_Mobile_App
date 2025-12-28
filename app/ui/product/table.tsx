import Image from 'next/image';
// import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
// import InvoiceStatus from '@/app/ui/invoices/status';
import { UpdateProduct, DeleteProduct } from '@/app/ui/product/buttons';
import ProductStatus from '@/app/ui/product/status';

import { formatDateToLocal, formatCurrency } from '@/app/lib/utils/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import { fetchFilteredProducts } from '@/app/lib/data';

import { pinata } from "@/next.config";

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage);

   
    products.forEach(async (product) => {
      // <TODO> The Below code is working and commented out since we are using images paths as full URL - instead of IPFS CID
      //       // if (!product.images.startsWith('/')) {
      //   const pinata_image_cid = pinata.gateways.public.get('bafkreihdls5j7xhjkvqpiuefjlujmmenbriybw63hk75wdrc4kokajyotm').optimizeImage({ format: "webp", quality: 80 }).then((data) => {
      //     return data;
      //   });
      //   //console.log(`pinata_image_cid: ${pinata_image_cid}`);
      //   console.log(`pinata_image_cid: ${pinata_image_cid}`);
      //   const pinata_image_URL = await pinata.gateways.public.convert('bafkreihdls5j7xhjkvqpiuefjlujmmenbriybw63hk75wdrc4kokajyotm');
      //   console.log(`pinata_image_URL ${pinata_image_URL}`);
      //   // product.images = pinata_image_URL;
      //   //`https://sapphire-left-chinchilla-283.mypinata.cloud/ipfs/bafkreihdls5j7xhjkvqpiuefjlujmmenbriybw63hk75wdrc4kokajyotm`; 
      //   // //pinata_image_URL; //pinata_image_URL;
      //   //product.images = 'https://sapphire-left-chinchilla-283.mypinata.cloud/ipfs/bafkreihdls5j7xhjkvqpiuefjlujmmenbriybw63hk75wdrc4kokajyotm';
      // }
      //product.images.startsWith('//') ? product.images: pinata.gateways.public.get(product.images).optimizeImage({ format: "webp", quality: 80 });              

   });
  
  // invoices?.map((invoice) => (
  //   console.log('Table'+invoice.id)
  // ));
    
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (              
              <div
                key={product.id}                
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={product.images}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${product.name}'s profile picture`}
                      />
                      <p>{product.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                  <ProductStatus status={product.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(product.amount*100)}
                    </p>
                    <p>{product.points}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    <DeleteProduct id={product.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Points
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.images}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${product.name}'s profile picture`}
                      />
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(product.amount*100)}  
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.points}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ProductStatus status={product.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      <DeleteProduct id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
