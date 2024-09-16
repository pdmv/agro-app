import axios from "axios";

export const endpoints = {
  "token": "/auth/token",
}

export const authApi = (accessToken) =>
  axios.create({
    baseURL: "http://localhost:8080/agro",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default API = axios.create({
  baseURL: "http://10.0.0.101:8080/agro",
  headers: {
    "Content-type": "application/json",
  },
});

export const login = async (credentials) => {
  try {
    const response = await API.post(endpoints.token, {
      username: credentials.username,
      password: credentials.password,
    });

    // Trả về token và trạng thái authenticated từ result
    return {
      token: response.data.result.token,
      authenticated: response.data.result.authenticated,
    };
  } catch (error) {
    console.log(error)
    // Xử lý lỗi từ API khi đăng nhập thất bại
    if (error.response && error.response.data.code === 1005) {
      throw new Error(error.response.data.message);
    }
    throw error.response ? error.response.data : error.message;
  }
};

// axios.get('http://10.0.0.101:8080/agro/auth/test-cors')
//   .catch(function (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       // console.log(error.response.data);
//       // console.log(error.response.status);
//       // console.log(error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       // console.log(error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       // console.log('Error', error.message);
//     }
//     // console.log(error.config);
//   });