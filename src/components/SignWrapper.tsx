import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { useState } from "react"
import x from '../assets/icons/x.svg'
import whiteX from '../assets/icons/whiteX.svg'


export type TMode = 'sign-in' | 'sign-up'

export default function SignWrapper({setIsSignFormHidden} :
  {setIsSignFormHidden: React.Dispatch<React.SetStateAction<boolean>>}
) {
  const [mode, setMode] = useState<TMode>('sign-in');

  return (
    <section className='form-container fixed right-0 top-0 z-40 flex h-[100vh] w-[100vw] flex-col overflow-hidden bg-[#35403F]/50'>
      <div className='relative flex h-full w-[35vw] flex-col self-end bg-white 2xl:max-w-[23vw]  '>
        <div
          onClick={() => setIsSignFormHidden(true)}
          className='absolute  right-5 top-5 z-50 h-10 w-3'
        >
          {mode === 'sign-in' ? (
            <img src={x} alt='x-icon' className=' w-1 lg:w-2 ' />
          ) : (
            <img src={whiteX} alt='x-icon' className=' w-1 lg:w-2 ' />
          )}
        </div>
        {mode === 'sign-in' ? (
          <SignIn mode={mode} setMode={setMode} />
        ) : (
          <SignUp
            mode={mode}
            setMode={setMode}
            setIsSignFormHidden={setIsSignFormHidden}
          />
        )}
      </div>
    </section>
  );
}
