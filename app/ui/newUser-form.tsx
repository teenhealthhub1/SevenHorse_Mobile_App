'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import Link from 'next/link';
import { useActionState } from 'react';
import { newRegistration } from '@/app/lib/actions';

export default function newUser({ email }: { email: string | undefined}) {
  const [errorMessage, formAction, isPending] = useActionState(
    newRegistration,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8"
           style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Join 7Horse Today
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                defaultValue={email}
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending} name='action' value='new-user'>
          Send Invitation<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div className="mt-4 w-full rounded-md border"
          style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>

            <Link
            className="shining-button style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}"
            href="/login"
            >
            Back<ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Link>
        </div>
        <div></div>
        <div className="ml-auto flex h-8 items-end space-x-1 gap-5">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="ml-auto h-5 w-5 text-black" />
              <p className="ml-auto text-sm text-black">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
