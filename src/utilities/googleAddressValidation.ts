import axios, { AxiosError } from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const ADDRESS_VALIDATION_URL =
  'https://addressvalidation.googleapis.com/v1:validateAddress?key=' + API_KEY;

// export const loader = new Loader({
//   apiKey: API_KEY,
//   libraries: ['places'],
// });

/**
 * * VALIDATE ADDRESS
 */

export async function validateAddress(
  shipToAddress: AddressFields
): Promise<ValidateAddressResponse> {
  // construct Google-friendly request object
  const requestObject = convertToPlaces(shipToAddress);

  const requestOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send request to Places API
  try {
    const { data } = await axios.post(
      ADDRESS_VALIDATION_URL,
      { address: requestObject },
      requestOptions
    );

    // Reshape the address response in a more usable format
    const { verdict, address }: { verdict: Verdict; address: Address } =
      data.result;

    console.log('verdict:', verdict);
    console.log('address:', address);

    const replacedComponents = address.addressComponents
      .filter((comp) => comp.replaced || comp.spellCorrected)
      .reduce((obj, comp) => {
        return { ...obj, [comp.componentType]: comp.componentName.text };
      }, {});

    // Make sets to avoid having to loop over arrays later on
    const replacedComponentTypes = new Set(
      Object.keys(replacedComponents) as PlacesComponent[]
    );

    const unconfirmedComponents = address.addressComponents
      .filter((comp) => {
        return (
          !replacedComponentTypes.has(comp.componentType) &&
          componentMap[comp.componentType] !== 'IGNORE' &&
          ['UNCONFIRMED_BUT_PLAUSIBLE', 'UNCONFIRMED_AND_SUSPICIOUS'].includes(
            comp.confirmationLevel
          )
        );
      })
      .reduce((obj, comp) => {
        return { ...obj, [comp.componentType]: comp.componentName.text };
      }, {});

    // Make sets to avoid having to loop over arrays later on
    const unconfirmedComponentTypes = new Set(
      Object.keys(unconfirmedComponents) as PlacesComponent[]
    );
    console.log('unconfirmedComponentTypes', unconfirmedComponentTypes);

    // Set up some booleans to make future conditionals more readable
    const hasReplacements = replacedComponentTypes.size > 0;
    const hasUnconfirmed = unconfirmedComponentTypes.size > 0;

    if (verdict.addressComplete) {
      // "Address complete" means address is usable, but there may be questionable pieces.

      if (!hasReplacements && !hasUnconfirmed) {
        // * Happy path - return processed address.
        return {
          result: 'confirmed',
          message: 'Address complete; no replacements or unconfirmed fields.',
          address: convertFromPlaces(address),
        };
      }

      // Instantiate response object
      const validationResponse = {
        message: 'Result:',
      } as ValidateAddressResponse;

      if (unconfirmedComponentTypes.size > 0) {
        // There are some unconfirmed, unreplaced components.
        // These take precedence over replacements & therefore are tacked on to the response message first.
        validationResponse.result = 'unconfirmed';
        validationResponse.message +=
          ' Some fields are unconfirmed and should be reviewed.';
        validationResponse.unconfirmedFields = Array.from(
          new Set(
            Array.from(unconfirmedComponentTypes).map(
              (comp) => componentMap[comp]
            )
          )
        );
      }

      if (replacedComponentTypes.size > 0) {
        // Mark response as 'replaced' only if not already marked as 'unconfirmed'
        validationResponse.result = validationResponse.result || 'replaced';
        validationResponse.message += ' Some fields have been replaced.';
        validationResponse.replacedFields = Array.from(
          replacedComponentTypes
        ).map((comp) => componentMap[comp]);
      }

      validationResponse.address = convertFromPlaces(address);

      // * Semi-happy path: we have a complete address, but it needs some edits
      return validationResponse;
    } else {
      // * Unhappy path: verdict.addressComplete is falsy

      return {
        result: 'rejected',
        unconfirmedFields: Array.from(unconfirmedComponentTypes).map(
          (comp) => componentMap[comp]
        ),
        replacedFields: Array.from(replacedComponentTypes).map(
          (comp) => componentMap[comp]
        ),
        address: convertFromPlaces(address),
        message: 'Rejected: verdict.addressComplete is falsy',
      };
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      return {
        result: 'rejected',
        message: 'Rejected: AxiosError',
        error: { message: err.response?.data, status: err.response?.status },
      };
    } else {
      console.error(err);
      return {
        result: 'rejected',
        message: 'Rejected: a non-Axios error occurred.',
      };
    }
  }
}

