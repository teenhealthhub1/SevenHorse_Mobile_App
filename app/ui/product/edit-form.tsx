'use client';

import { CustomerField, InvoiceForm, ProductForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

import { updateInvoice, updateProduct } from '@/app/lib/actions';

import { useEffect, useState } from 'react';

export default function EditProductForm({
  product,
  dollarPoints
}: {
  product: ProductForm;
  dollarPoints: number;
}) {

  const [inputValue, setInputValue] = useState<string>(product.amount?.toString() || '');
  const [integerValue, setIntegerValue] = useState<number | null>(product.amount || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parsedValue = parseInt(inputValue, 10);
    if (!isNaN(parsedValue) && parsedValue <= 0) {
      setError("Input value must be greater than 0");
    } else {
      setError(null);
    }
    setInputValue(parsedValue.toString());
  }, [inputValue]);

  useEffect(() => {
    const parsedValue = parseInt(inputValue, 10);
    if (!isNaN(parsedValue)) {
      setIntegerValue(parsedValue);
    } else {
      setIntegerValue(null);
    }
  }, [inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const parsedValue = parseInt(e.target.value, 10);
    if (!isNaN(parsedValue) && parsedValue <= 0) {
      setError("Input value must be greater than 0");
    } else {
      setError(null);
    }
  };

  const amount = integerValue || 0;
  const points = amount * dollarPoints; // Convert to cents

  console.log('EditProductForm', product);
  const updateProductWithId = updateProduct.bind(null, product.id);
  return (
    <form action={updateProductWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product ID */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="hidden"
              id="id"
              name="id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={product.id}
              readOnly
            >
            </input>
          </div>
        </div>

        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={product.name}
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Product Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={product.description}
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Product Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                // step="0.01"
                defaultValue={product.amount}
                value={inputValue}
                // placeholder="Enter USD amount"
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === '.' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Product Points */}
        <div className="mb-4">
          <label htmlFor="points" className="mb-2 block text-sm font-medium">
            Choose an Points
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="points"
                name="points"
                type="number"
                step="0.01"
                value={points}
                defaultValue={product.points}
                placeholder="Enter points"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Product Out of Stock */}
        <div className="mb-4">
          <label htmlFor="points" className="mb-2 block text-sm font-medium">
            Choose an out of Stock
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="outofstock"
                name="outofstock"
                type="number"
                defaultValue={product.outofstock}
                placeholder="Enter points"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"                
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the product status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="status"
                  name="status"
                  type="radio"
                  value="disable"
                  defaultChecked={product.status === 'disable'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="disable"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  disable <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="status"
                  name="status"
                  type="radio"
                  value="enable"
                  defaultChecked={product.status === 'enable'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="enabel"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  enable <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>

          {/* Product file name */}
          <div className="mb-4">
            <label htmlFor="images" className="mb-2 block text-sm font-medium">
              Product Image name
            </label>
            <div className="relative">
              <input
                id="images"
                name="images"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={product.images}
              >
              </input>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/product"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Product</Button>
      </div>
    </form>
  );
}
