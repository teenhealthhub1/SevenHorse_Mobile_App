'use client';
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { v4 as uuidv4 } from "uuid";
import convertToSubcurrency from "@/app/lib/utils/convertToSubcurrency";
import { insertPlayerBank } from "@/app/lib/actions";

// Stripe.js will load on the client side
const CheckoutPage = ({ amount,player_id }: { amount: number,player_id:string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const transactionId = uuidv4();

  // As and when the amount changes, we need to create a new payment intent
  useEffect(() => {
    // Fetch the client secret from the server
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Failed to load payment intent.");
      });
  }, [amount]);

  // Create the payment when the form is submitted.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // no default form submission
    // We don't want to submit the form when the button is clicked.
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.    
      return;
    }
    setLoading(true); // Interact element in the page to show loading
    // Confirm the payment with the card Element.

    //validate check if the card details are valid    
    const { error: submitError } = await elements.submit();
    // If an error occurs, display the error message in your UI.
    if (submitError) {
      // Dont carry on the payment processing
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    
    insertPlayerBank(player_id, amount, transactionId)
    .then((response) => {
      console.log("Payment successful:", response);
    });

    // Charge the card:
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // return_url: window.location.href,
        // Create a URL on your server to handle the success
        // and failure after the payment is confirmed.
        return_url: process.env.NODE_ENV === "production"
          ? `https://www.7horse.in/dashboard/purchase/payment-success?trans_id=${transactionId}`
          : `http://www.localhost:3000/dashboard/purchase/payment-success?trans_id=${transactionId}`,
        //return_url: `http://www.localhost:3000/dashboard/purchase?payment=success&amount=${amount}`,
      },
    });
    if (error) {
      // Show error to your customer (e.g., insufficient funds)
      setErrorMessage(error.message);
    } else {        
      // The payment has been processed!      
      setErrorMessage("Payment succeeded!");
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }
    setLoading(false);

    // add spineed spinner to the button
    if (!clientSecret || !stripe || !elements) {
      return (
        <div className="flex items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      );
    }

  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {/* display error message under the control if any */}
      {errorMessage && <div>{errorMessage}</div>}
      <button
      // disable a button of there are no stripe or enterKeyHint
        disabled={!stripe || loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );

};

export default CheckoutPage;