import { auth } from '@/auth';
import { fetchPlayerActivity_Hourly, fetchLkpSparam, fetchPlayerBank } from "@/app/lib/data";
import { insertPurchasePoints, insertPlayerBank } from "@/app/lib/actions";
import { sql } from '@vercel/postgres';
import Link from 'next/link';
// @ts-ignore
import { redirect } from 'next/navigation';
import { getFooterYearRange } from '@/app/lib/utils/utils';

// http://www.localhost:3000/dashboard/purchase/payment-success?
// trans_id=e280e7af-144c-44f3-bca3-9696262c19d2&
// payment_intent=pi_3RBez8G7ZynvAbIK0mRLYfSB&
// payment_intent_client_secret=pi_3RBez8G7ZynvAbIK0mRLYfSB_secret_T4Y8qn6pf94vcr6CvsbiDucxq&
// redirect_status=succeeded


interface Props {
  searchParams: Promise<{
    trans_id: string,
    payment_intent: string,
    payment_intent_client_secret: string,
    redirect_status: string
  }>;
}
export default async function PaymentSuccess(props: Props) {
  const trans_id = (await props.searchParams).trans_id;
  const payment_intent = (await props.searchParams).payment_intent;
  const payment_intent_client_secret = (await props.searchParams).payment_intent_client_secret;
  const redirect_status = (await props.searchParams).redirect_status;

  // get the player ID
  const [playerInfo] = await Promise.all([
    auth().then((data) => {
      const email = data?.user?.email;
      return fetchPlayerActivity_Hourly(email, null);
    })
  ]);

  const playerID = playerInfo.player_id;
  // call the action to save the payment 
  // convert the amount to a points
  // save the points to the user
  // send a notification to the user  
  // calcuate the points

  // Fetch the dollat to point convertion rate
  const dollarConvertion = await fetchLkpSparam();
  let purchaseAmount = 0;
  let dollarToPoints = 1;
  let PointsToUpload = 0;
  dollarConvertion.forEach((sparam) => {
    if (sparam.system === 'DOLLARTOPOINTS' && sparam.key === 'DOLLAR') {
      dollarToPoints = Number(sparam.value);
      return;
    }
  });
  try {
    await sql`BEGIN`;
    // read the transaction ID from the request from the table and update the status to approve
    await fetchPlayerBank(trans_id).then(async (data) => {
      if (data.length > 0) {
        const playerBank = data[0];
        PointsToUpload = Number(playerBank.amount) * dollarToPoints;
        purchaseAmount = Number(playerBank.amount);
        if (playerBank.status.toUpperCase() === 'PENDING') {
          const insertPurchase = await insertPurchasePoints(playerID, PointsToUpload, 100).then((data) => {
            // Update the status to approved in purchase
            sql`UPDATE playerbank SET status = 'approved', payment_intent=${payment_intent}, payment_intent_client_secret=${payment_intent_client_secret}, redirect_status=${redirect_status} WHERE trans_id = ${trans_id}`;
          });
          // Update the status to approved in playerbank
        }
      }
    });
    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    console.error('ROLLBACK - Error during the process:', error);
  }

  if (purchaseAmount === 0) {
    redirect('/dashboard/purchase');
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500"
      style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '20px' }}>
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>
        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${purchaseAmount}
        </div>
        <div className="mt-5"></div>
        <div>
          <Link
            href="/dashboard/purchase"
            className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold"
          >
            OK
          </Link>
        </div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        © {getFooterYearRange(2024)} 7Horse. All rights reserved.
      </footer>
    </main>
  );
}
