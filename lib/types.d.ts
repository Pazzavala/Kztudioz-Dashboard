type CollectionType = {
   _id: string;
   title: string;
   media: [string];
   products: ProductType[];
};

type ProductType = {
   _id: string;
   title: string;
   description: string;
   media: [string];
   collections: [CollectionType];
   tags: [string];
   price: number;
   expense: number;
   createdAt: Date;
   UpdatedAt: Date;
};
