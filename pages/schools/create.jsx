import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "@/styles/Form.module.css";
import { toast } from "react-toastify";
import { API_URL } from "@/config/index";
import { parseCookie } from "@/helpers/index";

export default function CreateSchoolPage({ token }) {
  const [values, setValues] = useState({
    name: "",
    description: "",
    schoolFee: "",
    applicationFee: "",
    startDate: "",
    endDate: "",
    isPublic: false,
    acceptingStudents: false,
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyValues = Object.values(values).some((value) => value === "");

    if (hasEmptyValues) {
      toast.error("Please fill in all fields!");
      return;
    }

    const res = await fetch(`${API_URL}/api/schools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: values }),
    });
    if (!res.ok) {
      console.log(res);
      toast.error(res.statusText ?? "Something went wrong.");
    } else {
      const school = await res.json();
      console.log(school);
      router.push(`/schools/${school.data.id}`);
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

  return (
    <Layout>
      <div className="content">
        <h1>Create School</h1>
        <form className={`${styles.form} form`} onSubmit={handleSubmit}>
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
                  <button className="button is-link">Submit</button>
                </div>
                <div className="control">
                  <button className="button is-link is-light">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookie(req);

  return {
    props: {
      token,
    },
  };
}
