// import { useRouter  } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { BiBody } from "react-icons/bi";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { pinata } from "@/next.config";

export const config = {
    api: {
        bodyParser: false, // Disable default bodyParser to handle FormData manually
    },
};


export async function POST(request: NextRequest) {   
    try {
        // Update the record in the database
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file || file.type !== 'image/png') {
            return NextResponse.json({ error: 'Invalid file type. Only PNG images are allowed.' }, { status: 400 });
        }

        if (file) {
            const fileBuffer = await file.arrayBuffer();
            const filePath = join(process.cwd(), 'public','images', file.name);
            await writeFile(filePath, Buffer.from(fileBuffer));
            console.log(`File saved to ${filePath}`);
            // const uploadFile = await pinata.upload.public.file(file);
            // From the Application we are upload the image to the Pinat and store the CID in the database
            // when we view the image in the browser we will use the CID to get the image from the Pinata
            // and format to webp if the number of the size or view is more in the pinata, then copy this image to the server and change the path in the database to server
            // This approach is save the cost of the pinata and also save the time to get the image from the pinata
            // View the image in the browser
            // const pinata_image_cid = await pinata.gateways.public.get(uploadFile.cid).optimizeImage({ format: "webp", quality: 80 });
            // console.log(`pinata_image_cid: ${pinata_image_cid}`);
            // const pinata_image_URL = await pinata.gateways.public.convert(uploadFile.cid);
            // console.log(`pinata_image_URL ${pinata_image_URL}`);
            
            // Log 
            console.log("Uploaded Images: ", new Date(), file);
            //console.log("Uploaded pinata_image_cid_URL: ", new Date(), pinata_image_cid_URL);            
            return NextResponse.json({ message: 'File uploaded successfully!', filePath: filePath, time: new Date() }, { status: 200 });
        } else {
            throw new Error("No file provided");
        }

    }

    catch (error) {
        console.error("Error in uploadImages route:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}