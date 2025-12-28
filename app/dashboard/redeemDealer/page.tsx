import React from 'react';
import CheckoutPage from '@/app/ui/purchase/CheckoutPage';
import convertToSubcurrency from "@/app/lib/utils/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PlayerIdInput from '@/app/ui/redeemDealer/PlayerIdInput';
import { auth } from '@/auth';
import { fetchPlayerActivity_Hourly, fetchPlayerBalance, fetchLkpSparam } from "@/app/lib/data";
import { get } from 'http';
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
            // console.log('email:', email);
            return fetchPlayerActivity_Hourly(email, null);
        })
    ]);

    // Fetch the dollat to point convertion rate
    // const dollarConvertion = await fetchLkpSparam();
    // let dollarPoints = 1;
    // dollarConvertion.forEach((sparam) => {
    //     if (sparam.system === 'DOLLARTOPOINTS' && sparam.key === 'DOLLAR') {
    //         dollarPoints = Number(sparam.value);
    //         return;
    //     }
    // });

    // fetchPlayerBalance(null,'8940cf3e-1b21-47cc-a0db-03f87f9c762e').then((data) => {
    //     console.log('player balance:', data);
    // }    
    // );


    // console.log('playerInfo:', playerInfo);
    // console.log('playerID:', playerInfo.player_id);
    return (
        <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
            style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <div className="mb-4">
            <p className="text-2xl font-bold">Redeem Points</p>
            <PlayerIdInput></PlayerIdInput>
                {/* <div className="mb-4">
                    <label htmlFor="playerId" className="block text-sm font-medium text-black mb-2">
                        Scan Player ID:
                    </label>
                    <input
                        type="text"
                        id="playerId"
                        name="playerId"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
                        placeholder="Enter Player ID"
                    />
                </div> */}
               
                    {/* <label htmlFor="playerId" className="block text-sm font-medium text-black mb-2">
                    Scan Player ID:
                </label>             
                {/* <PlayerIdInput />               */}
                    {/* <input
                    type="text"
                    id="playerId"
                    name="playerId"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
                    placeholder="Enter Player ID"
                /> } */}
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>
    );

}