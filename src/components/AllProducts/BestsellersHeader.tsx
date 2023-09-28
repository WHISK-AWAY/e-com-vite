import purpleBlob from '../../assets/vid/bestsellers/blob.mp4';

export type BestsellersHeaderProps = {
  mobileMenu: boolean;
};

export default function BestsellersHeader({
  mobileMenu,
}: BestsellersHeaderProps) {
  return (
    <>
      <section className="mb-40 w-screen portrait:w-[100svw]">
        <div className="video-wrapper  relative flex h-[calc(100vh_-_164px)] w-full items-start 4xl:w-[1500px] 5xl:w-[1900px] 6xl:w-[2600px] portrait:h-[40svh]">
          <video
            loop
            autoPlay
            muted
            playsInline
            controls={false}
            src={purpleBlob}
            className="aspect-[1/2] h-full w-full object-cover"
          />
          <h1
            className={` ${
              mobileMenu
                ? '-translate-y-[10%] text-[2.4rem] portrait:sm:text-[2.8rem]'
                : 'translate-y-[45%]'
            } absolute bottom-0 right-0 w-full  text-center font-archivo text-[8vw] font-xxbold uppercase leading-none tracking-widest text-charcoal/80 mix-blend-color-burn `}
          >
            bestsellers
          </h1>
        </div>
      </section>
    </>
  );
}
