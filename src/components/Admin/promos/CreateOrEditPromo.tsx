import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  TPromo,
  adminCreateSinglePromo,
  adminEditSinglePromo,
  adminFetchSinglePromo,
  selectAdminPromos,
  selectAdminSinglePromo,
} from '../../../redux/slices/admin/adminPromoSlice';

export type TFormMode = 'edit' | 'new';
export type TCreatePromo = {
  promoCodeName: string;
  promoRate: number | null;
};

const ZCreatePromo = z
  .object({
    promoCodeName: z
      .string()
      .min(3, { message: 'Promo code name must be at lest 3 characters long' }),
    promoRate: z
      .number()
      .nonnegative()
      .min(0.01, { message: 'Promo rate must be between 0.01 to 0.5' }),
  })
  .strict();

export default function CreateOrEditPromo() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { promoId } = useParams();
  const promo = useAppSelector(selectAdminSinglePromo);
  const promos = useAppSelector(selectAdminPromos);
  const [formMode, setFormMode] = useState<TFormMode>('new');

  const defaultValues: TCreatePromo = {
    promoCodeName: promo.promoCodeName || '',
    promoRate: promo.promoRate || null,
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TPromo>({
    resolver: zodResolver(ZCreatePromo),
    defaultValues,
  });

  useEffect(() => {
    if (promoId)
      dispatch(adminFetchSinglePromo(promoId)).then(() => setFormMode('edit'));
  }, [promoId]);

  useEffect(() => {
    if (promo._id && formMode === 'edit') {
      // console.log('promo', promo);
      reset({
        promoCodeName: promos.promos.find((pcd) => pcd._id === promoId)
          ?.promoCodeName,
        promoRate: promos.promos.find((pr) => pr._id === promoId)?.promoRate,
      });
    } else if (!promoId) setFormMode('new');
  }, [promo, formMode]);

  const handleCreateOrEditForm = async (data: TCreatePromo) => {
    const promoFields = {
      promoCodeName: data.promoCodeName,
      promoRate: data.promoRate,
    };
    if (formMode === 'new') {
      await dispatch(adminCreateSinglePromo(promoFields));
      navigate('/admin/promos');
    } else if (formMode === 'edit') {
      if (promoId)
        await dispatch(adminEditSinglePromo({ promoId, promo: promoFields }));
      navigate('/admin/promos');
    }
  };

  return (
    <section className="create-edit-form-section">
      <form onSubmit={handleSubmit(handleCreateOrEditForm)}>
        {promoId ? <h1>EDIT PROMO CODE</h1> : <h1>CREATE NEW PROMO CODE</h1>}

        <br />
        <div className="promo-code-name">
          <label htmlFor="promo-code-name">PROMO CODE NAME</label>
          <input
            type="text"
            id="promo-code-name"
            {...register('promoCodeName')}
          />
          {errors.promoCodeName && (
            <p className="text-red-700">{errors.promoCodeName?.message}</p>
          )}
        </div>
        <div className="promo-rate">
          <label htmlFor="promo-rate">PROMO RATE</label>
          <input
            type="number"
            id="promo-rate"
            step={0.01}
            {...register('promoRate', { valueAsNumber: true })}
          />
          {errors.promoRate && (
            <p className="text-red-700">{errors.promoRate?.message}</p>
          )}
        </div>
        {promoId ? (
          <button
            type="submit"
            className="bg-blue-300"
          >
            EDIT
          </button>
        ) : (
          <button
            type="submit"
            className="bg-blue-300"
          >
            SAVE
          </button>
        )}
      </form>
    </section>
  );
}
