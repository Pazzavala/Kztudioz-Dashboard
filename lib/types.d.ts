type CollectionType = {
  _id: string;
  title: string;
  description: string;
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

type OrderItemType = {
  product: ProductType;
  quantity: number;
};

type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  createdAt: string;
};
