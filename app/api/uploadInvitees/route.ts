"use server"
// import { useRouter  } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { uploadInvitees } from 'app/lib/actions';
import { sql } from "@vercel/postgres";


export async function GET(request: NextRequest) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }


  // Update the record into the database  
  try {
    await sql`BEGIN`;
    await uploadInvitees();
    console.log("Uploaded invitees at: ", new Date());
    await fetch(`${request.nextUrl.origin}/api/emailNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ message: 'Invitees uploaded successfully' }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Email notification sent:', data);
      });
    await sql`COMMIT`;
    console.log("COMMIT - Changes committed to the database");
  } catch (error) {
    await sql`ROLLBACK`;
    console.error('ROLLBACK - Error during the process:', error);
  }

  // Log
  console.log("Cron Job - uploaded invitees at: ", new Date());
  return NextResponse.json({ message: "Uploaded invitees successfully" }, { status: 200 });
}
