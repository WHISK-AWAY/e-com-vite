import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useEffect, useState } from 'react';
import {
  TPromo,
  TPromoField,
  adminDeleteSinglePromo,
  adminFetchAllPromos,
  selectAdminPromos, sort
} from '../../../redux/slices/admin/adminPromoSlice';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

export default function PromoInventory() {
  const dispatch = useAppDispatch();
  const allPromos = useAppSelector(selectAdminPromos);
  const {promoId} = useParams();
  const [column, setColumn] = useState<keyof TPromoField>('promoCodeName');
  const [sortDir, setSortDir] = useState<string>('desc')

  useEffect(() => {
    dispatch(adminFetchAllPromos()).then(() => dispatch(sort({column, sortDir})));
  }, []);


  useEffect(() => {
    dispatch(sort({column, sortDir}))
  }, [column, sortDir])

  const handleSort = (col: keyof TPromoField) => {
    if(col === column && sortDir === 'desc') {
      setSortDir('asc');
    } else if(col === column && sortDir === 'asc') {
      setSortDir('desc')
    } else {
      setColumn(col);
      setSortDir('desc')
    }
  }

  if(!allPromos.promos.length) return  <p>...Loading</p>
  return (
    <section className='promo-inventory'>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>PROMOS</th>
          </tr>
          <tr>
            <th className='pr-10'>PROMO CODE ID</th>
            <th onClick={() => handleSort('promoCodeName')} className='pr-10'>
              PROMO CODE NAME
            </th>
            <th onClick={() => handleSort('promoRate')} className='pr-10'>
              PROMO CODE RATE
            </th>
          </tr>
        </thead>
        <tbody>
          {allPromos.promos.map((promo) => {
            return (
              <tr>
                <td className='pr-10'>{promo._id}</td>
                <td className='pr-10'>{promo.promoCodeName}</td>
                <td>{promo.promoRate}</td>
                <Link to={`/admin/promos/${promo._id}`} className='pr-2'>
                  EDIT
                </Link>
                <button
                  onClick={async () => {
                    await dispatch(adminDeleteSinglePromo(promo._id!));
                    dispatch(adminFetchAllPromos());
                  }}
                >
                  DELETE
                </button>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
