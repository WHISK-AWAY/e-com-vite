// import { useAccountInfo } from '../utilities/convertKitAccInfo';
// import { useSubscribers } from '../utilities/subscribers';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubscribe } from '../utilities/subscribe';
import { useEffect } from 'react';
// import 'lazysizes'

type FormData = {
  email: string;
};

const ZFormData = z.object({
  email: z.string().email({ message: 'please enter a valid e-mail address' }),
});

export default function Footer({ mobileMenu }: { mobileMenu: boolean }) {
  const FORM_ID = '5294841';
  const { mutate } = useSubscribe(FORM_ID);
  const defaultValues: FormData = {
    email: '',
  };

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(ZFormData),
    defaultValues,
  });

  useEffect(() => {
    for (let key in errors) {
      if (key === 'email') setValue('email', '');
    }
  }, [errors.email]);

  const handleSubscribe = async (email: FormData) => {
    await mutate(email);

    // console.log('emaiol', email)
    if (dirtyFields.email) {
      reset({
        email: 'thank you',
      });
    }
  };

  return (
    <section
      className={` ${
        mobileMenu ? 'h-[25vh] portrait:xs:h-[20vh]' : 'h-[250px]'
      } footer-section max-w-screen flex  bg-primary-gray text-white`}
    >
      <div
        className={` ${
          mobileMenu
            ? 'items-center justify-center'
            : 'items-start justify-start'
        } flex w-4/12 flex-col   self-start md:w-8/12 2xl:w-6/12`}
      >
        <div className=" flex  w-full">
          <div
            className={` ${
              mobileMenu ? 'hidden' : 'px-6'
            } flex w-full flex-col pt-4  md:justify-center md:px-3 2xl:px-9 2xl:pt-2`}
          >
            <h2
              className={` ${
                mobileMenu ? ' hidden' : 'md:text-sm 2xl:text-lg '
              } flex justify-center pb-4 font-poiret uppercase md:pb-7  2xl:pb-6 `}
            >
              Our story
            </h2>
            <p className={` text-center font-aurora md:text-xs`}>
              <span className="text-center font-chonburi uppercase md:text-xs">
                astoria
              </span>{' '}
              {mobileMenu
                ? `formulas are simple, considered and effective. Provenance is
              important to us, so you'll always know where our ingredients come
              from.`
                : `formulas are simple, considered and effective. Provenance is
              important to us, so you'll always know where our ingredients come
              from. And we'll even show you how to create your own skincare
              formulations along the way.`}
            </p>
          </div>
          <div className={` ${mobileMenu ? '' : ''} w-full`}>
            <picture>
              <source srcSet="/assets/bg-img/footer.webp" />
              <img
                src="/assets/bg-img/footer.jpg"
                alt=""
                className={`${
                  mobileMenu ? 'h-[25vh] portrait:xs:h-[20vh]' : 'h-[250px]  '
                } aspect-[3/4] w-full border-r-[1.5px] border-white object-cover `}
              />
            </picture>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className=" w-full">
          <form
            className=" flex w-full bg-[#4c4c4c] "
            onSubmit={handleSubmit(handleSubscribe)}
          >
            <label
              htmlFor="newsletter"
              className={` ${
                mobileMenu
                  ? 'px-2 pt-3 text-[.7rem]'
                  : ' md:text-sm 2xl:text-2xl'
              } border-b border-white font-poiret uppercase text-white md:p-3  xl:px-6 2xl:px-5 2xl:py-3 `}
            >
              newsletter
            </label>
            <input
              type="text"
              id="email"
              {...register('email')}
              placeholder={errors.email?.message || 'email...'}
              className={` ${
                mobileMenu
                  ? 'placeholder: text-[.8rem]'
                  : 'md:placeholder:text-xs lg:placeholder:text-sm'
              } w-full border-x-[1.5px] border-b-[1.5px] border-white bg-[#c3c3c3] px-4 font-poiret text-charcoal placeholder:text-charcoal md:px-2 `}
            />
            <button
              className={` ${
                mobileMenu
                  ? 'w-32 whitespace-nowrap px-4 text-[.7rem]'
                  : 'w-52 px-8 md:text-xs  lg:text-xs 2xl:text-base'
              }  border-x-[1.5px] border-b-[1.5px] border-white bg-[#262626] font-poiret uppercase `}
            >
              sign me up
            </button>
          </form>
        </div>

        <section
          className={` ${
            mobileMenu
              ? ' py-2 leading-none  portrait:sm:pl-6 pb-5'
              : 'py-8 xl:py-3'
          } flex  w-full items-start  font-poiret md:justify-around lg:justify-center `}
        >
          <div
            className={` ${
              mobileMenu ? 'pr-3 pl-4 portrait:sm:pl-0' : ''
            } explore text-center lg:pr-16`}
          >
            <div
              className={` ${
                mobileMenu ? 'pb-2' : 'pb-4'
              } text-[.7rem] uppercase  md:text-sm lg:text-lg `}
            >
              explore
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              shop all
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              bestsellers
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              new in
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              shop kits
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              face
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              body
            </p>
          </div>
          <div
            className={` ${
              mobileMenu ? 'pr-3' : ''
            } customer-service text-center lg:pr-16`}
          >
            <div
              className={`${
                mobileMenu ? 'pb-2' : 'pb-4'
              } text-[.7rem] uppercase md:text-sm lg:text-lg`}
            >
              customer service
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              faq
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              shopping & delivery
            </p>
          </div>
          <div className="legal text-center">
            <div
              className={` ${
                mobileMenu ? 'pb-2' : 'pb-4'
              } text-[.7rem] uppercase md:text-sm lg:text-lg`}
            >
              legal
            </div>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              delivery & returns
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              terms & conditions
            </p>
            <p
              className={` ${
                mobileMenu
                  ? 'text-[.7rem] portrait:sm:text-[.8rem]'
                  : 'text-sm md:text-xs xl:text-sm'
              } `}
            >
              privacy policy
            </p>
          </div>
        </section>

        <p
          className={`${
            mobileMenu ? 'text-[.5rem] pr-10 pb-1' : 'text-[10px]'
          } -translate-y-[100%]    self-end px-5  font-poiret  font-light text-white 2xl:-translate-y-[200%]`}
        >
          &copy; ASTORIA - 2023
        </p>
      </div>
    </section>
  );
}
