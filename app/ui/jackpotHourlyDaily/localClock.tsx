'use client';
import { useState, useEffect } from 'react';
import { getNextIntervalTime } from '@/app/lib/utils/utils';
// import { fetchLkpClockTrigger } from '@/app/lib/data';

// type props = {
//   currentTime: Date;
// }

//-------- TODO -----------
// Need to add this in database
// for now we have kept as place holder
// below string are encrypted using bcrypt and salt value is 10
// HOURLY_PRIZE_ID : $2b$10$Kduuk1bUDJW40YJ8q5QDZ.GneTDIQcgI7l5YFO1QRGi1B2aqzfvwG
// DAILY_PRIZE_ID : $2b$10$OFG82WM6yaCsR5s3Lj.K1eX.o5KDjY7QdvjjKIfh.lwom8WHUwvuK
//   const hourlyhashedPassword = bcrypt.hash("HOURLY_PRIZE_ID", 10);
//  const dailyhashedPassword = bcrypt.hash("DAILY_PRIZE_ID", 10);
//  const hashPassword = await Promise.all([
//     hourlyhashedPassword,
//     dailyhashedPassword
//  ]);
//  console.log(`HOURLY_PRIZE_ID : ${(await hourlyhashedPassword).toString()}`);
//  console.log(`DAILY_PRIZE_ID : ${(await dailyhashedPassword).toString()}`);

// const referenceTime = '08:00';  // Reference time in 24-hour format
//const intervalDuration = 60;    // Interval duration in minutes

export const ClockHourly = (
  { currentTime: initial, referenceTimeHourly, intervalDurationHourly }:
    { currentTime: Date, referenceTimeHourly: string, intervalDurationHourly: number }) => {

  const [currentTime, setCurrentTime] = useState(initial);
  const [nextIntervalTime, setNextIntervalTime] = useState(getNextIntervalTime(currentTime, referenceTimeHourly, intervalDurationHourly));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      setNextIntervalTime(getNextIntervalTime(currentTime, referenceTimeHourly, intervalDurationHourly));
    }, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, [currentTime, nextIntervalTime]);

  return (
    <div>
      <div className="text-2xl flex w-full items-center justify-between">
        <h1>Current Time: {currentTime.toLocaleTimeString()}</h1>
      </div>
      <div className="text-5xl tabular-nums">
        <h1>
          {nextIntervalTime.hours.toString().padStart(2, '0')} :
          {nextIntervalTime.minutes.toString().padStart(2, '0')} :
          {nextIntervalTime.seconds.toString().padStart(2, '0')}
        </h1>
      </div>
    </div>
  );
};


//-------- TODO -----------
// Need to add this in database
// for now we have kept as place holder
// const referenceTimeDaily = '18:30';  // Reference time in 24-hour format
// const intervalDurationDaily = 60*24; // Interval duration in minutes * 24 hours reverse count
export const ClockDaily = (
  { currentTime: initial, referenceTimeDaily, intervalDurationDaily }: 
  { currentTime: Date, referenceTimeDaily: string, intervalDurationDaily: number }) => {

    const [currentTime, setCurrentTime] = useState(initial);
  const [nextIntervalTime, setNextIntervalTime] = useState(getNextIntervalTime(currentTime, referenceTimeDaily, intervalDurationDaily));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      setNextIntervalTime(getNextIntervalTime(currentTime, referenceTimeDaily, intervalDurationDaily));
    }, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, [currentTime, nextIntervalTime]);

  return (
    <div>
      <div className="text-2xl flex w-full items-center justify-between">
        <h1>Current Time: {currentTime.toLocaleTimeString()}</h1>
      </div>
      <div className="text-5xl tabular-nums">
        <h1>
          {nextIntervalTime.hours.toString().padStart(2, '0')} :
          {nextIntervalTime.minutes.toString().padStart(2, '0')} :
          {nextIntervalTime.seconds.toString().padStart(2, '0')}
        </h1>
      </div>
    </div>
  );
};

// Some Research
// export const Clock = ({ time:initial }: props) => {
//   const [time1, setTime] = useState(calculateTimeRemaining(initial));
//   useEffect(() => {
//     setInterval(() => {
//       console.log(time1);
//       console.log(`initial: ${initial}`);
//       // fetch('/dashboard/jackpotDaily/api/updateJackpot')
//       // .then(res => res.json())
//       // .then(data => console.log(data));
//       setTime(calculateTimeRemaining(initial));

//     }, 1000)
//   }, []);

//   return (
//     <div className="text-7xl tabular-nums flex w-full items-center justify-between">
//       {/* {time.toLocaleTimeString(
//         undefined, {
//           hour12: false,
//           hour: '2-digit',
//           minute: '2-digit',
//           second: '2-digit'
//         }
//       )} */}
//       {
//         `${time1.days}:${time1.hours}:${time1.minutes}:${time1.seconds}`
//       }
//     </div>);
// }


/*
const getNextIntervalTime = (currentTime: Date, referenceTime: string, intervalDuration: number) => {
  const [refHours, refMinutes] = referenceTime.split(':').map(Number);
  const referenceTimeInMinutes = (refHours * 60 * 60 + refMinutes * 60) * 1000;
  const currentTimeInMinutes = (currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds()) * 1000;
  const timeDiff = currentTimeInMinutes - referenceTimeInMinutes;

  const intervalCount = Math.ceil(timeDiff / (intervalDuration));
  
  const nextIntervalTimeInMinutes = referenceTimeInMinutes + intervalCount * intervalDuration;

  // const now = new Date().getTime();
  // const end = new Date(endDate).getTime();

  const difference = nextIntervalTimeInMinutes - currentTimeInMinutes;

  if (difference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  // const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours1 = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes1 = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds1 = Math.floor((difference % (1000 * 60)) / 1000);

  // const nextIntervalHours = Math.floor(nextIntervalTimeInMinutes / (60 * 60));
  // const nextIntervalMinutes = Math.floor(nextIntervalTimeInMinutes / (60 * 60));
  const nextIntervalSecond = Math.floor(nextIntervalTimeInMinutes / (60 * 60 * 60);
  // const hours1 = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  // const minutes1 = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds1 = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `${hours1.toString().padStart(2, '0')}:${minutes1.toString().padStart(2, '0')}`;
  // return { , minutes1, seconds1 };
};
*/



