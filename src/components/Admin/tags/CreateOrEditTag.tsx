import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  createSingleTag,
  editSingleTag,

} from '../../../redux/slices/admin/adminTagSlice';
import { selectTagState } from '../../../redux/slices/tagSlice';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router';

export type TCreateTag = {
  tagName: string;
};

const ZSingleTag = z.object({
  tagName: z.string().min(3, {message: 'Tag must be at least 3 characters long'}),
});

export type EditOrCreateFormModes = 'edit' | 'new';

export default function CreateOrEditTag() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tag = useAppSelector(selectTagState);
  const { tagId } = useParams();
  const [formMode, setFormMode] = useState<EditOrCreateFormModes>('new');

  useEffect(() => {
    if (tag.tags.length && formMode === 'edit')  
      reset({
        tagName: tag.tags.find((t) => t._id === tagId)?.tagName,
      });

  }, [tag, tagId, formMode]);



  useEffect(() => {
    if(tagId) setFormMode('edit')
  }, [tagId])

  const defaultValues: TCreateTag = {
    tagName: '',
  };


  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TCreateTag>({
    resolver: zodResolver(ZSingleTag),
    defaultValues,
  });

  const handleCreateOrEditForm = async (data: TCreateTag) => {
    if (formMode === 'new') {
      await dispatch(createSingleTag(data.tagName));
      navigate('/admin/tags');
    } else if (formMode === 'edit') {
      if (tagId) {
        dispatch(editSingleTag({ tagId, tag: data }));
        navigate('/admin/tags');
      }
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit(handleCreateOrEditForm)}>
        <div className='tag-name-section'>
          {tagId ? <h1>EDIT TAG </h1> : <h1>CREATE NEW TAG</h1>}

          <br />
          <label htmlFor='tag-name'>TAG NAME</label>
          <input type='text' id='tag-name' {...register('tagName')}></input>
          {errors.tagName && (
            <p className='text-red-700'>{errors.tagName?.message}</p>
          )}
        </div>
        {!tagId && (
          <button type='submit' className='bg-blue-300'>
            SAVE
          </button>
        )}
        {tagId && <button className='bg-blue-300'>EDIT</button>}
      </form>
    </section>
  );
}
