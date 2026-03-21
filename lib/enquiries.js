import api from "./api";

export const getMyEnquiries = async (params = {}) => {
  const response = await api.get("/api/enquiry/my", { params });
  return response.data;
};

export const updateMyEnquiryStatus = async (id, status) => {
  const response = await api.patch(`/api/enquiry/my/${id}`, { status });
  return response.data;
};
