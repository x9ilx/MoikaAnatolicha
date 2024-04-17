import React from "react";
const URL = "http://localhost:8000/";
// const URL = "";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { COOKIES_LIFE_TIME } from "../constants";

const cookies = new Cookies(null, { path: "/" });
class Api {
  constructor(url, headers) {
    this._url = url;
    this._headers = headers;
  }

  checkResponse(res) {
    return new Promise((resolve, reject) => {
      if (res.status === 204) {
        return resolve(res);
      }
      if (res.status === 401) {
        cookies.remove("auth_token");
        cookies.remove("employer_info");
        cookies.set("loggedIn", false, {
          path: "/",
          maxAge: COOKIES_LIFE_TIME,
        });
        window.location.replace("/");
      }
      const func = res.status < 400 ? resolve : reject;
      res.json().then((data) => {
        func(data);
      });
    });
  }

  signin({ username, password }) {
    return fetch(URL + "/api/auth/token/login/", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(this.checkResponse);
  }

  signout() {
    const token = cookies.get("auth_token");
    return fetch(URL + "/api/auth/token/logout/", {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  signup({ email, password, username, first_name, last_name }) {
    return fetch(URL + `/api/users/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        email,
        password,
        username,
        first_name,
        last_name,
      }),
    }).then(this.checkResponse);
  }

  getUserData() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/users/me/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  //////////////////////////////////////////////////// COMPANY

  getRequisites() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/company/1/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  setRequisites(requisites) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/company/1/`, {
      method: "PUT",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...requisites,
      }),
    }).then(this.checkResponse);
  }
  //////////////////////////////////////////////////// EMPLOYES

  createEmployer({
    name,
    short_name,
    phone = "",
    position,
    add_user = false,
    username = "",
    password = "",
  }) {
    const token = cookies.get("auth_token");
    return fetch(URL + "/api/employees/", {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name,
        short_name,
        phone,
        position,
        add_user,
        username,
        password,
      }),
    }).then(this.checkResponse);
  }

  updateEmployer({
    id,
    name,
    short_name,
    phone = "",
    position,
    add_user = false,
    username = "",
    password = "",
  }) {
    const token = cookies.get("auth_token");
    return fetch(`${URL}/api/employees/${id}/`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name,
        short_name,
        phone,
        position,
        add_user,
        username,
        password,
      }),
    }).then(this.checkResponse);
  }

  deleteEmployer(id) {
    const token = cookies.get("auth_token");
    return fetch(`${URL}/api/employees/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getEmployer(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getEmployeesList(page = 1, items_limit = 8) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/?page=${page}&limit=${items_limit}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getEmployeesPositions() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/get_all_position/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getFreeWashers() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/get_free_washers_count/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  /////////////////////////////// VEHICLES

  getVehicleClasses(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/vehicle_class/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getVehicleClass(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicle_class/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicleModels(search) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicles/models/?search=${search}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicleTypesForVehicleClass(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicle_class/${id}/get_vehicle_types/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  createVehicleClass({ name, vehicle_types = [] }) {
    const token = cookies.get("auth_token");
    return fetch(URL + "/api/vehicle_class/", {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name,
        vehicle_types,
      }),
    }).then(this.checkResponse);
  }

  updateVehicleClass({ id, name, vehicle_types }) {
    const token = cookies.get("auth_token");
    return fetch(`${URL}/api/vehicle_class/${id}/`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        name,
        vehicle_types,
      }),
    }).then(this.checkResponse);
  }

  deleteVehicleClass(id) {
    const token = cookies.get("auth_token");
    return fetch(`${URL}/api/vehicle_class/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicles(search = "", excludes = []) {
    const token = cookies.get("auth_token");
    const excludesString = excludes
      ? excludes.map((exclude) => `&exclude=${exclude}`).join("")
      : "";
    return fetch(URL + `/api/vehicles/?search=${search}${excludesString}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicle(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicles/${id}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehiclesList(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL + `/api/vehicles/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  createVehicle(vehicle) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicles/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...vehicle,
      }),
    }).then(this.checkResponse);
  }

  updateVehicle(id, vehicle) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicles/${id}/`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...vehicle,
      }),
    }).then(this.checkResponse);
  }

  getVehicleOwners(page, items_limit, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/legal_entity/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  deleteVehicle(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicles/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  deleteVehicleModel(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicle_models/delete/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicleTypes() {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/vehicle_type/`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }
  
  ////////////////////////////////////////// LEGAL ENTITIES
  getLegalEntities(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/legal_entity/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getLegalEntity(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  updateLegalEntity(id, requisites) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/`, {
      method: "PUT",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...requisites,
      }),
    }).then(this.checkResponse);
  }

  createLegalEntity(requisites) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...requisites,
      }),
    }).then(this.checkResponse);
  }

  deleteLegalEntity(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  ////////////////////////////////////////// SERVICES

  getServices(search = "") {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/?search=${search}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getService(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getVehicleTypesForService(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/${id}/vehicle_types/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  createService(data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...data,
      }),
    }).then(this.checkResponse);
  }

  updateService(id, data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/${id}/`, {
      method: "PATCH",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...data,
      }),
    }).then(this.checkResponse);
  }
  
  deleteService(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/services/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }
  





}

export default new Api(process.env.API_URL || "http://localhost", {
  "content-type": "application/json",
});
