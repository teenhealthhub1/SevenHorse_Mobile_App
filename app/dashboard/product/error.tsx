'use client';

import { useEffect } from "react";
import { getFooterYearRange } from '@/app/lib/utils/utils';

export default function Error(
    {
        error,
        reset,
    }:{
        error: Error & {digest?: string},
        reset: () => void;
    }
){

    useEffect(() => {
        // Optinal log the error to an error reporting serves
        console.log(error);
    }, [error]
    );

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className="text=center">Something Went Wrong</h2>
            <button 
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            onClick={() => reset()}>
                Try again !
            </button>
               <footer className="mt-8 text-center text-sm text-gray-500">
                    © {getFooterYearRange(2024)} 7Horse. All rights reserved.
                  </footer>
        </main>
    );

}