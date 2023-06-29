import purpleClouds from '../../assets/vid/bestsellers/Purple blobs 10mb 480p.mp4';

export type BestsellersHeaderProps = {};

export default function BestsellersHeader({}: BestsellersHeaderProps) {
  return (
    <>
      <section className='mb-40 w-full'>
        <div className='video-wrapper relative flex h-[calc(100vh_-_164px)] w-full items-start'>
          <video
            muted={true}
            autoPlay={true}
            loop={true}
            src={purpleClouds}
            className='h-full w-full object-cover'
          />
          <h1 className='absolute bottom-0 w-full translate-y-[50%] text-center font-archivo text-6xl font-xxbold uppercase leading-none tracking-widest text-charcoal/80 mix-blend-color-burn lg:text-8xl 2xl:text-9xl'>
            bestsellers
          </h1>
        </div>
      </section>
    </>
  );
}
