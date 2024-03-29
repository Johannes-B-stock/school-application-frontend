/* eslint-disable @typescript-eslint/no-var-requires */
import AuthContext from "@/context/AuthContext";
import { useContext, useState, ChangeEvent, MouseEvent } from "react";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCity,
  faGlobe,
  faHashtag,
  faRoad,
  faUser,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { address as addressi18n, general } from "@/i18n";
import { Address, User } from "api-definitions/backend";
import { SingleDataResponse } from "api-definitions/strapiBaseTypes";
import { useLocale } from "i18n/useLocale";
import CountrySelect from "../common/CountrySelect";
import { allCountries } from "lib/countries";

export default function AddressEdit({
  token,
  user,
  address,
  addressId,
  alwaysEdit = false,
  noButtons = false,
  bindSave = undefined,
  isEmergencyAddress = false,
}: {
  token: string;
  user: User;
  address?: Address;
  addressId?: number;
  alwaysEdit?: boolean;
  noButtons?: boolean;
  bindSave?: (save: any) => any;
  isEmergencyAddress?: boolean;
}) {
  const locale = useLocale();

  const { setUser } = useContext(AuthContext);
  const [updatedAddress, setUpdatedAddress] = useState<Address | undefined>(
    address
  );
  const defaultName: Partial<Address> = isEmergencyAddress
    ? { type: "emergency" }
    : { firstname: user.firstname, lastname: user.lastname, type: "main" };
  const [addressEdit, setAddressEdit] = useState<Partial<Address> | undefined>(
    updatedAddress ?? defaultName
  );

  const [allowAddressEdit, setAllowAddressEdit] = useState(alwaysEdit ?? false);

  const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (addressEdit) {
      setAddressEdit({ ...addressEdit, [name]: value });
    } else {
      setAddressEdit({ [name]: value });
    }
  };

  const handleCountryInputChange = (country: string | undefined) => {
    setAddressEdit({ ...addressEdit, country });
  };

  const onSaveAddress = async (e: MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    const newAddress: Partial<Address> = {
      ...addressEdit,
      firstname: addressEdit?.firstname || user.firstname,
      lastname: addressEdit?.lastname || user.lastname,
      type: isEmergencyAddress ? "emergency" : "main",
    };
    console.log(newAddress);
    const addressComplete = checkIfAddressComplete(newAddress);
    if (!addressComplete) {
      if (noButtons) {
        throw new Error("Please fill in all required address fields!");
      } else {
        toast.error("Please fill in all required address fields!");
        return;
      }
    }

    try {
      if (!address || !addressId) {
        const addressResult = await createNewAddress(newAddress);
        if (!addressResult) {
          throw new Error("Address could not be created!");
        }

        setUpdatedAddress(addressResult);
        !alwaysEdit && setAllowAddressEdit(false);

        setUser({
          ...user,
          addresses: [...(user.addresses ?? []), addressResult],
        });
      } else {
        // Update existing address
        const addressResult = await updateAddress(
          addressId,
          token,
          addressEdit
        );
        if (!addressResult) {
          throw new Error("Address could not be updated!");
        }
        setUpdatedAddress(addressResult);
        !alwaysEdit && setAllowAddressEdit(false);

        setUser({
          ...user,
          addresses: [...(user.addresses ?? []), addressResult],
        });
      }
    } catch (reason: any) {
      if (noButtons) {
        throw new Error(reason);
      }
      toast.error(reason?.message ?? reason);
    }
  };

  async function createNewAddress(newAddress?: Partial<Address>) {
    const body = {
      data: populateWithUser(newAddress),
    };
    // Create new address
    const res = await fetch(`${API_URL}/api/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const addressResult = (await res.json()) as SingleDataResponse<Address>;
    if (!res.ok) {
      if (noButtons) {
        throw new Error(addressResult.error?.message ?? res.statusText);
      } else {
        toast.error(
          addressResult.error?.message ??
            res.statusText ??
            "Something went wrong."
        );
      }
    }

    return addressResult.data;
  }

  bindSave && bindSave(onSaveAddress);

  const handleAddressEditCancel = () => {
    setAllowAddressEdit(false);
    setAddressEdit(updatedAddress ?? defaultName);
  };

  return allowAddressEdit ? (
    <form>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{addressi18n[locale].name}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.firstname ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[locale].firstName}
                name="firstname"
                id="firstname"
                value={addressEdit?.firstname ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.lastname ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[locale].lastName}
                name="lastname"
                id="lastname"
                value={addressEdit?.lastname ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faUserGroup} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{addressi18n[locale].street}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.street ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[locale].street}
                name="street"
                id="street"
                value={addressEdit?.street ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faRoad} />
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.number ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[locale].number}
                name="number"
                id="number"
                value={addressEdit?.number ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faHashtag} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{addressi18n[locale].city}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className={`input ${addressEdit?.city ? "" : "is-danger"}`}
                type="text"
                id="city"
                name="city"
                placeholder={addressi18n[locale].city}
                value={addressEdit?.city ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faCity} />
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className={`input ${
                  addressEdit?.postalCode ? "" : "is-danger"
                }`}
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder={addressi18n[locale].postal}
                value={addressEdit?.postalCode ?? ""}
                onChange={handleAddressInputChange}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faHashtag} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{addressi18n[locale].country}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <CountrySelect
                country={addressEdit?.country}
                countryChanged={handleCountryInputChange}
                locale={locale}
              />
              <div className="icon is-small is-left">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!noButtons && (
        <div className="field is-grouped">
          <div className="control">
            <div className="button is-primary" onClick={onSaveAddress}>
              {general.buttons[locale].save}
            </div>
          </div>
          <div className="control">
            {" "}
            <div className="button" onClick={handleAddressEditCancel}>
              {general.buttons[locale].cancel}
            </div>
          </div>
        </div>
      )}
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[locale].name}:
        </div>
        <div className="column is-narrow">{updatedAddress?.firstname}</div>
        <div className="column">{updatedAddress?.lastname}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[locale].street}:
        </div>
        <div className="column is-narrow">{updatedAddress?.street}</div>
        <div className="column">{updatedAddress?.number}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[locale].city}:
        </div>
        <div className="column">{updatedAddress?.city}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[locale].postal}:
        </div>
        <div className="column">{updatedAddress?.postalCode}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[locale].country}:
        </div>
        <div className="column">
          {updatedAddress?.country &&
            allCountries.getName(updatedAddress?.country, locale)}
        </div>
      </div>
      {!noButtons && (
        <div
          className="button is-primary"
          onClick={() => setAllowAddressEdit(true)}
        >
          {general.buttons[locale].edit}
        </div>
      )}
    </>
  );

  function populateWithUser(newAddress?: Partial<Address>) {
    return {
      ...newAddress,
      user: user.id,
    };
  }
}
function checkIfAddressComplete(address: Partial<Address>): boolean {
  return (
    address.city !== undefined &&
    address.city.length > 0 &&
    address.country !== undefined &&
    address.country.length > 0 &&
    address.firstname !== undefined &&
    address.firstname.length > 0 &&
    address.lastname !== undefined &&
    address.lastname.length > 0 &&
    address.number !== undefined &&
    address.number.length > 0 &&
    address.postalCode !== undefined &&
    address.postalCode > 0 &&
    address.street !== undefined &&
    address.street.length > 0
  );
}

async function updateAddress(
  id: number,
  token: string,
  addressEdit?: Partial<Address>
) {
  const fetchResult = await fetch(`${API_URL}/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: addressEdit,
    }),
  });
  if (!fetchResult.ok) {
    throw new Error(`${fetchResult.status} - ${fetchResult.statusText}`);
  }
  const result = (await fetchResult.json()) as SingleDataResponse<Address>;
  if (result.error) {
    throw new Error(result.error.message);
  }
  return result.data;
}
