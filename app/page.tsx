import SevenHorseLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import  Styles  from '@/app/ui/home.module.css';
import {lusitana} from '@/app/ui/fonts';
import Image from 'next/image';
import LoginForm from "@/app/ui/login-form";


export default function Page() {

  const email = '';
  const password = '';

  return (
    <main className="flex min-h-screen flex-col p-6" style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' }}>
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52"  style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' }}>
        { <SevenHorseLogo /> }
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row"  style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' }}>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20"
        style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' }}
      >
         
          <div /*className = {Styles.shape}*/ />
          {/* Draw Rectangle */}
          {
            // <div className="relative w-0 h-0 border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black"          />
            // <div className={Styles.shape} />
          }
          
          {/* <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link> */}
          <div  style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' }}>
            <LoginForm email={email} password={password}/>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 " style={{ border: '4px solid black' }}>
          {/* Add Hero Images Here */}
          <Image 
          src="/seven-Horse.png"
          width={1000}
          height={760}
          className="hidden md:block"
          alt="Screenshots of the dashboard project showing desktop version"
          style={{ border: '4px solid black' }}/>
        </div>      
      </div>
    </main>
  );
}
