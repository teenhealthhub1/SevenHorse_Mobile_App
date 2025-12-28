//-------------------------------------------------------------------------
// If this file changes then we need to restart the server to take into effect.
// At production we need to re-deployed to see the changes
//-------------------------------------------------------------------------
import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';

import {
  processHourlyPrize,
  processDailyPrize
} from 'app/lib/actions';

import {
  fetchAwardHourlyPrize,
  fetchAwardHourlyPrizeProcessed,
  fetchhourlyPrize
} from 'app/lib/data';

// Put all this value in the .env variable
// const connection = new Redis({maxRetriesPerRequest:null});
// const connection = new Redis({ 
//   port:11680,
//   host:'redis-11680.c89.us-east-1-3.ec2.redns.redis-cloud.com',
//   password:'xHC3COIOEbOtsQd5xvK804DDGzjbu38M',
//   username:'default',
//   maxRetriesPerRequest:null
//   });

const connection = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  maxRetriesPerRequest: Number(process.env.REDIS_MAXRETRIESPERREQUEST), // In production this entry should be Zero - not sure we need to investigate more on this
});

// Create the queue for the hourly/Daily process message
// Queue Name is ProcessingHDQ - HDQ (Hourly, Daily and Queue)
export const ProcessingQ = new Queue('ProcessingHDQ', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
  },
});


const worker = new Worker(
  'ProcessingHDQ', // this is the hourly queue name, the first string parameter we provided for Queue()
  async (job) => {
    try {
      // This function clear the record for the player in the playeractivityHourly table and 
      // update the winning points for the winning number.
     
      console.log(`Fetch the Job (${JSON.stringify(job.data.message)} at ${JSON.stringify(job.data.date)}) from the type (${JSON.stringify(job.data.messageType)}) to ProcessingHDQ Queue`);

      // Check which for the hourly or Daily
      if (job.data.messageType === 'HOURLY_PRIZE') {
        console.log(`----------------------------- Start Hourly Worker thread -----------------------------------------------------------`);        
        if (!await processHourlyPrize())
          throw new Error('Error in processing HourlyPrize');
      }
      else if (job.data.messageType === 'DAILY_PRIZE') {
        console.log(`----------------------------- Start Daily Worker thread -----------------------------------------------------------`);
        if (!await processDailyPrize())
          throw new Error('Error in processing DailyPrize');
      }
      else {
        throw new Error('Unknown message from the message Queue');
      }
    }
    catch (error) {
      console.log(" Error in the worker process - inside the job call back function  ", error);
      // Look for the database error and send the accordingly so that it will be easy to debug
      // 400 bad request
      // return new NextResponse("Database error while awarding the hourly prize", { status: 400 });
    }
    console.log('--------------End Worker thread -> executed successfully--------');
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
    lockDuration: 1000 * 60 * 1
  }
);

export default worker;