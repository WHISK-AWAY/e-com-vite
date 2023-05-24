import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';

export type GoogleAddressRequest = {
  regionCode: 'US';
  locality: string;
  administrativeArea: string;
  addressLines: string[];
  postalCode: string;
};

export const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  libraries: ['places'],
});

let autocomplete: google.maps.places.Autocomplete;
let address1Field: HTMLInputElement;
let address2Field: HTMLInputElement;
let postalField: HTMLInputElement;

//TODO: no anys, please
export type AddressAutocompleteFields = {
  address1Field: any;
  address2Field: any;
  postalField: any;
};

export async function initAutoComplete({
  address1Field,
  address2Field,
  postalField,
}: AddressAutocompleteFields) {
  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ['us'] },
    fields: ['address_components', 'geometry'],
    types: ['address'],
  });

  autocomplete.addListener('place_changed', fillInAddress);
}

//TODO: anys
export function fillInAddress({
  locality,
  state,
}: {
  locality: any;
  state: any;
}) {
  const place = autocomplete.getPlace();

  let address1 = '';
  let postcode = '';

  for (let component of place.address_components as google.maps.GeocoderAddressComponent[]) {
    const componentType = component.types[0];

    switch (componentType) {
      case 'street_number': {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case 'route': {
        address1 += component.short_name;
        break;
      }

      case 'postal_code': {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case 'postal_code_suffix': {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }

      case 'locality': {
        locality.value = component.long_name;
        break;
      }

      case 'administrative_area_level_1': {
        state.vaslue = component.short_name;
        break;
      }
    }
  }

  address1Field.value = address1;
  postalField.value = postcode;
}

declare global {
  interface Window {
    initAutocomplete: () => void;
  }
}

const unconfirmedComponentMap = {
  street_number: 'address_1',
  route: 'address_1',
  subpremise: 'address_2',
  locality: 'city',
  administrative_area_level_1: 'state',
  postal_code: 'zip',
  country: 'country',
};

type CheckAddressReturn = {
  result: 'confirmed' | 'unconfirmed';
  unconfirmedFields: string[];
};

export async function checkAddress(
  address: GoogleAddressRequest
): Promise<CheckAddressReturn> {
  const url =
    'https://addressvalidation.googleapis.com/v1:validateAddress?key=' +
    import.meta.env.VITE_GOOGLE_API_KEY;
  // console.log('url:', url);
  const res = await axios.post(
    url,
    {
      address,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  // console.log('res:', res.data.result.address.unconfirmedComponentTypes);

  const unconfirmedComponents = res.data.result.address
    .unconfirmedComponentTypes as
    | (keyof typeof unconfirmedComponentMap)[]
    | undefined;

  if (unconfirmedComponents) {
    let returnSet = new Set(
      unconfirmedComponents.map((comp) => unconfirmedComponentMap[comp])
    );

    return {
      result: 'unconfirmed',
      unconfirmedFields: Array.from(returnSet),
    };
  }
  return { result: 'confirmed', unconfirmedFields: [] };
}
