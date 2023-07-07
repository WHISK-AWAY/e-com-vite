import purpleBlob from '../../assets/vid/bestsellers/blob.mp4'
import 'lazysizes';

export type BestsellersHeaderProps = {};

export default function BestsellersHeader({}: BestsellersHeaderProps) {
  return (
    <>
      <section className='mb-40 w-screen '>
        <div className='video-wrapper  relative flex h-[calc(100vh_-_164px)] w-full items-start 4xl:w-[1500px] 5xl:w-[1900px] 6xl:w-[2600px]'>
          <video
            muted={true}
            autoPlay={true}
            loop={true}
            data-src={purpleBlob}
            data-sizes='auto'
            className='lazyload aspect-[1/2] h-full w-full object-cover'
          />
          <h1 className='absolute bottom-0 right-0 w-full translate-y-[45%] text-center font-archivo text-[8vw] font-xxbold uppercase leading-none tracking-widest text-charcoal/80 mix-blend-color-burn '>
            bestsellers
          </h1>
        </div>
      </section>
    </>
  );
}
