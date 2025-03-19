//Before writing code, you should install..
// npm i axios
// npm i react-toastify
// npm i zustand
// npm i zxcvbn

import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../content/register";
import { passwordRules } from "../../content/register";
import zxcvbn from "zxcvbn";
import { Eye, EyeClosed } from "lucide-react";

const Register = () => {
  // Javascript
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [showRules, setShowRules] = useState(false);
  const passwordStrengthLevels = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ];
  const passwordStrength = zxcvbn(form.password);
  const strengthText = passwordStrengthLevels[passwordStrength.score];

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value); e.targer.name = key | e.target.value = value
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value.trim() === "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cut the space from the front and back
    const trimmedEmail = form.email.trim();
    const trimmedPassword = form.password.trim();
    const trimmedConfirmPassword = form.confirmPassword.trim();

    // Check value is blank? Yes = True, No = False
    let newErrors = {
      email: trimmedEmail === "",
      password: trimmedPassword === "",
      confirmPassword: trimmedConfirmPassword === "",
    };

    // Check Required
    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return toast.warning("All fields are required!");
    }

    // Check email is in the wrong format?
    if (!emailRegex.test(trimmedEmail)) {
      return toast.warning("Invalid email format! Please check again!");
    }

    // Check length
    if (trimmedPassword.length <= 7) {
      return toast.warning("Password must contain at least 8 characters!");
    } else if (trimmedPassword.length >= 26) {
      return toast.warning("Password must be less than 25 characters!");
    }

    // Check Password is match?
    if (trimmedPassword !== trimmedConfirmPassword) {
      return toast.warning("Passwords do not match!");
    }

    // Check if the password is in the wrong format?
    const invalidRule = passwordRules.find(
      (rule) => !rule.regex.test(trimmedPassword)
    );
    if (invalidRule) {
      return toast.warning(invalidRule.message);
    }

    // Send to Backend
    try {
      const res = await axios.post("http://localhost:1010/api/register/", {
        ...form,
        email: trimmedEmail,
        password: trimmedPassword,
        confirmPassword: trimmedConfirmPassword,
      });
      toast.success(res.data);
      if (res.status === 200) {
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800">
      {/* Start Form */}
      <form
        className="flex flex-col gap-5 bg-white p-8 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <p className="text-center text-4xl font-semibold mb-3">Register</p>
        {/* Email */}
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
        {/* Password */}
        <div className="relative">
          <p className="text-lg font-bold after:content-['*'] after:text-red-500">
            Password
          </p>
          <input
            className={`border w-96 h-12 px-2 ${
              errors.password
                ? "border-red-500 border-2  bg-red-50"
                : "border-gray-300"
            }`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            onChange={handleOnChange}
            onFocus={() => setShowRules(true)}
            // onBlur={() => setShowRules(false)}
          />
          <button
            type="button"
            className="absolute right-3 bottom-3"
            onClick={togglePassword}
          >
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div>
          <p className="text-lg font-bold after:content-['*'] after:text-red-500">
            Confirm Password
          </p>
          <input
            className={`border w-96 h-12 px-2 ${
              errors.confirmPassword
                ? "border-red-500 border-2 bg-red-50"
                : "border-gray-300"
            }`}
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            onChange={handleOnChange}
          />
        </div>
        {/* Button */}
        <button
          className="text-white text-md font-semibold bg-blue-500 rounded-md py-2 hover:bg-blue-600"
          type="submit"
        >
          Register
        </button>
      </form>
      {/* End Form */}

      {showRules && (
        <div className="w-96 mt-8">
          {/* Show Security */}
          <p
            className={`mb-5 font-semibold ${
              strengthText === "Very Weak"
                ? "text-red-500"
                : strengthText === "Weak"
                ? "text-orange-500"
                : strengthText === "Moderate"
                ? "text-yellow-500"
                : strengthText === "Strong"
                ? "text-green-500"
                : "text-blue-500"
            }`}
          >
            Password Security: {strengthText}
          </p>

          {/* Show rules */}
          <ul className="flex flex-col gap-3">
            {[
              {
                rule: "At least 8 characters",
                isValid: form.password.length >= 8,
              },
              {
                rule: "At least 1 number",
                isValid: /\d/.test(form.password),
              },
              {
                rule: "At least 1 capital letter",
                isValid: /[A-Z]/.test(form.password),
              },
              {
                rule: "At least 1 lowercase letter",
                isValid: /[a-z]/.test(form.password),
              },
              {
                rule: "At least 1 special character",
                isValid: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
              },
            ].map((item, index) => (
              <li
                key={index}
                className={item.isValid ? "text-green-400 " : "text-red-400"}
              >
                {item.isValid && "✅"} {item.rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Register;
