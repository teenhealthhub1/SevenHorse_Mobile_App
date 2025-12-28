'use server'
import { sendEmail } from "@/app/lib/utils/mail.utils";
import { NextRequest, NextResponse } from "next/server";
import { fetchUsers } from "@/app/lib/data";
import { updateUser } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
import { sql } from '@vercel/postgres';
//export const dynamic = 'force-dynamic'; // Disable caching for the route
// import { send } from "process";

// This Api is called from the vercel cron job - look the above the comment for more information
export async function POST(request: NextRequest) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
    // Update the user table with approved status and remarks
    let UserEmailIds: string[] = [];

  try {
    const sender = {
      name: 'no-reply',
      address: 'support@7horse.in'
    };
    // console.log("New - User: ", user);
    const users = await fetchUsers().then((users) => {
      let results: any[] = [];
      users.forEach((user: User) => {
        const emailParts = user.email.split('@');
        const emailUsername = emailParts[0];
        const receipients = [{
          name: emailUsername,
          address: user.email,
        }];

        // Construct the email message
        const emailMessage = user.email.toString().split('@')[0] + user.remarks;

        const result = sendEmail({
          sender,
          receipients,
          subject: 'Welcome to 7Horse app',
          message: `
            <p>You are invited!!!</p>
            <p>URL: <a href="http://www.7horse.in">www.7horse.in</a></p>
            <p>USERNAME: ${user.email}</p>
            <p>PASSWORD: ${emailMessage}</p>
          `,
        });

        results.push(result);
      });
      return users;
    });


    let userEmail = users.forEach(async (user: User) => {
      // updatedUser = await updateUser(user.id, { status: 'approved', remarks: 'Approved' });
      UserEmailIds.push(user.email);
      // return user.email;
    });   
  }
  catch (error) {
    console.log("Cron Job - Unable to send email at this movement Try later!: ", error);
    //Look for the database error and send the accordingly so that it will be easy to debug
    //400 bad request
    return new NextResponse(JSON.stringify({ message: "Cron Job - Unable to send email at this moment. Try later!" }), { status: 400 });
  }

   //
   await sql`BEGIN`;
   const [UnlockhourlyPrize] = await Promise.all([
    // Update the lock and show the animated image to the customer
    updateUser(UserEmailIds).then(() => {
    console.log("Cron Job -COMMIT SUCCESSFUL -Updated the user table with approved status and remarks: ", new Date());
    // Update the invite status to approved
    sql`COMMIT`;
        
  }).catch((error) => {
    sql`ROLLBACK`;
    console.log("Cron Job - ROLLBACK - Database error while updating the user table with approved status and remarks: ", error);
    //Look for the database error and send the accordingly so that it will be easy to debug
    //400 bad request
    return new NextResponse(JSON.stringify({ message: "Cron Job - Database error while updating the user table with approved status and remarks" }), { status: 400 });
  })]);
   

  console.log("End of the Cron Job - Sent Email successfully ");
  return new NextResponse(JSON.stringify({ message: "End of the Cron Job - Sent Email successfully" }), { status: 200 });
}
