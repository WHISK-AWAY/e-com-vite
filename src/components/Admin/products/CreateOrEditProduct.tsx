import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  adminCreateSingleProduct,
  adminDeleteSingleProduct,
  adminEditSingleProduct,
  adminFetchAllProducts,
} from '../../../redux/slices/admin/productsSlice';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  TProduct,
  fetchAllProducts,
  fetchSingleProduct,
  selectSingleProduct,
} from '../../../redux/slices/allProductSlice';
import { fetchAllTags, selectTagState } from '../../../redux/slices/tagSlice';
import { useParams } from 'react-router';

export type TCreateSingleProduct = {
  productName: string;
  productLongDesc: string;
  productShortDesc: string;
  brand: string;
  price: number;
  qty: number;
  imageURL: string;
  tags: {
    value: string;
    label: string;
  }[];
};

const ZSingleProduct = z.object({
  productName: z.string().min(3),
  productLongDesc: z.string().min(20),
  productShortDesc: z.string().min(10),
  brand: z.string(),
  price: z.number().nonnegative(),
  qty: z.number().nonnegative(),
  imageURL: z.string(),
  tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    )
    .min(3)
    .max(5),
});

export type EditOrCreateFormModes = 'edit' | 'new';

export default function CreateOrEditProduct() {
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<TCreateSingleProduct>();
  const { productId } = useParams();
  const product = useAppSelector(selectSingleProduct);
  const allTags = useAppSelector(selectTagState);
  const [editOrCreateFormModes, setEditOrCreateFormModes] =
    useState<EditOrCreateFormModes>('new');

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
        productLongDesc: product?.productLongDesc || '',
        productShortDesc: product?.productShortDesc || '',
        brand: product?.brand || '',
        price: product?.price || 0,
        qty: product?.qty || 0,
        imageURL: product?.imageURL || '',
        tags:
          product?.tags.map((tag) => {
            return { label: tag.tagName, value: tag.tagName };
          }) || [],
      });
    else newProduct();
  }, [product, editOrCreateFormModes]);


  const defaultValues: TCreateSingleProduct = {
    productName: product?.productName || '',
    productLongDesc: product?.productLongDesc || '',
    productShortDesc: product?.productShortDesc || '',
    brand: product?.brand || '',
    price: product?.price || 0,
    qty: product?.qty || 0,
    imageURL: product?.imageURL || '',
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
      productLongDesc: '',
      productShortDesc: '',
      brand: '',
      price: 0,
      qty: 0,
      imageURL: '',
      tags: [],
    });
  };

  const handleCreateOrEditProduct = async (data: TCreateSingleProduct) => {
    const productFields = {
      productName: data.productName,
      productLongDesc: data.productLongDesc,
      productShortDesc: data.productShortDesc,
      brand: data.brand,
      price: data.price,
      qty: data.qty,
      imageURL: data.imageURL,
      tags: data.tags.map((tag) => tag.label),
    };

    if (editOrCreateFormModes === 'new') {
      await dispatch(adminCreateSingleProduct(productFields));
    } else if (editOrCreateFormModes === 'edit') {
      if (productId)
        await dispatch(
          adminEditSingleProduct({
            product: productFields,
            productId: productId,
          })
        );
    }
  };
    // useEffect(() => {
    //   if (productId) dispatch(adminDeleteSingleProduct(productId));
    //   dispatch(adminFetchAllProducts())
    // }, [productId]);
  

  console.log('DF', getValues('tags'));
  console.log('errs', errors);
  return (
    <section className='product-form-container'>
      <form onSubmit={handleSubmit(handleCreateOrEditProduct)}>
        <div className='product-name-section'>
          {!productId ? <h1>NEW PRODUCT FORM</h1>: <h1>EDIT PRODUCT FORM </h1>}
          <label htmlFor='product-name'>PRODUCT NAME</label>
          <input
            type='text'
            id='product-name'
            {...register('productName')}
          ></input>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT LONG DESCRIPTION</label>
          <textarea
            id='product-name'
            {...register('productLongDesc')}
          ></textarea>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT SHORT DESCRIPTION</label>
          <textarea
            id='product-name'
            {...register('productShortDesc')}
          ></textarea>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT BRAND</label>
          <input type='text' id='product-name' {...register('brand')}></input>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT PRICE</label>
          <input
            type='number'
            id='product-name'
            {...register('price', { valueAsNumber: true })}
          ></input>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT QTY</label>
          <input
            type='number'
            id='product-name'
            {...register('qty', { valueAsNumber: true })}
          ></input>
        </div>
        <div className='product-name-section'>
          <label htmlFor='product-name'>PRODUCT IMAGE</label>
          <input
            type='text'
            id='product-name'
            {...register('imageURL')}
          ></input>
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
        {productId && <button className='bg-blue-300'>EDIT</button>}

        <br />
        {!productId && <button className='bg-blue-300'>SAVE</button>}
      </form>
    </section>
  );
}
