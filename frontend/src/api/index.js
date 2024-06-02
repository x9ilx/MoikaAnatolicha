export const URL = "http://localhost:8000/";
// export const URL = "";
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

  getSettings() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/settings/1/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  setSettings(data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/settings/1/`, {
      method: "PUT",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...data,
      }),
    }).then(this.checkResponse);
  }

  //////////////////////////////////////////////////// EMPLOYEES

  openShift(employer_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/${employer_id}/open_shift/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  closeShift(employer_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/${employer_id}/close_shift/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

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

  getEmployeesList(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/employees/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getEmployeesAllWashers() {
    const token = cookies.get("auth_token");
    return fetch(
      URL + `/api/employees/?page=${1}&limit=${9999999}&position=WASHER`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getEmployeesAllWashersOnShift() {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/employees/?page=${1}&limit=${9999999}&position=WASHER&on_shift=True`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
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

  getEmployerName(employer_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/${employer_id}/get_employer_name/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getEmployerPosition(employer_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/employees/${employer_id}/get_employer_position/`, {
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

  setWasherOnShift(washer_id, value) {
    const token = cookies.get("auth_token");
    return fetch(
      URL + `/api/employees/${washer_id}/set_washer_on_shift/${value}/`,
      {
        method: "PUT",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getWasherOrders(id_employer, start_date, end_date) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/employees/${id_employer}/get_washer_orders/?start_date=${start_date}&end_date=${end_date}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getAdministratorShiftsForPeriod(admin_id, start_date, end_date) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/employees_shifts/?employer=${admin_id}&start_shift_time=${start_date}&end_shift_time=${end_date}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getAllSalaries(
    current_page = 1,
    items_limit = 8,
    searchEmployer = "",
    dateStart = new Date().toISOString(),
    dateEnd = new Date().toISOString()
  ) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/employees_salaries/?page=${current_page}&limit=${items_limit}&employee_name=${searchEmployer}&start_date_issue=${dateStart}&end_date_issue=${dateEnd}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getSalaryDocPDFURL(id_employer, salary_id) {
    window.open(
      `${URL}/api/employees/${id_employer}/get_salary_pdf/${salary_id}/`,
      "_blank",
      "rel=noopener noreferrer"
    );
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

  getServicesForVehicleType(vehicle_type_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/vehicle_type/${vehicle_type_id}/services/`, {
      method: "GET",
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

  getVehicleFromPlateNumber(plate_number) {
    const token = cookies.get("auth_token");
    return fetch(
      URL + `/api/vehicles/find_vehicle_for_plate_number/${plate_number}/`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
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
    return fetch(URL + `/api/vehicle_type/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
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

  getLegalEntityVehicleServicesList(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/get_vehicle_services/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getLegalEntityServicesList(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/get_services/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getLegalEntityVehicleTypeServicesList(id, vehicle_type_id) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/legal_entity/${id}/get_services_for_vehicle_type/${vehicle_type_id}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  setLegalEntityServicesList(id, data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/set_vehicle_services/`, {
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

  getLegalEntityShortName(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${id}/get_legal_entity_short_name/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getLegalEntityServicesForPeriod(legal_entity_id, start_date, end_date) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity/${legal_entity_id}/get_services_for_period/?start_date=${start_date}&end_date=${end_date}`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }
  
  ////////////////////////////////////////// CONTRACT

  getLegalEntityContracts(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/legal_entity_contracts/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }
  
  createContract(legal_entity_id, start_date, end_date) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_contracts/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        legal_entity: legal_entity_id,
        start_date: start_date,
        end_date: end_date,
      }),
    }).then(this.checkResponse);
  }

  getGetContract(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_contracts/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getContractDocPDFURL(contract_id) {
    window.open(
      `${URL}/api/legal_entity_contracts/${contract_id}/get_contract_pdf/`,
      "_blank",
      "rel=noopener noreferrer"
    );
  }

  deleteLegalEntityContract(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_contracts/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  setContractToCurrent(legal_entity_contract_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_contracts/${legal_entity_contract_id}/set_contract_to_current/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }
  

   ////////////////////////////////////////// INVOICE
   createInvoice(legal_entity_id, start_date, end_date, services) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_invoices/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        legal_entity: legal_entity_id,
        start_date: start_date,
        end_date: end_date,
        services: services,
      }),
    }).then(this.checkResponse);
  }

  getLegalEntityInvoices(page = 1, items_limit = 8, search = "") {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/legal_entity_invoices/?page=${page}&limit=${items_limit}&search=${search}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }
  
  getInvoice(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_invoices/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  deleteLegalEntityInvoice(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/legal_entity_invoices/${id}/`, {
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

  ///////////////////////////////////// ORDERS

  getPaymentMethods() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/get_payment_methods/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  createOrder(data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/`, {
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

  updateOrder(id, data) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/${id}/`, {
      method: "PUT",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        ...data,
      }),
    }).then(this.checkResponse);
  }

  getOrders(
    page = 1,
    items_limit = 9999999,
    isCompleted = false,
    other_filters = ""
  ) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/orders/?page=${page}&limit=${items_limit}&is_completed=${isCompleted}${other_filters}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getCompletedOrdersForDay(page = 1, items_limit = 9999999) {
    const token = cookies.get("auth_token");
    return fetch(
      URL +
        `/api/orders/get_complete_order_for_day/?page=${page}&limit=${items_limit}`,
      {
        method: "GET",
        headers: {
          ...this._headers,
          authorization: `Token ${token}`,
        },
      }
    ).then(this.checkResponse);
  }

  getOrder(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/${id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getActiveOrderCount() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/get_active_order_count/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  getClosedOrderCount() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/get_complete_order_count_for_day/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  setOrderClose(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/${id}/set_order_close/`, {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  cancelOrder(id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/orders/${id}/cancel_order/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  ////////////////////////////////////////////////// REQUISITES
  getCompanyRequisites() {
    const token = cookies.get("auth_token");
    return fetch(URL + `/api/company/1/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  //////////////////////////////////// SALARY
  createSalary(
    employer_id,
    start_date,
    end_date,
    employer_salary,
    total_order_income,
    shifts_description,
    orders_description
  ) {
    const token = cookies.get("auth_token");
    return fetch(URL + "/api/employees_salaries/", {
      method: "POST",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        employer_id,
        start_date,
        end_date,
        employer_salary,
        total_order_income,
        shifts_description,
        orders_description,
      }),
    }).then(this.checkResponse);
  }

  getAdministratorSalary(salary_id) {
    const token = cookies.get("auth_token");
    return fetch(URL + `api/employees_salaries/${salary_id}/`, {
      method: "GET",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }

  deleteSalary(id) {
    const token = cookies.get("auth_token");
    return fetch(`${URL}/api/employees_salaries/${id}/`, {
      method: "DELETE",
      headers: {
        ...this._headers,
        authorization: `Token ${token}`,
      },
    }).then(this.checkResponse);
  }
}

// eslint-disable-next-line no-undef
export default new Api(process.env.API_URL || "http://localhost", {
  "content-type": "application/json",
});