/**
 * * TYPES
 */

export type PlacesFields = {
  regionCode: 'US';
  locality: string;
  administrativeArea: string;
  addressLines: string[];
  postalCode: string;
};

type AddressFields = {
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  zip: string;
};

export type ValidateAddressResponse = {
  result: 'confirmed' | 'replaced' | 'unconfirmed' | 'rejected';
  message: string;
  address?: AddressFields;
  unconfirmedFields?: LocalComponent[];
  replacedFields?: LocalComponent[];
  error?: {
    status: number | undefined;
    message: string;
  };
};

type Verdict = {
  addressComplete?: boolean;
  hasInferredComponents?: boolean;
  hasReplacedComponents?: boolean;
  hasUnconfirmedComponents?: boolean;
};

type Address = {
  addressComponents: AddressComponent[];
  missingComponentTypes: PlacesComponent[];
  unconfirmedComponentTypes: PlacesComponent[];
  unresolvedTokens: string[];
};

type AddressComponent = {
  componentName: {
    text: string;
  };
  componentType: PlacesComponent;
  confirmationLevel: ConfirmationLevel;
  replaced?: boolean;
  inferred?: boolean;
  spellCorrected?: boolean;
};

type LocalComponent =
  | 'address_1'
  | 'address_2'
  | 'city'
  | 'state'
  | 'zip'
  | 'IGNORE';

type PlacesComponent =
  | 'route'
  | 'locality'
  | 'administrative_area_level_1'
  | 'postal_code'
  | 'country'
  | 'postal_code_suffix'
  | 'street_number'
  | 'subpremise';

type ConfirmationLevel =
  | 'CONFIRMED'
  | 'UNCONFIRMED_BUT_PLAUSIBLE'
  | 'UNCONFIRMED_AND_SUSPICIOUS';

type ComponentMap = Record<PlacesComponent, LocalComponent>;

/**
 * * HELPER FUNCTIONS
 */

const componentMap: ComponentMap = {
  street_number: 'address_1',
  route: 'address_1',
  subpremise: 'address_2',
  locality: 'city',
  administrative_area_level_1: 'state',
  postal_code: 'zip',
  country: 'IGNORE',
  postal_code_suffix: 'IGNORE',
};

function convertToPlaces(shipToAddress: AddressFields) {
  // Convert address from app-local format to Google Places API.
  return {
    regionCode: 'US',
    administrativeArea: shipToAddress.state,
    locality: shipToAddress.city,
    postalCode: shipToAddress.zip,
    addressLines: [shipToAddress.address_1, shipToAddress.address_2],
  };
}

function convertFromPlaces(address: Address): AddressFields {
  // Convert response address from Google Places API to app-local format.
  const { addressComponents } = address;

  const convertedAddress = {} as AddressFields;

  // Places returns address_1 in two parts. Use this object to combine the two for _
  // purposes of the response object.
  const convertedAddress1 = {
    street_number: '',
    route: '',
  };

  // Loop through Places components and construct return object
  for (let { componentName, componentType } of addressComponents) {
    let convertedType = componentMap[componentType];
    if (convertedType === 'IGNORE') continue; // some pieces e.g. zip suffix aren't really _
    // used by the app
    if (componentType === 'route' || componentType === 'street_number') {
      convertedAddress1[componentType] = componentName.text;
    } else {
      convertedAddress[convertedType] = componentName.text;
    }
  }

  convertedAddress.address_1 = [
    convertedAddress1.street_number,
    convertedAddress1.route,
  ].join(' ');

  return convertedAddress;
}
