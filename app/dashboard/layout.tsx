import SideNav from '@/app/ui/dashboard/sidenav';
import { nav_link } from '@/app/lib/definitions';
import { auth } from '@/auth';
import { fetchNavLink } from '@/app/lib/data';
import { getFooterYearRange } from '@/app/lib/utils/utils';

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {

  // Get the user_group_type from the user table
  const data = await auth().then((data) => {
    const name = data?.user?.name;
    //console.log('user_group_type_Name:' + name);
    return fetchNavLink(name);
  });
  //console.log('user_group_type_name:' + JSON.stringify(data.rows));

// This component will render the Page background colors
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav link={data.rows} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12" 
      style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>{children}</div>
      {/* <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer> */}
    </div>
  );
}
