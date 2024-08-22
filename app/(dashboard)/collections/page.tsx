// 'use client';
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuPlus } from 'react-icons/lu';

// import { columns } from '@/components/collections/CollectionColumns';
// import { DataTable } from '@/components/custom ui/DataTable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/custom ui/DataTable';
import { columns } from '@/components/collections/CollectionColumns';

// export default Collections;
export default function Collections() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [collections, setCollections] = useState([]);

   const getCollections = async () => {
      try {
         const res = await fetch('/api/collections', { method: 'GET' });

         const data = await res.json();
         setCollections(data);
         setLoading(false);
      } catch (err) {
         console.log('collections_GET', err);
      }
   };

   useEffect(() => {
      getCollections();
   }, []);

   return (
      <div className='px-10 py-5'>
         <div className='flex items-center justify-between'>
            <p className='text-heading2-bold'>Collections</p>
            <Button
               className='bg-blue-1 text-white'
               onClick={() => router.push('/collections/new')}
            >
               <LuPlus size={20} />
               <p className='ml-2'>Create Collection</p>
            </Button>
         </div>
         <Separator className='bg-grey-1 my-4' />
         <DataTable columns={columns} data={collections} searchKey='title' />
      </div>
   );
}
