import purpleBlob from '../../assets/vid/bestsellers/blob.mp4'

export type BestsellersHeaderProps = {};

export default function BestsellersHeader({}: BestsellersHeaderProps) {
  return (
    <>
      <section className='mb-40 w-screen '>
        <div className='video-wrapper  relative flex h-[calc(100vh_-_164px)] w-full items-start min-[1600px]:w-[2500px] '>
          <video
            muted={true}
            autoPlay={true}
            loop={true}
            src={purpleBlob}
            className='aspect-[1/2] h-full w-full object-cover'
          />
          <h1 className='absolute bottom-0 right-0 w-full translate-y-[45%] text-center font-archivo text-[8vw] font-xxbold uppercase leading-none tracking-widest text-charcoal/80 mix-blend-color-burn '>
            bestsellers
          </h1>
        </div>
      </section>
    </>
  );
}
