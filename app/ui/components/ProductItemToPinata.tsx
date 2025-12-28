"use client";
import { useRef, useState } from 'react';
import { Button } from '@/app/ui/button';

const ProductItemToPinata = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        disabled={isUploading}
        className="absolute right-[9999px]"
        onChange={async (e) => {
          const file = e.target.files?.[0] as File;
          if (file) {
            // Handle file upload logic here
            console.log('File selected-1:', file);
          }
          setIsUploading(true);
          const data = new FormData();
          data.set("file", file);
          // Create the route handler and upload the file to the server
          const uploadRequest = await fetch('/api/uploadImagesToPinata', {
            method: 'POST',
            body: data,
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('File upload failed');
              }
              return response.json();
            }
            )
            .then(data => {
              console.log('File uploaded successfully:', data);
              setIsUploading(false);
              // document.getElementById('images')?.setAttribute('value', `/images/${file.name}`);
              document.getElementById('images')?.setAttribute('value', data.filePath);
            }
            )
            .catch(error => {
              console.error('Error during file upload:', error);
              setIsUploading(false);
            }
            );
        }}
      />
      <Button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={isUploading}
        onClick={() => {
          // Handle file upload logic here
          fileInputRef.current?.click();
        }}
      >
        {isUploading ? 'Uploading...' : 'Upload Image to Pinata'}
      </Button>
    </div>
  );
}
export default ProductItemToPinata;

