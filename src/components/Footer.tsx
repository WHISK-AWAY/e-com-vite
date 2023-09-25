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

export default function Footer({mobileMenu}: {mobileMenu: boolean}) {
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
        mobileMenu ? 'h-[16svh]' : 'h-[300px]'
      } footer-section max-w-screen flex  bg-[#262626] text-white`}
    >
      <div className="flex w-4/12 flex-col items-start justify-start self-start md:w-8/12 2xl:w-3/12">
        <div className=" flex  w-full">
          <div
            className={` ${
              mobileMenu ? 'hidden' : 'px-6'
            } flex w-full flex-col pt-4  md:justify-center md:px-3 2xl:px-9 2xl:pt-9`}
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
          <div className={` ${mobileMenu ? 'h-[15svh]' : ''} w-full`}>
            <picture>
              <source srcSet="/assets/bg-img/footer.webp" />
              <img
                src="/assets/bg-img/footer.jpg"
                className={`${
                  mobileMenu
                    ? 'h-[16svh] object-contain'
                    : 'h-[300px] object-cover'
                } aspect-[3/4] w-full border-r-[1.5px] border-white object-cover`}
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
              }  border-x-[1.5px] border-b-[1.5px] border-white bg-[#232323] font-poiret uppercase `}
            >
              sign me up
            </button>
          </form>
        </div>

        <section className={` ${mobileMenu ? 'hidden' : '' } flex  w-full items-start  py-8 font-poiret md:justify-around lg:justify-center`}>
          <div className="explore text-center lg:pr-16">
            <div className="pb-4 text-[.7rem] uppercase  md:text-sm lg:text-lg">
              explore
            </div>
            <p className="text-sm md:text-xs">shop all</p>
            <p className="text-sm md:text-xs">bestsellers</p>
            <p className="text-sm md:text-xs">new in</p>
            <p className="text-sm md:text-xs">shop kits</p>
            <p className="text-sm md:text-xs">face</p>
            <p className="text-sm md:text-xs">body</p>
          </div>
          <div className="customer-service text-center lg:pr-16">
            <div className="pb-4 text-[.7rem] uppercase md:text-sm lg:text-lg">
              customer service
            </div>
            <p className="text-sm md:text-xs">faq</p>
            <p className="text-sm md:text-xs">shopping & delivery</p>
          </div>
          <div className="legal text-center">
            <div className="pb-4 text-[.7rem] uppercase md:text-sm lg:text-lg">
              legal
            </div>
            <p className="text-sm md:text-xs">delievry & returns</p>
            <p className="text-sm md:text-xs">terms & conditions</p>
            <p className="text-sm md:text-xs">privacy policy</p>
          </div>
        </section>

        <p className="flex flex-col px-5 text-end  align-bottom font-marcellus text-[10px] font-light">
          &copy; ASTORIA - 2023
        </p>
      </div>
    </section>
  );
}
