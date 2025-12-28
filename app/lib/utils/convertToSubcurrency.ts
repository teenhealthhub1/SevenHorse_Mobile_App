
// Factor 100 is used to convert dollars to cents for Stripe
// export const amountInCents = convertToSubcurrency(amount);
//     return (
//         <Elements stripe={stripePromise}>
//             <div>
//                 <h1>Purchase Page</h1>
//                 <p>Amount in cents: {amountInCents}</p>
//             </div>
//         </Elements>
//     );
// }
function convertToSubcurrency(amount: number, factor = 100) {
    return Math.round(amount * factor);
  }
  
  export default convertToSubcurrency;
  