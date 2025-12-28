import { PencilIcon, PlusIcon, TrashIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import clsx from 'clsx';


// import { state /* other hooks */ } from 'react-router-dom'; 


export function CollectPoints_Daily({ playerId, game_id, selectNumber, takenNumber, balancePoints }:
  { playerId: string, game_id: string, selectNumber: number, takenNumber: number, balancePoints: number }) {
  // which button has press
  // console.log(selectNumber);
  // console.log(takenNumber);
  // console.log(balancePoints);
  // const formData = {selectNumber, takenNumber, balancePoints}
  // Check where to re-direct
  // console.log('game_id',game_id);
  // const path = game_id.localeCompare('DAILY_PRIZE')?'/dashboard/jackpotHourly/updatePoints':'/dashboard/jackpotDaily/updatePoints';

  return (
    <Link
      href={{
        pathname: '/dashboard/jackpotDaily/updatePoints', query: {
          playerId: playerId,
          selectNumber: selectNumber
        }
      }}
      className="
      shining-button
      group
      flex h-50 
      items-center 
      rounded-lg 
      bg-blue-600 
      px-3
      text-sm 
      font-medium 
      text-white 
      transition-colors 
      hover:bg-blue-500 
      focus-visible:outline 
      focus-visible:outline-2 
      focus-visible:outline-offset-2 
      focus-visible:outline-blue-600"
    >
      <span
        className={
          clsx(
            'inline-flex items-center rounded-full px-2 py-1 text-xs',
            {
              'bg-gray-100 text-gray-500': takenNumber === 0,
              'bg-orange-500 text-black': takenNumber > 0,
            },
          )}>

        {takenNumber == 0 ? (
          <>
            {selectNumber}
            <PlusIcon className="ml-1 w-8 text-white-500" />
          </>
        ) : (
          <>
            {selectNumber}
            <CheckIcon className="ml-1 w-8 text-white-500" />
          </>
        )}
      </span>
    </Link>
  );
}
