// handling of refresh token and accesstoken in vue
//  if the server does not detect the access token and refreshtoken authomatically

// import axios from 'axios'

// const api = axios.create({
//   baseURL: 'http://localhost:4000',
// })

import Vue from "vue";
import App from "./App.vue";
import api from "./api";

Vue.config.productionTip = false;

// Interceptor for refreshing the access token
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-token"];
    const newRefreshToken = response.headers["x-refresh-token"];
    if (newToken && newRefreshToken) {
      // Update the stored access token and refresh token with the new ones
      localStorage.setItem("accessToken", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }
    return response;
  },
  (error) => {
    const statusCode = error.response && error.response.status;
    if (statusCode === 401) {
      // Access token expired, attempt to refresh the token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        // Make a request to refresh the access token
        return api
          .post("/refresh", { refreshToken })
          .then((response) => {
            const newToken = response.headers["x-token"];
            const newRefreshToken = response.headers["x-refresh-token"];
            if (newToken && newRefreshToken) {
              // Update the stored access token and refresh token with the new ones
              localStorage.setItem("accessToken", newToken);
              localStorage.setItem("refreshToken", newRefreshToken);
              // Retry the original request with the new access token
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return api(error.config);
            }
            return Promise.reject(error);
          })
          .catch((error) => {
            // Handle refresh token failure or other errors
            // For example, redirect to the login page
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          });
      } else {
        // No refresh token available, redirect to the login page
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

new Vue({
  render: (h) => h(App),
}).$mount("#app");

// handling of refresh token and accesstoken in vue
//  if the server detect the access token and refreshtoken authomatically

import Vue from "vue";
import App from "./App.vue";
import api from "./api";

Vue.config.productionTip = false;

// Interceptor for refreshing the access token
// Interceptor for refreshing the access token
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-token"];
    if (newToken) {
      // Update the stored access token with the new one
      localStorage.setItem("accessToken", newToken);
    }
    return response;
  },
  (error) => {
    const statusCode = error.response && error.response.status;
    if (statusCode === 401) {
      // Access token expired or invalid, handle the error or redirect to the login page
      // For example, you can clear the tokens and redirect to the login page:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

new Vue({
  render: (h) => h(App),
}).$mount("#app");

// Graphql

// api.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

export default client;

// interceptor.js:

import client from "./api";

// Interceptor for refreshing the access token
client.onResponse((response) => {
  const newToken = response.headers.get("x-token");
  if (newToken) {
    // Update the stored access token with the new one
    localStorage.setItem("accessToken", newToken);
  }
  return response;
});

client.onError((error) => {
  const { networkError } = error;
  if (networkError && networkError.statusCode === 401) {
    // Access token expired or invalid, handle the error or redirect to the login page
    // For example, you can clear the tokens and redirect to the login page:
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

// main.js:

import Vue from "vue";
import App from "./App.vue";
import "./interceptor"; // Import the interceptor file

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
