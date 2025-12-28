//-------------------------------------------------------------------------------------
// Field	Value Range	Example Expression	Description
// Minute	0 - 59	5 * * * *	Triggers at 5 minutes past the hour
// Hour	0 - 23	* 5 * * *	Triggers every minute, between 05:00 AM and 05:59 AM
// Day of Month	1 - 31	* * 5 * *	Triggers every minute, on day 5 of the month
// Month	1 - 12	* * * 5 *	Triggers every minute, only in May
// Day of Week	0 - 6 (Sun-Sat)	* * * * 5	Triggers every minute, only on Friday
// 0 5 * * *  - Your cron job will run: At 05:00 AM
// Look at the document https://vercel.com/docs/cron-jobs
// /usr/bin/curl http://localhost:3000/api/hourlyjackpot -H "Authorization: Bearer cc99fc2a183ac5884a96963381574f51263875258389930340d9c89e8e8e1633"
//-------------------------------------------------------------------------------------
"use server"
// import { useRouter  } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { updatelockHourlyPrize } from 'app/lib/actions';
import { ProcessingQ } from '@/workers/7horse.worker';
import { sql } from '@vercel/postgres';
// This Api is called from the vercel cron job - look the above the comment for more information
export async function GET(request: NextRequest) {

  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  // Insert/update the record into the database   
  try {
    await sql`BEGIN`;
    // Update the record into the database   
    const [UnlockhourlyPrize] = await Promise.all([
      // Update the lock and show the animated image to the customer
      updatelockHourlyPrize(true).then(() => {
        // Call the worker thread and push the message to Redis database
        const data = {
          // any serializable data you want to provide for the job
          // for this example, we'll provide a message
          message: 'This is hourly job add to process the prize number',
          messageType: 'HOURLY_PRIZE',
          date:new Date()
        }
        // ProcessingQ.drain(true);
        ProcessingQ.add('hourlyJob', data);
        console.log("Added Hourly Message to the BULLMQ at ", data, new Date());
      })
    ]);
    await sql`COMMIT`;
    console.log("Database transaction committed successfully at: ", new Date());
  }
  catch (error) {
    await sql`ROLLBACK`;
    console.log("Cron Job - Database error while locking the database for processing: ", error);
    //Look for the database error and send the accordingly so that it will be easy to debug
    //400 bad request
    return new NextResponse(JSON.stringify({ error: "Cron Job - Database error while awarding the hourly" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  console.log("End of the Cron Job - Added Hourly Prize message into the queue for processing at: ", new Date());
  return new NextResponse(JSON.stringify({ message: `End of the Cron Job - Added Hourly Prize message into the queue for processing at: ${new Date()}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}