// Data check emali is valid?
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Rules Password
export const passwordRules = [
  {
    regex: /[A-Z]/,
    message: "Password must contain at least 1 uppercase letter.",
  },
  {
    regex: /[a-z]/,
    message: "Password must contain at least 1 lowercase letter.",
  },
  { regex: /[0-9]/, message: "Password must contain at least 1 number." },
  {
    regex: /[\W_]/,
    message: "Your password must contain at least one special character.",
  },
  {
    regex: /^\S+$/,
    message: "Password must not contain spaces!",
  },
  {
    regex: /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]+$/,
    message: "Password must be in English only!",
  },
];
