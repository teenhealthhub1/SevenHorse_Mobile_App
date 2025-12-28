import Breadcrumbs from '@/app/ui/jackpotHourlyDaily/breadCrumbs';
import { fetchPlayerActivity_Daily, fetchPlayerActivity_Hourly, fetchPlayerBalance } from "@/app/lib/data";
import UpdateForm_hourly from '@/app/ui/jackpotHourlyDaily/update-form-hourly';
import { auth } from '@/auth';
import { getFooterYearRange } from '@/app/lib/utils/utils';

//{ selectNumber, takenNumber, balancePoints}: 
// { selectNumber: number, takenNumber: number, balancePoints: number }

// href={{pathname:'/dashboard/jackpotDaily/updatePoints',query:{
//     playerId:playerId,
//     selectNumber:selectNumber
//   }}}

export default async function page(props: {
    searchParams?: Promise<{
        playerId?: string;
        selectNumber?: number;
    }>
}) {
    const searchParams = await props.searchParams;
    const plyId = searchParams?.playerId;
    const selectNumber = Number(searchParams?.selectNumber);

    if (plyId === undefined)
        return;

    const playerID = plyId;
    // console.log(playerID, selectNumber);

    const [playerInfo_Hourly, playerInfo_Daily] = await Promise.all([
        fetchPlayerActivity_Hourly(null, playerID).then((data) => {
            return data;
        }), // fetch the player info    
        fetchPlayerActivity_Daily(null, playerID).then((data) => {
            return data;
        }), // fetch the player info    
        // fetchhourlyPrize(),            // fetch the lock
    ]);
    // Calculate the points 
    let lpoints = 0;
    switch (Number(selectNumber)) {
        case 1:
            lpoints = Number(playerInfo_Hourly.points_one);
            break;
        case 2:
            lpoints = Number(playerInfo_Hourly.points_two);
            break;
        case 3:
            lpoints = Number(playerInfo_Hourly.points_three);
            break;
        case 4:
            lpoints = Number(playerInfo_Hourly.points_four);
            break;
        case 5:
            lpoints = Number(playerInfo_Hourly.points_five);
            break;
        case 6:
            lpoints = Number(playerInfo_Hourly.points_six);
            break;
        case 7:
            lpoints = Number(playerInfo_Hourly.points_seven);
            break;
        case 8:
            lpoints = Number(playerInfo_Hourly.points_eight);
            break;
        case 9:
            lpoints = Number(playerInfo_Hourly.points_nine);
            break;

        default:
            break;
    }

    const playerBalance = await auth().then((data) => {
        const email = data?.user?.email;
        return fetchPlayerBalance(email, null);
    })

    const totalPoint = Number(playerBalance);
    const balance = Number(playerBalance) - Number(playerInfo_Hourly.points_one +
        playerInfo_Hourly.points_two +
        playerInfo_Hourly.points_three +
        playerInfo_Hourly.points_four +
        playerInfo_Hourly.points_five +
        playerInfo_Hourly.points_six +
        playerInfo_Hourly.points_seven +
        playerInfo_Hourly.points_eight +
        playerInfo_Hourly.points_nine +
        playerInfo_Daily.points_one +
        playerInfo_Daily.points_two +
        playerInfo_Daily.points_three +
        playerInfo_Daily.points_four +
        playerInfo_Daily.points_five +
        playerInfo_Daily.points_six +
        playerInfo_Daily.points_seven +
        playerInfo_Daily.points_eight +
        playerInfo_Daily.points_nine
    );

    const sNumber = selectNumber;
    const pts = Number(lpoints);


    return (
        <main style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <Breadcrumbs breadcrumbs={
                [
                    { label: 'Jackpot Hourly', href: '/dashboard/jackpotHourly' },
                    { label: 'Update Points', href: '/dashboard/jackpotHourly/updatePoints', active: true },
                ]
            } />
            {<UpdateForm_hourly player_id={playerInfo_Hourly.player_id} total_points={totalPoint} balance={balance} points={pts} selectNumber={sNumber}></UpdateForm_hourly>}
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>);
}