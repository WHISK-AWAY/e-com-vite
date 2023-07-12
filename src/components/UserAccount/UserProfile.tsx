import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchSingleUser,
  resetUserState,
  selectSingleUser,
} from '../../redux/slices/userSlice';
import { useParams } from 'react-router';
import { requestLogout } from '../../redux/slices/authSlice';
import EditAccountInfo from './EditAccountInfo';
import OrderHistory from './OrderHistory';
import { useNavigate } from 'react-router';
import EditPassword from './EditPassword';
import UserAddressBook from './UserAddressBook';
import flowerBg from '../../assets/bg-vids/user_acc_flowers.mp4';

type views = 'account' | 'shipping' | 'order' | 'password';

const viewMap = {
  account: 'account info',
  shipping: 'address book',
  order: 'order history',
  password: 'update password',
};

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState<views>('account');
  const { userId } = useParams();
  const authUserId = useAppSelector((state) => state.auth.userId);
  const user = useAppSelector(selectSingleUser);

  useEffect(() => {
    // if (!authUserId) dispatch(getUserId());
    // else {
    if (userId) dispatch(fetchSingleUser(userId));
    // }
  }, [authUserId, userId]);

  function signOut() {
    dispatch(requestLogout());
    dispatch(resetUserState());
    navigate('/');
  }

  if (!user) return <h1>Loading...</h1>;
  return (
    <section className='user-profile-container relative mx-auto flex min-h-[calc(100dvh_-_64px)] w-full flex-col items-center gap-2 font-marcellus'>
      <div className='user-settings-wrapper flex h-[calc(100dvh_-_64px)] min-h-[390px] w-full items-start justify-center pb-12 text-base lg:min-h-[450px] lg:pb-16 lg:text-lg xl:min-h-[500px] xl:pb-20 xl:text-xl 2xl:min-h-[600px] 2xl:pb-24 2xl:text-[1.75rem]'>
        <div
          className={`user-profile-menu-section relative flex h-full shrink-0 grow-0 basis-2/5 flex-col items-end justify-start px-[8%] `}
        >
          <h1 className='font-italiana text-[2.5rem] uppercase lg:text-[3.25rem] xl:text-[4rem] 2xl:text-[4.75rem]'>
            <span className='absolute bottom-0 right-1 translate-y-[150%] tracking-normal text-white xl:-bottom-3'>
              hello
            </span>
            <span className='absolute -right-1 bottom-0 translate-x-[100%] translate-y-[150%] tracking-widest xl:-bottom-3'>
              {user.user.firstName}
            </span>
          </h1>
          <video
            className='lazyload absolute right-0 -z-10 h-screen min-h-[515px] w-full -translate-y-[64px] object-cover xl:min-h-[565px] 2xl:min-h-[664px]'
            data-src={flowerBg}
            data-sizes='auto'
            autoPlay={true}
            loop={true}
            muted={true}
          />
          <div className='menu-items-container mt-[5%] flex h-full w-full flex-col items-center justify-between gap-[1%] border border-white bg-[rgba(255,238,238,.33)] pb-[5%] pt-[16%] font-hubbali text-[1.7vw]'>
            <div>
              <div className='flex flex-col items-center'>
                <button
                  className={
                    '' + view === 'account' ? ' uppercase' : ' lowercase'
                  }
                  onClick={() => setView('account')}
                >
                  account info
                </button>
                {view === 'account' && (
                  <div className='w-3/5 border-b border-charcoal pt-[1%]'></div>
                )}
              </div>
              <div className='flex flex-col items-center'>
                <button
                  className={
                    '' + view === 'shipping' ? ' uppercase' : ' lowercase'
                  }
                  onClick={() => setView('shipping')}
                >
                  address book
                </button>
                {view === 'shipping' && (
                  <div className='w-3/5 border-b border-charcoal pt-[3%]'></div>
                )}
              </div>
              <div className='flex flex-col items-center'>
                <button
                  className={
                    '' + view === 'order' ? ' uppercase' : ' lowercase'
                  }
                  onClick={() => setView('order')}
                >
                  order history
                </button>
                {view === 'order' && (
                  <div className='w-3/5 border-b border-charcoal pt-[3%]'></div>
                )}
              </div>
            </div>

            <div> {userId && <button onClick={signOut}>sign out</button>}</div>
          </div>
        </div>
        <div className='user-settings-main shrink-1 flex h-full grow-0 basis-3/5 flex-col items-center justify-center pl-3 pr-7'>
          <div className='relative flex h-fit max-h-[calc(100vh_-_112px)] w-fit flex-col items-center justify-start pt-[4%] lg:max-h-[calc(100vh_-_130px)] xl:max-h-[calc(100vh_-_140px)] 2xl:max-h-[calc(100vh_-_160px)]'>
            <h2 className='w-3/4 border border-b-0 border-charcoal py-[1%] text-center font-italiana text-xl uppercase lg:text-2xl xl:text-3xl 2xl:text-[2rem]'>
              {viewMap[view]}
            </h2>
            <div
              className={`user-profile-edit-section shrink-1 no-scrollbar h-fit w-fit grow-0 overflow-auto border border-charcoal`}
            >
              <div className='h-fit w-full min-w-[40vw]'>
                {view === 'account' && <EditAccountInfo user={user.user} />}
                {view === 'password' && <EditPassword user={user.user} />}
                {view === 'shipping' && <UserAddressBook user={user.user} />}
                {view === 'order' && <OrderHistory />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /*
  from the wrapper around the rendered subcomponents:
   max-h-[calc(100vh_-_182px)] lg:max-h-[calc(100vh_-_205px)] xl:max-h-[calc(100vh_-_225px)] 2xl:max-h-[calc(100vh_-_250px)]
*/
}
