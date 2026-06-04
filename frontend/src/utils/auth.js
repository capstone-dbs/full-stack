import API from "../services/api";

// REGISTER
export const register = async (
  name,
  email,
  password,
  confirmPassword
) => {

  const response = await API.post(
    "/auth/register",
    {
      name,
      email,
      password,
      confirmPassword,
    }
  );

  return response.data;
};

// LOGIN
export const login = async (
  email,
  password
) => {

  const response = await API.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  localStorage.removeItem("selectedChild");

  // simpan token
  localStorage.setItem(
    "token",
    response.data.access_token
  );

  // simpan user
  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  localStorage.setItem("isLogin", "true");
  localStorage.setItem(
    "role",
    response.data.user?.user_metadata?.role ||
      response.data.user?.app_metadata?.role ||
      "parent"
  );

  return response.data;
};

// LOGOUT
export const logout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("role");
  localStorage.removeItem("selectedChild");

};

// CEK LOGIN
export const isAuthenticated = () => {

  return !!localStorage.getItem("token");

};

// GET USER
export const getUser = () => {

  return JSON.parse(
    localStorage.getItem("user")
  );

};

// RESET PASSWORD
export const resetPassword = async (
  email,
  newPassword
) => {
  const response = await API.post(
    "/auth/reset-password",
    {
      email,
      newPassword,
    }
  );

  return response.data;
};
