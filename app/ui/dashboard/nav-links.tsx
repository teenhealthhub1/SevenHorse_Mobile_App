'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/20/solid';
import { GiTrojanHorse } from "react-icons/gi";
import { GiHorseshoe } from "react-icons/gi";
import { BiPurchaseTag } from "react-icons/bi";
import { MdRedeem } from "react-icons/md";
import { PiHandshakeDuotone } from "react-icons/pi";
// Set size directly when rendering the icon instead of using defaultProps
import { auth } from '@/auth';

import {fetchNavLink} from '@/app/lib/data';
import { nav_link } from '@/app/lib/definitions';
import { IoIosPersonAdd } from "react-icons/io";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon },
//   { name: 'Partner', href: '/dashboard/partner', icon: UserGroupIcon, },
//   { name: 'Dealer', href: '/dashboard/dealer', icon: UserGroupIcon },
//   { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
//   // { name: 'Jackpot Daily Page', href: '/dashboard/jackpotDaily', icon: GiTrojanHorse},  
//   // { name: 'Jackpot Hourly Page', href: '/dashboard/jackpotHourly',   icon: GiHorseshoe  },
// ];

function selectIcon(name:string){
if (name === 'Home') return (props: any) => <HomeIcon {...props} size={24} />;
if (name === 'Partner') return (props: any) => <PiHandshakeDuotone {...props} size={24} />;
if (name === 'Dealer') return (props: any) => <IoIosPersonAdd {...props} size={24} />;
if (name === 'Profile') return (props: any) => <UserIcon {...props} size={24} />;
if (name === 'Jackpot Daily') return (props: any) => <GiTrojanHorse {...props} size={24} />;
if (name === 'Jackpot Hourly') return (props: any) => <GiHorseshoe {...props} size={24} />;
if (name === 'Purchase') return (props: any) => <BiPurchaseTag {...props} size={24} />;
if (name === 'Redeem') return (props: any) => <MdRedeem {...props} size={24} />;
if (name === 'PurchaseDealer') return (props: any) => <BiPurchaseTag {...props} size={24} />;
if (name === 'RedeemDealer') return (props: any) => <MdRedeem {...props} size={24} />;
if (name === 'Trend') return (props: any) => <BiPurchaseTag {...props} size={24} />;
if (name === 'Product') return (props: any) => <BiPurchaseTag {...props} size={24} />;

// Default
return HomeIcon;
}

export default function NavLinks({link}:{link:nav_link[]}) {
  const pathname = usePathname();

// console.log('NavLinks:------' + JSON.stringify(link));
// link.map((data) => {
//   console.log('page_name' + data.name);
//   console.log('page_name' + data.href);
// });
// }

  return (
    <>
      {link.map((link) => {
        const LinkIcon = selectIcon(link.name);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              // 'flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                'shining-button ',
                {
                'bg-sky-200 text-blue-600': pathname === link.href,
                },
              )}
              prefetch={false} // Ensures the layout is not preloaded
              >
              <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}