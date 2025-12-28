import { create } from "domain";
import AcmeLogo from "../ui/acme-logo";
import NewUser from "../ui/newUser-form";
import { createInvite, InviteState } from '@/app/lib/actions'
import Invite from "../ui/invite";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';


export default async function newUserRegistration(props: {
  searchParams?: Promise<{
    email?: string;
}>
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email; 
  
  console.log(`email = ${email}`);
  

    return ( 
      <main className="flex items-center justify-center md:h-screen" style={{ background: 'linear-gradient(to right,rgb(81, 81, 81), rgb(53, 56, 52))' , padding: '20px'}}>
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32" style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
          <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36" style={{ background: 'linear-gradient(to right, #E5B80B, rgb(110, 9, 9))' , padding: '20px'}}>
            <div className="text-white md:w-36">
              <AcmeLogo />
            </div>
          </div>
          <NewUser email={email}/>
        </div>
       </main>
    );
  }