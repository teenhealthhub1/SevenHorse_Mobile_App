'use client';
import Image from 'next/image';
import { useState } from 'react';
import QRCode from 'qrcode';

// Functiion take player_id from the playeractivity table
const QRCodeGenerator = ({ playerID }: { playerID: string }) => {

    const [playerid, setPlayerID] = useState<string>(playerID);
    // Ensure player_id is string before generating the QR code
    QRCode.toDataURL(playerID).then(setPlayerID);

    return (

        <div className='relative w-full max-w-md mx-auto'>
            <img
                src={playerid}
                alt='Something went wrong!'
                width={500}
                height={400}
            />
        </div>

    );


};

export default QRCodeGenerator;