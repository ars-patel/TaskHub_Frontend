import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./../../components/layouts/AuthLayout";
import { validateEmail } from "./../../utils/helper";
import ProfilePhotoSelector from "./../../components/inputs/ProfilePhotoSelector";
import Input from "./../../components/inputs/Input";
import axiosInstance from "./../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "./../../context/userContext";
import uploadImage from "./../../utils/uploadImage";
import { FaSpinner } from "react-icons/fa";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please Enter the valid email address.");
      return;
    }

    if (!fullName) {
      setError("Please Enter full name.");
      return;
    }

    if (!password) {
      setError("Please Enter the Password");
      return;
    }

    setLoading(true); // Start loading
    try {
      let profileImageUrl = "";
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
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
            "Signup Failed"
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-10 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John"
              type="text"
            />
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
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="f2d9e48ce76f62c4XXXXXX"
              type="text"
            />
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
            disabled={loading} // disable during loading
          >
            {loading && <FaSpinner className="animate-spin w-4 h-4" />}
            {loading ? "Signing up..." : "SignUp"}
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;