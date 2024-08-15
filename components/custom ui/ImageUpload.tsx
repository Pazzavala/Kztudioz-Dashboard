import { useCallback, useEffect, useState, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

interface ImageUploadProps {
   value: string[];
   onChange: (value: string[]) => void;
   onRemove: (value: string) => void;
}

export default function ImageUpload({
   onChange,
   onRemove,
   value,
}: ImageUploadProps) {
   const [images, setImages] = useState<string[]>(value);
   const imagesRef = useRef<string[]>(value);

   useEffect(() => {
      setImages(value);
      imagesRef.current = value;
   }, [value]);

   const onUpload = useCallback(
      (result: any) => {
         if (result.info.secure_url) {
            const newImages = [...imagesRef.current, result.info.secure_url];
            setImages(newImages);
            imagesRef.current = newImages;
            onChange(newImages);
         } else if (Array.isArray(result.info)) {
            const newUrls = result.info.map((file: any) => file.secure_url);
            const newImages = [...imagesRef.current, ...newUrls];
            setImages(newImages);
            imagesRef.current = newImages;
            onChange(newImages);
         }
      },
      [onChange]
   );

   const handleRemove = useCallback(
      (url: string) => {
         const newImages = imagesRef.current.filter((image) => image !== url);
         setImages(newImages);
         imagesRef.current = newImages;
         onChange(newImages);
         onRemove(url);
      },
      [onChange, onRemove]
   );

   return (
      <div>
         <div className='mb-4 flex flex-wrap items-center gap-4'>
            {images.map((url) => (
               <div key={url} className='relative w-[200px] h-[200px]'>
                  <div className='absolute top-0 right-0 z-10'>
                     <Button
                        type='button'
                        onClick={() => handleRemove(url)}
                        size='sm'
                        className='bg-red-1 text-white'
                     >
                        <Trash className='h-4 w-4' />
                     </Button>
                  </div>
                  <Image
                     src={url}
                     alt='collection'
                     className='object-cover rounded-lg'
                     sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                     fill
                  />
               </div>
            ))}
         </div>

         <CldUploadWidget
            options={{ multiple: true, maxFiles: 10 }}
            uploadPreset='f4b7kjis'
            onSuccess={onUpload}
         >
            {({ open }) => {
               return (
                  <Button
                     type='button'
                     onClick={() => open()}
                     className='bg-grey-1 text-white'
                  >
                     <Plus className='h-4 w-4 mr-2' />
                     Upload Image
                  </Button>
               );
            }}
         </CldUploadWidget>
      </div>
   );
}
