import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  PlayerActivity,
  HourlyPrize,
  DailyPrize,
  LkpClockTrigger,
  award_hourlyprize,
  award_dailyprize,
  award_hourlyprize_processed,
  award_dailyprize_processed,
  nav_link,
  inviteNewPlayer,
  lkpSparam,
  User,
  productType,
  countrystateType,
  playerBankType,
  UsersDetails,
  productTable,
  ProductForm
} from './definitions';
import { formatCurrency } from './utils/utils';
import bcrypt from 'bcryptjs';
import { number } from 'zod';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 5 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {

    // console.log('Fetching Latest Invoices data...');
    // await new Promise((resolve) => setTimeout(resolve, 1000));


    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    // console.log('Data fetch completed after 1 seconds.');

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));



    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

const PRODUCT_ITEMS_PER_PAGE = 6;
export async function fetchFilteredProducts(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * PRODUCT_ITEMS_PER_PAGE;

  try {
    const products = await sql<productTable>`
      SELECT
        id,
        name,
        description,
        points,
        amount,
        status,
        images,
        outofstock 
      FROM product      
      WHERE
        name ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        points::text ILIKE ${`%${query}%`} OR
        amount::text ILIKE ${`%${query}%`} OR
        status ILIKE ${`%${query}%`}
      LIMIT ${PRODUCT_ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return products.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Product.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchProductsPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*) FROM product where active = true`;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of Product.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const data = await sql<ProductForm>`
      SELECT
        id,
        name,
        description,
        points,  
        amount,
        status,
        images,
        outofstock
      FROM product
      WHERE product.id = ${id} and product.active = true;
    `;

    // const invoice = data.rows.map((invoice) => ({
    //   ...invoice,
    //   // Convert amount from cents to dollars
    //   amount: invoice.amount / 100,
    // }));

    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch Product.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// Fetch the lucky number from the database
export async function fetchAwardWinner() {
  try {
    //-------------------------------TODO---------------
    // Calculate the Prize from the database and remove the rand placehold 
    // Fetch data from the database
    // Place holder
    const luckyNumber = Math.floor(Math.random() * 9) + 1; // Generates a number between 1 and 9
    if (luckyNumber > 0 && luckyNumber < 100)
      return luckyNumber;
    else
      throw new Error("Something went wrong at the Random number geration");
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all awardTable table.');
  }
}

// Fetch the player information
export async function fetchPlayerActivity_Daily(email: string | null | undefined, id: string | undefined | null) {
  try {
    const data = await sql<PlayerActivity>`
      SELECT
        ph.player_id,
        ph.game_id,
        ph.points_one,
        ph.points_two,
        ph.points_three,
        ph.points_four,
        ph.points_five,
        ph.points_six,
        ph.points_seven,
        ph.points_eight,
        ph.points_nine,
        ph.dt_update
      FROM playeractivity_daily ph 
      JOIN users u ON u.id::text = ph.player_id 
      WHERE u.email = ${email} OR u.id = ${id}`;

    const playerPoints = data.rows[0];
    return playerPoints;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all PlayerActivity table.');
  }
}

export async function fetchPlayerFreeplayBalance(player_id: string) {
  try {
    const FREEPLAY_TRANSACTION_ID = 500;
    const data = await sql`select SUM(total_points) as total_points 
    FROM PlayerActivity where player_id = ${player_id} and trans_id = ${FREEPLAY_TRANSACTION_ID}`;

    const freeplayBalance: string = data.rows[0].total_points;
    return freeplayBalance;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player freeplay balance points.');
  }
}

export async function fetchPlayerBalance(email: string | null | undefined, id: string | undefined | null) {
  try {
    const data = await sql`select SUM(total_points) as total_points 
    FROM PlayerActivity pa
    JOIN users u ON u.id::text = pa.player_id 
      WHERE u.email = ${email} OR u.id = ${id}`;

    const playerPoints: string = data.rows[0].total_points;
    // console.log(playerPoints);
    return playerPoints;
  }
  catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch player balance points.');
  }
}

// Fetch the player information
export async function fetchPlayerActivity_Hourly(email: string | null | undefined, id: string | undefined | null) {
  try {
    const data = await sql<PlayerActivity>`
      SELECT
        ph.player_id,
        ph.game_id,
        ph.points_one,
        ph.points_two,
        ph.points_three,
        ph.points_four,
        ph.points_five,
        ph.points_six,
        ph.points_seven,
        ph.points_eight,
        ph.points_nine,
        ph.dt_update
      FROM playeractivity_hourly ph 
      JOIN users u ON u.id::text = ph.player_id 
      WHERE u.email = ${email} OR u.id = ${id}`;

    const playerPoints = data.rows[0];
    return playerPoints;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all PlayerActivity table.');
  }
}

// Fetch the player information
export async function fetchUsersDetails(player_id: string | undefined | null) {
  console.log('fetchUsersDetails called with player_id:', player_id);
  try {

    const userExists = await sql`
    SELECT EXISTS (
      SELECT 1 
      FROM users_details 
      WHERE users_id = ${player_id}
    )
  `.then((result) => result.rows[0].exists);

    const defaultUserDetails: UsersDetails = {
      users_id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      phone: '',
      address_1: '',
      address_2: '',
      country: '',
      city: '',
      state: '',
      pin: 0,
      age: 0,
      sex: ''
    };

    if (userExists) {
      console.log('User exists, fetching details for player_id:', player_id);
      const data = await sql<UsersDetails>`
      SELECT
        users_id,
        first_name,
        middle_name,
        last_name,
        phone,
        address_1,
        address_2,
        country,
        city,
        state,
        pin,
        age,
        sex
      FROM users_details 
      WHERE users_id = ${player_id}`;

      const userDetails: UsersDetails = {
        users_id: data.rows[0].users_id,
        first_name: data.rows[0].first_name,
        middle_name: data.rows[0].middle_name,
        last_name: data.rows[0].last_name,
        phone: data.rows[0].phone,
        address_1: data.rows[0].address_1,
        address_2: data.rows[0].address_2,
        country: data.rows[0].country,
        city: data.rows[0].city,
        state: data.rows[0].state,
        pin: data.rows[0].pin,
        age: data.rows[0].age,
        sex: data.rows[0].sex
      }
      return userDetails;
    }
    return defaultUserDetails;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all User_Details table.');
  }
}

// Fetch the player information for tread page
export async function fetchPlayerActivityHourly_count() {
  try {
    const data = await sql<PlayerActivity>`
      SELECT
        SUM(ph.points_one) as points_one,
        SUM(ph.points_two) as points_two,
        SUM(ph.points_three) as points_three,
        SUM(ph.points_four) as points_four,
        SUM(ph.points_five) as points_five,
        SUM(ph.points_six) as points_six,
        SUM(ph.points_seven) as points_seven,
        SUM(ph.points_eight) as points_eight,
        SUM(ph.points_nine) as points_nine
      FROM 
        playeractivity_hourly ph`
    const playerPoints = data.rows[0];
    return playerPoints;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all PlayerActivity_hourly table.');
  }
}

// Fetch the player information for tread page
export async function fetchPlayerActivityDaily_count() {
  try {
    const data = await sql<PlayerActivity>`
      SELECT
        SUM(dy.points_one) as points_one,
        SUM(dy.points_two) as points_two,
        SUM(dy.points_three) as points_three,
        SUM(dy.points_four) as points_four,
        SUM(dy.points_five) as points_five,
        SUM(dy.points_six) as points_six,
        SUM(dy.points_seven) as points_seven,
        SUM(dy.points_eight) as points_eight,
        SUM(dy.points_nine) as points_nine
      FROM 
        playeractivity_daily dy`
    const playerPoints = data.rows[0];
    return playerPoints;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all PlayerActivity_daily table.');
  }
}

// Fetch the Prize record information from hourlyPrize table
export async function fetchhourlyPrize() {
  try {

    const record = await sql<HourlyPrize>`SELECT dt, hourly_prize_number, dt_update, lock FROM hourlyprize`;
    const dt = record.rows[0].dt;
    const hourly_prize_number = record.rows[0].hourly_prize_number;
    const dt_update = record.rows[0].dt_update;
    const lock = record.rows[0].lock;

    return {
      dt,
      hourly_prize_number,
      dt_update,
      lock
    };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all hourlyPrize table.');
  }
}

// // Fetch the Prize record information from hourlyPrize_history table
// export async function fetchhourlyPrizeHistory(dt: string) {
//   const date = dt;
//   try {

//     const recordCountPromise = sql`SELECT count(*) FROM hourlyprize_history where dt = '${date}'`;
//     const recordPromise = sql<HourlyPrize>`SELECT dt, hourly_prize_number, dt_update FROM hourlyprize_history where dt = '${date}'`;

//     const data = await Promise.all([
//       recordCountPromise,
//       recordPromise
//     ]);

//     const recordCount = Number(data[0].rows[0].count ?? '0');
//     const dt = data[1].rows[0].dt;
//     const hourly_prize_number = data[1].rows[0].hourly_prize_number;
//     const dt_update = data[1].rows[0].dt_update;

//     return {
//       recordCount,
//       dt,
//       hourly_prize_number,
//       dt_update
//     };
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all hourlyPrize_history table.');
//   }
// }

// Fetch the Prize record information from hourlyPrize_history table
export async function fetchhourlyPrizeHistory(historyLimit: number = 10) {
  try {
    const recordPromise = sql<HourlyPrize>`SELECT hourly_prize_number, dt_update FROM hourlyprize_history ORDER BY dt_update DESC LIMIT ${historyLimit}`;

    const data = await Promise.all([
      recordPromise
    ]);

    const hourlyPrizeNumbers = data[0].rows.map(row => row.hourly_prize_number).join(',');
    return hourlyPrizeNumbers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all hourlyPrize_history table.');
  }
}

// Fetch the Prize record information from hourlyPrize_history table
export async function fetchdailyPrizeHistory(historyLimit: number = 10) {
  try {
    const recordPromise = sql<DailyPrize>`SELECT daily_prize_number, dt_update FROM dailyprize_history ORDER BY dt_update DESC LIMIT ${historyLimit}`;

    const data = await Promise.all([
      recordPromise
    ]);

    const dailyPrizeNumbers = data[0].rows.map(row => row.daily_prize_number).join(',');
    return dailyPrizeNumbers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all dailyprize_history table.');
  }
}

// Fetch the Prize record information from dailyPrize_history table
export async function fetchdailyPrize() {
  try {
    const record = await sql<DailyPrize>`SELECT dt, daily_prize_number, dt_update, lock FROM dailyprize`;

    const dt = record.rows[0].dt;
    const daily_prize_number = record.rows[0].daily_prize_number;
    const dt_update = record.rows[0].dt_update;
    const lock = record.rows[0].lock;

    return {
      dt,
      daily_prize_number,
      dt_update,
      lock
    };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all dailyPrize table.');
  }
}

// Fetch the Prize record information from dailyPrize_history table
// export async function fetchdailyPrizeHistory(dt: string) {
//   const date = dt;
//   try {

//     const recordCountPromise = sql`SELECT count(*) FROM dailyprize_history where dt = '${date}'`;
//     const recordPromise = sql<DailyPrize>`SELECT dt, daily_prize_number,dt_update FROM dailyprize_history where dt = '${date}'`;

//     const data = await Promise.all([
//       recordCountPromise,
//       recordPromise
//     ]);

//     const recordCount = Number(data[0].rows[0].count ?? '0');
//     const dt = data[1].rows[0].dt;
//     const daily_prize_number = data[1].rows[0].daily_prize_number;
//     const dt_update = data[1].rows[0].dt_update;

//     return {
//       recordCount,
//       dt,
//       daily_prize_number,
//       dt_update
//     };
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all dailyPrize_history table.');
//   }
// }



export async function fetchLkpClockTrigger(id: string) {

  const clock_id = id;
  try {
    const data = await sql<LkpClockTrigger>`SELECT id, interval_duration, reference_time FROM lkp_clock_trigger where id = ${clock_id}`;

    const lkpClockTrigger = data.rows[0];
    const interval_duration = Number(lkpClockTrigger.interval_duration);
    const reference_time = lkpClockTrigger.reference_time;

    return {
      reference_time,
      interval_duration
    };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all lkpClockTrigger table.');
  }
}

export async function fetchAwardHourlyPrize(gameID: string) {
  const game_ID = gameID;
  try {
    const data = await sql<award_hourlyprize>`SELECT prizenumber, status FROM award_hourlyprize where game_id = ${game_ID}`;
    const prizeNumber = data.rows[0]?.award_hourlyprize;
    const status = data.rows[0]?.status;
    return {
      prizeNumber,
      status
    };
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all award_hourlyprize table.');
  }
}

export async function fetchAwardDailyPrize(gameID: string) {
  const game_ID = gameID;
  try {
    const data = await sql<award_dailyprize>`SELECT prizenumber, status FROM award_dailyprize where game_id = ${game_ID}`;
    const prizeNumber = data.rows[0]?.award_dailyprize;
    const status = data.rows[0]?.status;
    return {
      prizeNumber,
      status
    };
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all award_dailyprize table.');
  }
}

export async function fetchAwardHourlyPrizeProcessed(gameId: string) {
  console.log('gameId', gameId);
  const game_ID = gameId;
  try {
    const data = await sql<award_hourlyprize_processed>`
    select 
      sum(points_one) as onecount,
      sum(points_two) as twocount,
      sum(points_three) as threecount,
      sum(points_four) as fourcount,
      sum(points_five) as fivecount,
      sum(points_six) as sixcount,
      sum(points_seven) as sevencount,
      sum(points_eight) as eightcount,
      sum(points_nine) as ninecount
    from playeractivity_hourly where game_id = ${game_ID}`;

    const record = data.rows[0];
    // console.log(data.rows[0],'----',record.onecount);
    let IndividualPoints = [
      Number(data.rows[0].onecount),
      Number(data.rows[0].twocount),
      Number(data.rows[0].threecount),
      Number(data.rows[0].fourcount),
      Number(data.rows[0].fivecount),
      Number(data.rows[0].sixcount),
      Number(data.rows[0].sevencount),
      Number(data.rows[0].eightcount),
      Number(data.rows[0].ninecount)
    ];

    let prize = 0;  // This variable is the winner
    let prizenumber = IndividualPoints[0];  // This sum of point one value   

    let sameNumberValue = [0]; // if there are more poistion for the same number then we need to randomaly display amoung those position
    let j = 0;

    for (let i = 0; i < 9; ++i) {
      console.log('i :', i, IndividualPoints[i]);
      if (prizenumber > IndividualPoints[i + 1]) {
        prize = i + 1;
        prizenumber = IndividualPoints[i + 1];

        // Clear the array 
        j = j + 1;
        sameNumberValue[++j] = prizenumber;
      }
      else if (prizenumber === IndividualPoints[i + 1]) {
        // add to the array
        sameNumberValue[++j] = i + 1;
      }
    }

    // Check if the SameNumber has in multiple location (at 0th and 9th, then we need to randon this and get the number)
    console.log(`sameNumberValue.length : ${sameNumberValue}`);
    if (sameNumberValue.length > 0) {
      const luckyNumber = Math.floor(Math.random() * sameNumberValue.length) + 1; // Generates a number between 1 and 9
      if (luckyNumber > 0 && luckyNumber <= 9)
        return luckyNumber;
      else
        return prize + 1;
    }
    else {
      // Since array start from 0 we need to increase one value
      prize = prize + 1;
    }
    return prize;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all playeractivity_hourly table.');
  }
}


export async function fetchAwardDailyPrizeProcessed(gameId: string) {
  console.log('gameId', gameId);
  const game_ID = gameId;
  try {
    const data = await sql<award_dailyprize_processed>`
    select 
      sum(points_one) as onecount,
      sum(points_two) as twocount,
      sum(points_three) as threecount,
      sum(points_four) as fourcount,
      sum(points_five) as fivecount,
      sum(points_six) as sixcount,
      sum(points_seven) as sevencount,
      sum(points_eight) as eightcount,
      sum(points_nine) as ninecount
    from playeractivity_daily where game_id = ${game_ID}`;

    const record = data.rows[0];
    // console.log(data.rows[0],'----',record.onecount);
    let IndividualPoints = [
      Number(data.rows[0].onecount),
      Number(data.rows[0].twocount),
      Number(data.rows[0].threecount),
      Number(data.rows[0].fourcount),
      Number(data.rows[0].fivecount),
      Number(data.rows[0].sixcount),
      Number(data.rows[0].sevencount),
      Number(data.rows[0].eightcount),
      Number(data.rows[0].ninecount)
    ];

    let prize = 0;  // This variable is the winner
    let prizenumber = IndividualPoints[0];  // This sum of point one value    
    for (let i = 0; i < 9; ++i) {
      console.log('i :', i, IndividualPoints[i]);
      if (prizenumber > IndividualPoints[i + 1]) {
        prize = i + 1;
        prizenumber = IndividualPoints[i + 1];
      }
    }
    // Since array start from 0 we need to increase one value
    prize = prize + 1;
    return prize;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all playeractivity_daily table.');
  }
}

export async function fetchNavLink(name: string | null | undefined) {
  const user_group_type_name = name;
  try {
    const data = await sql<nav_link>`SELECT name, href FROM lkp_page_access where user_group_type_name = ${user_group_type_name}`;
    return data;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch records from user_group_type_name table.');
  }
}

// Check for the player exist before inviting.
export async function fetchInvitePresent(newPlayerEmail: string) {
  const email = newPlayerEmail;
  try {
    const data = await sql`SELECT count(*) FROM invite where invited_to = ${email}`;

    const numberOfInvite = Number(data.rows[0].count ?? '0');
    return numberOfInvite > 0 ? true : false;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch Invite table.');
  }
}

// Check for the player exist before inviting.
export async function fetchInvite() {
  try {
    const data = await sql<inviteNewPlayer>`SELECT invited_from_id, invited_to FROM invite where status = 'pending'`;
    const newPlayer = data.rows;
    return newPlayer;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch Invite table.');
  }
}

// Check for the player exist before inviting.
export async function fetchLkpSparam() {
  try {
    const data = await sql<lkpSparam>`SELECT system, key, value FROM lkp_sparam`;
    const lkpSparam = data.rows; // return multiple rows - for single row data.rows[0]
    return lkpSparam;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch lkp_sparam table.');
  }
}


export async function fetchUsers() {
  try {
    const count = await fetchLkpSparam().then((data) => {
      let bulkEmailCount = 0;
      data.forEach((element) => {
        if (element.key === 'BULKEMAIL') {
          bulkEmailCount = Number(element.value)
        }
      });
      return bulkEmailCount;
    });
    const user = await sql<User>`SELECT * FROM users WHERE invitation_sent = FALSE FETCH FIRST ${count} ROWS ONLY;`;
    return user.rows;
  } catch (error) {
    console.error('Failed to fetch users', error);
    throw new Error('Failed to fetch users.');
  }
}

export async function fetchProduct() {
  try {
    const data = await sql<productType>`SELECT * FROM product where active = true and status = 'enable'`;
    const product = data.rows; // return multiple rows - for single row data.rows[0]
    return product;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product table.');
  }
}


export async function fetchDollarConvertion() {
  try {
    const data = await sql<lkpSparam>`SELECT * FROM lkp_sparam where active = true`;
    const product = data.rows; // return multiple rows - for single row data.rows[0]
    return product;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch product table.');
  }
}

export async function fetchCountryState() {
  try {
    const data = await sql<countrystateType>`SELECT * FROM countrystate`;
    const countrystate = data.rows; // return multiple rows - for single row data.rows[0]
    return countrystate;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch countrystate table.');
  }
}

export async function fetchPlayerBank(trans_id: string) {
  try {
    const data = await sql<playerBankType>`SELECT * FROM playerbank where status = 'pending' and trans_id = ${trans_id}`;
    const countrystate = data.rows; // return multiple rows - for single row data.rows[0]
    return countrystate;
  }
  catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch countrystate table.');
  }
}