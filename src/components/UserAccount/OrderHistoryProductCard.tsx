export type OrderHistoryProductCardProps = {
  product: {
    productId: string;
    productName: string;
    productShortDesc: string;
    imageURL: string;
    price: number;
    qty: number;
  };
};

export default function OrderHistoryProductCard({
  product,
}: OrderHistoryProductCardProps) {
  return (
    <div className='order-history-product-card flex justify-center gap-5 border border-charcoal'>
      <div className='image-container basis-1/5'>
        <img
          className='aspect-[3/4] w-full'
          src={product.imageURL}
          alt='product image'
        />
      </div>
      <div className='info-container flex basis-4/5 flex-col items-start'>
        <h4>{product.productName}</h4>
        <div>{`$${product.price.toFixed(2)}/ea x ${product.qty}: $${(
          product.price * product.qty
        ).toFixed(2)}`}</div>
      </div>
    </div>
  );
}
