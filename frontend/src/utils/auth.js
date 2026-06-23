export const getCurrentUser = () => {
  return JSON.parse(
    localStorage.getItem("user")
  );
};

export const getRole = () => {
  const user = getCurrentUser();

  return user?.role;
};