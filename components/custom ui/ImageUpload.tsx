import { CldUploadWidget } from 'next-cloudinary';
import { LuPlus, LuTrash } from 'react-icons/lu';

import { Button } from '../ui/button';
import Image from 'next/image';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
}: ImageUploadProps) {
    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    };

    return (
        <div>
            <div className='mb-4 flex flex-wrap items-center gap-4'>
                {value.map((url) => (
                    <div key={url} className='relative w-[200px] h-[200px]'>
                        <div className='absolute top-0 right-0 z-10'>
                            <Button
                                onClick={() => onRemove(url)}
                                size='sm'
                                className='bg-red-1 text-white'
                            >
                                <LuTrash size={20} />
                            </Button>
                        </div>
                        <Image
                            src={url}
                            alt='Collection'
                            fill
                            className='object-cover rounded-lg'
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget uploadPreset='f4b7kjis' onSuccess={onUpload}>
                {({ open }) => {
                    return (
                        <Button
                            onClick={() => open()}
                            className='bg-gray-500 text-white'
                        >
                            <LuPlus color='white' size={20} />
                            <p className='ml-2'>Upload Image</p>
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
}
