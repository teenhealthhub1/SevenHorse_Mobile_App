import { Revenue } from '../definitions';
import { PlayerActivity } from '@/app/lib/definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generateYAxisForPlayerChart = (playerInfo: PlayerActivity, total_points:number) => {
  const yAxisLabels = [];
  const highestRecord = total_points;
  const interval = total_points / 10 ;
  let labelInterval = highestRecord;
  for (let i = 10; i >= 0; --i) {
    yAxisLabels.push(`${Math.round(labelInterval)}`);
    labelInterval -= interval;
  }
  return { yAxisLabels };
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

// Calculate the reverse counter based
export function calculateTimeRemaining(endDate: Date) {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const difference = end - now;
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  // const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

// Calculate the next interval time
export const getNextIntervalTime = (currentTime: Date, referenceTime: string, intervalDuration: number) => {
  const [hours, minutes] = referenceTime.split(':').map(Number);
  const seconds = 0;
  const referenceTimeInMinutes = hours * 60 + minutes;
  const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes() + currentTime.getSeconds()/60;
  const timeDiff = currentTimeInMinutes - referenceTimeInMinutes;
  const intervalCount = Math.ceil(timeDiff / intervalDuration);
  const nextIntervalTimeInMinutes = referenceTimeInMinutes + intervalCount * intervalDuration;

  const nextIntervalHours = Math.floor(nextIntervalTimeInMinutes / 60);
  const nextIntervalMinutes = nextIntervalTimeInMinutes % 60;
  const nextIntervalSeconds = nextIntervalTimeInMinutes % (60 * 60);

  const nextDay = new Date(currentTime);
  

  nextDay.setDate(nextIntervalHours > 24 ? currentTime.getDate() + 1 : currentTime.getDate());
  nextDay.setHours(nextIntervalHours, nextIntervalMinutes, 0, 0);
  
  return calculateTimeRemaining(nextDay);
};

// Generator the password
export function generatePassword(length = 12, includeNumbers = true, includeSymbols = true) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = lowercaseChars.toUpperCase(); 
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~`|}{[]\:;?><,./-='

  let allowedChars = lowercaseChars + uppercaseChars;
  if (includeNumbers) allowedChars += numberChars;
  if (includeSymbols) allowedChars += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    password += allowedChars[randomIndex];
  }
  return password;
}

export function getFooterYearRange(startYear: number): string {
  const currentYear = new Date().getFullYear();
  return `${startYear} - ${currentYear}`;
}

// // Nodemailer
// // Create the transport method and pass the option
// // Pass the host -  store in the envniroment
// const transport = nodemailer.createTransport({
//  host: process.env.MAIL_HOST,
//  port: process.env.MAIL_PORT,
//  secure:true, //true for port 465, false for other ports - see the hostering mail connection setting
//  auth:{
//    user: process.env.MAIL_USER,
//    pass: process.env.MAIL_PASSWORD,
//  }
// } as SMTPTransport.Options) // for type scipt add this "as SMTPTransport.Options"


// // create the function to sending email
// // Parameter that we need to send
// // Define the type of the nessage that we are sending
// type sendEmailto={
//  sender: Mail.Address,
//  receipients:Mail.Address[],  // Multiple
//  subject: string,
//  message: string,
// }


// export const sendEmail = async (sendto:sendEmailto) =>{
//  const {sender,receipients,subject,message} = sendto;
//   // make use of the transport object to send an email
//  return await transport.sendMail({
//       from: sender,
//       to: receipients,
//       subject,
//       html: message,   // message
//       text:message,    // Plain text message of the html message
//  })
// }
