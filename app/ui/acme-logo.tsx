import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { GiHorseHead } from "react-icons/gi";

export default function SevenHorseLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-black`}>
      {<GiHorseHead className="h-12 w-12 text-black" />}
      <p className="text-[44px] text-black">7horse</p>
    </div>
  );
}
