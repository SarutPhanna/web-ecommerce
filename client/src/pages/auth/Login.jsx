//Before writing code, you should install..
// npm i axios
// npm i react-toastify
// npm i zustand

import React, { useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

const Login = () => {
  // Javascript
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin); // get actionLogin
  const user = useEcomStore((state) => state.user); // get user

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value); e.targer.name = key | e.target.value = value
    const { name, value } = e.target;
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value.trim() === "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: form.email === "",
      password: form.password === "",
    };

    setErrors(newErrors);

    if (!form.email && !form.password) {
      return toast.warning("Please fill data!");
    }
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("Wellcome Back!");
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
  };

  // redirect role
  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  // End Javascript
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800">
      <form
        className="flex flex-col gap-5 bg-white p-8 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <p className="text-center text-4xl font-semibold mb-3">Login</p>
        <div>
          <p className="text-lg font-bold after:content-['*'] after:text-red-500">
            Email
          </p>
          <input
            className={`border w-96 h-12 px-2 ${
              errors.email
                ? "border-red-500 border-2 bg-red-50"
                : "border-gray-300"
            }`}
            name="email"
            type="email"
            onChange={handleOnChange}
          />
        </div>
        <div className="relative">
          <p className="text-lg font-bold after:content-['*'] after:text-red-500">
            Password
          </p>
          <input
            className={`border w-96 h-12 px-2 ${
              errors.password
                ? "border-red-500 border-2 bg-red-50"
                : "border-gray-300"
            }`}
            name="password"
            onChange={handleOnChange}
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute right-3 bottom-3"
            onClick={togglePassword}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>
        <button
          className=" text-white  text-md font-semibold bg-blue-500 rounded-md py-2 hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
