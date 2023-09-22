import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'

import convertMediaUrl from "../../utilities/convertMediaUrl";
import type { RenderProduct } from './ProductCarousel'
import type { ImageData } from '../../../server/database';

type ProdCarouselCardProps = {
  prod: RenderProduct;
}

type CarouselImages = {
  front: string,
  hover: string
}

export default function ProdCarouselCard({ prod }: ProdCarouselCardProps) {
  const navigate = useNavigate();
  const [images, setImages] = useState<CarouselImages | null>(null)

  useEffect(() => {
    if (!prod._id || !prod.images.length) return;

    setImages({ front: chooseFrontImage(prod.images), hover: chooseHoverImage(prod.images) })
  }, [prod._id])

  function chooseFrontImage(images: ImageData[]) {
    if (!images?.length) return '';

    return images.find(img => img.imageDesc === 'product-front')?.imageURL || images[0].imageURL
  }

  function chooseHoverImage(images: ImageData[]) {
    if (!images?.length) return '';

    return images.find(img => img.imageDesc === 'video-product')?.imageURL
      || images.find(img => img.imageDesc === 'gif-product')?.imageURL
      || images.find(img => img.imageDesc === 'product-texture')?.imageURL
      || images.find(img => img.imageDesc === 'product-alt')?.imageURL
      || images.at(-1)!.imageURL
  }

  return (
    <div
      onClick={() => {
        navigate('/product/' + prod._id);
      }}
      className='ymal-card group relative flex flex-col items-center justify-center gap-2 shrink-0 grow-0 w-[125px] xl:w-[200px] 2xl:w-[225px] cursor-pointer first:hidden last:hidden'
    >
      <div className="image-wrapper relative">
        {images?.front && (
          <picture>
            <source srcSet={convertMediaUrl(images.front)} type='image/webp' />
            <img
              // active:translate-y-[600%] group-active:duration-[10000] group-active:ease-in-out 
              className='aspect-[3/4] object-cover w-[100px] xl:w-[175px] 2xl:w-[200px] opacity-100 group-hover:opacity-0'
              src={images.front}
              height='1600'
              width='1600'
              alt={`product image: ${prod.productName}`}
            />
          </picture>)}
        {images?.hover &&
          (['jpg', 'jpeg', 'png', 'webp'].includes(images.hover.split('.').at(-1)!) ? (
            <picture>
              <source srcSet={convertMediaUrl(images.hover)} type="image/webp" />
              <img
                className='opacity-0 absolute left-0 top-0 aspect-[3/4] transform object-cover transition duration-300 group-hover:opacity-100 group-hover:ease-in-out w-[100px] xl:w-[175px] 2xl:w-[200px]'
                src={images.hover}
                height='1600'
                width='1600'
              />
            </picture>
          ) : (
            <video
              className='opacity-0 absolute left-0 top-0 aspect-[3/4] transform object-cover transition duration-300 group-hover:opacity-100 group-hover:ease-in-out w-[100px] xl:w-[175px] 2xl:w-[200px]'
              loop
              autoPlay
              muted
              playsInline
              controls={false}
            >
              <source src={convertMediaUrl(images.hover)} type='video/webm' />
              <source src={images.hover} type={images.hover.split('.').at(-1) === 'gif' ? 'image/gif' : 'video/mp4'} />
            </video>
          ))}
      </div>
      <h4 className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-grotesque text-xs uppercase lg:text-sm xl:text-lg portrait:text-[1rem]'>
        {prod.productName}
      </h4>
    </div>)
}