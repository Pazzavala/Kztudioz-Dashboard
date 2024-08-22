import { DataTable } from '@/components/custom ui/DataTable';
import { columns } from '@/components/customers/CustomerColumns';
import { Separator } from '@/components/ui/separator';
import Customer from '@/lib/models/Customer';
import { connectToDB } from '@/lib/mongoDB';
import React from 'react';

export default async function Customers() {
   await connectToDB();

   const customer = await Customer.find().sort({ createdAt: 'desc' }); // -1 also works

   return (
      <div className='px-10 py-5'>
         <p className='text-heading2-bold'>Customers</p>
         <Separator className='bg-gray-400 my-5' />
         <DataTable columns={columns} data={customer} searchKey='name' />
      </div>
   );
}
