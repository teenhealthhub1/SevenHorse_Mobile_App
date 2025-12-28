import { ClockHourly } from "@/app/ui/jackpotHourlyDaily/localClock";
import { CollectPoints_hourly } from "@/app/ui/jackpotHourlyDaily/buttons_hourly";
import BubbleSort from "@/app/ui/jackpotHourlyDaily/bubbleSort";
import {
    fetchPlayerActivity_Hourly, fetchPlayerActivity_Daily,
    fetchAwardWinner, fetchLkpClockTrigger,
    fetchhourlyPrize, fetchhourlyPrizeHistory,
    fetchPlayerBalance
} from "@/app/lib/data";
import PlayerChart from "@/app/ui/jackpotHourlyDaily/player-chart";
import localFont from 'next/font/local';
import { revalidatePath } from 'next/cache';
import { RefreshCache } from "@/app/ui/jackpotHourlyDaily/refresh-cache";
import { auth } from '@/auth';
import AnimatedGif_Hourly from '@/app/lib/AnimatedGif_Hourly';
// @ts-ignore
import { redirect } from 'next/navigation';
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import MemoryGame from "@/app/ui/components/MemoryGame";
import { getFooterYearRange } from '@/app/lib/utils/utils';

const digitalFont = localFont({ src: '../../fonts/digital.ttf' });
const id = process.env.HOURLY_PRIZE_ID;

export default async function Page() {

    const [playerInfo, lkpClockTrigger, hourlyPrize, hourlyPrizeHistory] = await Promise.all([
        auth().then((data) => {
            const email = data?.user?.email;
            return [fetchPlayerActivity_Hourly(email, null), fetchPlayerActivity_Daily(email, null)];
        }),
        fetchLkpClockTrigger('M2aDZNKr7O521xs4+qaXtA=='),
        fetchhourlyPrize(),
        fetchhourlyPrizeHistory(50)
    ]);

    const playerBalance = await auth().then((data) => {
        const email = data?.user?.email;
        return fetchPlayerBalance(email, null);
    })
    const total_points = Number(playerBalance);
    // console.log(playerBalance);
    const nowHourly = new Date();
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


    //const {reference_time, interval_duration} = await ;
    // Monitor the hourlyPrize table once prize changed then display new Prize number
    const dtUpdate = hourlyPrize.dt_update.getTime();

    async function checkHourlyPrizeUpdated() {
        "use server";
        const checkPrize = await fetchhourlyPrize();
        const LastdtUpdated = checkPrize.dt_update.getTime();
        const didChanged = dtUpdate !== LastdtUpdated;
        // if (didChanged) {
        // revalidatePath('/');  // revalidate all the path
        revalidatePath('/dashboard/jackpotHourly');
        // redirect('/dashboard/jackpotHourly');
        // }
        // console.log("did hourly Prize Changed?", didChanged, checkPrize.lock);
    };
    const playerInfo_Hourly = await playerInfo[0];

    return (
        <div style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <div className={`gap-3 ${hourlyPrize.lock ? 'flex hidden' : ''}`}>
                <RefreshCache check={checkHourlyPrizeUpdated} />
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className= {'${lusitana.classname} text-2xl'}>Jackpot Daily</h1> */}
                    <h1 className={'${lusitana.classname} text-2xl'}>H-Points: {balancePoints}</h1>
                </div>
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className={'${lusitana.classname} text-2xl '}>{(await playerInfo[0]).player_id}</h1> */}
                    <h1 className={'${lusitana.classname} text-2xl '}>Prize: {hourlyPrize.hourly_prize_number} </h1>
                </div>
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className={'${lusitana.classname} text-2xl '}>{(await playerInfo[0]).player_id}</h1> */}
                    <h1 className={`${digitalFont.className} text-2xl ${hourlyPrizeHistory.length > 50 ? 'md:whitespace-normal' : ''}`}>
                        HistoryPrize
                    </h1>
                </div>
                <div className={`flex w-full items-center justify-between`}>
                    {/* <h1 className={'${lusitana.classname} text-2xl '}>{(await playerInfo[0]).player_id}</h1> */}
                    <p>
                        <span>
                            {hourlyPrizeHistory.split('').map((char, index) => (
                                (index + 1) % 10 === 0 ? char + '\n' : char
                            )).join('')}
                        </span>
                    </p>
                </div>


                <div className={`flex w-full items-center justify-between ${digitalFont.className}`}>
                    <ClockHourly currentTime={nowHourly} referenceTimeHourly={lkpClockTrigger.reference_time} intervalDurationHourly={lkpClockTrigger.interval_duration}></ClockHourly>
                </div>

                {/* <div className="mt-4 relative w-0 h-0 px-0 py-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"> */}
                <div className="mt-4 flex justify-start gap-9">
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={1} takenNumber={(await playerInfo[0]).points_one} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={2} takenNumber={(await playerInfo[0]).points_two} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={3} takenNumber={(await playerInfo[0]).points_three} balancePoints={balancePoints} />
                </div>
                <div className="mt-4 flex justify-start gap-9">
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={4} takenNumber={(await playerInfo[0]).points_four} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={5} takenNumber={(await playerInfo[0]).points_five} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={6} takenNumber={(await playerInfo[0]).points_six} balancePoints={balancePoints} />
                </div>
                <div className="mt-4 flex justify-start gap-9">

                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={7} takenNumber={(await playerInfo[0]).points_seven} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={8} takenNumber={(await playerInfo[0]).points_eight} balancePoints={balancePoints} />
                    <CollectPoints_hourly playerId={(await playerInfo[0]).player_id} game_id={(await playerInfo[0]).game_id} selectNumber={9} takenNumber={(await playerInfo[0]).points_nine} balancePoints={balancePoints} />
                </div>
                {/* </div> */}
                {/* <AwardedNumber playerId={playerInfo.player_id} selectNumber={0} takenNumber={playerInfo.points_nine} balancePoints={balancePoints} /> */}
                <div className="mt-4 flex justify-start gap-9 border border-white" >
                    <PlayerChart playerInfo={playerInfo_Hourly} total_points={total_points} />
                </div>
            </div>
            <div className={`gap-3 ${hourlyPrize.lock ? '' : 'flex hidden'}`}>
                {/* <h1> */}
                <AnimatedGif_Hourly />
                {/* </h1> */}
            </div>
            <div className="mt-4 flex justify-start gap-9">
                <MemoryGame playerId={(await playerInfo[0]).player_id} />
            </div>

            {/* <><BubbleSort></BubbleSort></> */}
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </div>
    )
}
