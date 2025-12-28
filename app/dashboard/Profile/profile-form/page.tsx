import { auth } from '@/auth';
import { fetchPlayerActivity_Hourly, fetchUsersDetails } from "@/app/lib/data";
import ProfileFormPage from "@/app/ui/profile/profile-form/page";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
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
        }),

    ]);

    const player_id = playerInfo.player_id;

    const PlayerDetails = await fetchUsersDetails(player_id);



    console.log('PlayerDetails', PlayerDetails);
    console.log('player_id', player_id);


    return (
        <main className="max-w-6xl mx-auto p-10 text-black text-left border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
            style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
            <div>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                </div>
                <div className="mb-4">
                    <ProfileFormPage
                        player_id={player_id || ''}
                        PlayerDetails={PlayerDetails}
                    />
                </div>
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </main>
    );
}
