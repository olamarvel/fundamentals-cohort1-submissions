import axiosClient from "./axiosClient";

export const searchTasks = async (query: string, page: number, limit: number) => {
  const { data } = await axiosClient.post(`/tasks/search?page=${page}&limit=${limit}`, {query} );
  console.log(data)
  return data
};