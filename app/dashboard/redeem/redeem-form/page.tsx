import { auth } from '@/auth';
import { fetchPlayerActivity_Hourly, fetchPlayerActivity_Daily, fetchProduct } from "@/app/lib/data";
import RedeemFormPage from "@/app/ui/redeem/redeem-form/page";
import { fetchPlayerBalance } from "@/app/lib/data";
import { getFooterYearRange } from '@/app/lib/utils/utils';

export default async function Page(props: {
    searchParams?: Promise<{
        id?: string;
    }>
}) {

    const searchParams = await props.searchParams || {};
    const [playerInfo] = await Promise.all([
        auth().then((data) => {
            const email = data?.user?.email;
            return fetchPlayerActivity_Hourly(email, null);
        })
    ]);

    const playerBalance = await auth().then((data) => {
        const email = data?.user?.email;
        return fetchPlayerBalance(email, null);
    });

    const player_id = playerInfo.player_id;
    const [playerInfo_Hourly,playerInfo_Daily, productInfo] = await Promise.all([
            fetchPlayerActivity_Hourly(null,playerInfo.player_id).then((data) => {
                return data;
            }), // fetch the player info    
            fetchPlayerActivity_Daily(null,playerInfo.player_id).then((data) => {
                return data;
            }), // fetch the player info    
            // fetchhourlyPrize(),            // fetch the lock
            fetchProduct().then((products) => {
                return  products.find((product) => product.id === searchParams.id);
            }),
        ]);    

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
    
        const total_points_available = Number(balance);
        const product_id = productInfo?.id;
        const product_name = productInfo?.name;
        const product_description = productInfo?.description;
        const product_points = Number(productInfo?.points);


    // console.log('productInfo', productInfo);
    // console.log('productInfo.id', productInfo?.id);
    // console.log('player_id', player_id);
    // console.log('total_points_available', total_points_available);

    return (
        <main className="max-w-6xl mx-auto p-10 text-black text-left border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
        style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
            <div className="mb-4">
                {total_points_available > product_points && (
                    <RedeemFormPage 
                        player_id={player_id || ''}
                        product_id={product_id || ''}
                        product_name={ product_name || ''}
                        product_description={product_description || ''}
                        product_points={(product_points || 0)}
                        total_points_available={total_points_available || 0}                      
                    />
                )}
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>
    );
}
