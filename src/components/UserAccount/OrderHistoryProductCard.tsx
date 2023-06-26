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
    <div className='order-history-product-card flex w-full justify-center gap-5'>
      <div className='image-container basis-1/5'>
        <img
          className='aspect-[3/4] w-full border border-charcoal'
          src={product.imageURL}
          alt='product image'
        />
      </div>
      <div className='info-container flex basis-4/5 flex-col items-center justify-center gap-4'>
        <h4 className='font-semibold'>{product.productName}</h4>
        <div>
          {`$${product.price.toFixed(2)}/ea x ${product.qty}: `}
          <span className='font-semibold'>
            ${(product.price * product.qty).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
