"use server"
// import { useRouter  } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { updatelockDailyPrize } from 'app/lib/actions'

export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Update the record to false to unlock into the database   
      const [UnlockDailyPrize] = await Promise.all([      
        updatelockDailyPrize(false)
      ]);      
   
    // Log 
    console.log("Cron Job - Unlock Daily Prize Awarded at: ", new Date());   
    return NextResponse.json({ message: "Unlock Daily Prize Awarded at:", timestamp: new Date() }, { status: 200 });
}