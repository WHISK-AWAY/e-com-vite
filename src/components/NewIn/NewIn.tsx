import { Link } from 'react-router-dom';
import 'lazysizes'

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

export default function NewIn() {
  return (
    <main className='new-in no-scrollbar min-h-screen overflow-x-hidden'>
      <header className='relative mb-[7vw] flex h-full flex-col items-center justify-start'>
        <h1 className='right-1/2 whitespace-nowrap font-archivo text-[16.75vw] font-xxbold uppercase leading-none tracking-widest text-charcoal/90'>
          lip tints
        </h1>
        <video
          data-src={roseLady}
          className='lazyload relative z-30 h-screen w-11/12 object-cover object-center'
          muted={true}
          autoPlay={true}
          loop={true}
        />
      </header>
      <section className='middle-section relative z-10 flex h-full w-screen flex-col items-center gap-[2vw] p-6 pb-[8vw]'>
        <img
          data-src={gelBg}
          data-sizes='auto'
          className='lazyload middle-section-bg absolute right-0 top-0 z-0 h-full w-full object-cover object-top'
          alt='abstract background'
        />
        <div className='middle-section-columns relative flex w-full basis-3/4 gap-6 pt-[18vw]'>
          <div className='product-image-wrapper group absolute right-1/2 top-0 z-10 h-fit w-1/4 translate-x-[50%]'>
            <img
              data-src={tintImageURL}
              data-sizes='auto'
              className='lazyload absolute aspect-[3/4] w-full translate-y-[-30%] object-cover group-hover:invisible'
              alt='lineup of tinted lip products'
            />
            <video
              data-src={tintGif}
              data-sizes='auto'
              muted={true}
              autoPlay={true}
              loop={true}
              className='lazyload invisible absolute aspect-[3/4] w-full translate-y-[-30%] object-cover group-hover:visible'
            />
          </div>
          <div className='mid-left relative z-10 min-h-[70vh] basis-1/2'>
            <video
              className='lazyload aspect-[1/2] w-full rounded-sm object-cover object-top'
              data-src={redBlobs}
              data-sizes='auto'
              muted={true}
              autoPlay={true}
              loop={true}
            ></video>
          </div>
          <div className='mid-right relative z-10 basis-1/2'>
            <video
              className='lazyload aspect-[1/2] w-full object-cover object-top'
              data-src={redLady}
              data-sizes='auto'
              muted={true}
              autoPlay={true}
              loop={true}
            ></video>
            <div className='new-in absolute right-1/2 top-0 translate-x-[70%] translate-y-[-50%] whitespace-nowrap font-yantramanav text-[13vw] font-bold uppercase leading-none text-white/20'>
              <p>new in</p>
              <p>new in</p>
              <p>new in</p>
            </div>
          </div>
          <div className='red-banner absolute -right-6 bottom-12 z-20 flex h-fit w-screen gap-12 bg-[rgba(83,1,2,.7)] px-[6vw] text-white'>
            <div className='red-banner-column h-full shrink-0 grow-0 basis-1/2 py-6 pr-[4vw]'>
              <h3 className='mb-2 text-[2.5vw] font-semibold uppercase tracking-[0.2em]'>
                where skincare meets color
              </h3>
              <p className='font-roboto-mono text-[1.5vw] font-thin lowercase tracking-[0.3em]'>
                Our tinted-care hybrids combine active ingredients like
                hyaluronic acid with natural pigments for long-term skincare
                benefits and immediate color payoff. All our tinted care
                products are vegan, made in France, and suitable for each skin
                typology.
              </p>
            </div>
            <div className='red-banner-column h-full min-w-[50%] shrink-0 grow-0 basis-1/2 '></div>
          </div>
        </div>
        <div className='middle-section-button-container flex basis-1/4 flex-col items-center justify-center'>
          <Link
            to='/shop-all'
            state={{ filterKey: 'tint' }}
            className='relative border-2 border-white bg-transparent px-[9vw] py-[1.4vw] font-raleway text-[2.5vw] font-light text-white'
          >
            shop now
          </Link>
        </div>
      </section>
      <section className='bottom-section relative z-10 flex min-h-screen w-full flex-col items-center bg-white px-8 pb-12 pt-4 text-white'>
        <h2 className='absolute right-1/2 top-0 w-full translate-x-[51%] translate-y-[-54%] whitespace-nowrap text-center font-archivo text-[12vw] uppercase leading-none tracking-[1.5rem]'>
          made with
        </h2>
        <img
          className='lazyload h-full w-full object-cover'
          data-src={roseBg}
          data-sizes='auto'
          alt='close-up photo of a red rose'
        />
        <div className='bottom-text absolute top-0 w-3/5 translate-y-[75%] text-white lg:w-1/2 xl:w-5/12 2xl:w-1/3'>
          <h3 className='mb-3 font-yantramanav text-[2.5vw] uppercase tracking-widest'>
            rosehip oil
          </h3>
          <p className='font-roboto-mono text-[1.75vw] font-light lowercase tracking-[0.3rem]'>
            We've infused Latin America's most legendary serum, Rosa Mosqueta,
            into a luxuriously glossy Lip Oil. Our fragrance-free lip oil
            applies sheer with a perfect hint of color, giving you a natural but
            gentle color-enhanced you.
          </p>
        </div>
      </section>
    </main>
  );
}
