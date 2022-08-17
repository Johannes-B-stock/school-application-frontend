import AuthContext from "@/context/AuthContext";
import { useContext, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import countries from "i18n-iso-countries";
import Select from "react-select";
import axios from "axios";
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

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/fr.json"));
countries.registerLocale(require("i18n-iso-countries/langs/de.json"));

export default function AddressEdit({
  token,
  user,
  address,
  alwaysEdit = false,
  noButtons = false,
  bindSave = null,
  isEmergencyAddress = false,
}) {
  const router = useRouter();

  const { setUser } = useContext(AuthContext);
  const [addressEdit, setAddressEdit] = useState(
    address?.attributes ?? address
  );

  const [countryEdit, setCountryEdit] = useState({
    value: addressEdit?.country,
    label: countries.getName(addressEdit?.country, router.locale.split("-")[0]),
  });
  const [allowAddressEdit, setAllowAddressEdit] = useState(alwaysEdit ?? false);
  const countryList = useMemo(
    () =>
      Object.keys(countries.getNames(router.locale ?? "en")).map((key) => ({
        value: key,
        label: countries.getName(key, router.locale ?? "en"),
      })),
    [router.locale]
  );

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressEdit({ ...addressEdit, [name]: value });
  };

  const handleCountryInputChange = (country) => {
    setCountryEdit(country);
    setAddressEdit({ ...addressEdit, country: country.value });
  };

  const onSaveAddress = async (e) => {
    e?.preventDefault();

    const newAddress = {
      ...addressEdit,
      firstname: addressEdit.firstname || user.firstname,
      lastname: addressEdit.lastname || user.lastname,
    };

    const hasSomeEmptyValues = Object.values(newAddress).some(
      (value) => value === ""
    );

    if (hasSomeEmptyValues) {
      if (noButtons) {
        throw new Error("Please fill in all fields!");
      } else {
        toast.error("Please fill in all fields!");
        return;
      }
    }
    if (!address) {
      const addressResult = await createNewAddress(addressEdit);
      !alwaysEdit && setAllowAddressEdit(false);
      setUser({ ...user, address: addressResult.data.attributes });
    } else {
      // Update existing address
      const res = await updateAddress(
        address.id,
        token,
        addressEdit,
        countryEdit
      );
      const addressResult = await res.json();

      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
        if (noButtons) {
          throw new Error(addressResult.error?.message ?? res.statusText);
        }
      } else {
        !alwaysEdit && setAllowAddressEdit(false);
        setUser({ ...user, address: addressResult.data.attributes });
      }
    }
  };

  async function createNewAddress(newAddress) {
    const body = {
      data: {
        ...newAddress,
        country: countryEdit.value ?? null,
      },
    };
    if (!isEmergencyAddress) {
      body.data.user = user.id;
    }
    // Create new address
    const res = await fetch(`${API_URL}/api/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const addressResult = await res.json();

    if (!res.ok) {
      toast.error(
        addressResult.error.message ?? res.statusText ?? "Something went wrong."
      );
      if (noButtons) {
        throw new Error(addressResult.error?.message ?? res.statusText);
      }
      // return;
    }
    if (isEmergencyAddress) {
      await axios
        .put(
          `${API_URL}/api/users/me`,
          {
            data: {
              emergency_address: addressResult.data.id,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((reason) => toast.error(reason.message ?? reason));
    }
    return addressResult;
  }

  bindSave && bindSave(onSaveAddress);

  const handleAddressEditCancel = () => {
    setAllowAddressEdit(false);
    setAddressEdit(address);
  };

  return allowAddressEdit ? (
    <form>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">{addressi18n[router.locale].name}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.firstname ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[router.locale].firstName}
                name="firstname"
                id="firstname"
                value={addressEdit?.firstname}
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
                placeholder={addressi18n[router.locale].lastName}
                name="lastname"
                id="lastname"
                value={addressEdit?.lastname}
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
          <label className="label">{addressi18n[router.locale].street}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control has-icons-left">
              <input
                className={`input ${addressEdit?.street ? "" : "is-danger"}`}
                type="text"
                placeholder={addressi18n[router.locale].street}
                name="street"
                id="street"
                value={addressEdit?.street}
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
                placeholder="#"
                name="number"
                id="number"
                value={addressEdit?.number}
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
          <label className="label">{addressi18n[router.locale].city}*:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <input
                className={`input ${addressEdit?.city ? "" : "is-danger"}`}
                type="text"
                id="city"
                name="city"
                placeholder={addressi18n[router.locale].city}
                value={addressEdit?.city}
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
                placeholder={addressi18n[router.locale].postal}
                value={addressEdit?.postalCode}
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
          <label className="label">
            {addressi18n[router.locale].country}*:
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-left">
              <Select
                classNamePrefix="select"
                name="country"
                value={countryEdit}
                onChange={handleCountryInputChange}
                options={countryList}
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
              {general.buttons[router.locale].save}
            </div>
          </div>
          <div className="control">
            {" "}
            <div className="button" onClick={handleAddressEditCancel}>
              {general.buttons[router.locale].cancel}
            </div>
          </div>
        </div>
      )}
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[router.locale].name}:
        </div>
        <div className="column is-narrow">{addressEdit?.firstname}</div>
        <div className="column">{addressEdit?.lastname}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[router.locale].street}:
        </div>
        <div className="column is-narrow">{addressEdit?.street}</div>
        <div className="column">{addressEdit?.number}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[router.locale].city}:
        </div>
        <div className="column">{addressEdit?.city}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[router.locale].postal}:
        </div>
        <div className="column">{addressEdit?.postalCode}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">
          {addressi18n[router.locale].country}:
        </div>
        <div className="column">
          {countries.getName(addressEdit?.country, router.locale.split("-")[0])}
        </div>
      </div>
      {!noButtons && (
        <div
          className="button is-primary"
          onClick={() => setAllowAddressEdit(true)}
        >
          {general.buttons[router.locale].edit}
        </div>
      )}
    </>
  );
}
async function updateAddress(id, token, addressEdit, countryEdit) {
  return await fetch(`${API_URL}/api/addresses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        ...addressEdit,
        country: countryEdit.value ?? null,
      },
    }),
  });
}
