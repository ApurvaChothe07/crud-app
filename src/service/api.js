import axios from 'axios';

const URL = 'http://127.0.0.1:3001/users';

export const getUsers = async () => {
    return await axios.get(URL);
};

export const getUser = async (id) => {
    return await axios.get(`${URL}/${id}`);
};

export const addUser = async (user) => {
    return await axios.post(URL, user);
};

export const editUser = async (user, id) => {
    return await axios.put(`${URL}/${id}`, user);
};

export const deleteUser = async (id) => {
    return await axios.delete(`${URL}/${id}`);
};