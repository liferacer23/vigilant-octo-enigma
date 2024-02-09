import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { BASE_URL, BOOKS_API_ROUTE, USERS_API_ROUTE } from "./constants";

export const createUser = async (user, setLoading, setUserData) => {
  if (!user.role || !user.email || !user.password || !user.username) return;
  try {
    const response = await axios.post(USERS_API_ROUTE, {
      id: uuidv4(),
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);

    const { password, ...Other } = response.data;
    return Other;
  } catch (err) {
    console.log(err);
  } finally {
  }
};

export const editUser = async (user) => {
  if (!user.email || !user.password || !user.username || !user.id) return;
  try {
    const response = await axios.put(`${USERS_API_ROUTE}/${user.id}`, {
      username: user.username,
      email: user.email,
      password: user.password,
    });

    const { password, ...Other } = response.data;
    return Other;
  } catch (err) {
    console.log(err);
  } finally {
  }
};

export const login = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: user.email,
      password: user.password,
    });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    const { password, ...Other } = response.data;
    return Other;
  } catch (err) {
    console.log(err);
  } finally {
  }
};
export const fetchUserData = async (userId, accessToken) => {
  try {
    const response = await axios.get(`${USERS_API_ROUTE}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { password, ...Other } = response.data;
    return Other;
  } catch (err) {
    console.log(err);
  } finally {
  }
};

export const fetchAllBooks = async () => {
  try {
    const response = await axios.get(BOOKS_API_ROUTE);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const updateBooks = async (updateBooks, id, accessToken) => {
  try {
    const response = await axios.put(
      `${BOOKS_API_ROUTE}/${id}`,
      ...updateBooks,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
