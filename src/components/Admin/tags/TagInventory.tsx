import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchAllTags } from '../../../redux/slices/tagSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  deleteSingleTag,
  sort, adminFetchAllTags, selectAdminTag
} from '../../../redux/slices/admin/adminTagSlice';



export default function TagInventory() {
  const dispatch = useAppDispatch();
  const allTags = useAppSelector(selectAdminTag);
  const { tagId } = useParams();
  const [column, setColumn] = useState('tagName');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    dispatch(adminFetchAllTags()).then(() => dispatch(sort({ column, sortDir })));
  }, []);

  useEffect(() => {
    dispatch(sort({ column, sortDir }));
  }, [column, sortDir]);

  const handleSort = (col: string) => {
    if (col === column && sortDir === 'desc') {
      setSortDir('asc');
    } else if (col === column && sortDir === 'asc') {
      setSortDir('desc');
    } else {
      setColumn(col);
      setSortDir('desc');
    }
  };

  return (
    <section>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>TAGS</th>
          </tr>
          <tr>
            <th>TAG ID</th>
            <th onClick={() => handleSort('tagName')}>TAG NAME</th>
          </tr>
        </thead>
        <tbody>
          {allTags.tags.map((tag) => {
            return (
              <tr>
                <td key={tag._id} className='pr-10'>
                  {tag._id}
                </td>
                <td className='pr-10'>{tag.tagName}</td>
                <>
                  <Link to={`/admin/tags/${tag._id}`}>
                    <button className='pr-2'>EDIT</button>
                  </Link>
                  <button
                    onClick={async () => {
                      await dispatch(deleteSingleTag(tag._id));
                      dispatch(fetchAllTags());
                    }}
                  >
                    DELETE
                  </button>
                </>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
