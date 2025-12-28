'use client';

import Link from "next/link";
import { useState } from "react";

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



const PlayerIdInput: React.FC = () => {

    const[playerId,setPlayerId] = useState<string | null>(null);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.value.length >= 36) {
            console.log('Player ID:', e.target.value);
            // alert('Player ID: ' + e.target.value);
            setPlayerId(value);
        }
    };


    return (
        <div className="relative mt-2 rounded-md">
             {/* <p className="text-2xl font-bold">Redeem Points</p> */}
            <label htmlFor="uploadPoints" className="mb-2 block text-sm font-medium">
                Scan Player ID :
            </label>
            <div className="relative">
                <div className="mb-4">
                    {/* <span className="mr-2 text-white">$</span> */}
                    <div className="mb-4">    
                    <input
                        type="string"
                        id="playerId"
                        name="playerId"
                        onChange={onChangeHandler}
                        // {(e) => {
                        //     if(e.target.value.length >= 36 ) {
                        //         console.log('Player ID:', e.target.value);
                        //         alert('Player ID: ' + e.target.value);
                        //     }                        
                        // }
                        // }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
                        placeholder="Enter Player ID"
                    />
                    </div>

                    <div className="mb-4">   
                        <Link
                            href="/dashboard/redeemDealer"
                            as={{
                                pathname: '/dashboard/redeemDealer/redeemForm',
                                query: { playerId: playerId },
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </Link>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default PlayerIdInput;