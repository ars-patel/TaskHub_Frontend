import React from "react";
import AuthLayout from "./../../components/layouts/AuthLayout";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "./../../components/inputs/Input";
import { validateEmail } from "./../../utils/helper";
import axiosInstance from "./../../utils/axiosinstance";
import { API_PATHS } from "./../../utils/apiPaths";
import { UserContext } from "./../../context/userContext";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError(null);

    if (!validateEmail(email)) {
      setError("Please Enter the valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please Enter the Password");
      setLoading(false);
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });

        const { token, role } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          updateUser(response.data);

          if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(
            error.response.data.message ||
              error.response.data.error ||
              "Login Failed"
          );
        } else {
          setError("Something went wrong. Please try again.");
          setLoading(false)
        }
      }
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <FaSpinner className="animate-spin w-4 h-4" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
