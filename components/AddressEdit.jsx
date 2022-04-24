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

export default function AddressEdit({ token, user, address }) {
  const router = useRouter();

  const { setUser } = useContext(AuthContext);
  const [addressEdit, setAddressEdit] = useState(address);

  const [countryEdit, setCountryEdit] = useState({
    value: addressEdit?.country,
    label: countries.getName(addressEdit?.country, router.locale.split("-")[0]),
  });
  const [allowAddressEdit, setAllowAddressEdit] = useState(false);
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
    e.preventDefault();

    const hasOnlyEmptyValues = Object.values(addressEdit).some(
      (value) => value === ""
    );

    if (hasOnlyEmptyValues) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!address) {
      // Create new address
      console.log("Create new Address");
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
      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
      } else {
        const updatedAddress = await res.json();
        console.log(updatedAddress);
        toast.success("Saved successfully");
        setAllowAddressEdit(false);
        setUser({ ...user, address: updatedAddress.data.attributes });
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
      if (!res.ok) {
        toast.error(res.statusText ?? "Something went wrong.");
      } else {
        const updatedAddress = await res.json();
        setAllowAddressEdit(false);
        setUser({ ...user, address: updatedAddress.data.attributes });

        toast.success("Saved successfully");
        console.log(updatedAddress);
      }
    }
  };

  const handleAddressEditCancel = () => {
    setAllowAddressEdit(false);
    setAddressEdit(address);
  };

  return allowAddressEdit ? (
    <form>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">First Name:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <input
                className="input"
                type="text"
                id="firstname"
                name="firstname"
                placeholder="First Name"
                value={addressEdit?.firstname}
                onChange={handleAddressInputChange}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Last Name:</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control is-expanded">
              <input
                className="input"
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Last Name"
                value={addressEdit?.lastname}
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
    </form>
  ) : (
    <>
      <div className="columns">
        <div className="column is-3">First Name:</div>
        <div className="column">{addressEdit?.firstname}</div>
      </div>
      <div className="columns">
        <div className="column is-3">Last Name:</div>
        <div className="column">{addressEdit?.lastname}</div>
      </div>
      <div className="columns">
        <div className="column is-3">Street:</div>
        <div className="column is-5">{addressEdit?.street}</div>
        <div className="column is-2">{addressEdit?.number}</div>
      </div>
      <div className="columns">
        <div className="column is-3">City:</div>
        <div className="column">{addressEdit?.city}</div>
      </div>
      <div className="columns">
        <div className="column is-3">Postal Code:</div>
        <div className="column">{addressEdit?.postalCode}</div>
      </div>

      <div className="columns">
        <div className="column is-3">Country:</div>
        <div className="column">
          {countries.getName(addressEdit?.country, router.locale.split("-")[0])}
        </div>
      </div>
      <div className="button" onClick={() => setAllowAddressEdit(true)}>
        Edit
      </div>
    </>
  );
}
