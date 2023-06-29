import { Link } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import handLotion from '../assets/vid/homapage/hand-lotion.mp4';
import rainLeaves from '../assets/vid/homapage/rain-leaves.mp4';

export default function Homepage() {
  return (
    <div className='relative flex h-full w-screen flex-col justify-center px-10 '>
      <div className=' flex h-[calc(100dvh_-_64px)] w-full justify-center  self-center '>
        <video
          src={handLotion}
          loop={true}
          autoPlay={true}
          className='aspect-[1/2] h-full basis-1/2 translate-x-1 items-center justify-center object-cover'
        />
        <video
          src={rainLeaves}
          loop={true}
          autoPlay={true}
          className='aspect-[1/2] h-full  basis-1/2 -translate-x-1  items-center justify-center object-cover'
        />
      </div>
      <div className=' absolute right-1/2 top-1/2 flex -translate-y-[50%] translate-x-[50%] flex-col items-center justify-center mix-blend-exclusion'>
        <h1 className=' z-10 font-yantramanav text-[11rem] font-xxbold uppercase leading-none tracking-wide text-white  '>
          discover
        </h1>
      </div>

      <div className='absolute right-1/2 top-1/2 flex -translate-y-[50%] translate-x-[50%]'>
        <h2 className='text-white '>skincare</h2>
        <h3 className=''>your skin loves</h3>
      </div>
      {/* <Link to='/shop-all' className='text-green-400'>
        All Products
      </Link> */}
    </div>
  );
}
