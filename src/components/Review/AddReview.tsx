import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addReview } from '../../redux/slices/reviewSlice';
import { TProduct } from '../../redux/slices/allProductSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectAuthUserId } from '../../redux/slices/authSlice';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

const SKIN_CONCERN_OPTIONS = [
  { value: 'oily skin', label: 'Oily skin' },
  { value: 'aging skin', label: 'Aging skin' },
  { value: 'acne prone skin', label: 'Acne-prone skin' },
  { value: 'normal skin', label: 'Normal skin' },
  { value: 'dry skin', label: 'Dry skin' },
  { value: 'hyperpigmentation', label: 'Hyperpigmentation' },
  { value: 'rosacea', label: 'Rosacea' },
  { value: 'dark circles', label: 'Dark circles' },
  { value: 'enlarged pores', label: 'Enlarged pores' },
  { value: 'dull skin', label: 'Dull skin' },
  { value: 'redness', label: 'Redness' },
  { value: 'clogged pores', label: 'Clogged pores' },
  { value: 'blackheads', label: 'Blackheads' },
  { value: 'fine lines', label: 'Fine lines' },
  { value: 'eczema', label: 'Eczema' },
  { value: 'uneven skin tone', label: 'Uneven skin tone' },
];

const zodAddReview = z.object({
  title: z
    .string()
    .min(10, 'minimum 10 characters')
    .max(40, 'maximum 40 characters'),
  content: z.string().min(30, 'minimum 30 characters'),
  rating: z.object({
    overall: z.coerce.number().min(1).max(5),
    quality: z.coerce.number().min(1).max(5),
    value: z.coerce.number().min(1).max(5),
  }),
  skinConcernOptions: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array()
    .min(1, 'must choose at least 1 skin concern')
    .max(5, 'maximum of 5 skin concerns'),
  nickname: z.string().min(2, 'minimum of 2 characters'),
  location: z.string().min(2, 'minimum of 2 characters'),
});

type TAddReview = z.infer<typeof zodAddReview>;

const defaultValues = {
  title: '',
  content: '',
  rating: {
    overall: 5,
    quality: 5,
    value: 5,
  },
  nickname: '',
  location: '',
  skinConcernOptions: [],
};

