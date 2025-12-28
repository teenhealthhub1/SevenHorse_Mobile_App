'use client';
import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import { insertPlayerBank, insertPurchasePoints } from "@/app/lib/actions";
import { v4 as uuidv4 } from "uuid";


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
    player_balance: number;
}

const InputFundsForDealer: React.FC<InputFundsProps> = ({ dollarPoints, player_id, player_balance }) => {
    // create the transaction for the purchase  

    const [inputValue, setInputValue] = useState<string>('');
    const [integerValue, setIntegerValue] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // const [] = useState(false);
    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<boolean>(false);
    const [playerNewPoints, setPlayerNewPoints] = useState<number>(player_balance);
    function setPlayerNewPointss(points: number) {
        setPlayerNewPoints(playerNewPoints - points);
    }

    useEffect(() => {
        const parsedValue = parseInt(inputValue, 10);
        if (!isNaN(parsedValue) && (parsedValue <= 0 || (parsedValue*dollarPoints) > playerNewPoints)) {
            setError(`Input value must be greater than 0 and less than or equal to your balance - ${playerNewPoints}`);
        } else {
            setError(null);
        }
        setInputValue(parsedValue.toString());
        setPaymentSuccessMessage(false);
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
        if (!isNaN(parsedValue) && (parsedValue <= 0 || (parsedValue*dollarPoints) > playerNewPoints)) {
            setError(`Input value must be greater than 0 and less than your balance - ${playerNewPoints}`);
            // setError("Input value must be greater than 0");
        } else {
            setError(null);
        }
    };

    const amount = integerValue || 0;
    const PointsToUpload = amount * dollarPoints; // Convert to cents


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // setPaymentSuccessMessage(true);
        const transactionId = uuidv4();

        insertPlayerBank(player_id, -amount, transactionId, 'approved')
            .then((response) => {
                console.log("Payment successful:", response);
                insertPurchasePoints(player_id, -PointsToUpload, 700).then((data) => {
                    console.log("Points added successfully:", data);
                    setPaymentSuccessMessage(true);
                    setPlayerNewPointss(PointsToUpload);
                    // Send an email that ammount points added successfully
                }
                ).catch((error) => {
                    console.error("Error adding points:", error);
                }
                );
            });
    }

    return (
        <div className="relative mt-2 rounded-md">
            <h1><b>SELL POINTS</b></h1>
            <label htmlFor="uploadPoints" className="mb-2 block text-sm font-medium">
                Player Points : {playerNewPoints}
            </label>
            <label htmlFor="uploadPoints" className="mb-2 block text-sm font-medium">
                Redeem  {PointsToUpload} points

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
                    has requested to redeem
                </h2>
            </div>
            { (amount > 0 && (paymentSuccessMessage || (amount*dollarPoints) < playerNewPoints))  && (
                <div>
                    {/* <CheckoutPageForDealer amount={amount} player_id={player_id} PointsToUpload={PointsToUpload} /> */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmit(event);
                            // Send the player_id to the parent page
                            if (window && window.parent) {
                                window.parent.postMessage({ player_id }, '*');
                            }
                        }}
                        className="bg-white p-2 rounded-md"
                    >
                        {!paymentSuccessMessage ? (
                            <button
                                className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
                                type="submit"
                            >
                                Redeem {amount}
                            </button>
                        ) : (
                            <p className="text-green-500 font-bold text-center">Redeemed successful!</p>
                        )}
                    </form>
                    <div className="mt-4 flex justify-center items-center">
                        <Link
                            className="text-black text-center w-full p-5 bg-blue-500 rounded-md font-bold border border-black disabled:opacity-50 disabled:animate-pulse"
                            href="/dashboard/purchaseDealer"
                            as={{
                                pathname: '/dashboard/purchaseDealer'
                            }}
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InputFundsForDealer;