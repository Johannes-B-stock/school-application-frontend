import { useRouter } from "next/router";
import { useState, useContext } from "react";
import styles from "@/styles/Form.module.css";
import { toast } from "react-toastify";
import { API_URL } from "@/config/index";
import qs from "qs";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import NotAuthorized from "@/components/auth/NotAuthorized";
import { parseCookie } from "@/helpers/index";

export default function EditSchoolPage({ school, token }) {
  const { user } = useContext(AuthContext);

  const [values, setValues] = useState({
    name: school.name,
    description: school.description,
    schoolFee: school.schoolFee,
    applicationFee: school.applicationFee,
    startDate: school.startDate,
    endDate: school.endDate,
    isPublic: school.isPublic,
    acceptingStudents: school.acceptingStudents,
  });
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState(
    school.image ? school.image.data?.attributes.formats.thumbnail : null
  );
  const handleUpdate = async (e) => {
    e.preventDefault();

    const hasEmptyValues = Object.values(values).some((value) => value === "");

    if (hasEmptyValues) {
      toast.error("Please fill in all fields!");
      return;
    }

    const res = await fetch(`${API_URL}/api/schools/${school.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: values }),
    });

    const resultObj = await res.json();
    if (!res.ok) {
      toast.error(
        resultObj.error?.message ?? res.statusText ?? "Something went wrong."
      );
    } else {
      toast.success("Update successful");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setValues({ ...values, [name]: checked });
  };

  return user && user.role?.name === "SchoolAdmin" ? (
    <div className="content">
      <h1>Edit School</h1>
      <form
        className={`${styles.createSchoolForm} form`}
        onSubmit={handleUpdate}
      >
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label" htmlFor="name">
              Name
            </label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  id="name"
                  name="name"
                  value={values.name}
                  type="text"
                  placeholder="Name of school"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Description</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <textarea
                  className="textarea"
                  id="description"
                  name="description"
                  value={values.description}
                  onChange={handleInputChange}
                  placeholder="Describe the school in more detail"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label">Start date</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  id="startDate"
                  name="startDate"
                  value={values.startDate}
                  type="date"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label">End date</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  id="endDate"
                  name="endDate"
                  value={values.endDate}
                  type="date"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label" htmlFor="name">
              Application Fee
            </label>
          </div>
          <div className="field-body">
            <div className="field has-addons">
              <p className="control">
                <span className="select">
                  <select
                    id="currency"
                    name="currency"
                    value={values.currency}
                    onChange={handleInputChange}
                  >
                    <option>$</option>
                    <option>£</option>
                    <option>€</option>
                  </select>
                </span>
              </p>
              <div className="control">
                <input
                  className="input"
                  id="applicationFee"
                  name="applicationFee"
                  value={values.applicationFee}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <label className="label" htmlFor="name">
              School Fee
            </label>
          </div>
          <div className="field-body">
            <div className="field has-addons">
              <p className="control">
                <span className="select">
                  <select
                    id="currency"
                    name="currency"
                    value={values.currency}
                    onChange={handleInputChange}
                  >
                    <option>$</option>
                    <option>£</option>
                    <option>€</option>
                  </select>
                </span>
              </p>
              <div className="control">
                <input
                  className="input"
                  id="schoolFee"
                  name="schoolFee"
                  value={values.schoolFee}
                  type="text"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <div className="label">is public</div>
          </div>
          <div className="field-body">
            <div className="field">
              <label className="checkbox">
                <input
                  className="mr-3"
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={values.isPublic}
                  onChange={handleCheckboxChange}
                />
                Set this to true so it can be seen on the overview
              </label>
            </div>
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-label">
            <div className="label">accepts students</div>
          </div>
          <div className="field-body">
            <div className="field">
              <label className="checkbox">
                <input
                  className="mr-3"
                  type="checkbox"
                  id="acceptingStudents"
                  name="acceptingStudents"
                  checked={values.acceptingStudents}
                  onChange={handleCheckboxChange}
                />
                When checked, users can apply for this school.
              </label>
            </div>
          </div>
        </div>
        <div className="field is-horizontal is-grouped">
          <div className="field-label"></div>
          <div className="field-body">
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link">Update</button>
              </div>
              <div className="control">
                <button className="button is-link is-light">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <h2>Image Preview</h2>
      {imagePreview ? (
        <Image
          src={imagePreview.url}
          alt="image preview"
          height="200"
          width="300"
        />
      ) : (
        <p>No image uploaded</p>
      )}
    </div>
  ) : (
    <NotAuthorized />
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookie(req);
  const query = qs.stringify({
    populate: "image",
  });
  const res = await fetch(`${API_URL}/api/schools/${id}?${query}`);

  const response = await res.json();
  return {
    props: {
      token,
      school: {
        id: response.data.id,
        ...response.data.attributes,
      },
    },
  };
}
