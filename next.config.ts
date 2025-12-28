import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output:"standalone",
};

export default nextConfig;

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});

