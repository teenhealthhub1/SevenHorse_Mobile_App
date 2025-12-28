// export default function Page(){
//     return <p>DashBoard Page</p>;
// }

import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import { fetchLatestInvoices } from '@/app/lib/data';
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
// import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons';
import { getFooterYearRange } from '@/app/lib/utils/utils';

export default async function Page() {
  // const revenue = await fetchRevenue();
  // const latestInvoices = await fetchLatestInvoices();
  // const cardData = await fetchCardData();
  // const totalPaidInvoices = cardData.totalPaidInvoices;
  // const totalPendingInvoices = cardData.totalPendingInvoices;
  // const numberOfInvoices = cardData.numberOfInvoices;
  // const numberOfCustomers = cardData.numberOfCustomers;
  // const {
  //   totalPaidInvoices,
  //   totalPendingInvoices,
  //   numberOfInvoices,
  //   numberOfCustomers,
  // } = await fetchCardData();

  return (
    <main style={{ background: 'linear-gradient(to right,rgb(147, 194, 231), rgb(147, 194, 231))', padding: '20px' }}>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome to 7Horse
      </h1>
      <section className="mb-6">
        {/* <div className="Creating_A_New_Account">
          <input id="ch" type="checkbox"></input>
          <p> Testing  <label htmlFor="ch">+</label> </p>
          <div className="Creating_A_New_Account_content">
            <p> <label htmlFor="ch">-</label> Content goes here</p>
          </div>
        </div> */}
        {/*--Here input field works lile a hack. The checkbox's checked and unchecked is not showing to the user-------*/}
        <div>
          <input id="ch1" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch1">+</label> Creating A New Account </h2>

          <div className="chapter1 text-sm text-gray-700">
            <p className="mb-4" >
              {/* <label htmlFor="ch1">-</label> */}
              <strong>Step 1: Click the Sign-up Button</strong>
              <br />
              Begin by clicking the "Sign up" button on the homepage.
            </p>

            <p className="mb-4">
              <strong>Step 2: Fill Out Your Email Address</strong>
              <br />
              You will be redirected to the sign-up page. Enter your email address in the required field to receive an invitation.
            </p>

            <p className="mb-4">
              <strong>Step 3: Receive Your Invitation</strong>
              <br />
              An invitation will be sent to your email address with a pre-generated password.
            </p>
            <p>
              <strong>Step 4: Log in to Your Account</strong>
              <br />
              Your account will now be created and ready for login. Simply use the email address and pre-generated password provided in the invitation to access your account.
            </p>
            <p>
              <strong>Important Note</strong>
              <br />
              If the email address you entered is already registered, you will receive an error message. Please use a different email address or try recovering your existing account.
            </p>
          </div>
        </div>

        <div >
          <input id="ch2" type="checkbox"></input>
          <h2 className="text-lg font-semibold"> <label htmlFor="ch2">+</label> Recovering Your Password</h2>
          <div className='chapter2 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 1: Attempt to Login</strong>
              <br />
              Go to the login page and try to log in with your email address and password.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 2: Click the Forgot Password Button</strong>
              <br />
              If your login credentials are incorrect, click the "Forgot Password" button.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 3: Receive Your Password via Email</strong>
              <br />
              An email with your password should be sent to your registered email address.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 4: Check Your Email</strong>
              <br />
              Check your inbox (and spam/junk folder if necessary) for the password recovery email.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 5: Login with Your Recovered Password</strong>
              <br />
              Use the password provided in the email to log in to your account.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Troubleshooting Tip</strong>
              <br />
              If you don't receive the email or encounter issues, ensure you're using the correct email address or contact support for further assistance.
            </p>
          </div>
        </div>

        <div>
          <input id="ch3" type="checkbox"></input>
          <h2 className="text-lg font-semibold"> <label htmlFor="ch3">+</label> Your Profile</h2>
          <div className='chapter3 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 1: Access Your Profile</strong>
              <br />
              Once logged in, navigate to your profile page.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 2: Edit Your Profile</strong>
              <br />
              The "Edit Profile" button is used to set up your profile. This step is crucial for redeeming or buying points.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 3: View Your Player ID</strong>
              <br />
              On the profile page, locate your Player ID, which is displayed below the "Edit Profile" button.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 4: Scanable Player ID (QR Code)</strong>
              <br />
              Find the QR code on your profile page, which represents your scanable Player ID.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 5: Invite Friends</strong>
              <br />
              Use the "Invite Friends" functionality to invite friends (via their email) and earn points for both you and your friend.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Why Profile Setup Matters</strong>
              <br />
              Completing your profile setup is essential for a smooth experience when redeeming or buying points.
            </p>
          </div>
        </div>
        <div>
          <input id="ch4" type="checkbox"></input>
          <h2 className="text-lg font-semibold"> <label htmlFor="ch4">+</label> Editing Your Profile Details</h2>
          <div className='chapter4 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 1: Click the Edit Profile Button</strong>
              <br />
              Tap the "Edit Profile" button to begin setting up your profile.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 2: Enter Your Details</strong>
              <br />
              Fill in the required information, including:
            </p>

            <ul className="text-sm text-gray-700 mb-4 list-disc pl-5">
              <li>Name</li>
              <li>Phone number</li>
              <li>Address</li>
              <li>Other important details</li>
            </ul>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 3: Save Your Changes</strong>
              <br />
              Once you've entered your details, save your changes to complete your profile setup.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Why Accurate Details Matter</strong>
              <br />
              Entering accurate information is crucial for a smooth experience, especially when redeeming or buying points.
            </p>
          </div>
        </div>
        <div>
          <input id="ch5" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch5">+</label> Earning Points</h2>
          <div className='chapter5 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 1: Create an Account</strong>
              <br />
              Earn points by creating an account. You'll receive points as a sign-up bonus!
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 2: Invite Friends</strong>
              <br />
              Invite friends to join via email and earn points for both you and your friend.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 3: Play Minigames</strong>
              <br />
              Play minigames under the Jackpot pages (Hourly and Daily) to win points.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>Step 4: Purchase Points</strong>
              <br />
              Buy points using online or offline payment methods to add to your balance.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              <strong>What's Next?</strong>
              <br />
              Use your earned points for betting and other activities!
            </p>
          </div>
        </div>
        <div>
          <input id="ch6" type="checkbox"></input>
          <h2 className="text-lg font-semibold"> <label htmlFor="ch6">+</label>  Hourly Betting Page</h2>
          <div className='chapter6 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Overview</strong>
              <br />
              The Hourly Page allows you to bet your points every hour. Here's what you'll see:
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Page Components</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Current Points Balance: Your current points balance.</li>
                <li>Previous Winning Number: The winning number from the previous hour.</li>
                <li>Last 50 Winning Numbers: A list of the last 50 winning numbers (over the last 50 hours).</li>
                <li>Current Time: The current time.</li>
                <li>Next Winning Prize Timer: A timer counting down to the next hourly winning number.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Betting</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Betting Numbers: Choose numbers 1-9 to bet on.</li>
                <li>Place Bets: Decide how many points to bet on each number.</li>
                <li>Winning Number: Only one number will win. If your number wins, your points will be multiplied by 9.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Additional Features</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Graph: A graph displays the points you've bet on each number, making it easy to track your bets.</li>
                <li>Edit Bets: You can adjust your bets before the winning number is displayed. Be sure to save your changes before the timer runs out!</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Important Reminders</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Make sure to finalize your bets before the next winning number is displayed. If you don't, your points will be lost.</li>
                <li>Technical Issues: In case of a software glitch or bug at the time of the winning number, your points will be carried over to the next hour without any loss or gain. Your bets will automatically roll over, ensuring you don't lose any points due to technical issues.</li>
              </ul>
            </p>
          </div>
        </div>
        <div>
          <input id="ch7" type="checkbox"></input>
          <h2 className="text-lg font-semibold"> <label htmlFor="ch7">+</label> Daily Betting Page</h2>
          <div  className='chapter7 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Overview</strong>
              <br />
              The Daily Page allows you to bet your points every day. Here's what you'll see:
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Page Components</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Current Points Balance: Your current points balance.</li>
                <li>Previous Winning Number: The winning number from the previous day.</li>
                <li>Last 50 Winning Numbers: A list of the last 50 winning numbers (over the last 50 days).</li>
                <li>Current Time: The current time.</li>
                <li>Next Winning Prize Timer: A timer counting down to the next daily winning number.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Betting</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Betting Numbers: Choose numbers 1-9 to bet on.</li>
                <li>Place Bets: Decide how many points to bet on each number.</li>
                <li>Winning Number: Only one number will win. If your number wins, your points will be multiplied by 9.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Additional Features</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Graph: A graph displays the points you've bet on each number, making it easy to track your bets.</li>
                <li>Edit Bets: You can adjust your bets before the winning number is displayed. Be sure to save your changes before the timer runs out!</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Important Reminders</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Make sure to finalize your bets before the next winning number is displayed. If you don't, your points will be lost.</li>
                <li>Technical Issues: In case of a software glitch or bug at the time of the winning number, your points will be carried over to the next day without any loss or gain. Your bets will automatically roll over, ensuring you don't lose any points due to technical issues.</li>
              </ul>
            </p>
          </div>
        </div>
        <div>
          <input id="ch8" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch8">+</label>  Redeem Page</h2>
          <div className='chapter8 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Overview</strong>
              <br />
              The Redeem Page allows you to exchange your points for merchandise. Here's what you'll see:
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Page Components</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Current Points Balance: Your current points balance.</li>
                <li>Available Products: A list of products available for redemption, each with a point cost.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Redeeming a Product</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Check Availability: If you have enough points, the "Redeem" option will be visible. If not, "Insufficient" will be displayed.</li>
                <li>Product Details: View the product name, description, and point cost.</li>
                <li>Shipment Address: Fill in your shipment details in the provided form.</li>
                <li>Redeem: Tap "Redeem" to confirm your selection.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>After Redemption</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Your Current Points Balance will be updated and decreased by the points used for redemption.</li>
                <li>You'll receive an email with shipment and product details.</li>
                <li>The page will close after redemption.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Important Notes</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Make sure you have enough points to redeem a product.</li>
                <li>Ensure accurate shipment details for smooth delivery.</li>
                <li>Your points balance will update in real-time after redemption.</li>
              </ul>
            </p>
          </div>
        </div>
        <div>
          <input id="ch9" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch9">+</label> Purchase Page</h2>
          <div className='chapter9 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Overview</strong>
              <br />
              The Purchase Page allows you to buy points using various online payment methods. Here's how it works:
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Page Components</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Amount Input: Enter the amount of money you want to spend.</li>
                <li>Points Conversion: The page will show how many points you'll receive in exchange for your chosen amount.</li>
                <li>Payment Methods: Choose from various online payment options, such as:
                  <ul className="list-disc pl-5">
                    <li>Card</li>
                    <li>Amazon Pay</li>
                    <li>Cash App</li>
                    <li>etc.</li>
                  </ul>
                </li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Making a Purchase</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Enter Amount: Input the amount you want to spend.</li>
                <li>Review Points: Check how many points you'll receive.</li>
                <li>Choose Payment Method: Select your preferred payment option.</li>
                <li>Complete Purchase: Proceed with the purchase.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>After Purchase</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Your points balance will be updated with the purchased points.</li>
                <li>You'll receive confirmation of your purchase.</li>
              </ul>
            </p>
          </div>
        </div>
        <div>
          <input id="ch10" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch10">+</label>  Offline Purchase</h2>
          <div className='chapter10 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Buying Points for Cash through Dealers</strong>
              <br />
              <ul className="list-disc pl-5">
                <li><strong>Find a Dealer:</strong> Locate a participating dealer near you.</li>
                <li ><strong>Provide Player ID or QR Code:</strong> Show your Player ID or QR code (found in your profile page) to the dealer.</li>
                <li ><strong>Dealer Verifies Account:</strong> The dealer will scan the QR code or enter your Player ID to access your account.</li>
                <li ><strong>Give Cash, Get Points:</strong> Provide the dealer with cash, and they'll add the equivalent points to your account.</li>
              </ul>
              <p className="text-sm text-gray-700 mb-4"></p>
              <strong>After Purchase</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Your points balance will be updated and increased by the amount purchased.</li>
              </ul>
              <p className="text-sm text-gray-700 mb-4"></p>
              <strong>Important Notes</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Ensure you're dealing with authorized dealers.</li>
                <li>Verify the dealer's identity and authenticity before proceeding.</li>
                <li>The dealer will handle the points purchase process.</li>
              </ul>
            </p>
          </div>
        </div>
        <div>
          <input id="ch11" type="checkbox"></input>
          <h2 className="text-lg font-semibold"><label htmlFor="ch11">+</label> Offline Redemption Process</h2>
          <div className='chapter11 text-sm text-gray-700'>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Redeeming Points for Cash through Dealers</strong>
              <br />
              <ul className="list-disc pl-5">
                <li><strong>Find a Dealer:</strong> Locate a participating dealer near you.</li>
                <li><strong>Provide Player ID or QR Code:</strong> Show your Player ID or QR code (found in your profile page) to the dealer.</li>
                <li><strong>Dealer Verifies Points:</strong> The dealer will scan the QR code or enter your Player ID to view your available points.</li>
                <li><strong>Withdraw Points:</strong> Inform the dealer of the points you'd like to redeem for cash.</li>
                <li><strong>Receive Cash:</strong> The dealer will provide you with cash equivalent to the points redeemed.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>After Redemption</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Your points balance will be updated and decreased by the amount redeemed.</li>
              </ul>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <strong>Important Notes</strong>
              <br />
              <ul className="list-disc pl-5">
                <li>Ensure you're dealing with authorized dealers.</li>
                <li>Verify the dealer's identity and authenticity before proceeding.</li>
                <li>The dealer will handle the points redemption process.</li>
              </ul>
            </p>
          </div>
        </div>
      </section>
      <footer className="mt-8 text-center text-sm text-gray-500">
        © {getFooterYearRange(2024)} 7Horse. All rights reserved.
      </footer>
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="video-container">
          <h2 className="text-lg font-semibold">How to Play - Daily</h2>
            <video controls className="w-full rounded-lg shadow-lg">
            <source src="/videos/how-to-play-daily.mp4" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
        <div className="video-container">
          <h2 className="text-lg font-semibold">How to Play - Hourly</h2>
          <video controls className="w-full rounded-lg shadow-lg">
            <source src="/videos/how-to-play-hourly.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div> */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
       <Suspense fallback = {<CardSkeleton />}>
        <CardWrapper />
       </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Suspense fallback={<RevenueChartSkeleton/>}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback = {<LatestInvoicesSkeleton />}>
        <LatestInvoices />
      </Suspense>        
      </div> */}
    </main>
  );
}