// // TODO we need to automate this API to update the CRON JOB string from the external api
// "use server"
// // import { useRouter  } from "next/navigation";
// import { NextRequest, NextResponse } from "next/server";

// // export async function GET(request: NextRequest) {
// //     if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
// //         return new  NextResponse("Unauthorized", { status: 401 });
// //       }
// //     console.log("Cron Job Ran at: ", new Date());
// //     // const uRouter = useRouter();
// //     // uRouter.refresh();
// //     // OKuRouter.replace('/dashboard/jackpotDaily');
// //     return new NextResponse("7horse cron ran", { status: 200 });
// // } 

// // pages/api/update-cron.js
// import fs from 'fs';
// import path from 'path';

// const vercelJsonPath = path.join(process.cwd(), 'vercel.json');

// export default async function POST(req: NextRequest, res: NextResponse) {
//   if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   if (req.method === 'POST') {

//     const newCronString = req.body;

//     try {
//       const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));

//       // Update the cron job schedule
//       vercelJson.crons[0].schedule = newCronString;

//       // Write the updated vercel.json file
//       fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));

//       // Trigger a redeployment (you'll need a way to do this)
//       // For example, you can use the Vercel CLI or a Vercel API call

//       return new NextResponse(`Cron job updated:${newCronString}`, { status: 200 });
//       // res.status(200).json({ message: 'Cron job updated' });
//     } catch (error) {
//       console.error(error);
//       // res.status(500).json({ message: 'Error updating cron job' });
//       return new NextResponse("Error updating cron job", { status: 500 });
//     }
//   } else {
//     // res.status(405).end(); // Method Not Allowed
//     return new NextResponse("Method Not Allowed", { status: 405 });
//   }
// }