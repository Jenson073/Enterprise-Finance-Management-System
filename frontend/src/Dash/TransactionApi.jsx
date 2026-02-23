import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true 
});

export const getTransactions = async () => {
  const res = await api.get("/api/payments");
  return res.data;
};
export const getCompletedTransactions = async () => {
  const res = await api.get("/api/completed");
  return res.data;
};

/* ADD (WITH FILE) */
export const addTransaction = async (transaction) => {
  const formData = new FormData();

  // transaction object → JSON blob
  formData.append(
    "transaction",
    new Blob([JSON.stringify(transaction)], {
      type: "application/json",
    })
  );

  // file (optional)
  if (transaction.file) {
    formData.append("file", transaction.file);
  }

  const res = await api.post("/api/addpayment", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const updateTransaction = async (id, transaction) => {
  const formData = new FormData();

  formData.append(
    "transaction",
    new Blob([JSON.stringify(transaction)], {
      type: "application/json",
    })
  );

  if (transaction.file) {
    formData.append("file", transaction.file);
  }

  const res = await api.put(`/api/payments/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/api/payments/${id}`);
  return res.data;
};

export const downloadFile = async (filename) => {
  return api.get(`/api/files/${filename}`, {
    responseType: "blob",
    withCredentials: true 
  });
};

export const logout = async () => {
  return api.post("/auth/logout");
};