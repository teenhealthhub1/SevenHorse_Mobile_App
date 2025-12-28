import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SevenHorseLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { nav_link } from '@/app/lib/definitions';
import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';

export default function SideNav({ link }: { link: nav_link[] }) {
  // console.log('inside *****' + JSON.stringify(link));
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2"
      style={{ background: 'linear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255)))', padding: '20px' }}>
      <Link
        // className="style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px' , padding: '20px'}}"
        href="/"
      >
        <div className=" text-white md:w-40">
          <SevenHorseLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks link={link} />
        <div
          className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"
          style={{ background: 'linear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255)))', padding: '20px' }}
        >
          <img
            src="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
            alt="winning image"
            className="w-full h-auto rounded-md"
          />
        </div>
        <form action={async () => {
          'use server';
          async function getUser(email: string): Promise<User | undefined> {
            try {
              const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
              return user.rows[0];
            } catch (error) {
              console.error('Failed to fetch user:', error);
              throw new Error('Failed to fetch user.');
            }
          }
          await auth().then(async (data) => {
            const email = data?.user?.email;
            const userDetail = email ? await getUser(email.toString().toUpperCase()) : undefined;
            await sql`INSERT INTO login_activity (user_id, status) VALUES (${userDetail?.id},false)`;
          })

          await signOut({ redirectTo: '/dashboard', redirect: true });
        }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
