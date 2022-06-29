import AuthContext from "@/context/AuthContext";
import { useContext, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { API_URL } from "@/config/index";
import { toast } from "react-toastify";
import countries from "i18n-iso-countries";
import Select from "react-select";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/fr.json"));
countries.registerLocale(require("i18n-iso-countries/langs/de.json"));

export default function AddressEdit({
  token,
  user,
  address,
  alwaysEdit,
  noButtons,
  bindSave,
}) {
  const router = useRouter();

  const { setUser } = useContext(AuthContext);
  const [addressEdit, setAddressEdit] = useState(address);

  const [countryEdit, setCountryEdit] = useState({
    value: addressEdit?.country,
    label: countries.getName(addressEdit?.country, router.locale.split("-")[0]),
  });
  const [allowAddressEdit, setAllowAddressEdit] = useState(alwaysEdit ?? false);
  const countryList = useMemo(
    () =>
      Object.keys(countries.getNames(router.locale.split("-")[0] ?? "en")).map(
        (key) => ({
          value: key,
          label: countries.getName(key, router.locale.split("-")[0] ?? "en"),
        })
      ),
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
      // Create new address
      const res = await fetch(`${API_URL}/api/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            ...addressEdit,
            country: countryEdit.value ?? null,
            user: user.id,
          },
        }),
      });
      const addressResult = await res.json();

      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
        if (noButtons) {
          throw new Error(addressResult.error?.message ?? res.statusText);
        }
      } else {
        toast.success("Saved successfully");
        !alwaysEdit && setAllowAddressEdit(false);
        setUser({ ...user, address: addressResult.data.attributes });
      }
    } else {
      // Update existing address
      const res = await fetch(`${API_URL}/api/addresses/${addressEdit.id}`, {
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
      const addressResult = await res.json();

      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
        if (noButtons) {
          throw new Error(addressResult.error?.message ?? res.statusText);
        }
      } else {
        !alwaysEdit && setAllowAddressEdit(false);
        setUser({ ...user, address: addressResult.data.attributes });

        toast.success("Saved successfully");
      }
    }
  };

  bindSave && bindSave(onSaveAddress);

  const handleAddressEditCancel = () => {
    setAllowAddressEdit(false);
    setAddressEdit(address);
  };

  return allowAddressEdit ? (
    <form>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Name:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="First name"
                name="firstname"
                id="firstname"
                value={addressEdit?.firstname || user.firstname}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Last name"
                name="lastname"
                id="lastname"
                value={addressEdit?.lastname || user.lastname}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Street:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Street"
                name="street"
                id="street"
                value={addressEdit?.street}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="#"
                name="number"
                id="number"
                value={addressEdit?.number}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">City:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <input
                className="input"
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={addressEdit?.city}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
          <div className="field">
            <p className="control is-expanded">
              <input
                className="input"
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder="Postal Code"
                value={addressEdit?.postalCode}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Country:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded has-icons-right">
              <Select
                classNamePrefix="select"
                name="country"
                value={countryEdit}
                onChange={handleCountryInputChange}
                options={countryList}
              />
            </div>
          </div>
        </div>
      </div>

      {!noButtons && (
        <div className="field is-grouped">
          <div className="control">
            <div className="button is-primary" onClick={onSaveAddress}>
              Save
            </div>
          </div>
          <div className="control">
            {" "}
            <div className="button" onClick={handleAddressEditCancel}>
              Cancel
            </div>
          </div>
        </div>
      )}
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">Street:</div>
        <div className="column is-5">{addressEdit?.street}</div>
        <div className="column is-2">{addressEdit?.number}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">City:</div>
        <div className="column">{addressEdit?.city}</div>
      </div>
      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">Postal Code:</div>
        <div className="column">{addressEdit?.postalCode}</div>
      </div>

      <div className="columns">
        <div className="column is-3 has-text-weight-semibold">Country:</div>
        <div className="column">
          {countries.getName(addressEdit?.country, router.locale.split("-")[0])}
        </div>
      </div>
      {!noButtons && (
        <div
          className="button is-primary"
          onClick={() => setAllowAddressEdit(true)}
        >
          Edit
        </div>
      )}
    </>
  );
}
