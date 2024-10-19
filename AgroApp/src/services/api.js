import axios from "axios";

export const endpoints = {
  "token": "/auth/token",

  "get-profile": "/users/profile",
  "change-profile": "/users/change-profile",
  "change-avatar": "/users/change-avatar",
  "change-password": "/users/change-password",
  "register": "/users",

  "get-users": "/admin/users",
  "create-role-users": "/admin/users",
  "admin-change-profile": "/admin/change-profile",

  "list-price": "/prices",
  "price-detail": (productId) => `/prices/detail?productId=${productId}`,
  "update-prices": (priceId) => `/prices/update?id=${priceId}`,

  "inventory": "/inventory",
  "import-inventory": "/inventory",

  "product": "/products",
  "change-product": (id) => `/products/change-product?productId=${id}`,

  "supplier": "/suppliers",
  "change-supplier": (id) => `/suppliers/change-supplier?supplierId=${id}`,

  "purchase-order": "/purchase-orders",
  "purchase-order-detail": (id) => `/purchase-orders/detail?id=${id}`,
  "purchase-order-enter-price": (id) => `/purchase-orders/enter-price?id=${id}`,

  "orders": "/orders",
  "own-orders": "/orders/own",
  "orders-detail": (id) => `/orders/${id}`,
  "confirm-order": (id) => `/orders/confirm?orderId=${id}`,
  "shipping-order": (id) => `/orders/shipping?orderId=${id}`,
  "delivered-order": (id) => `/orders/delivered?orderId=${id}`,
  "cancel-order": (id) => `/orders/cancel?orderId=${id}`,
  "paid-order": (id) => `/orders/paid?orderId=${id}`,

  "payments": "/payments",
  "payments-detail": (id) => `/payments/detail?id=${id}`,
  "pay-payment": (id) => `/payments/paid?id=${id}`,
}

export const ipDomain = "http://192.168.1.3:8080";

export const authApi = (accessToken) =>
  axios.create({
    baseURL: `${ipDomain}/agro`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export default API = () => axios.create({
  baseURL: `${ipDomain}/agro`,
  headers: {
    "Content-type": "application/json",
  },
});

export const login = async (credentials) => {
  try {
    const response = await API().post(endpoints.token, {
      username: credentials.username,
      password: credentials.password,
    });

    return {
      token: response.data.result.token,
      authenticated: response.data.result.authenticated,
    };
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const getProfile = async (token) => {
  try {
    const response = await authApi(token).get(endpoints["get-profile"]);
    return response.data.result;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const changeProfile = async (token, data) => {
  try {
    const response = await authApi(token).post(endpoints["change-profile"],
      data);
    return response.data.result;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const changeAvatar = async (token, data) => {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: data.avatar.uri, // sử dụng uri của ảnh
      type: data.avatar.mimeType, // hoặc loại tương ứng với ảnh
      name: data.avatar.fileName, // tên file
    });

    const url = `${ipDomain}/agro${endpoints["change-avatar"]}`;

    const upload = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    const response = await getProfile(token);

    return response;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const changePassword = async (token, data) => {
  try {
    const response = await authApi(token).post(endpoints["change-password"],
      data);
    return response.data;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const register = async (data) => {
  try {
    const response = await API().post(endpoints.register, data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const registerRoleUser = async (token, data) => {
  try {
    // console.log(token);
    // console.log(data);
    const response = await authApi(token).post(endpoints["create-role-users"], data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const getUsers = async (token, role) => {
  try {
    const response = await authApi(token).get(`${endpoints["get-users"]}?role=${role}`);
    return response.data.result;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const adminChangeProfile = async (token, userId, data) => {
  try {
    const response = await authApi(token)
      .post(`${endpoints["admin-change-profile"]}?userId=${userId}`, data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
}

export const listPrice = async () => {
  try {
    const response = await API().get(endpoints["list-price"]);

    // console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const getInventory = async (token) => {
  try {
    const response = await authApi(token).get(endpoints["inventory"]);
    // console.log(response.data.result)
    return response.data.result;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const listProduct = async () => {
  try {
    const response = await API().get(`${endpoints["product"]}?size=50`);

    // console.log(response.data.result);

    return response.data.result;
  } catch (error) {
    console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
  }
};

export const listSupplier = async (token) => {
  try {
    const response = await authApi(token).get(endpoints["supplier"]);
    // console.log(response.data.result)
    return response.data.result;
  } catch (error) {
    // console.log(error.response.data);
    if (error.response) {
      throw { message: error.response.data.message, code: error.response.data.code };
    }
    throw { message: error.response ? error.response.data : error.message, code: error.response ? error.response.status : 'UNKNOWN' };
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