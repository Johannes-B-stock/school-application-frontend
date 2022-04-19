import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, error } = useContext(AuthContext);
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
    login(formData);
  };
  return (
    <Layout title="Login to page">
      <div className="columns is-centered has-text-centered ">
        <div className="column is-5 box p-5">
          <h1 className="title is-4">Login</h1>
          <p className="description">You have to login to see this.</p>
          <form onSubmit={onSubmit}>
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
            <button
              className="button is-block is-primary is-fullwidth is-medium"
              type="submit"
            >
              Submit
            </button>
            <br />
            <small>
              <em>
                Don&apos;t have an account?{" "}
                <Link href="/account/register">Register</Link>
              </em>
            </small>
          </form>
        </div>
      </div>
    </Layout>
  );
}
