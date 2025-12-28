'use client';
import Image from 'next/image';
import { useState } from 'react';
export default function AnimatedGif_Daily() {
    const [selectedGif, serSelectedGif] = useState('/assets/daily.gif');
    return (<div className='relative w-full max-w-md mx-auto'>
        <Image
            src={selectedGif}
            alt='Daily Image'
            width={1000}
            height={900}
            priority
            className='rounded-lg'
        />
    </div>);
}