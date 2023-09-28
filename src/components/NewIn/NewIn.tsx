import { Link } from 'react-router-dom';

import roseLady from '../../assets/vid/new in/lady-sniffing-roses.mp4';
import gelBg from '../../assets/bg-img/new in/red-gray-gel.jpg';
import redBlobs from '../../assets/vid/new in/red-blobs.mp4';
import redLady from '../../assets/vid/new in/lady-in-red.mp4';
import roseBg from '../../assets/bg-img/new in/rose.jpg';
const tintImageURL =
  'https://media.typology.com/storyblok/3327x3327/309b6fd67b/05_lip_oil_gamme_carrousel.jpg';
// 'https://media.typology.com/storyblok/1872x1872/2b69157428/teinte_packshot-collection_web_15ml.jpg';

const tintGif =
  'https://media.typology.com/video-storyblok/1120x1120/f58dfedd46/teinte_packshot-collection_web_15ml.gif';

export default function NewIn({ mobileMenu }: { mobileMenu: boolean }) {
  // const isPresent = useIsPresent();

  return (
    <>
      <main className="new-in no-scrollbar min-h-screen overflow-x-hidden">
        <header className="relative mb-[7vw] flex h-full flex-col items-center justify-start">
          <h1 className="right-1/2 whitespace-nowrap font-archivo text-[16.75vw] font-xxbold uppercase leading-none tracking-widest text-charcoal/90">
            lip tints
          </h1>
          <video
            src={roseLady}
            className={` ${
              mobileMenu ? 'h-[50vh]' : 'h-screen '
            } relative z-30 w-11/12 object-cover object-center portrait:md:h-[60vh]`}
            loop
            autoPlay
            muted
            playsInline
            controls={false}
          />
        </header>
        <section className="middle-section relative z-10 flex h-full w-screen flex-col items-center gap-[2vw]  p-6 pb-[8vw]">
          <img
            src={gelBg}
            className=" middle-section-bg absolute right-0 top-0 z-0 h-full w-full object-cover object-top"
            alt="abstract background"
          />
          <div className="middle-section-columns relative flex w-full basis-3/4 gap-6 pt-[20vw]">
            <div
              className={` ${
                mobileMenu ? 'w-2/4' : 'w-1/4'
              } product-image-wrapper group absolute right-1/2 top-0 z-10 h-fit  translate-x-[50%] portrait:md:w-2/5`}
            >
              <img
                src={tintImageURL}
                className={`  5xl:aspect-[10/11]" alt="lineup of tinted lip products absolute
                aspect-[3/4] w-full translate-y-[-30%] object-cover group-hover:invisible`}
              />
              <video
                src={tintGif}
                loop
                autoPlay
                muted
                playsInline
                controls={false}
                className="invisible absolute aspect-[3/4] w-full translate-y-[-30%] object-cover group-hover:visible"
              />
            </div>
            <div className="mid-left relative z-10 h-[50vh] basis-1/2 5xl:h-[40vh]">
              <video
                className={` ${
                  mobileMenu
                    ? 'aspect-[2/5]  translate-y-[15%]'
                    : 'aspect-[9/11] '
                }  w-full rounded-sm object-cover object-top 5xl:w-[70%] 5xl:translate-x-[40%] portrait:md:aspect-[2/4] portrait:md:translate-y-[14%]`}
                src={redBlobs}
                loop
                autoPlay
                muted
                playsInline
                controls={false}
              ></video>
            </div>
            <div className="mid-right relative  basis-1/2">
              <video
                className={` ${
                  mobileMenu
                    ? 'aspect-[2/5] translate-y-[15%]'
                    : ' aspect-[9/11]'
                }  w-full object-cover object-top 5xl:w-[70%] portrait:md:aspect-[2/4] portrait:md:translate-y-[14%]`}
                src={redLady}
                loop
                autoPlay
                muted
                playsInline
                controls={false}
              ></video>
              <div className="new-in absolute right-1/2 top-0 translate-x-[70%] translate-y-[-50%] whitespace-nowrap font-yantramanav text-[13vw] font-bold uppercase leading-none text-white/10">
                <p>new in</p>
                <p>new in</p>
                <p>new in</p>
              </div>
            </div>
            <div
              className={` ${
                mobileMenu ? 'bottom-11 h-[25vh]' : 'bottom-0 h-[40vh]'
              } red-banner absolute -right-6  z-20 flex  w-screen gap-12  bg-[rgba(83,1,2,.7)] px-[6vw] text-white 5xl:h-[50vh]`}
            >
              <div className="red-banner-column h-full shrink-0 grow-0 basis-1/2 py-6 pr-[4vw] 5xl:pl-64 6xl:pl-80">
                <h3
                  className={` ${
                    mobileMenu ? 'text-[1rem]' : 'text-[2vw]'
                  } mb-2  font-semibold uppercase tracking-[0.2em] 5xl:text-[1.3vw] `}
                >
                  where skincare meets color
                </h3>
                <p
                  className={` ${
                    mobileMenu ? 'w-[90svw] text-[.8rem]' : 'text-[1.1vw]'
                  } font-roboto-mono  font-thin lowercase tracking-[0.3em] 5xl:w-[90%] 5xl:text-[.8vw] portrait:md:text-[.9rem]`}
                >
                  Our tinted-care hybrids combine active ingredients like
                  hyaluronic acid with natural pigments for long-term skincare
                  benefits and immediate color payoff. All our tinted care
                  products are vegan, made in France, and suitable for each skin
                  typology.
                </p>
              </div>
              <div className="red-banner-column h-full min-w-[50%] shrink-0 grow-0 basis-1/2 "></div>
            </div>
          </div>
          <div className="middle-section-button-container flex basis-1/4 flex-col items-center justify-center">
            <Link
              to="/shop-all?filter=tint"
              // state={{ filterKey: 'tint' }}
              className={`${
                mobileMenu ? 'text-[1rem] mt-20' : 'text-[2vw]'
              } relative border-2 border-white bg-transparent px-[8vw] py-[1vw] font-grotesque  font-light text-white lg:text-[1.5vw] 2xl:text-[2vw] 5xl:text-[1.2vw] portrait:md:mt-28`}
            >
              shop now
            </Link>
          </div>
        </section>
        <section
          className={` ${
            mobileMenu ? 'h-[70svh] pt-2' : 'min-h-screen pt-4'
          } bottom-section relative z-10 flex  w-full flex-col items-center bg-white px-8 pb-12  text-[#f6fff8] `}
        >
          <h2
            className={` ${
              mobileMenu
                ? 'translate-x-[50%] text-[3.4rem] tracking-[.1rem]'
                : 'translate-x-[48.6%] text-[12vw] tracking-[1.5rem] '
            } absolute right-1/2 top-0 w-full  translate-y-[-54%] whitespace-nowrap text-center font-archivo  uppercase leading-none lg:translate-x-[51%]`}
          >
            made with
          </h2>
          <img
            className=" h-full w-full object-cover"
            src={roseBg}
            alt="close-up photo of a red rose"
          />
          <div
            className={` ${
              mobileMenu ? 'translate-y-14' : 'translate-y-[75%]'
            } bottom-text absolute top-0 w-3/5  text-white lg:w-1/2 xl:w-5/12 2xl:w-1/3`}
          >
            <h3
              className={` ${
                mobileMenu ? 'text-[1.2rem]' : 'text-[2.5vw]'
              } mb-3 font-yantramanav  uppercase tracking-widest 5xl:text-[2vw]`}
            >
              rosehip oil
            </h3>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.9rem] leading-normal'
                  : 'text-[1.4vw] tracking-[0.3rem]'
              } font-roboto-mono  font-light lowercase  lg:text-[1.2vw] 5xl:text-[1vw] portrait:text-[1rem]`}
            >
              We've infused Latin America's most legendary serum, Rosa Mosqueta,
              into a luxuriously glossy Lip Oil. Our fragrance-free lip oil
              applies sheer with a perfect hint of color, giving you a natural
              but gentle color-enhanced you.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
