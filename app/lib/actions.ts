'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
// @ts-ignore
import { redirect } from 'next/navigation';
// Manual validate the type using Zod library (Typescript-First validation)
import { number, promise, z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { count, error } from 'console';
import {
  fetchAwardWinner,
  fetchhourlyPrize,
  fetchdailyPrize,
  fetchAwardHourlyPrize,
  fetchAwardDailyPrize,
  fetchAwardHourlyPrizeProcessed,
  fetchAwardDailyPrizeProcessed,
  fetchInvitePresent,
  fetchInvite,
  fetchLkpSparam,
  fetchPlayerBalance,
  fetchPlayerFreeplayBalance
} from '@/app/lib/data';
import { lkp_jackpot_award, lkpSparam } from '@/app/lib/definitions';
import { generatePassword } from '@/app/lib/utils/utils';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
// Ensure the correct path to the User module or create the module if it doesn't exist
import { User } from './definitions';
import { sendEmail } from '@/app/lib/utils/mail.utils';


export async function newRegistration(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log(`Send link to new registration email: ${formData.get('action')}`);

    if (formData.get('action') === 'new-user') {
      console.log(`New registration requested for email: ${formData.get('email')}`);
      const email = formData.get('email')?.toString().toUpperCase();
      if (!email) {
        return 'Email is required for password reset.';
      }
      // Logic to handle forget password, e.g., sending a reset link
      try {
        let inserted = false;
        try {
          // 92a23d79-bcb8-45bc-bd3e-0ee123fd7f46 -> admin user id 
          // for self registration we use the admin user id as invite
          let inserted = await fetchInvitePresent(email).then((present) => {
            if (!present) {
              sql`
              INSERT INTO invite (invited_from_id,invited_to,status)
              VALUES ('92a23d79-bcb8-45bc-bd3e-0ee123fd7f46',${email}, 'pending')
            `;
              return true; //'A link has been sent to your email. Please check within 1 to 2 hours.';
            }
            else {
              // Already present
              return false; // 'Email already present, use differently .';
            }
          });
          if (inserted) {

            return 'A link has been sent to your email. Please check within 1 to 2 hours.';
          } else {
            // Already present
            return 'Email already present, use differently .';
          }
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Insert invite.');
        }
      } catch (error) {
        console.log('Something went wrong! Retry later :', error);
        return 'Something went wrong! Retry later.';
      }
    }


  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // case 'CredentialsSignin':
        // return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    console.log(`Forget password requested for email: ${formData.get('action')}`);

    if (formData.get('action') === 'forgot-password') {
      console.log(`Forget password requested for email: ${formData.get('email')}`);
      const email = formData.get('email')?.toString().toUpperCase();
      if (!email) {
        return 'Email is required for password reset.';
      }
      // Logic to handle forget password, e.g., sending a reset link
      try {
        // Construct the email message
        const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`.then((data) => {

          const sender = {
            name: 'no-reply',
            address: 'support@7horse.in'
          };
          const player = data.rows[0];
          const emailMessage = player.email.toString().split('@')[0] + player.remarks;
          const receipients = [{
            name: player.email.split('@')[0],
            address: player.email,
          }];

          const result = sendEmail({
            sender,
            receipients,
            subject: 'Welcome to 7Horse app',
            message: `
                    <p>Password resend requested!!!</p>
                    <p>URL: <a href="http://www.7horse.in">www.7horse.in</a></p>
                    <p>USERNAME: ${player.email}</p>
                    <p>PASSWORD: ${emailMessage}</p>
                  `,
          });
          return player;  // return the first record
        });
        console.log(`Forget password requested for email: ${user.email}`);
      } catch (error) {
        console.log('Something went wrong! Retry later :', error);
        return 'Something went wrong! Retry later.';
      }
      return `Please check your inbox shortly!`;
    }
    console.log('Authenticate' + formData.values);
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.'
  }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
// This two are not part of the form data, so omit the variable
const Invoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = Invoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    // await sql`INSERT INTO invoices (customer_id, amount, status, date) value (${customerId}, ${amountInCent}, ${status}, ${date})`;
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Insert invoice.');
  }
  // 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  // const rawFormData = {
  //     customerId: formData.get('customerID'),
  //     amount: formData.get('amount'),
  //     status: formData.get('status'),
  // }

  // Test it out
  // console.log(rawFormData);

  // Check for the datatype
  // Manual validate the type using Zod library (Typescript-First validation)
  // console.log('rawFormData.amount:' + typeof rawFormData.amount);   
}

export async function updateInvoice(id: string, formData: FormData) {

  const { customerId, amount, status } = Invoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  console.log('serverActionID' + id)
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    // await sql`INSERT INTO invoices (customer_id, amount, status, date) value (${customerId}, ${amountInCent}, ${status}, ${date})`;
    await sql`
        UPDATE invoices set customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date=${date} 
        where id = ${id};     
        `;
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Update the invoice.');
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  console.log('deleteInvoice' + id);
  // throw new Error('Fail to Delete Invoice');

  try {
    await sql`
    DELETE from invoices where id = ${id};  
    `;
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Delete the invoice.');
  }
  revalidatePath('/dashboard/invoices');
}


const ProductFormSchema = z.object({
  id: z.string().min(1, { message: 'ID cannot be empty.' }),
  name: z.string().min(1, { message: 'Name cannot be empty.' }),
  description: z.string().min(1, { message: 'Description cannot be empty.' }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  points: z.coerce.number().gt(0, { message: 'Please enter points greater than $0.' }),
  status: z.enum(['disable', 'enable'], {
    invalid_type_error: 'Please select a product status.',
  }),
  images: z.string().min(1, { message: 'Images field cannot be empty.' }),
  outofstock: z.coerce.number().optional().default(0).refine(value => value >= 0, {
    message: 'Out of stock value must be a non-negative number.',   
  })
});
// This two are not part of the form data, so omit the variable
const Product = ProductFormSchema.omit({ id: true });

export type productState = {
  name?: string;
  description?: string;
  amount?: number;
  points?: number;
  status?: string;
  images?: string;
  outofstock?:number;
  errors?: {
    // id?: string[];
    name?: string[];
    description?: string[];
    amount?: string[];
    points?: string[];
    status?: string[];
    images?: string[];
    outofstock?: string[];
  message?: string | null;
  }
};

export async function createProduct(prevState: productState, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = Product.safeParse({
    // id: formData.get('id'),
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString(),
    amount: formData.get('amount'),
    points: formData.get('points'),
    status: formData.get('status')?.toString(),
    images: formData.get('images')?.toString(),
    outofstock: formData.get('outofstock')
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      name: formData.get('name')?.toString(),
      description: formData.get('description')?.toString(),
      amount: formData.get('amount'), 
      points: formData.get('points'),
      status: formData.get('status')?.toString(),
      images: formData.get('images')?.toString(),
      outofstock: formData.get('outofstock'), // Convert checkbox value to boolean
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Product.',
    };
  }

  const { name, description, amount, points, status, images, outofstock } = validatedFields.data;
  //const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  const filePath = validatedFields.data.images;

  try {
    // await sql`INSERT INTO invoices (customer_id, amount, status, date) value (${customerId}, ${amountInCent}, ${status}, ${date})`;
    await sql`
    INSERT INTO product (name, description, amount, status, points, images)
    VALUES (${name}, ${description}, ${amount}, ${status}, ${points}, ${filePath})
  `;
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Insert Product.');
  }
  // 
  revalidatePath('/dashboard/product');
  redirect('/dashboard/product');
}

export async function updateProduct(id: string, formData: FormData) {

  const { name, description, amount, points, status, images, outofstock } = Product.parse({
    id: formData.get('id')?.toString(),
    name: formData.get('name')?.toString(),
    description: formData.get('description')?.toString(),
    amount: formData.get('amount'),
    points: formData.get('points'),
    status: formData.get('status')?.toString(),
    images: formData.get('images')?.toString(),
    outofstock: formData.get('outofstock'), // Convert checkbox value to boolean
  })
  console.log('serverActionID' + id)
  const filePath = images;
  try {
    // await sql`INSERT INTO invoices (customer_id, amount, status, date) value (${customerId}, ${amountInCent}, ${status}, ${date})`;
    await sql`
        UPDATE product set name = ${name},  description = ${description}, amount = ${amount}, points = ${points}, status = ${status},  images = ${filePath}, outofstock = ${outofstock}
        where id = ${id};     
        `;
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Update the Product.');
  }

  revalidatePath('/dashboard/product');
  redirect('/dashboard/product');
}

export async function deleteProduct(id: string) {
  console.log('deleteProduct' + id);
  // throw new Error('Fail to Delete Invoice');

  try {
    // await sql`
    // DELETE from product where id = ${id};  
    // `;

    await sql`
    UPDATE product set active = false where id = ${id};  
    `;   

  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Delete the product.');
  }
  revalidatePath('/dashboard/product');
  redirect('/dashboard/product');
}



// Zod for the field validation
// State to get the value of the for
// Import: Import the useActionState hook from React.
// Call the Hook: Pass your Server Action function (myServerAction) and an initial state object (initialState) to useActionState.
// Returned Values: The hook returns three values:
// state: An object containing the latest state returned by the Server Action, or the initial state if the action hasn't been triggered yet.
// formAction: A function to use as the action attribute of your form. This function triggers your Server Action.
// isPending: A boolean indicating whether the Server Action is currently in progress.


// import { z } from 'zod';
// const userSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
//   confirmPassword: z.string().refine(
//     (value, ctx) => value === ctx.parent.password,
//     { message: 'Passwords do not match' }
//   ),
// });
// 
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const formData = req.body;
// 
//   const validationResult = userSchema.safeParse(formData);
// 
//   if (!validationResult.success) {
//     // Handle validation errors
//     return res.status(400).json({ errors: validationResult.error.flatten().fieldErrors });
//   }
//Explanation:
//refine method:
//The refine method allows you to add custom validation logic to a field. In this example, we're using it to check if the confirmPassword field matches the value of the password field.
//ctx.parent:
//Within the refine method, ctx.parent provides access to the other values in the schema object. This allows you to validate a field against the values of other fields.
//Error message:
//You can provide a custom error message that will be displayed if the validation fails.

//-------------Profile-------------------
export type ProfileState = {
  errors?: {
    player_id?: string[];
    firstName?: string[];
    middleName?: string[];
    lastName?: string[];
    email?: string[];
    phoneNum?: string[];
    address1?: string[];
    address2?: string[];
    country?: string[];
    city?: string[];
    state?: string[];
    age?: string[];
    pin?: string[];
    sex?: string[];
  };
  message?: string | null;
};

const ProfileFormSchema = z.object({
  player_id: z.string({ message: 'Player ID is required.' })
    .min(1, { message: 'Player ID cannot be empty.' }),
  firstName: z.string({ message: 'First Name is required.' })
    .min(1, { message: 'First Name cannot be empty.' }),
  middleName: z.string().optional(),
  lastName: z.string({ message: 'Last Name is required.' })
    .min(1, { message: 'Last Name cannot be empty.' }),
  // email: z.string().email({ message: 'Invalid email address.' }),
  phoneNum: z.string()
    .regex(/^\d+$/, { message: 'Phone number must be a numeric value' })
    .min(10, { message: 'Phone number must be at least 10 digits long.' })
    .transform(Number)
    .refine(value => value > 0, { message: 'Please enter a phone number greater than 0' })
    .refine(value => value !== null && value !== undefined, { message: 'Phone number cannot be empty.' }),
  address1: z.string({ message: 'Address line 1 is required.' })
    .min(1, { message: 'Address line 1 cannot be empty.' }),
  address2: z.string({ message: 'Address line 2 is required.' })
    .min(1, { message: 'Address line 2 cannot be empty.' }),
  country: z.string({ message: 'Country is required and must be a valid string.' })
    .min(1, { message: 'Country cannot be empty.' })
    .refine(value => value.toLowerCase() !== 'select a country', { message: 'Please select a valid country.' }),
  city: z.string({ message: 'City is required and must be a valid string.' })
    .min(1, { message: 'City cannot be empty.' }),
  state: z.string({ message: 'State is required and must be a valid string.' })
    .min(1, { message: 'State cannot be empty.' })
    .refine(value => value.toLowerCase() !== 'select a state', { message: 'Please select a valid country.' }),
  pin: z.string()
    .regex(/^\d+$/, { message: 'ZIP Code must be a numeric value' })
    .min(5, { message: 'ZIP Code must be at least 5 digits long.' })
    .transform(Number)
    .refine(value => value > 0, { message: 'Please enter a Valid ZIP Code' })
    .refine(value => value !== null && value !== undefined, { message: 'ZIP Code cannot be empty.' }),
  age: z.string().optional(),
  sex: z.string().optional(),
});

export async function validateProfileForm(prevState: ProfileState, formData: FormData) {

  const profile = ProfileFormSchema;

  const validatedFields = profile.safeParse({
    player_id: formData.get('player_id')?.toString(),
    firstName: formData.get('firstname'),
    middleName: formData.get('middlename'),
    lastName: formData.get('lastname'),
    phoneNum: formData.get('phoneNum'),
    address1: formData.get('address1'),
    address2: formData.get('address2'),
    country: formData.get('country'),
    city: formData.get('city'),
    state: formData.get('state'),
    email: formData.get('email')?.toString(),
    age: formData.get('age')?.toString(),
    pin: formData.get('pin')?.toString(),
    sex: formData.get('sex')?.toString()
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // Remove 'country' and 'state' from formData if needed
    // formData.set('country', '');
    // formData.set('state', '');
    console.log('validatedFields.error.flatten().fieldErrors:', validatedFields.error.flatten().fieldErrors);
    console.log('validatedFields:', formData);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update the profile.',
      formData: formData
    };
  }

  // Generate the transaction number  
  const recordId = uuidv4();
  try {
    await sql`BEGIN`;

    const userExists = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM users_details 
        WHERE users_id = ${validatedFields.data.player_id}
      )
    `.then((result) => result.rows[0].exists);

    if (!userExists) {
      // throw new Error('User ID not found in users_details table.');
      // Insert into shipmentDetail table
      await sql`
    INSERT INTO users_details (id, users_id, first_name, middle_name, last_name, address_1, address_2, phone, country, state, city, pin, age, sex)
    VALUES ( ${recordId},${validatedFields.data.player_id},${validatedFields.data.firstName}, ${validatedFields.data.middleName}, 
    ${validatedFields.data.lastName}, ${validatedFields.data.address1}, 
    ${validatedFields.data.address2}, ${validatedFields.data.phoneNum}, ${validatedFields.data.country}, ${validatedFields.data.state},
    ${validatedFields.data.city},${validatedFields.data.pin},${validatedFields.data.age},${validatedFields.data.sex})
  `;
    }
    else {
      // Update the user details in users_details table
      await sql`
        UPDATE users_details 
        SET             
            first_name = ${validatedFields.data.firstName}, 
            middle_name = ${validatedFields.data.middleName}, 
            last_name = ${validatedFields.data.lastName}, 
            phone = ${validatedFields.data.phoneNum}, 
            address_1 = ${validatedFields.data.address1}, 
            address_2 = ${validatedFields.data.address2}, 
            country = ${validatedFields.data.country}, 
            state = ${validatedFields.data.state}, 
            city = ${validatedFields.data.city}, 
            pin  = ${validatedFields.data.pin},
            age = ${validatedFields.data.age},
            sex = ${validatedFields.data.sex}
        WHERE users_id = ${validatedFields.data.player_id}
      `;
    }
    await sql`COMMIT`;
    console.log('Transaction committed successfully.');
  } catch (error) {
    await sql`ROLLBACK`;
    console.log('Transaction rolled back due to error:', error);
    throw new Error('Failed to update the profile. Please try again later.');
  }

  revalidatePath('/dashboard/profile');
  redirect('/dashboard/profile');
}


//-----------------Reedem -------------------
export type RedeemState = {
  errors?: {
    player_id?: string[];
    productId?: string[];
    total_points_available?: string[];
    productPoints?: string[];
    productName?: string[];
    productDescription?: string[];
    firstName?: string[];
    middleName?: string[];
    lastName?: string[];
    phoneNum?: string[];
    address1?: string[];
    address2?: string[];
    country?: string[];
    city?: string[];
    state?: string[];
    zipCode?: string[];
  };
  message?: string | null;
  formData?: FormData;
};

const RedeemFormSchema = z.object({
  player_id: z.string(),
  productId: z.string(),
  total_points_available: z.string(),
  productPoints: z.string(),
  productName: z.string(),
  productDescription: z.string(),

  // player_id: z.string({ message: 'Player ID is required.' })
  //   .min(1, { message: 'Player ID cannot be empty.' }),
  // productId: z.string({ message: 'Product ID is required.' })
  //   .min(1, { message: 'Product ID cannot be empty.' }),
  // total_points_available: z.string({ message: 'Total points available is required.' })
  //   .regex(/^\d+$/, { message: 'Total points available must be a numeric value' })
  //   .transform(Number)
  //   .refine(value => value > 0, { message: 'Please enter a total points available greater than 0' })
  //   .refine(value => value !== null && value !== undefined, { message: 'Total points available cannot be empty.' }),
  // productPoints: z.string({ message: 'Product points is required.' })
  //   .regex(/^\d+$/, { message: 'Product points must be a numeric value' })
  //   .transform(Number)
  //   .refine(value => value > 0, { message: 'Please enter a product points greater than 0' })
  //   .refine(value => value !== null && value !== undefined, { message: 'Product points cannot be empty.' }),
  // productName: z.string({ message: 'Product name is required.' })
  //   .min(1, { message: 'Product name cannot be empty.' }),
  // productDescription: z.string({ message: 'Product description is required.' })
  //   .min(1, { message: 'Product description cannot be empty.' }),
  firstname: z.string({ message: 'First Name is required.' })
    .min(1, { message: 'First Name cannot be empty.' }),
  middlename: z.string(),
  //{ message: 'Middle Name is required.' })
  //   .min(1, { message: 'Middle Name cannot be empty.' }),
  lastname: z.string({ message: 'Last Name is required.' })
    .min(1, { message: 'Last Name cannot be empty.' }),
  phoneNum: z.string()
    .regex(/^\d+$/, { message: 'Phone number must be a numeric value' })
    .min(10, { message: 'Phone number must be at least 10 digits long.' })
    .transform(Number)
    .refine(value => value > 0, { message: 'Please enter a phone number greater than 0' })
    .refine(value => value !== null && value !== undefined, { message: 'Phone number cannot be empty.' }),
  address1: z.string({ message: 'Address line 1 is required.' })
    .min(1, { message: 'Address line 1 cannot be empty.' }),
  address2: z.string({ message: 'Address line 2 is required.' })
    .min(1, { message: 'Address line 2 cannot be empty.' }),
  country: z.string({ message: 'Country is required and must be a valid string.' })
    .min(1, { message: 'Country cannot be empty.' })
    .refine(value => value.toLowerCase() !== 'select a country', { message: 'Please select a valid country.' }),
  city: z.string({ message: 'City is required and must be a valid string.' })
    .min(1, { message: 'City cannot be empty.' }),
  state: z.string({ message: 'State is required and must be a valid string.' })
    .min(1, { message: 'State cannot be empty.' })
    .refine(value => value.toLowerCase() !== 'select a state', { message: 'Please select a valid country.' }),
  zipCode: z.string()
    .regex(/^\d+$/, { message: 'ZIP Code must be a numeric value' })
    .min(5, { message: 'ZIP Code must be at least 5 digits long.' })
    .transform(Number)
    .refine(value => value > 0, { message: 'Please enter a Valid ZIP Code' })
    .refine(value => value !== null && value !== undefined, { message: 'ZIP Code cannot be empty.' }),
});

// .refine(schema => {
//   console.log(schema.phoneNum);
//   console.log(schema.address1);
//   console.log(schema.address2);
//   console.log(schema.city);
//   console.log(schema.state);
//   console.log(schema.pin);
//   return (true)
// },
//   {
//     message: 'Missing Fields. Failed to Redeem points.',
//     // path: ['']
//   }
// );

export async function validateRedeemForm(prevState: RedeemState, formData: FormData) {

  const redeemPts = RedeemFormSchema;

  const validatedFields = redeemPts.safeParse({
    player_id: formData.get('player_id')?.toString(),
    productId: formData.get('productId')?.toString(),
    total_points_available: formData.get('total_points_available'),
    productPoints: formData.get('productPoints'),
    productName: formData.get('productName'),
    productDescription: formData.get('productDescription'),
    product_id: formData.get('product_id'),
    track_id: formData.get('track_id'),
    firstname: formData.get('firstname'),
    middlename: formData.get('middlename'),
    lastname: formData.get('lastname'),
    phoneNum: formData.get('phoneNum'),
    address1: formData.get('address1'),
    address2: formData.get('address2'),
    country: formData.get('country'),
    city: formData.get('city'),
    state: formData.get('state'),
    zipCode: formData.get('zipCode'),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // Remove 'country' and 'state' from formData if needed
    // formData.set('country', '');
    // formData.set('state', '');
    console.log('validatedFields.error.flatten().fieldErrors:', validatedFields.error.flatten().fieldErrors);
    console.log('validatedFields:', formData);

    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Redeem points.',
      formData: formData
    };
  }
  // Update the database and send an email and notify the user
  // const { phoneNum, address1, address2, city, state, pin } = validatedFields.data;
  // console.log('phoneNum:', validatedFields.data.phoneNum);
  // console.log('address1:', address1);
  // console.log('address2:', address2);
  // console.log('city:', city);
  // console.log('state:', state);
  // console.log('pin:', pin);
  // console.log('formData:', formData);
  // console.log('validatedFields:', validatedFields);
  // console.log('validatedFields.data:', validatedFields.data);

  // Generate the transaction number
  const transactionNumber = uuidv4();
  const redeemId = uuidv4();

  // console.log('Transaction Number:', transactionNumber);  

  try {
    await sql`BEGIN`;

    // Insert into redeem table
    // Player_ID === dealer_id then it is redeem self
    await sql`
      INSERT INTO redeem (id, player_id, redeem_points,product_id,status,track_id,dealer_id)
      VALUES (${redeemId},${validatedFields.data.player_id}, 
      ${validatedFields.data.productPoints}, 
      ${validatedFields.data.player_id}, 'pending', 
      ${transactionNumber}, 
      ${validatedFields.data.player_id}) 
    `;

    // Insert into playeractivity table
    await sql`
      INSERT INTO playeractivity (player_id, total_points, trans_id)
      VALUES (${validatedFields.data.player_id}, ${-validatedFields.data.productPoints}, 200)
    `;

    // Insert into shipmentDetail table
    await sql`
      INSERT INTO shipmentdetail (track_id, redeem_id, firstname, middlename, lastname, address1, address2, phone, country, countrystate, city, zipCode, status)
      VALUES ( ${transactionNumber},${redeemId},${validatedFields.data.firstname}, ${validatedFields.data.middlename}, 
      ${validatedFields.data.lastname}, ${validatedFields.data.address1}, 
      ${validatedFields.data.address2}, ${validatedFields.data.phoneNum}, ${validatedFields.data.country}, ${validatedFields.data.state},
      ${validatedFields.data.city},${validatedFields.data.zipCode},'pending')
    `;

    await sql`COMMIT`;
    console.log('Transaction committed successfully.');
  } catch (error) {
    await sql`ROLLBACK`;
    console.log('Transaction rolled back due to error:', error);
    throw new Error('Failed to process the redeem request.');
  }

  revalidatePath('/dashboard/redeem');
  redirect('/dashboard/redeem');
}

// This two are not part of the form data, so omit the variable
// const UpdatePoints = FormSchema.omit({ id: true, date: true });
const UpdateFormSchema = z.object({
  playerId: z.string({ invalid_type_error: 'Invalid PlayerID - Please contact staff' }),
  total_points: z.coerce.number().gte(0, { message: 'total point should be greater than or equal to  0' }),
  balance: z.coerce.number().gte(0, { message: 'balance point should be greater than or equal to 0' }),
  updatePoints: z.coerce.number().gte(0, { message: 'Please enter the point greater than or equal to zero' }),
  currentPoints: z.coerce.number().gte(0, { message: 'Please enter the point greater than or equal to zero' }),
  num: z.coerce.number().gt(0, { message: 'Please enter the point greater than 0' }),
})

  .refine(schema => {
    console.log(schema.updatePoints);
    console.log(schema.currentPoints);
    console.log(schema.balance);
    console.log(schema.currentPoints + schema.balance);
    let bShowError = schema.updatePoints <= schema.currentPoints + schema.balance;
    console.log(bShowError);
    return (bShowError)
  },
    {
      message: 'Points should be less than or equal to available points',
      path: ['updatePoints']
    }
  );

export type UpdateState = {
  errors?: {
    playerId?: string[];
    total_points?: string[];
    balance?: string[];
    updatePoints?: string[];
    currentPoints?: string[];
    num?: string[];
  };
  message?: string | null;
};

export async function updatePlayerActivity_Daily(
  currentPoints: number,
  prevState: UpdateState,
  formData: FormData) {

  const updatePts = UpdateFormSchema;

  // Validate form fields using Zod
  const validatedFields = updatePts.safeParse({
    playerId: formData.get('playerId'),
    total_points: formData.get('totalPoints'),
    balance: formData.get('balance'),
    updatePoints: formData.get('updatePoints'),
    currentPoints,
    num: formData.get('number'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit points.',
      path: ['updatePoints']
    };
  }

  // Check for the lock status.
  const checkLock = await fetchdailyPrize();
  if (!checkLock.lock) {

    const { playerId, updatePoints, num } = validatedFields.data;

    switch (num) {
      case 1:
        try {
          await sql`
            UPDATE playeractivity_daily set points_one = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 2:
        try {
          await sql`
            UPDATE playeractivity_daily set points_two = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 3:
        try {
          await sql`
            UPDATE playeractivity_daily set points_three = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 4:
        try {
          await sql`
      UPDATE playeractivity_daily set points_four = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;

      case 5:
        try {
          await sql`
      UPDATE playeractivity_daily set points_five = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 6:
        try {
          await sql`
      UPDATE playeractivity_daily set points_six = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 7:
        try {
          await sql`
      UPDATE playeractivity_daily set points_seven = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 8:
        try {
          await sql`
      UPDATE playeractivity_daily set points_eight = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      case 9:
        try {
          await sql`
      UPDATE playeractivity_daily set points_nine = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_daily.');
        }
        break;
      default:
        break;
    }
  }
  revalidatePath('/dashboard/jackpotDaily');
  redirect('/dashboard/jackpotDaily');
}

export async function updatePlayerActivity_Hourly(currentPoints: number, prevState: UpdateState, formData: FormData) {

  const updatePts = UpdateFormSchema;

  // Validate form fields using Zod
  const validatedFields = updatePts.safeParse({
    playerId: formData.get('playerId'),
    total_points: formData.get('totalPoints'),
    balance: formData.get('balance'),
    updatePoints: formData.get('updatePoints'),
    currentPoints,
    num: formData.get('number'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Edit points.',
      path: ['updatePoints']
    };
  }

  // Check for the lock status.
  const checkLock = await fetchhourlyPrize();
  if (!checkLock.lock) {
    const {
      playerId,
      updatePoints,
      num
    } = validatedFields.data;

    switch (num) {
      case 1:
        try {
          console.log(`UPDATE playeractivity_hourly set points_one = ${updatePoints} where player_id = ${playerId}`);
          await sql`
            UPDATE playeractivity_hourly set points_one = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 2:
        try {
          await sql`
            UPDATE playeractivity_hourly set points_two = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 3:
        try {
          await sql`
            UPDATE playeractivity_hourly set points_three = ${updatePoints} where player_id = ${playerId};     
            `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 4:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_four = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;

      case 5:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_five = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 6:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_six = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 7:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_seven = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 8:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_eight = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      case 9:
        try {
          await sql`
      UPDATE playeractivity_hourly set points_nine = ${updatePoints} where player_id = ${playerId};     
      `;
        }
        catch (error) {
          console.log('Database Error:', error);
          throw new Error('Failed to Update the playeractivity_hourly.');
        }
        break;
      default:
        break;
    }
  }
  revalidatePath('/dashboard/jackpotHourly');
  redirect('/dashboard/jackpotHourly');
}

// This method is called from the API and insert the record into the hourlyPrize table for every hour
export async function updateHourlyPrize(prize: number) {
  try {
    const now: Date = new Date();
    // Date(2025-02-02) Time(22:34:35) (218)Seconds (Z)UTC
    // 2025-02-02T22:34:35.218Z
    // In database it is String field
    const nowISODate = now.toISOString();
    await sql`UPDATE hourlyprize SET hourly_prize_number=${prize},dt_update=${nowISODate}, lock=false`;
    await sql`INSERT INTO hourlyprize_history (dt, hourly_prize_number,dt_update)
    VALUES (${nowISODate}, ${prize}, ${nowISODate})`;
    return true;
  }
  catch (error) {
    console.log("Database error while inserting hourlyPrize table", error);
    throw new Error('Unable to update the record in the hourlyPrize table');
  }
  // revalidatePath('/dashboard/jackpotHourly');
  // redirect('/dashboard/jackpotHourly');
}

// This method is called from the API and insert the record into the hourlyPrize table for every hour
export async function insertHourlyPrizeHistory(awardPrize: number) {
  try {
    const now: Date = new Date();
    // Date(2025-02-02) Time(22:34:35) (218)Seconds (Z)UTC
    // 2025-02-02T22:34:35.218Z
    // In database it is String field
    const nowISODate = now.toISOString();
    await sql`INSERT INTO hourlyprize_history (dt, hourly_prize_number,dt_update)
        VALUES (${nowISODate}, ${awardPrize}, ${nowISODate})`;
    console.log('Award prize Insert successfully in hourlyPrize_history table');
  }
  catch (error) {
    console.log("Database error while inserting hourlyPrize_history table", error);
    throw new Error('Unable to insert the record in the hourlyPrize_history table');
  }
  // if not present insert else skip
}

export async function updateDailyPrize(prize: number) {
  try {
    const now: Date = new Date();
    const nowISODate = now.toISOString();
    await sql`UPDATE dailyprize set dt = ${nowISODate}, daily_prize_number = ${prize}, lock=false`
    await sql`INSERT INTO dailyprize_history (dt, daily_prize_number, dt_update)
    VALUES (${nowISODate}, ${prize}, ${nowISODate})`;
    console.log('Award prize UPDATE successfully in dailyPrize table');
  }
  catch (error) {
    console.log("Database error while inserting dailyPrize table", error);
    throw new Error('Unable to update the record in the dailyPrize table');
  }
}


export async function insertDailyPrizeHistory(prize: number) {
  try {
    const now: Date = new Date();
    const nowISODate = now.toISOString();
    await sql`INSERT INTO dailyprize_history (dt, daily_prize_number, dt_update)
                           VALUES (${nowISODate}, ${prize}, ${nowISODate})`;
    console.log('Award prize Insert successfully in dailyprize_history table');
  }
  catch (error) {
    console.log("Database error while inserting dailyPrize_history table", error);
    throw new Error('Unable to insert the record in the dailyPrize_history table');
  }
}

// This method is called from the API and insert the record into the hourlyPrize table for every hour
export async function updatelockHourlyPrize(hourlyPagelock: boolean) {
  const lock = hourlyPagelock;
  try {
    await sql`BEGIN`;
    const now: Date = new Date();
    // Date(2025-02-02) Time(22:34:35) (218)Seconds (Z)UTC
    // 2025-02-02T22:34:35.218Z
    // In database it is String field
    const nowISODate = now.toISOString();
    await sql`UPDATE hourlyprize SET lock=${lock},dt_update=${nowISODate}`;
    console.log('Update the lock value to false in hourlyPrize table');
    await sql`COMMIT`;
  }
  catch (error) {
    await sql`ROLLBACK`;
    console.log("Database error while updating lock value in hourlyPrize table", error);
    throw new Error('Unable to update the record in the hourlyPrize table to lock/unlock');
  }
}

// This method is called from the API and insert the record into the hourlyPrize table for every hour
export async function updatelockDailyPrize(dailyPagelock: boolean) {
  const lock = dailyPagelock;
  try {
    await sql`BEGIN`;
    const now: Date = new Date();
    // Date(2025-02-02) Time(22:34:35) (218)Seconds (Z)UTC
    // 2025-02-02T22:34:35.218Z
    // In database it is String field
    const nowISODate = now.toISOString();
    await sql`UPDATE dailyprize SET lock=${lock},dt_update=${nowISODate}`;
    console.log('Award prize Update lock successfully in DailyPrize table');
    await sql`COMMIT`;
  }
  catch (error) {
    await sql`ROLLBACK`;
    console.log("Database error while inserting hourlyPrize table", error);
    throw new Error('Unable to update the record in the dailyPrize table to lock/unlock');
  }
}

//-----------------------------------------------------------------------------------------------------
// This function clear the record for the player in the playeractivityHourly table and 
// update the winning points for the winning number.
// This method is called from the API at every one hour or Daily
//-----------------------------------------------------------------------------------------------------
export async function updatePlayerPointsHourly(awardPrize: number) {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  // Insert and update records
  // TODO possible we need to add COMMIT and ROLLBACK
  try {
    await sql`INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT 
          player_id, 
          -(points_one
              + points_two
              + points_three
              + points_four
              + points_five
              + points_six
              + points_seven
              + points_eight
              + points_nine), 
          400 FROM playeractivity_hourly where (
            points_one > 0 or 
            points_two > 0 or 
            points_three > 0 or 
            points_four > 0 or
            points_five > 0 or 
            points_six > 0 or
            points_seven > 0 or
            points_eight > 0 or 
            points_nine > 0))`;

    console.log('TRANSACTION 400 (Player points played) added to the playeractivity table ');
    console.log('Hourly Awarded Prize ', awardPrize);

    // Check the lock status in the hourlyprize table, if true then fetch the new number.
    // Insert record playeractivity
    //let awardTimes: number  = 9;  // Need to define in the database
    const awardTime = await sql<lkp_jackpot_award>`SELECT value FROM lkp_jackpot_award where game_id = 'HOURLY_PRIZE'`.then((data) => {
      return data.rows[0].value;
    });
    const awardTimes = Number(awardTime);
    console.log(`Multiply Hourly Awarded number by (${awardTimes}) times`);
    // TODO - look for code optimize
    // Update record playerActivity table for all the players with transaction as Reward (300)
    switch (awardPrize) {
      case 1:
        console.log(`Updating playeractivity for points_one`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_one + (points_one  * ${awardTimes}), 300 FROM playeractivity_hourly where points_one > 0)`;
        break;
      case 2:
        console.log(`Updating playeractivity for points_two`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_two + (points_two * ${awardTimes}), 300 FROM playeractivity_hourly where points_two > 0)`;
        break;
      case 3:
        console.log(`Updating playeractivity for points_three`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_three + (points_three * ${awardTimes}), 300 FROM playeractivity_hourly where points_three > 0)`;
        break;
      case 4:
        console.log(`Updating playeractivity for points_four`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_four + (points_four * ${awardTimes}), 300 FROM playeractivity_hourly where points_four > 0)`;
        break;
      case 5:
        console.log(`Updating playeractivity for points_five`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_five + (points_five * ${awardTimes}), 300 FROM playeractivity_hourly where points_five > 0)`;
        break;
      case 6:
        console.log(`Updating playeractivity for points_six`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_six + (points_six * ${awardTimes}), 300 FROM playeractivity_hourly where points_six > 0)`;
        break;
      case 7:
        console.log(`Updating playeractivity for points_seven`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_seven + (points_seven * ${awardTimes}), 300 FROM playeractivity_hourly where points_seven > 0)`;
        break;
      case 8:
        console.log(`Updating playeractivity for points_eight`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_eight + (points_eight * ${awardTimes}), 300 FROM playeractivity_hourly where points_eight > 0)`;
        break;
      case 9:
        console.log(`Updating playeractivity for points_nine`);
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_nine + (points_nine * ${awardTimes}), 300 FROM playeractivity_hourly where points_nine > 0)`;
        break;
      default:
        break;
    }

    // Update the playeractivity table with the played points with negative number
    ; await sql`UPDATE playeractivity_hourly SET points_one=0, points_two=0, points_three=0, points_four=0, points_five=0, points_six=0, points_seven=0, points_eight=0, points_nine=0`;
    // await updatelockHourlyPrize(false); // Release the lock

    // Update the award Prize
    ; await updateHourlyPrize(awardPrize);


    // Call the wait method for 10 seconds from the time it got locked so that
    //await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log(`------------------End of Worker for Hourly--------------`);
  }
  catch (error) {
    // Roll back 
    console.log('Database error while updating Award points value in playeractivity table', error);
    throw new Error('Database error while updating Award points value in playeractivity table');
  }
}


//-----------------------------------------------------------------------------------------------------
// This function clear the record for the player in the playeractivityDaily table and 
// update the winning points for the winning number.
// This method is called from the API at every one hour
//-----------------------------------------------------------------------------------------------------
export async function updatePlayerPointsDaily(awardPrize: number) {
  // <TODO>
  // Call the wait method for 10 seconds from the time it got locked so that
  // no update should happen after this point into the pplayeractivity_daily table
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  // Insert and update records
  // TODO possible we need to add COMMIT and ROLLBACK
  try {
    // Update the playeractivity table for player points -SUM(...) 

    await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT 
          player_id, 
          -(points_one
              + points_two
              + points_three
              + points_four
              + points_five
              + points_six
              + points_seven
              + points_eight
              + points_nine), 
          400 FROM playeractivity_daily where (
            points_one > 0 or 
            points_two > 0 or 
            points_three > 0 or 
            points_four > 0 or
            points_five > 0 or 
            points_six > 0 or
            points_seven > 0 or
            points_eight > 0 or 
            points_nine > 0))`;

    console.log('TRANSACTION PLAYED (400) for daily prize and added to the playeractivity table ');
    console.log('Awarded Prize ', awardPrize);

    // Check the lock status in the hourlyprize table, if true then fetch the new number.
    // Insert record playeractivity
    // const awardTime: number = 10;  // Need to define in the database
    // Check the lock status in the hourlyprize table, if true then fetch the new number.
    // Insert record playeractivity
    //let awardTimes: number  = 9;  // Need to define in the database
    const awardTime = await sql<lkp_jackpot_award>`SELECT value FROM lkp_jackpot_award where game_id = 'DAILY_PRIZE'`.then((data) => {
      return data.rows[0].value;
    });
    const awardTimes = Number(awardTime);
    console.log(`Multiply Daily Awarded number by (${awardTimes}) times`);

    // TODO - look for code optimize
    // Update record playerActivity table for all the players with transaction as Reward (300)
    switch (awardPrize) {
      case 1:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_one + (points_one  * ${awardTimes}), 300 FROM playeractivity_daily where points_one > 0)`;
        break;
      case 2:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_two + (points_two * ${awardTimes}), 300 FROM playeractivity_daily where points_two > 0)`;
        break;
      case 3:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_three + (points_three * ${awardTimes}), 300 FROM playeractivity_daily where points_three > 0)`;
        break;
      case 4:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_four + (points_four * ${awardTimes}), 300 FROM playeractivity_daily where points_four > 0)`;
        break;
      case 5:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_five + (points_five * ${awardTimes}), 300 FROM playeractivity_daily where points_five > 0)`;
        break;
      case 6:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_six + (points_six * ${awardTimes}), 300 FROM playeractivity_daily where points_six > 0)`;
        break;
      case 7:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_seven + (points_seven * ${awardTimes}), 300 FROM playeractivity_daily where points_seven > 0)`;
        break;
      case 8:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_eight + (points_eight * ${awardTimes}), 300 FROM playeractivity_daily where points_eight > 0)`;
        break;
      case 9:
        await sql`
        INSERT INTO playeractivity (player_id, total_points, trans_id)
        (SELECT player_id, points_nine + (points_nine * ${awardTimes}), 300 FROM playeractivity_daily where points_nine > 0)`;
        break;
      default:
        break;
    }

    // Update the playeractivity table with the played points with negative number
    await sql`UPDATE playeractivity_daily SET points_one=0, points_two=0, points_three=0, points_four=0, points_five=0, points_six=0, points_seven=0, points_eight=0, points_nine=0`;

    // Release the lock
    updateDailyPrize(awardPrize);

    // Call the wait method for 10 seconds from the time it got locked so that
    // no update should happen after this point into the pplayeractivity_hourly table
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log(`------------------End of Worker for Daily--------------`);

  }
  catch (error) {
    // Roll back 
    console.log('Database error while updating Award points value in playeractivity table', error);
    throw new Error('Database error while updating Award points value in playeractivity table');
  }
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
export async function processHourlyPrize() {

  try {
    const awardPrize = await fetchAwardHourlyPrize('HOURLY_PRIZE').then((data) => {
      console.log('data.status', data.status);
      // If status is Active we need to update the prize number else some other system have update the table
      if (data.status === 'A') {
        // Calculate the least number and then display
        const awardPrizeCalculated = fetchAwardHourlyPrizeProcessed('HOURLY_PRIZE');
        return awardPrizeCalculated;
      }
      else if (data.status === 'S') {  // System Generated Award
        // Inactive status
        console.log('System Gernated Prize ');
        const luckyNumber = Math.floor(Math.random() * 9) + 1; // Generates a number between 1 and 9
        if (luckyNumber > 0 && luckyNumber <= 9)
          return luckyNumber;
        else
          return 4; // default value and should not happen
      }
      else {
        // Outside Award number got updated 
        return data.prizeNumber;
      }
    });

    // Update the record into the database   
    ; await updatePlayerPointsHourly(awardPrize);
  }
  catch (error) {
    return false;
  }
  return true;
}

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
export async function processDailyPrize() {
  try {
    const awardPrize = await fetchAwardDailyPrize('DAILY_PRIZE').then((data) => {
      console.log('data.status', data.status);
      // If status is Active we need to update the prize number else some other system have update the table
      if (data.status === 'A') {
        // Calculate the least number and then display
        const awardPrizeCalculated = fetchAwardDailyPrizeProcessed('DAILY_PRIZE');
        return awardPrizeCalculated;
      }
      else if (data.status === 'S') {  // System Generated Award
        // Inactive status
        console.log('System Gernated Prize ');
        const luckyNumber = Math.floor(Math.random() * 9) + 1; // Generates a number between 1 and 9
        if (luckyNumber > 0 && luckyNumber <= 9)
          return luckyNumber;
        else
          return 4; // default value and should not happen
      }
      else {
        // Outside Award number got updated 
        return data.prizeNumber;
      }
    });

    // Update the record into the database   
    ; await updatePlayerPointsDaily(awardPrize);
  }
  catch (error) {
    return false;
  }
  return true;
}

const FormSchemaInvite = z.object({
  playerID: z.string(),
  emailID: z.string().email({ message: 'Invalid email address' }),
});

export type InviteState = {
  errors?: {
    playerID?: string[];
    emailID?: string[];
  };
  message?: string | null;
};

export async function createInvite(playerID: string, prevState: InviteState, formData: FormData) {

  let selfRegistration = false;
  // we are passing null value for new registration 
  if (!playerID) {
    selfRegistration = true;
    playerID = uuidv4();
    // no need to pass the player id for self registration
    console.log('placehold to playerID', playerID);
  }

  const sch = FormSchemaInvite;

  // Validate form fields using Zod
  const validatedFields = sch.safeParse({
    playerID,
    emailID: formData.get('emailID')?.toString().toUpperCase(),
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.log('Invalid email');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invite.',
    };
  }
  // const {date, emailID, playerID} = validatedFields.data.;
  const date = new Date().toISOString().split('T')[0];
  let inserted = false;
  try {
    inserted = await fetchInvitePresent(validatedFields.data.emailID).then((present) => {
      if (!present) {
        sql`
        INSERT INTO invite (invited_from_id,invited_to,status)
        VALUES (${validatedFields.data.playerID},${validatedFields.data.emailID}, 'pending')
      `;
        return true;
      }
      else {
        // Already present
        return false;
      }
    });
  }
  catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to Insert invite.');
  }

  if (!selfRegistration) {
    revalidatePath('/dashboard/profile');
  } else {
    revalidatePath('/');
  }


  if (inserted) {
    return { message: `This email ${validatedFields.data.emailID} added successfully!` };
  }
  else {
    return { message: `This email  ${validatedFields.data.emailID} already exist! please use different` };
  }
}


// This method is called from the API and insert the record into the corresponding tables. 
// Every 5 miniutes this method is called except it is not in the process of the Award calculation.
export async function uploadInvitees() {
  // const lock = hourlyPagelock;
  try {
    const now: Date = new Date();
    const currentMinutes = now.getMinutes(); // Get the current minute

    if (currentMinutes <= 10) {
      // The current time is less than 10 minutes after the hour
      console.log("It's less than 10 minutes after the hour - skip the new player update process");
      return;
    } else {
      // Check if the database is lock to update the Award process
      // Check for the lock status.
      const checkHourlyLock = await fetchhourlyPrize();
      const checkDailyLock = await fetchdailyPrize();


      if (checkHourlyLock.lock || checkDailyLock.lock) {
        console.log("It's lock to process hourly or daily award - skip the new player update process");
        return;
      }

      // fetch the payout from the lkp_sparam table for FREEPLAY
      const freeplay = await fetchLkpSparam().then((lkpSparam) => {
        return lkpSparam;
      });

      // Insert into playeractivity
      let freeplayPayoutPoints: number = 0; // Default
      let freeplayMaxoutPoints: number = 0; // Default
      freeplay.map((sparam) => {
        if (sparam.system === 'FREEPLAY' && sparam.key === 'PAYOUT') {
          freeplayPayoutPoints = Number(sparam.value);
        }
        if (sparam.system === 'FREEPLAY' && sparam.key === 'MAXOUT') {
          freeplayMaxoutPoints = Number(sparam.value);
        }
      });

      // fetch the user fromt the invite table 
      const newUserInfo = await fetchInvite().then((newPlayers) => {
        // Insert into the users table
        // Need to check await is not accept on this Promise call
        // await isn't allowed in non-async function
        const insertedUsers = Promise.all(
          newPlayers.map(async (newPlayer) => {
            const password = generatePassword();
            const userName = newPlayer.invited_to.substring(0, newPlayer.invited_to.indexOf('@'));
            const usernamePwd = userName.concat(password);

            console.log(`password****:${usernamePwd}`);
            // remarks -> userName+<12 digit Random Number>
            const hashedPassword = await bcrypt.hash(usernamePwd, 10);
            const uuid = uuidv4();
            // name -> player group (see lkp_user_group_typePLAYER/ADMINISTATOR/)

            // Insert into Users
            // by default invitation_sent field is false so that we can send the invitation through email
            try {
              await sql`
                INSERT INTO users (id,name, email, password, remarks)
                VALUES (${uuid}, 'PLAYER', ${newPlayer.invited_to}, ${hashedPassword}, ${password})
                ON CONFLICT (id) DO NOTHING;
              `;
              console.log(`Inserted new player into the users table successfully`);
            } catch (error) {
              if ((error as any).code === '23505') {
                console.log(`User with email ${newPlayer.invited_to} already exists.`);
              } else {
                throw error;
              }
            }

            // Insert into playeractivity_hourly
            try {
              await sql`
                INSERT INTO playeractivity_hourly (player_id,game_id)
                VALUES (${uuid}, 'HOURLY_PRIZE')
                ON CONFLICT (id) DO NOTHING;
              `;
              console.log(`Inserted new player into the playeractivity_hourly table successfully`);
            } catch (error) {
              if ((error as any).code === '23505') {
                console.log(`Player activity hourly for user ${uuid} already exists.`);
              } else {
                throw error;
              }
            }

            // Insert into playeractivity_daily
            try {
              await sql`
                INSERT INTO playeractivity_daily (player_id,game_id)
                VALUES (${uuid}, 'DAILY_PRIZE')
                ON CONFLICT (id) DO NOTHING;
              `;
              console.log(`Inserted new player into the playeractivity_daily table successfully`);
            } catch (error) {
              if ((error as any).code === '23505') {
                console.log(`Player activity daily for user ${uuid} already exists.`);
              } else {
                throw error;
              }
            }

            // Insert into the playeractivity table
            try {
              await sql`
                INSERT INTO playeractivity (player_id,total_points,trans_id)
                VALUES (${uuid}, ${freeplayPayoutPoints}, 500)
                ON CONFLICT (id) DO NOTHING;
              `;
              console.log(`Added freeplay to the new player into the playeractivity table successfully`);
            } catch (error) {
              if ((error as any).code === '23505') {
                console.log(`Player activity for user ${uuid} already exists.`);
              } else {
                throw error;
              }
            }

            // fetch and update the freeplay points wjo invited to the game
            await fetchPlayerFreeplayBalance(newPlayer.invited_from_id).then((data) => {
              const freeplayBalance = Number(data);
              if (freeplayBalance < freeplayMaxoutPoints) {
                // Insert the free play it has not reached the max points
                // Insert into the playeractivity table
                try {
                  sql`
                    INSERT INTO playeractivity (player_id,total_points,trans_id)
                    VALUES (${newPlayer.invited_from_id}, ${freeplayPayoutPoints}, 500)
                    ON CONFLICT (id) DO NOTHING;
                  `;
                  console.log(`Added freeplay points to the invitee player into the playeractivity table successfully`);
                } catch (error) {
                  if ((error as any).code === '23505') {
                    console.log(`Player activity for user ${newPlayer.invited_from_id} already exists.`);
                  } else {
                    throw error;
                  }
                }

                console.log(`Added freeplay points to the invitee player into the playeractivity table successfully`);
              }
            });
          }),
        );
        return newPlayers;
      });

      // Send Invitation 
      // update invite table with the status approve from pending

      // The current time is more than 10 minutes after the hour
      console.log("Updated the new player successfully!");
    }
    // Date(2025-02-02) Time(22:34:35) (218)Seconds (Z)UTC
    // 2025-02-02T22:34:35.218Z
    // In database it is String field
    // const nowISODate = now.toISOString();


  }
  catch (error) {
    console.log("Database error while updating lock value in hourlyPrize table", error);
    throw new Error('Unable to update the record in the hourlyPrize table to lock/unlock');
  }
}

// This method is called from the API and insert the record into the hourlyPrize table for every hour
export async function updateUser(email: string[]) {
  const emailid = email;
  try {
    // Your logic to update the user
    console.log('Updating user records...' + email.join(', '));
    const binvitation_sent = true;
    const query = 'UPDATE users SET invitation_sent = $1 WHERE email = ANY($2)';
    // Update the user records with invitation_sent = TRUE
    await sql.query(query, [binvitation_sent, email]);
    console.log('User records updated invitation_sent = TRUE successfully');

    const status = 'approved';
    const queryInvite = 'UPDATE invite SET status = $1 WHERE invited_to = ANY($2)';
    await sql.query(queryInvite, [status, email]);
    console.log('Invite records updated status = approved successfully');

  } catch (error) {
    console.error("Error updating users and invite ", error);
    throw new Error('Unable to update the users and invite table');
  }
  console.log('User records updated invitation_sent = TRUE successfully');
}

export async function insertPurchasePoints(player_id: string, points: number, trans_id: number) {
  try {
    // Insert into the playeractivity table
    // Transaction ID 100 - Purchase
    // Transaction ID 600 - Purchase from Cage 
    await sql`
      INSERT INTO playeractivity (player_id,total_points,trans_id)      
      VALUES (${player_id}, ${points}, ${trans_id})   
    `;
    console.log(`SUCCESS: Purchase points - [TRANS_ID:100] added to the player into the playeractivity table successfully`);
  } catch (error) {
    console.log(`ERROR: Unable to add [TRANS_ID:100] points(${points})into the player(${player_id}) playeractivity table.`);
    // Send an email to the customer and staff we are unable to add the points to you at this point
    // 7Horse team is looking into this issue and will be resolved soon and notify you
    // <TODO>
    // Need to create the email account to forward the errors message to the staff (fundstoresolve@7horse.in) to resolve
  }
}


export async function insertPlayerBank(player_id: string, amount: number, transactionId: string, status: string = 'pending') {
  try {
    // Insert into the playerBank table
    await sql`
      INSERT INTO playerbank (player_id, amount, trans_id, status)
      VALUES (${player_id}, ${amount}, ${transactionId}, ${status})     
    `;
    console.log(`SUCCESS: Purchase amount inserted into the playerbank table successfully with status: ${status}`);
  } catch (error) {
    console.log(`ERROR: Unable to add Amount(${amount}) into the player(${player_id}) playerBank table.`);
    // Send an email to the customer and staff we are unable to add the points to you at this point
    // 7Horse team is looking into this issue and will be resolved soon and notify you
    // <TODO>
    // Need to create the email account to forward the errors message to the staff (fundstoresolve@7horse.in) to resolve
  }
}

export async function insertGameWinPoints(player_id: string, game_ID: string) {
  try {

    // Get the points for the game from the lkp_game_points table
    const lkpSparam = await sql<lkpSparam>`SELECT system, key, value FROM lkp_sparam WHERE key = ${game_ID}`.then((data) => {
      if (data.rows.length > 0) {
        return data.rows[0];
      } else {
        throw new Error(`No points found for game ID: ${game_ID} in lkp_sparam table`);
      }
    });

    // get the transaction ID from the lkp_sparam table
    const trans_id = await sql`SELECT trans_id FROM lkp_trans_type WHERE trans_type = ${game_ID}`.then((data) => {
      if (data.rows.length > 0) {
        return data.rows[0].trans_id;
      } else {
        throw new Error(`No points found for game ID: ${game_ID} in lkp_sparam table`);
      }
    });

    // Insert into the playerBank table
    await sql`
      INSERT INTO playeractivity (player_id, total_points, trans_id)
      VALUES (${player_id}, ${lkpSparam.value}, ${trans_id})     
    `;
    console.log(`SUCCESS: Add game win points: ${lkpSparam.value} into the playeractivity table successfully for player: ${player_id} with game ID: ${game_ID}`);
  } catch (error) {
    console.log(`ERROR: Unable to add game win points into the player(${player_id}) playeractivity table for game ID: ${game_ID}.`, error);
    // Send an email to the customer and staff we are unable to add the points to you at this point
    // 7Horse team is looking into this issue and will be resolved soon and notify you
    // <TODO>
    // Need to create the email account to forward the errors message to the staff (fundstoresolve@7horse.in) to resolve
  }
}



