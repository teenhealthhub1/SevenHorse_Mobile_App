"use server"
// import { useRouter  } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { updatelockHourlyPrize } from 'app/lib/actions'

export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

    // Update the record intot he database   
    const [UnlockhourlyPrize] = await Promise.all([      
        updatelockHourlyPrize(false)
    ]);
    
    // Log 
    console.log("Cron Job - Hourly Prize Awarded at: ", new Date());   
    return NextResponse.json({ message: "Hourly Prize Awarded at:", time: new Date() }, { status: 200 });
}