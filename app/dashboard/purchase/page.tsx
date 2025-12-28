import React from 'react';
import CheckoutPage from '@/app/ui/purchase/CheckoutPage';
import convertToSubcurrency from "@/app/lib/utils/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import InputFunds from '@/app/ui/purchase/inputFunds';
import { auth } from '@/auth';
import { fetchPlayerActivity_Hourly, fetchLkpSparam } from "@/app/lib/data";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import { getFooterYearRange } from '@/app/lib/utils/utils';

// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//     throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
// }
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


export default async function Page() { 
    // page validation
      const [playerInfo] = await Promise.all([
        auth().then((data) => {
          const email = data?.user?.email;
          return fetchPlayerActivity_Hourly(email, null);
        })    
      ]);

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
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
        style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
            <div className="mb-4" >

                <InputFunds dollarPoints={dollarPoints} player_id={playerInfo.player_id}/>
                {/* <div className="relative mt-2 rounded-md">
                    <div className="relative">
                        <div className="flex items-center">
                            <span className="mr-2 text-white">$</span>
                            <input
                                style={{ color: 'black' }}
                                id="uploadPoints"
                                name="uploadPoints"
                                type="number"
                                onKeyDown={(e) => {
                                    if (e.key === '.' || e.key === 'e') {
                                        e.preventDefault();
                                    }
                                }}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <Elements
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    amount: convertToSubcurrency(amount),
                    currency: "usd",
                }}
            >
                <CheckoutPage amount={amount} />
            </Elements> */}
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>
    );

}