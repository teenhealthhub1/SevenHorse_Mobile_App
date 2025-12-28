'use client';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';

import { createProduct, productState } from '@/app/lib/actions';

import { useActionState, useState, useEffect } from 'react';
import { CreateProduct } from './buttons';
import ProductItemToPinata from '../components/ProductItemToPinata';
import ProductItemToServer from '../components/ProductItemToServer';


export default function Form(
  { dollarPoints }:
    { dollarPoints: number; }
) {

  const [inputValue, setInputValue] = useState<string>('');
  const [integerValue, setIntegerValue] = useState<number | null>(null);
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

  const initialState = {name: '', description:'', amount:0, points:0, outofstock:0, status:'', images:'', message: null, errors: {} };
  const [productState, formAction] = useActionState(createProduct, initialState as any);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={productState.name}              
              aria-describedby="customer-error"
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {productState.errors?.name &&
              productState.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description " className="mb-2 block text-sm font-medium">
            Product Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={productState.description}
              aria-describedby="customer-error"
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {productState.errors?.description &&
              productState.errors.description.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Product Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an Amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                // step="0.01"
                // defaultValue={product.amount}
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
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {productState.errors?.amount &&
                productState.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Product Points */}
        <div className="mb-4">
          <label htmlFor="points" className="mb-2 block text-sm font-medium">
            Product Points
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="points"
                name="points"
                type="number"
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="customer-error"
                value={points}
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {productState.errors?.points &&
                productState.errors.points.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

         {/* Product outofstock */}
         <div className="mb-4">
          <label htmlFor="points" className="mb-2 block text-sm font-medium">
            Product Out of Stock number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="outofstock"
                name="outofstock"
                type="number"
                step="0.01"
                placeholder="Enter number of stock"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="customer-error"
                value={productState.outofstock}
                readOnly
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {productState.errors?.outofstock &&
                productState.errors.outofstock.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>


        {/* Product Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="diable"
                  name="status"
                  type="radio"
                  value="disable"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="customer-error"
                  defaultChecked={productState.status === 'disable'}
                />
                <label
                  htmlFor="disable"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Disable <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="enable"
                  name="status"
                  type="radio"
                  value="enable"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  defaultChecked={productState.status === 'enable'}
                />
                <label
                  htmlFor="enable"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Enable <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {productState.errors?.status &&
              productState.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>

          {/* Product Image path */}
          <div className="mb-4">
            <label htmlFor="images" className="mb-2 block text-sm font-medium">
              Product image path
            </label>
            <div className="relative">
              <input
                id="images"
                name="images"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={productState.images}
                onChange={(e) => {
                  productState.images = e.target.value;
                }} 
                aria-describedby="customer-error"
                readOnly
              >
              </input>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {productState.errors?.images &&
                productState.errors.images.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">        
        <Link
          href="/dashboard/product"
          className="shining-button flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <ProductItemToPinata/>
        <ProductItemToServer/>
        <Button type="submit">Create Product</Button>
      </div>
    </form>
  );
}
