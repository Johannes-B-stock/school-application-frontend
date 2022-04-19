import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register, error } = useContext(AuthContext);

  useEffect(() => {
    error && toast.error(error);
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      };
      register(userData);
    }
  };
  return (
    <Layout title="User registration">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-5 box p-5">
          <h1 className="title is-4">Register</h1>
          <p className="description">Register now to apply for a school.</p>
          <form onSubmit={onSubmit}>
            <div className="field">
              <div className="control">
                <input
                  className="input is-medium"
                  type="text"
                  placeholder="Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  className="input is-medium"
                  type="email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  className="input is-medium"
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="field">
              <div className="control">
                <input
                  className="input is-medium"
                  type="password"
                  placeholder="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                />
              </div>
            </div>
            <button className="button is-block is-primary is-fullwidth is-medium">
              Submit
            </button>
            <br />
            <small>
              <em>
                Already have an account?{" "}
                <Link href="/account/login">Login</Link>
              </em>
            </small>
          </form>
        </div>
      </div>
    </Layout>
  );
}
