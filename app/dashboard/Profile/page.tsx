// import { Metadata } from 'next';
import QRCodeGenerator from '@/app/lib/QRCodeGenerator';
import Invite from '@/app/ui/invite';
import { auth } from '@/auth';
import {
  fetchPlayerActivity_Hourly,
} from "@/app/lib/data";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import ProfileFormPage from "@/app/ui/profile/profile-form/page";
import Link from 'next/link';
import { getFooterYearRange } from '@/app/lib/utils/utils';


export default async function Page() {

  const [playerInfo] = await Promise.all([
    auth().then((data) => {
      const email = data?.user?.email;
      return fetchPlayerActivity_Hourly(email, null);
    })

  ]);

  const playerID = playerInfo.player_id; // "Shoban.com";

  return (
    <main>
      <div style={{
        background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))',
        padding: '20px',
        // borderTop: '2px solid white', 
        // borderRight: '2px solid white', 
        // borderBottom: '2px solid white'       
      }} >
        <div className={'gap-3'}>
          <div className="mb-4">
            <Link
              href={{
                pathname: '/dashboard/profile/profile-form',
                query: { id: playerID },
              }}
              className="shining-button"
            // style={{ width: `${product.innerWidth}px` }}
            >
              Edit Profile
            </Link>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px' }}>
            {playerID}
          </div>
          <QRCodeGenerator playerID={playerID} />
        </div>
        <div style={{
          background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))',
          padding: '20px',
          // borderLeft: '5px solid white', 
          // borderRight: '5px solid gray' 
        }}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            Refer a friend and earn up to 50 points for each successful referral!
          </p>
          <Invite playerID={playerID} />
        </div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        © {getFooterYearRange(2024)} 7Horse. All rights reserved.
      </footer>
    </main>
  );
}