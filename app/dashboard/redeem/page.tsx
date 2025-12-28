import Image from 'next/image';
import React from 'react';
import { fetchProduct } from '@/app/lib/data';
//import pinata from '@/app/lib/pinata'; // Ensure this is the correct path to the pinata module
import { pinata } from "@/next.config";
import { productType } from '@/app/lib/definitions';
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import Link from 'next/link';
import { auth } from '@/auth';
import { fetchPlayerActivity_Daily, fetchPlayerActivity_Hourly, fetchPlayerBalance } from "@/app/lib/data";
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
import { getFooterYearRange } from '@/app/lib/utils/utils';

export default async function RedeemPage() {

    // page validation
    const [playerInfo] = await Promise.all([
        auth().then((data) => {
            const email = data?.user?.email;
            return fetchPlayerActivity_Hourly(email, null);
        })
    ]);

    // fetch the products from the product table to redeem
    const products: productType[] = await fetchProduct().then((products) => {
          // <TODO> The Below code is working and commented out since we are using images paths as full URL - instead of IPFS CID
        // if (!products) {
        //     return []; // Return an empty array if products is void
        // }
        // products.forEach((product) => {
        //     // const pinata_image_cid = await pinata.gateways.public.get(uploadFile.cid).optimizeImage({ format: "webp", quality: 80 });
        //     // console.log(`pinata_image_cid: ${pinata_image_cid}`);
        //     // const pinata_image_URL = await pinata.gateways.public.convert(uploadFile.cid);
        //     // console.log(`pinata_image_URL ${pinata_image_URL}`);
        //     product.images.startsWith('//') ? pinata.gateways.public.get(product.images).optimizeImage({ format: "webp", quality: 80 }) : product.images ;                   

        // });
        return products;
    });

    const playerBalance = await auth().then((data) => {
        const email = data?.user?.email;
        return fetchPlayerBalance(email, null);
    })


    const [playerInfo_Hourly,playerInfo_Daily] = await Promise.all([
        fetchPlayerActivity_Hourly(null,playerInfo.player_id).then((data) => {
            return data;
        }), // fetch the player info    
        fetchPlayerActivity_Daily(null,playerInfo.player_id).then((data) => {
            return data;
        }), // fetch the player info    
        // fetchhourlyPrize(),            // fetch the lock
    ]);

    const totalPoint = Number(playerBalance);
    const balance = Number(playerBalance) - Number(playerInfo_Hourly.points_one +
        playerInfo_Hourly.points_two +
        playerInfo_Hourly.points_three +
        playerInfo_Hourly.points_four +
        playerInfo_Hourly.points_five +
        playerInfo_Hourly.points_six +
        playerInfo_Hourly.points_seven +
        playerInfo_Hourly.points_eight +
        playerInfo_Hourly.points_nine +
        playerInfo_Daily.points_one +
        playerInfo_Daily.points_two +
        playerInfo_Daily.points_three +
        playerInfo_Daily.points_four +
        playerInfo_Daily.points_five +
        playerInfo_Daily.points_six +
        playerInfo_Daily.points_seven +
        playerInfo_Daily.points_eight +
        playerInfo_Daily.points_nine    
    );

    const total_points_available = Number(balance);

    // const products = [
    //     { id: 1, name: 'Product 1', description: 'Description for Product 1', points: '10000', images: '/images/background.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    //     { id: 2, name: 'Product 2', description: 'Description for Product 2', points: '20000', images: '/images/Product_1.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    //     { id: 3, name: 'Product 3', description: 'Description for Product 3', points: '30000', images: '/images/Product_2.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    //     { id: 4, name: 'Product 4', description: 'Description for Product 4', points: '40000', images: '/images/Product_3.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    //     { id: 5, name: 'Product 5', description: 'Description for Product 5', points: '50000', images: '/images/background.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    //     { id: 6, name: 'Product 6', description: 'Description for Product 6', points: '100000', images: '/images/background.png', borderWidth:'250px', borderHeight: '350px', innerWidth:'200',innerHeight:'200'},
    // ];

    return (
        <div style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>
            <div p-4>
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <h2 className="text-2xl font-bold mb-4">Points Available : {total_points_available}</h2>               
            </div>
            <div 
                className="overflow-x-auto grid gap-4 items-center" 
                style={{ 
                    maxHeight: 'calc(100vh - 200px)', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    justifyContent: 'center' 
                }}
            >
                {products.map((product) => (
                    <div key={product.id} className="border rounded shadow" style={{ width: product.borderWidth, height: product.borderHeight + 25}}>
                        <h2 className="text-xl font-semibold text-center">{product.name}</h2>
                        <p className="text-gray-600 text-center">{product.description}</p>
                        <p className="text-green-500 font-bold text-center">{product.points}</p>
                        <img
                            src={product.images}
                            alt={product.name}
                            width={Number(product.innerWidth)}
                            height={Number(product.innerHeight) - 10}
                            className="rounded mx-auto"
                        />
                        <div className="my-1"></div>
                        <div className="text-center">
                            {product.points <= total_points_available ? (
                                product.outofstock <= 0 ? (
                                    <button 
                                        className="shining-button-gray" 
                                        style={{ width: `${product.innerWidth}px` }}                                    
                                    >
                                        Out of Stock
                                    </button>
                                ) : (
                                    <Link
                                        href={{
                                            pathname: '/dashboard/redeem/redeem-form',
                                            query: { id: product.id },  
                                        }}
                                        className="shining-button"
                                        style={{ width: `${product.innerWidth}px` }}
                                    >
                                        Redeem
                                    </Link>
                                )
                            ) : (
                                <button 
                                    className="shining-button-gray" 
                                    style={{ width: `${product.innerWidth}px` }}                                    
                                >
                                    insufficient
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <footer className="mt-8 text-center text-sm text-gray-500">
                © {getFooterYearRange(2024)} 7Horse. All rights reserved.
            </footer>
        </div>        
    );
};