export type AddReviewProps = {
  productId: string;
  product: TProduct;
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 *
 * * AddReview() COMPONENT START
 *   - Form to create new product review
 *
 */

export default function AddReview({
  productId,
  product,
  setShowReviewForm,
}: AddReviewProps) {
  const reviewButtonRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUserId);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    getValues,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = useForm<TAddReview>({
    resolver: zodResolver(zodAddReview),
    defaultValues,
  });

  useEffect(() => {
    // * scroll to top of review section upon form load
    if (reviewButtonRef.current) {
      reviewButtonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [reviewButtonRef]);

  useEffect(() => {
    // * clear form fields upon validation error
    for (let key in errors) {
      if (key === 'title') {
        setValue('title', '');
      }
      if (key === 'content') {
        setValue('content', '');
      }
      if (key === 'nickname') {
        setValue('nickname', '');
      }
      if (key === 'location') {
        setValue('location', '');
      }
      if (key === 'skinConcernOptions') {
        setValue('skinConcernOptions', []);
      }
    }
  }, [Object.keys(errors)]);

  const addNewReview = (data: TAddReview) => {
    console.log(data);

    // * following lines commented out for testing -- bring these back
    if (userId)
      dispatch(addReview({ userId, productId, review: data })).then(() =>
        setShowReviewForm(false)
      );
  };

  const labelClasses = ' bg-white lg:text-base xl:text-lg 2xl:text-xl';
  const inputClasses =
    'focus:border-charcoal focus:rounded-[3px] focus-no-ring input-ring-charcoal px-2 border lg:text-base xl:text-lg 2xl:text-xl border-charcoal h-7 xl:h-9 2xl:h-14';

  // className={'' + inputClasses}

  return (
    <section
      ref={reviewButtonRef}
      className='new-review-container mb-6 flex flex-col items-center justify-center gap-5 2xl:gap-7'
    >
      <button
        className='self-end rounded-sm border border-charcoal px-6 py-1 font-italiana text-sm uppercase lg:px-8 lg:text-base xl:rounded 2xl:px-10 2xl:py-2 2xl:text-xl'
        onClick={() => setShowReviewForm((prev) => !prev)}
      >
        cancel
      </button>
      <div className='flex justify-center gap-5 xl:gap-8'>
        <div className='review-image-container shrink-0 grow-0 basis-2/5 items-center justify-center'>
          <img
            src={
              product.images.find(
                (image) => image.imageDesc === 'product-front'
              )?.imageURL || product.images[0].imageURL
            }
            className='aspect-[3/4]  object-cover'
            alt='product image'
          />
        </div>
        <div className='review-form-container flex basis-3/5 flex-col items-center'>
          <form
            onSubmit={handleSubmit(addNewReview)}
            className='flex w-full flex-col items-center gap-5 xl:gap-7'
          >
            <div className='input-form-wrapper flex w-full flex-col items-center'>
              <div className='review-form-header w-4/5 border border-b-0 border-charcoal'>
                <h2 className='py-2 text-center font-italiana uppercase lg:text-xl xl:text-2xl'>
                  write a review
                </h2>
              </div>
              <div className='review-form-body h-full w-full border border-charcoal font-marcellus'>
                {/* <div className='review-form-body-left grid grid-rows-[9] border-r border-charcoal'></div> */}
                <div className='review-form-body-right grid h-full grid-cols-[30%_70%] items-center gap-y-2 p-4 xl:gap-y-5 2xl:p-7'>
                  <label htmlFor='nickname' className={'' + labelClasses}>
                    nickname
                  </label>
                  <input
                    className={`${inputClasses} ${
                      errors.nickname?.message
                        ? ' border-red-400 bg-red-100'
                        : ''
                    }`}
                    type='text'
                    id='nickname'
                    placeholder={errors.nickname?.message || ''}
                    {...register('nickname')}
                  ></input>
                  <label htmlFor='location' className={'' + labelClasses}>
                    location
                  </label>
                  <input
                    className={`${inputClasses} ${
                      errors.location?.message
                        ? ' border-red-400 bg-red-100'
                        : ''
                    }`}
                    type='text'
                    id='location'
                    placeholder={errors.location?.message || ''}
                    {...register('location')}
                  ></input>
                  <label
                    htmlFor='skin-concern-select'
                    className={'self-start pt-1' + labelClasses}
                  >
                    skin concerns
                  </label>
                  <div className='select-container min-h-fit bg-white'>
                    <Controller
                      control={control}
                      name='skinConcernOptions'
                      rules={{ required: true, min: 3, max: 5 }}
                      render={({ field: { onChange, onBlur }, formState }) => (
                        <Select
                          unstyled={false}
                          className='h-fit text-xs lg:text-base 2xl:h-16'
                          theme={(theme) => ({
                            ...theme,
                            colors: {
                              ...theme.colors,
                              primary: '#4a4a4a',
                            },
                          })}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              borderColor: errors.skinConcernOptions
                                ? 'rgb(248,113,113)'
                                : '#4a4a4a',
                              ':hover': {
                                borderColor: '#4a4a4a',
                              },
                              borderRadius: state.isFocused ? '3px' : 'none',
                              backgroundColor: errors.skinConcernOptions
                                ? 'rgb(254,226,226)'
                                : 'white',
                              fontFamily: 'Marcellus, sans-serif',
                              minHeight: '100%',
                            }),
                            menu: (baseStyles, _) => ({
                              ...baseStyles,
                              borderRadius: 'none',
                              backgroundColor: 'white',
                              color: '#4a4a4a',
                              // fontSize: '0.5rem',
                              fontFamily: 'Marcellus, sans-serif',
                            }),
                            dropdownIndicator: (baseStyles, _) => ({
                              ...baseStyles,
                              color: '#4a4a4a',
                            }),
                          }}
                          closeMenuOnSelect={false}
                          onBlur={onBlur}
                          onChange={onChange}
                          isMulti={true}
                          options={SKIN_CONCERN_OPTIONS}
                          id='skin-concern-select'
                        />
                      )}
                    ></Controller>
                    {errors.skinConcernOptions?.message || ''}
                  </div>
                  <label htmlFor='title' className={'' + labelClasses}>
                    review title
                  </label>
                  <input
                    className={`${inputClasses} ${
                      errors.title?.message ? ' border-red-400 bg-red-100' : ''
                    }`}
                    type='text'
                    id='title'
                    placeholder={errors.title?.message || ''}
                    {...register('title')}
                  />{' '}
                  <label
                    htmlFor='content'
                    className={'row-span-3 self-start pt-1' + labelClasses}
                  >
                    review
                  </label>
                  <textarea
                    id='content'
                    placeholder={errors.content?.message || ''}
                    {...register('content')}
                    className={`focus-no-ring input-ring-charcoal row-span-3 h-36 border border-charcoal px-2 focus:rounded-[3px] focus:border-charcoal lg:text-base xl:text-lg 2xl:text-xl ${
                      errors.content ? ' border-red-400 bg-red-100' : ''
                    }`}
                  ></textarea>
                  <label
                    htmlFor='quality-rating'
                    className={
                      'self-start pt-1 lg:pt-0 xl:-translate-y-2' + labelClasses
                    }
                  >
                    rating
                  </label>
                  <div className='review-ratings-container flex justify-between bg-white'>
                    <div className='quality-rating-container'>
                      <div
                        id='quality-rating'
                        className='quality-rating flex gap-[1px]'
                      >
                        <input
                          type='radio'
                          id='quality-rating-1'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.quality')}
                          value={1}
                        />
                        <input
                          type='radio'
                          id='quality-rating-2'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.quality')}
                          value={2}
                        />
                        <input
                          type='radio'
                          id='quality-rating-3'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.quality')}
                          value={3}
                        />
                        <input
                          type='radio'
                          id='quality-rating-4'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.quality')}
                          value={4}
                        />
                        <input
                          type='radio'
                          id='quality-rating-5'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.quality')}
                          value={5}
                        />
                      </div>
                      <label
                        htmlFor='quality-rating'
                        className='text-[0.5rem] uppercase lg:text-xs 2xl:text-sm'
                      >
                        quality
                      </label>
                    </div>
                    <div className='value-rating-container'>
                      <div
                        id='value-rating'
                        className='value-rating flex gap-[1px]'
                      >
                        <input
                          type='radio'
                          id='value-rating-1'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.value')}
                          value={1}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.value')}
                          id='value-rating-2'
                          value={2}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.value')}
                          id='value-rating-3'
                          value={3}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.value')}
                          id='value-rating-4'
                          value={4}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.value')}
                          id='value-rating-5'
                          value={5}
                        />
                      </div>
                      <label
                        htmlFor='value-rating'
                        className='text-[0.5rem] uppercase lg:text-xs 2xl:text-sm'
                      >
                        value
                      </label>
                    </div>
                    <div className='overall-rating'>
                      <div
                        id='overall-rating'
                        className='overall-rating flex gap-[1px]'
                      >
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.overall')}
                          id='overall-rating-1'
                          value={1}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.overall')}
                          id='overall-rating-2'
                          value={2}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.overall')}
                          id='overall-rating-3'
                          value={3}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.overall')}
                          id='overall-rating-4'
                          value={4}
                        />
                        <input
                          type='radio'
                          className='text-charcoal focus:bg-charcoal focus:ring-0'
                          {...register('rating.overall')}
                          id='overall-rating-5'
                          value={5}
                        />
                      </div>
                      <label
                        htmlFor='overall-rating'
                        className='text-[0.5rem] font-bold uppercase lg:text-xs 2xl:text-sm'
                      >
                        overall
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className='self-end rounded-sm bg-charcoal px-6 py-1 font-italiana uppercase text-white lg:text-lg xl:rounded xl:px-8 xl:py-2 xl:text-xl 2xl:text-2xl'
              type='submit'
            >
              submit review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
{
  /* <section className='product-section'>
        <h3>{product.productName}</h3>
        <img
          src={
            product.images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || product.images[0].imageURL
          }
        ></img>
        <p>{product.productShortDesc}</p>
      </section> */
}
{
  /* <section className='new-review-form-container'>
        <form onSubmit={handleSubmit(addNewReview)}> */
}
{
  /* <div className='title-field'>
            <label htmlFor='title'>review title</label>
            <input
              type='text'
              id='title'
              placeholder={errors.title?.message || ''}
              {...register('title')}
            />
          </div> */
}
{
  /* <div className='content-field'>
            <label htmlFor='content'>review</label>
            <textarea
              id='content'
              placeholder={errors.content?.message || ''}
              {...register('content')}
            ></textarea>
          </div> */
}
{
  /* <div className='skin-concerns-options'>
            <h4>Skin concerns:</h4>
            <Controller
              control={control}
              name='skinConcernOptions'
              rules={{ required: true, min: 3, max: 5 }}
              render={({
                field: { onChange, onBlur, value, name, ref },
                formState,
              }) => (
                <Select
                  closeMenuOnSelect={false}
                  onBlur={onBlur}
                  onChange={onChange}
                  isMulti={true}
                  options={skinConcernOptions}
                ></Select>
              )}
            ></Controller>
            {errors.skinConcernOptions?.message || ''}
          </div> */
}
{
  /* <div className='rating-section'>
            <div className='overall-rating'>
              <label htmlFor='overall'>overall: </label>
              {[1, 2, 3, 4, 5].map((val) => {
                return (
                  <input
                    type='radio'
                    id='overall'
                    key={val}
                    {...register('rating.overall', {
                      setValueAs: (val) => parseInt(val),
                    })}
                    value={val}
                  ></input>
                );
              })}
            </div>

            <div className='value-rating'>
              <label htmlFor='value'>value: </label>
              {[1, 2, 3, 4, 5].map((val) => {
                return (
                  <input
                    type='radio'
                    id='value'
                    key={val}
                    {...register('rating.value', {
                      setValueAs: (val) => parseInt(val),
                    })}
                    value={val}
                  ></input>
                );
              })}
            </div>

            <div className='quality-rating'>
              <label htmlFor='quality'>quality: </label>
              {[1, 2, 3, 4, 5].map((val) => {
                return (
                  <input
                    type='radio'
                    id='quality'
                    key={val}
                    {...register('rating.quality', {
                      setValueAs: (val) => parseInt(val),
                    })}
                    value={val}
                  ></input>
                );
              })}
            </div> */
}

{
  /* <div className='user-info-section'>
              <div className='user-nickname'>
                <label htmlFor='nickname'>nickname:</label>
                <input
                  type='text'
                  id='nickname'
                  placeholder={errors.nickname?.message || ''}
                  {...register('nickname')}
                ></input>
              </div>
              <div className='user-location'>
                <label htmlFor='location'>location:</label>
                <input
                  type='text'
                  id='location'
                  placeholder={errors.location?.message || ''}
                  {...register('location')}
                ></input>
              </div>
            </div> */
}
{
  /* </div>
          <button type='submit'>submit review</button>
        </form> */
}
{
  /* <button onClick={() => setAddReview((prev) => !prev)}>cancel</button>
      </section> */
}
