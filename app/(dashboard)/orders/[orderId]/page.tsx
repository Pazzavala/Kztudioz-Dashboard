import { DataTable } from '@/components/custom ui/DataTable';
import { columns } from '@/components/orderItems/OrderItemsColumns';

export default async function OrderDetails({
   params,
}: {
   params: { orderId: string };
}) {
   const res = await fetch(
      `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
   );

   if (!res.ok) {
      const errorBody = await res.text();
      console.error(
         `Error fetching order details. Status: ${res.status}. Body:`,
         errorBody
      );
      return (
         <div>Error: Unable to fetch order details. Please try again later.</div>
      );
   }

   const { orderDetails, customer } = await res.json();

   const { street, city, state, postalCode, country } = orderDetails.shippingAddress;

   return (
      <div className='flex flex-col p-10 gap-5'>
         <p className='text-base-bold'>
            Order ID: <span className='text-base-medium'>{orderDetails._id}</span>
         </p>
         <p className='text-base-bold'>
            Customer name: <span className='text-base-medium'>{customer.name}</span>
         </p>
         <p className='text-base-bold'>
            Shipping address:{' '}
            <span className='text-base-medium'>
               {street}, {city}, {state}, {postalCode}, {country}
            </span>
         </p>
         <p className='text-base-bold'>
            Total Paid:{' '}
            <span className='text-base-medium'>${orderDetails.totalAmount}</span>
         </p>
         <p className='text-base-bold'>
            Shipping rate ID:{' '}
            <span className='text-base-medium'>{orderDetails.shippingRate}</span>
         </p>
         <DataTable
            columns={columns}
            data={orderDetails.products}
            searchKey='product'
         />
      </div>
   );
}
