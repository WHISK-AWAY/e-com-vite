import { TUser } from '../../redux/slices/userSlice';

type ShippingProps = {
  user: TUser;
};

export default function ShippingInfo({ user }: ShippingProps) {
  if (!user) return <h1>Loading...</h1>;

  const { address } = user;

  if (!address) return <h1>No addresses saved...</h1>;

  const { address_1, address_2, city, state, zip } = address;

  return (
    <div>
      <h1>SHIPPING INFO</h1>
      <p>Address1: {address_1}</p>
      {address_2 && <p>Address2: {address_2}</p>}
      <p>City: {city}</p>
      <p>State: {state}</p>
      <p>ZIP: {zip}</p>
    </div>
  );
}
