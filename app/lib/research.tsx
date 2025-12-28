// // NextJS routing Cache
// import Link from 'next/Link'
// import { revalidatePath } from 'next/cache';
// import { RefreshCache } from '@/app/ui/jackpotHourlyDaily/refresh-cache';


// async function getPost(postId: string) {
//     // const post = await prisma.post.findUnique0rThrow({
//     //     where: id:
//     //     parseInt(postId), 3);
//     const post = {title: 'sql statment', content: 'content'}
//     return post;
// }

// export default async function PostPage({
//     params,
// }: {
//     params: { postId: string };
// }) {

//     // fetch the post from the database
//     const post = await getPost(params.postId);
//     const postLastUpdate = post.dt_update.getTime();

//     async function checkPostChanged(){
//         "use server";
//         const checkPost = await getPost(params.postId);
//         const checkLastUpdated = checkPost.dt_update.getTime();

//         const didChanged = postLastUpdate !== checkLastUpdated;

//         if (didChanged){
//             revalidatePath('/');  // revalidate all the path
//         }

//         console.log("didChanged?", didChanged);

//     }

//     return (<div>
//         <h1 className="text-3xl font-bold tracking-tighter"> {post.title} </h1>
//         <p className="mt-3" > {post.content} </p>
//         <div>
//         <RefreshCache check={checkPostChanged}></RefreshCache>
//         </div>
//         < div className="mt-4" >
//             <Link href="/" className="text-blue-500 underline">
//                 Testing
//             </Link>
//         </ div>
//     </div>);
// }



    // const {dt, hourly_prize_number} = await fetchhourlyPrize();
    // const now = new Date();    
    // console.log(now);
    // console.log('now.toISOString():' + now.toISOString());
    // console.log('now.getDate():' + now.getDate());
    // console.log('now.toDateString()' + now.toDateString());

    // console.log('now.getFullYear():' + now.getFullYear());
    // console.log('now.getTime():' + now.getTime());
    // console.log('now.getUTCDate()' + now.getUTCDate());

    // console.log('now.toLocaleDateString():' + now.toLocaleDateString());
    // console.log('now.getTime():' + now.getTime());
    // console.log('now.getUTCDate()' + now.getUTCDate());

    // console.log('now.toLocaleTimeString():' + now.toLocaleTimeString());
    // console.log('now.toLocaleString():' + now.toLocaleString());

    // console.log('now.toTimeString():' + now.toTimeString());
    // console.log('now.toUTCString():' + now.toUTCString());

    // console.log('now.toISOString()..split(T)[0]:' + now.toISOString().split('T')[0]);
    // console.log('now.toISOString()..split(T)[1]:' + now.toISOString().split('T')[1]);
    // console.log('now.toISOString()..split(T)[1]:' + now.toISOString().split('T')[1].split('.')[0]);

    //.split('T')[0];
    // console.log('now.toLocaleString():' + now.toLocaleString());
    // console.log('now.toLocaleString():' + now.toLocaleString());
    // console.log('now.toLocaleString():' + now.toLocaleString());
    // console.log('now.toLocaleString():' + now.toLocaleString());

    //  const hourlyhashedPassword = bcrypt.hash("HOURLY_PRIZE_ID", 10);
    //  const dailyhashedPassword = bcrypt.hash("DAILY_PRIZE_ID", 10);

    //  const hashPassword = await Promise.all([
    //     hourlyhashedPassword,
    //     dailyhashedPassword
    //  ]);

    //  console.log(`HOURLY_PRIZE_ID : ${(await hourlyhashedPassword).toString()}`);
    //  console.log(`DAILY_PRIZE_ID : ${(await dailyhashedPassword).toString()}`);
    //const email:any = user?.user?.email;
    //const playerInfo = await fetchPlayerActivity(email);
    //console.log(user?.user?.id);
