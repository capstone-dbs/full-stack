// utils/child.js

export const setSelectedChild = (child) => {
  localStorage.setItem(
    "selectedChild",
    JSON.stringify(child)
  );
};

export const getSelectedChild = () => {
  const data = localStorage.getItem("selectedChild");

  return data ? JSON.parse(data) : null;
};