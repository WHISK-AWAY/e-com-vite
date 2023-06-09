import { Controller, useForm } from 'react-hook-form';
import CreatableSelect from 'react-select/creatable';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  adminCreateSingleProduct,
  adminEditSingleProduct,
} from '../../../redux/slices/admin/adminProductsSlice';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchSingleProduct,
  selectSingleProduct,
} from '../../../redux/slices/allProductSlice';
import { fetchAllTags, selectTagState } from '../../../redux/slices/tagSlice';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';

export type TCreateSingleProduct = {
  productName: string;
  productIngredients: string;
  productShortDesc: string;
  price: number;
  qty: number;
  imageURL: string[];
  tags: {
    value: string;
    label: string;
  }[];
};

const ZSingleProduct = z.object({
  productName: z
    .string()
    .min(3, { message: 'Product name must be at lest 3 characters long' }),
  productIngredients: z.string().min(20, {
    message: 'Products long description must be at least 20 characters long',
  }),
  productShortDesc: z.string().min(10, {
    message: 'Products short description must be at least 10 characters long',
  }),
  price: z
    .number()
    .nonnegative({ message: 'Price must not be a negative number' })
    .min(5, { message: 'Price must higher be than 5' }),
  qty: z
    .number()
    .nonnegative({ message: 'Price must not be a negative number' })
    .min(1, { message: 'Quantity must not be a negative number' }),
  imageURL: z.array(z.string().url({ message: 'Should be a valid URL' })),
  tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(3, { message: 'Must select at least 3 tags' })
    .max(5, { message: 'Must select at most 5 tags' }),
});

export type EditOrCreateFormModes = 'edit' | 'new';

export default function CreateOrEditProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<TCreateSingleProduct>();
  const [editOrCreateFormModes, setEditOrCreateFormModes] =
    useState<EditOrCreateFormModes>('new');
  const product = useAppSelector(selectSingleProduct);
  const allTags = useAppSelector(selectTagState);
  const { productId } = useParams();

  useEffect(() => {
    dispatch(fetchAllTags());
  }, []);

  useEffect(() => {
    if (productId) {
      dispatch(fetchSingleProduct(productId));
      setEditOrCreateFormModes('edit');
    } else setEditOrCreateFormModes('new');
  }, [productId]);

  useEffect(() => {
    if (product?._id && editOrCreateFormModes === 'edit')
      reset({
        productName: product?.productName || '',
        productIngredients: product?.productIngredients || '',
        productShortDesc: product?.productShortDesc || '',
        price: product?.price || 0,
        qty: product?.qty || 0,
        imageURL: product?.imageURL || [],
        tags:
          product?.tags.map((tag) => {
            return { label: tag.tagName, value: tag.tagName };
          }) || [],
      });
    else newProduct();
  }, [product, editOrCreateFormModes]);

  const defaultValues: TCreateSingleProduct = {
    productName: product?.productName || '',
    productIngredients: product?.productIngredients || '',
    productShortDesc: product?.productShortDesc || '',
    price: product?.price || 0,
    qty: product?.qty || 0,
    imageURL: product?.imageURL || [],
    tags:
      product?.tags.map((tag) => {
        return { label: tag.tagName, value: tag.tagName };
      }) || [],
  };

  const {
    register,
    reset,
    control,
    handleSubmit,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<TCreateSingleProduct>({
    resolver: zodResolver(ZSingleProduct),
    defaultValues,
  });

  const newProduct = () => {
    reset({
      productName: '',
      productIngredients: '',
      productShortDesc: '',
      price: 0,
      qty: 0,
      imageURL: [],
      tags: [],
    });
  };

  const handleCreateOrEditProduct = async (data: TCreateSingleProduct) => {
    const productFields = {
      productName: data.productName,
      productIngredients: data.productIngredients,
      productShortDesc: data.productShortDesc,
      price: data.price,
      qty: data.qty,
      imageURL: data.imageURL,
      tags: data.tags.map((tag) => tag.label),
    };

    if (editOrCreateFormModes === 'new') {
      await dispatch(adminCreateSingleProduct(productFields));
      navigate('/admin/inventory');
    } else if (editOrCreateFormModes === 'edit') {
      if (productId)
        await dispatch(
          adminEditSingleProduct({
            product: productFields,
            productId: productId,
          })
        );
      navigate('/admin/inventory');
    }
  };

  return (
    <section className='product-form-container'>
      <form onSubmit={handleSubmit(handleCreateOrEditProduct)}>
        <div className='product-name-section'>
          {!productId ? <h1>NEW PRODUCT FORM</h1> : <h1>EDIT PRODUCT FORM </h1>}
          <label htmlFor='product-name'>PRODUCT NAME</label>
          <input
            type='text'
            id='product-name'
            {...register('productName')}
          ></input>
          {errors.productName && (
            <p className='text-red-700'>{errors.productName?.message}</p>
          )}
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-long-desc'>PRODUCT LONG DESCRIPTION</label>
          <textarea
            id='product-long-desc'
            {...register('productIngredients')}
          ></textarea>
          {errors.productIngredients && (
            <p className='text-red-700'>{errors.productIngredients?.message}</p>
          )}
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-short-desc'>PRODUCT SHORT DESCRIPTION</label>
          <textarea
            id='product-short-desc'
            {...register('productShortDesc')}
          ></textarea>
          {errors.productShortDesc && (
            <p className='text-red-700'>{errors.productShortDesc?.message}</p>
          )}
        </div>
        <div className='price-section'>
          <label htmlFor='price'>PRODUCT PRICE</label>
          <input
            type='number'
            id='price'
            {...register('price', { valueAsNumber: true })}
          ></input>
          {errors.price && (
            <p className='text-red-700'>{errors.price?.message}</p>
          )}
        </div>
        <div className='qty-section'>
          <label htmlFor='qty'>PRODUCT QTY</label>
          <input
            type='number'
            id='qty'
            {...register('qty', { valueAsNumber: true })}
          ></input>
          {errors.qty && <p className='text-red-700'>{errors.qty?.message}</p>}
        </div>
        <div className='image-section'>
          <label htmlFor='image-URL'>PRODUCT IMAGE</label>
          <input type='text' id='image-URL' {...register('imageURL')}></input>
          {errors.imageURL && (
            <p className='text-red-700'>{errors.imageURL?.message}</p>
          )}
        </div>

        <h1>SELECT TAGS:</h1>
        <Controller
          control={control}
          name='tags'
          rules={{ required: true, min: 3 }}
          render={({
            field: { onChange, onBlur, value, name, ref },
            formState,
          }) => {
            return (
              <CreatableSelect
                closeMenuOnSelect={false}
                onBlur={onBlur}
                value={value}
                onChange={onChange}
                isMulti={true}
                options={allTags.tags.map((tag) => {
                  return { value: tag.tagName, label: tag.tagName };
                })}
              ></CreatableSelect>
            );
          }}
        ></Controller>
        {errors.tags && <p className='text-red-700'>{errors.tags?.message}</p>}
        {productId && <button className='bg-blue-300'>EDIT</button>}

        <br />
        {!productId && <button className='bg-blue-300'>SAVE</button>}
      </form>
    </section>
  );
}
