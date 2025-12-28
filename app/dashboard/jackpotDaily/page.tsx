import { ClockDaily } from "@/app/ui/jackpotHourlyDaily/localClock";
import { CollectPoints_Daily } from "@/app/ui/jackpotHourlyDaily/buttons_Daily";
import {
    fetchAwardWinner, fetchdailyPrize,
    fetchLkpClockTrigger, fetchPlayerActivity_Daily,
    fetchdailyPrizeHistory,
    fetchPlayerActivity_Hourly, fetchPlayerBalance
} from "@/app/lib/data";

import { getFooterYearRange } from '@/app/lib/utils/utils';
import PlayerChart from "@/app/ui/jackpotHourlyDaily/player-chart";
import localFont from 'next/font/local';
import { revalidatePath } from 'next/cache';
import { RefreshCache } from "@/app/ui/jackpotHourlyDaily/refresh-cache";
import { auth } from '@/auth';
import AnimatedGif_Daily from '@/app/lib/AnimatedGif_Daily';
// @ts-ignore
import { redirect } from 'next/navigation';
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import Snake from "@/app/ui/components/Snake";
import SudokuGame from "@/app/ui/components/SudokuGame";


const digitalFont = localFont({ src: '../../fonts/digital.ttf' });
const id = process.env.DAILY_PRIZE_ID;

export default async function Page() {

    const [playerInfo, lkpClockTrigger, dailyPrize, dailyPrizeHistory] = await Promise.all([
        auth().then((data) => {
            const email = data?.user?.email;
            return [fetchPlayerActivity_Hourly(email, null), fetchPlayerActivity_Daily(email, null)];
        }),
        fetchLkpClockTrigger('z3O4QIG01knYi5wTve9uEg=='),
        fetchdailyPrize(),
        fetchdailyPrizeHistory(50) // Limit the history to 30 records
    ]);

    const playerBalance = await auth().then((data) => {
        const email = data?.user?.email;
        return fetchPlayerBalance(email, null);
    });

    const total_points = Number(playerBalance);

    const balancePoints = Number(playerBalance) -
        ((await playerInfo[0]).points_one +
            (await playerInfo[0]).points_two +
            (await playerInfo[0]).points_three +
            (await playerInfo[0]).points_four +
            (await playerInfo[0]).points_five +
            (await playerInfo[0]).points_six +
            (await playerInfo[0]).points_seven +
            (await playerInfo[0]).points_eight +
            (await playerInfo[0]).points_nine +
            (await playerInfo[1]).points_one +
            (await playerInfo[1]).points_two +
            (await playerInfo[1]).points_three +
            (await playerInfo[1]).points_four +
            (await playerInfo[1]).points_five +
            (await playerInfo[1]).points_six +
            (await playerInfo[1]).points_seven +
            (await playerInfo[1]).points_eight +
            (await playerInfo[1]).points_nine);

    // Monitor the hourlyPrize table once prize changed then display new Prize number
    const dtUpdate = dailyPrize.dt_update.getTime();
    async function checkDailyPrizeUpdated() {
        "use server";
        const checkPrize = await fetchdailyPrize();
        const LastdtUpdated = checkPrize.dt_update.getTime();
        const didChanged = dtUpdate !== LastdtUpdated;
        //  if (didChanged) {
        revalidatePath('/dashboard/jackpotdaily');  // revalidate all the path
        //  redirect('/dashboard/jackpotdaily');
        // }
        // console.log("did Daily Prize Changed?", didChanged);   
    };

    const playerInfo_Daily = await playerInfo[1];
    return (
        <div style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <div className={`gap-3 ${dailyPrize.lock ? 'flex hidden' : ''}`}>
                <RefreshCache check={checkDailyPrizeUpdated} />
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className= {'${lusitana.classname} text-2xl'}>Jackpot Daily</h1> */}
                    <h1 className={'${lusitana.classname} text-2xl'}>D-Points: {balancePoints}</h1>
                </div> <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className={'${lusitana.classname} text-2xl '}>{ (await (playerInfo[1])).player_id}</h1> */}
                    <h1 className={'${lusitana.classname} text-2xl '}>Prize: {dailyPrize.daily_prize_number} </h1>
                </div>
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className={'${lusitana.classname} text-2xl '}>{(await playerInfo[0]).player_id}</h1> */}
                    <h1 className={`${digitalFont.className} text-2xl ${dailyPrizeHistory.length > 50 ? 'md:whitespace-normal' : ''}`}>
                        HistoryPrize
                    </h1>
                </div>
                <div className={`flex w-full items-center justify-between`}>
                    <p>
                        <span>
                            {dailyPrizeHistory.split('').map((char, index) => (
                                (index + 1) % 10 === 0 ? char + '\n' : char
                            )).join('')}
                        </span>
                    </p>
                </div>

                <div className={`flex w-full items-center justify-between ${digitalFont.className}`}>
                    <ClockDaily currentTime={new Date()} referenceTimeDaily={lkpClockTrigger.reference_time} intervalDurationDaily={lkpClockTrigger.interval_duration}></ClockDaily>
                </div>

                {/* <div className="mt-4 relative w-0 h-0 px-0 py-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"> */}
                <div className="mt-4 flex justify-start gap-9">
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={1} takenNumber={(await playerInfo[1]).points_one} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={2} takenNumber={(await playerInfo[1]).points_two} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={3} takenNumber={(await playerInfo[1]).points_three} balancePoints={balancePoints} />
                </div>
                <div className="mt-4 flex justify-start gap-9">
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={4} takenNumber={(await playerInfo[1]).points_four} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={5} takenNumber={(await playerInfo[1]).points_five} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={6} takenNumber={(await playerInfo[1]).points_six} balancePoints={balancePoints} />
                </div>
                <div className="mt-4 flex justify-start gap-9">

                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={7} takenNumber={(await playerInfo[1]).points_seven} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={8} takenNumber={(await playerInfo[1]).points_eight} balancePoints={balancePoints} />
                    <CollectPoints_Daily playerId={(await playerInfo[1]).player_id} game_id={(await playerInfo[1]).game_id} selectNumber={9} takenNumber={(await playerInfo[1]).points_nine} balancePoints={balancePoints} />
                </div>
                {/* </div> */}
                {/* <AwardedNumber playerId={playerInfo.player_id} selectNumber={0} takenNumber={playerInfo.points_nine} balancePoints={balancePoints} /> */}
                <div className="mt-4 flex justify-start gap-9 border border-white" >
                    <PlayerChart playerInfo={playerInfo_Daily} total_points={total_points} />
                </div>
            </div>
            <div className={`gap-3 ${dailyPrize.lock ? '' : 'flex hidden'}`}>
                {/* <h1> */}
                <AnimatedGif_Daily />
                {/* </h1> */}
            </div>
            <div className="mt-4 flex justify-start gap-9">
                <SudokuGame playerId={playerInfo_Daily.player_id} />
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </div>
    )
}
