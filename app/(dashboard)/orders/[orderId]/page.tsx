import { DataTable } from '@/components/custom ui/DataTable';
import { columns } from '@/components/orderItems/OrderItemsColumns';

export default async function OrderDetails({
   params,
}: {
   params: { orderId: string };
}) {
   try {
      const res = await fetch(
         `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
      );

      if (!res.ok) {
         const errorBody = await res.text();
         console.error(
            `Error fetching order details. Status: ${res.status}. Body:`,
            errorBody
         );
         throw new Error('Unable to fetch order details');
      }

      const { orderDetails, customer } = await res.json();

      const { street, city, state, postalCode, country } =
         orderDetails.shippingAddress;

      const shippingRateMapping: { [key: string]: string } = {
         // shr_1PqJ1VKn0cNBHMkihBBCHJ0X: 'USPS First-Class Mail (1-5 days, Untracked)',
         shr_1QQcPuC1X2HSWsRLfPrdgqW0: 'USPS First-Class Mail (1-5 days, Untracked)',
         shr_1QQcT4C1X2HSWsRLqrQFZWoQ: 'USPS Priority Mail (1-3 days, Tracked)',
         // shr_1PqIy9Kn0cNBHMkiJSX1TeON: 'FedEx Ground Shipping (1-5 days, Tracked)',
      };

      const shippingType = shippingRateMapping[orderDetails.shippingRate];

      return (
         <div className='flex flex-col p-10 gap-5'>
            <p className='text-base-bold'>
               Order ID:{' '}
               {orderDetails ? (
                  <span className='text-base-medium'>{orderDetails._id}</span>
               ) : (
                  'N/A'
               )}
            </p>
            <p className='text-base-bold'>
               Customer name:{' '}
               <span className='text-base-medium'>{customer.name}</span>
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
               <span className='text-base-medium'>{shippingType}</span>
            </p>
            <DataTable
               columns={columns}
               data={orderDetails.products}
               searchKey='product'
            />
         </div>
      );
   } catch (error) {
      console.error('Error fetching order details:', error);
      return (
         <div>Error: Unable to fetch order details. Please try again later.</div>
      );
   }
}
