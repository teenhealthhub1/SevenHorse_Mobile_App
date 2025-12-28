'use client';
// Routing cache
import { useEffect, useState, useRef}  from 'react';
import { nullable } from 'zod';

// Make this as client component to react to the client component
export { useEffect } from 'react';

// Refresh the rounting cache
// take the input as fuction and return nullor nothing;
export function RefreshCache({ check }: { check: () => Promise<void> }) {

    //------------------------------
    // tell the browser what to do 
    // useEffect(() => {
    //     const onFocus = () => check();
    //     window.addEventListener('focus', onFocus);

    //     // Kind of the distructor, call the this function when cursor going out of the scope
    //     return () => window.removeEventListener('focus', onFocus);

    // },[]);

    // the above code when we have focus so that it will update
    // Comment the 'useEffect' code and use useInterval API that will take function and what time it should calls
    //--------------------------
    // useInterval(check, 1000);

    // The setInterval function call the every 1000 second and it heavy so we want to call the interval when we are in that page
    // To do this we need to comment out the setInterval and use below pattern
    // ------------------------
    // Only run the window when the window is focused
    // create a new peace of state
    // Make sure type of document exist 
    const [shouldRun,setShouldRun] = useState(typeof document !== "undefined" && document.hasFocus());

    useEffect(() => {
        const onFocus = () => {
            check();   // To remove little delay we have added the this call
            setShouldRun(true);
        }
        const onBlur  = () => setShouldRun(false);

        // Define the window listener for onFocus and onBlur
        window.addEventListener('focus',onFocus);
        window.addEventListener('blur', onBlur);

        // When delay is larger than 2147483647 or less than 1, the delay will be set to 1. Non-integer delays are truncated to an integer.
        // If callback is not a function, a TypeError will be thrown.
        const intervalId = setInterval(() => {
            check()
        },shouldRun?1000:2147483646);

        return () => {
            window.removeEventListener('focus',onFocus);
            window.removeEventListener('blur',onBlur);
            clearInterval(intervalId);
        }
    });
    return null;
}