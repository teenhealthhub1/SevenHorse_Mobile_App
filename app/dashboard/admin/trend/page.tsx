import {
    fetchPlayerActivity_Hourly, fetchPlayerActivity_Daily,
    fetchAwardWinner, fetchLkpClockTrigger,
    fetchhourlyPrize, fetchhourlyPrizeHistory,
    fetchPlayerBalance, fetchPlayerActivityHourly_count,
    fetchPlayerActivityDaily_count,
    fetchdailyPrizeHistory
} from "@/app/lib/data";
import { getFooterYearRange } from '@/app/lib/utils/utils';
import { ClockDaily } from "@/app/ui/jackpotHourlyDaily/localClock";
import { ClockHourly } from "@/app/ui/jackpotHourlyDaily/localClock";

import PlayerChart from "@/app/ui/jackpotHourlyDaily/player-chart";
import Trend from '@/app/ui/admin/trend';
import localFont from 'next/font/local';
import { auth } from '@/auth';
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import React from 'react';

const digitalFont = localFont({ src: '../../../fonts/digital.ttf' });
const id = process.env.HOURLY_PRIZE_ID;

export default async function Page() {

    const [playerInfo, lkpClockTrigger_hr, lkpClockTrigger_dy, PlayerActivityHourly_count, PlayerActivityDaily_count, hourlyPrizeHistory, dailyPrizeHistory] = await Promise.all([
        auth().then((data) => {
            const email = data?.user?.email;
            return [
                fetchPlayerActivity_Hourly(email, null),  // this is to validate the page   
            ];
        }),
        fetchLkpClockTrigger('M2aDZNKr7O521xs4+qaXtA=='),
        fetchLkpClockTrigger('z3O4QIG01knYi5wTve9uEg=='),
        fetchPlayerActivityHourly_count(),  // This is used for calculating the points for hourly for all players
        fetchPlayerActivityDaily_count(),   // This is used for calculating the points for daily for all players   
        fetchhourlyPrizeHistory(50),
        fetchdailyPrizeHistory(50),
    ]);
    const nowHourly = new Date();
    return (

        <div style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            {/* </div> */}
            <Trend />
            <div className={`flex w-full items-center justify-between`}>
                {/* <h1 className= {'${lusitana.classname} text-2xl'}>Jackpot Daily</h1> */}
                <h1 className={'${lusitana.classname} text-2xl'}>Hourly-Tread</h1>
            </div>
            <div className={`flex w-full items-center justify-between`}>
                <p>
                    <span>
                        {hourlyPrizeHistory.split('').map((char, index) => (
                            (index + 1) % 10 === 0 ? char + '\n' : char
                        )).join('')}
                    </span>
                </p>
            </div>
            <div className={`flex w-full items-center justify-between ${digitalFont.className}`}>
                <ClockHourly currentTime={nowHourly} referenceTimeHourly={lkpClockTrigger_hr.reference_time} intervalDurationHourly={lkpClockTrigger_hr.interval_duration}></ClockHourly>
            </div>
            {/* <AwardedNumber playerId={playerInfo.player_id} selectNumber={0} takenNumber={playerInfo.points_nine} balancePoints={balancePoints} /> */}
            <div className="mt-4 flex justify-start gap-9 border border-white" >
                <PlayerChart playerInfo={PlayerActivityHourly_count} total_points={1} />
            </div>
            <div className={`flex w-full items-center justify-between`}>
                {/* <h1 className= {'${lusitana.classname} text-2xl'}>Jackpot Daily</h1> */}
                <h1 className={'${lusitana.classname} text-2xl'}>Daily-Tread</h1>
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
                <ClockDaily currentTime={new Date()} referenceTimeDaily={lkpClockTrigger_dy.reference_time} intervalDurationDaily={lkpClockTrigger_dy.interval_duration}></ClockDaily>
            </div>
            {/* <AwardedNumber playerId={playerInfo.player_id} selectNumber={0} takenNumber={playerInfo.points_nine} balancePoints={balancePoints} /> */}
            <div className="mt-4 flex justify-start gap-9 border border-white" >
                <PlayerChart playerInfo={PlayerActivityDaily_count} total_points={1} />
            </div>            
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </div>
    )
}
