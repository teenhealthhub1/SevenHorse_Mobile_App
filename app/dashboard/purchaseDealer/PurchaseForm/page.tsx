'use server';
import { fetchPlayerBalance, fetchPlayerActivity_Daily, fetchPlayerActivity_Hourly } from "@/app/lib/data";
import InputFundsForDealer from "@/app/ui/purchaseDealer/inputFundsForDealer";
import { fetchLkpSparam } from "@/app/lib/data";
import { getFooterYearRange } from '@/app/lib/utils/utils';

export default async function Page(props: {
    searchParams?: Promise<{
        playerId?: string;
    }>
}) {

    const searchParams = await props.searchParams || {};
    const player_id = searchParams.playerId;
    console.log('playerId:', player_id);

    const [playerBalance, playerInfo_Daily, playerInfo_Hourly] = await Promise.all([
        fetchPlayerBalance(null, player_id).then((data) => {
            return data;
        }), // fetch the player info 
        fetchPlayerActivity_Daily(null, player_id).then((data) => {
            return data;
        }), // fetch the player info    
        fetchPlayerActivity_Hourly(null, player_id).then((data) => {
            return data;
        }), // fetch the player info       
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

    const player_balance = Number(playerBalance) - Number(playerInfo_Daily.points_one +
        playerInfo_Daily.points_two +
        playerInfo_Daily.points_three +
        playerInfo_Daily.points_four +
        playerInfo_Daily.points_five +
        playerInfo_Daily.points_six +
        playerInfo_Daily.points_seven +
        playerInfo_Daily.points_eight +
        playerInfo_Daily.points_nine +
        playerInfo_Hourly.points_one +
        playerInfo_Hourly.points_two +
        playerInfo_Hourly.points_three +
        playerInfo_Hourly.points_four +
        playerInfo_Hourly.points_five +
        playerInfo_Hourly.points_six +
        playerInfo_Hourly.points_seven +
        playerInfo_Hourly.points_eight +
        playerInfo_Hourly.points_nine
    );


    return (
        <main className="max-w-6xl mx-auto p-10 text-black text-left border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
            style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <div className="mb-4">
                <p className="text-2xl font-bold">Purchase Points</p>
                {/* <p>Player ID: {player_id}</p> */}
                {/* <p>playerBalance:{playerBalance}</p> */}
                <p>Player ID: {player_id}</p>
                {/* <p>playerBalance:{playerBalance}</p> */}
            </div>
            {player_id ? (
                <div>
                    <InputFundsForDealer dollarPoints={dollarPoints} player_id={player_id} player_balance={Number(player_balance)} />
                </div>
            ) : (
                <p>Player ID is missing. Redirecting to the home page...</p>
            )}
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>
    );
}
