// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import { UUID } from "crypto";

// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  remarks: string;  
  dt_update: Date;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type ProductForm = {
  id: string;
  name: string;
  description: string;
  points: number;
  amount: number;
  status: 'enable' | 'disable';
  images: string; // This is the filename of the product image
  outofstock: number; // This is the number of products out of stock
};

// Player Activity table for the 
export type PlayerActivity = {
  player_id: string;
  game_id: string;
  points_one: number;
  points_two: number;
  points_three: number;
  points_four: number;
  points_five: number;
  points_six: number;
  points_seven: number;
  points_eight: number;
  points_nine: number;
  dt_update: Date;
};

export type UsersDetails = {
  users_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  country: string;
  city: string;
  state: string;
  pin: number;
  age: number;
  sex: string;
};


export type HourlyPrize = {
  dt: Date;
  hourly_prize_number: number;
  dt_update: Date;
  lock: boolean;
};

export type DailyPrize = {
  dt: Date;
  daily_prize_number: number;
  dt_update: Date
  lock: boolean;
};

// There are more field for now I have using only these three field
// <TODO> Schema check is not done - need to perform using ZOD library
export type LkpClockTrigger = {
  id: string;
  interval_duration: number;
  reference_time: string;
  dt_update: Date
};


export type lkp_jackpot_award = {
  value: string;
}


export type award_hourlyprize = {
  award_hourlyprize: number;
  status: string;
};

export type award_dailyprize = {
  award_dailyprize: number;
  status: string;
};

export type nav_link = {
  name: string;
  href: string;
};

export type inviteNewPlayer = {
  invited_from_id: string; // Player id who invited
  invited_to: string;     // email
};

export type lkpSparam = {
  system: string; 
  key: string; 
  value: string; // make sure you have integer or string based upon the needs
};

export type productType = {
  id: string;
  name: string;
  description: string;
  points: number;
  images: string, 
  borderWidth: string;
  borderHeight: string;
  innerWidth:string;
  innerHeight:string;
  dt: Date;
  status: string; // enable or disable
  dt_update: Date;
  active: boolean; // true = show or false = hide
  remarks: string;  
  outofstock: number; // This is the number of products out of stock
};

export type countrystateType = {
  id: string;
  country: string;
  description: string;
}

export type playerBankType = {
  id: string;
  player_id: string;
  amount: number;
  dt: Date;
  transaction_id: string;
  status: string; // approved or rejected
}


//dulplicate of User
// export type lkpUsers = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
//   remarks: string;
//   dt_update: Date;
// };


export type award_hourlyprize_processed = {
  onecount: number;
  twocount: number;
  threecount: number;
  fourcount: number;
  fivecount: number;
  sixcount: number;
  sevencount: number;
  eightcount: number;
  ninecount: number;
};

export type award_dailyprize_processed = {
  onecount: number;
  twocount: number;
  threecount: number;
  fourcount: number;
  fivecount: number;
  sixcount: number;
  sevencount: number;
  eightcount: number;
  ninecount: number;
};

export type productTable = {
  id: string;  
  name: string;
  description: string;
  points: number;
  amount: number;
  images: string;
  status: 'enable' | 'disable';
  outofstock: number; // This is the number of products out of stock
};