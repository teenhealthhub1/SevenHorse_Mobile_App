'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function AnimatedGif_Hourly() {
    const [selectedGif, serSelectedGif] = useState('/assets/hourly.gif');
    return (
        <div className="p-10 space-y-4">
            <h1></h1>
            <div className='relative w-full max-w-md mx-auto'>
                <Image
                    src={selectedGif}
                    alt='Hourly Image'
                    width={1000}
                    height={900}
                    priority
                    className='rounded-lg'
                />
            </div>
        </div>
    );
}