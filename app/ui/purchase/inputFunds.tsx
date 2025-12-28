'use client';
import React, { useState, useEffect } from 'react';
import CheckoutPage from '@/app/ui/purchase/CheckoutPage';
import convertToSubcurrency from "@/app/lib/utils/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from '@/app/ui/button';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';


if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


//const stripePromise = loadStripe("your-publishable-key-here");

/**
 * `InputFunds` is a React functional component that provides a user interface for inputting a monetary amount.
 * It ensures the input is an integer and prevents invalid characters such as '.' and 'e' from being entered.
 * The component also integrates with Stripe Elements for payment processing.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The input value is parsed into an integer and stored in the `integerValue` state.
 * - If the input is invalid, `integerValue` is set to `null`.
 * - The `amount` defaults to 1 if `integerValue` is `null`.
 * - The Stripe Elements component is configured with the parsed amount in subcurrency format.
 *
 * @example
 * ```tsx
 * <InputFunds />
 * ```
 *
 * @dependencies
 * - `useState` and `useEffect` from React for state management and side effects.
 * - `Elements` from `@stripe/react-stripe-js` for payment integration.
 * - `stripePromise` and `convertToSubcurrency` are assumed to be defined elsewhere in the application.
 */

interface InputFundsProps {
    dollarPoints: number;
    player_id: string;
}

const InputFunds: React.FC<InputFundsProps> = ({ dollarPoints, player_id}) => {
    // create the transaction for the purchase  

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

    return (
        <div className="relative mt-2 rounded-md">
            <label htmlFor="uploadPoints" className="mb-2 block text-sm font-medium">
                Upload  {points} points
            </label>
            <div className="relative">
                <div className="flex items-center">
                    {/* <span className="mr-2 text-white">$</span> */}
                    <input
                        style={{ color: 'black' }}
                        id="fundsInput"
                        type="number"
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === '.' || e.key === 'e') {
                                e.preventDefault();
                            }
                        }}
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    {/* placeholder="Enter an integer" */}
                    {/* <p>Parsed Integer Value: {integerValue !== null ? integerValue : 'Invalid input'}</p> */}
                </div>
                {error && <p className="text-2xl mb-2 text-red-500 text-left">{error}</p>}
            </div>
            <div className="mb-10">
                <h1>{!isNaN(Number(inputValue)) ? `$${inputValue}` : null}</h1>
                <h2 className="text-2xl">
                    has requested to charge
                </h2>
            </div>
            {amount > 0 && (
                <Elements
                    stripe={stripePromise}
                    options={{
                        mode: "payment",
                        amount: convertToSubcurrency(amount),
                        currency: "usd",
                    }}
                >
                    <CheckoutPage amount={amount} player_id={player_id} />
                </Elements>
            )}
        </div>
    );
};

export default InputFunds;