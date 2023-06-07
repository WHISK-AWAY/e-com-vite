import { useParams } from 'react-router';

export default function AdminOrderDetails() {
  const { userId } = useParams();

  if (!userId) return <h1>No user ID found...</h1>;
  return (
    <div>
      This page is not yet written...
      <br />
      {userId}
    </div>
  );
}
