import Cart from './Cart';
import Favorite from './Favorite';
import { TCFMode } from './navbar/Navbar';



export default function CartFavWrapper({
  mode,
  setIsCartFavWrapperHidden,
}: {
  mode: TCFMode;
  setIsCartFavWrapperHidden: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <section
      // onClick={() => setIsCartFavWrapperHidden(true)}
      className='cart-container fixed right-0 top-0 z-[99] backdrop-blur-md flex h-screen w-screen flex-col overflow-hidden bg-[#35403F]/50'
    >
      <div
        // onClick={() => setIsCartFavWrapperHidden(true)}
        className='flex h-full max-w-[40vw] min-w-[35vw] 4xl:max-w-[10vw] flex-col self-end bg-white'
      >
        {mode === 'cart' ? (
          <Cart setIsHidden={setIsCartFavWrapperHidden} />
        ) : (
          <Favorite setIsHidden={setIsCartFavWrapperHidden} />
        )}
      </div>
    </section>
  );
}
