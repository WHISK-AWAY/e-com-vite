import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addReview } from '../../redux/slices/reviewSlice';
import { useEffect } from 'react';
import { TProduct } from '../../redux/slices/allProductSlice';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectAuthUserId } from '../../redux/slices/authSlice';
import Select from 'react-select';
import { Controller } from 'react-hook-form';

export type AddReviewProps = {
  productId: string;
  product: TProduct;
  setAddReview: React.Dispatch<React.SetStateAction<boolean>>;
};

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
    .min(3, 'minimum of 3 skin concerns')
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

export default function AddReview({
  productId,
  product,
  setAddReview,
}: AddReviewProps) {
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
    if (userId) dispatch(addReview({ userId, productId, review: data }));
    setAddReview(false);
  };

  const skinConcernOptions = [
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

  return (
    <section className='new-review-container'>
      <section className='product-section'>
        <h3>{product.productName}</h3>
        <img
          src={
            product.images.find((image) => image.imageDesc === 'product-front')
              ?.imageURL || product.images[0].imageURL
          }
        ></img>
        <p>{product.productShortDesc}</p>
      </section>
      <br />
      <section className='new-review-form-container'>
        <form onSubmit={handleSubmit(addNewReview)}>
          <div className='title-field'>
            <label htmlFor='title'>review title</label>
            <input
              type='text'
              id='title'
              placeholder={errors.title?.message || ''}
              {...register('title')}
            />
          </div>
          <div className='content-field'>
            <label htmlFor='content'>review</label>
            <textarea
              id='content'
              placeholder={errors.content?.message || ''}
              {...register('content')}
            ></textarea>
          </div>
          <div className='skin-concerns-options'>
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
          </div>
          <div className='rating-section'>
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
            </div>

            <div className='user-info-section'>
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
            </div>
          </div>
          <button type='submit'>submit review</button>
        </form>
        <button onClick={() => setAddReview((prev) => !prev)}>cancel</button>
      </section>
    </section>
  );
}
