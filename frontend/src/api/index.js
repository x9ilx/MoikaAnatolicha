const URL = "http://localhost:8000";
import Cookies from "universal-cookie";

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
      const func = res.status < 400 ? resolve : reject;
      res.json().then((data) => {
        func(data)
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

// EMPLOYES

  createEmployer ({
    name,
    short_name,
    phone = '',
    position,
    add_user = false,
    username = '',
    password = ''
  }
  ) {
    const token = cookies.get("auth_token");
    return fetch(
      URL + '/api/employees/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          short_name,
          phone,
          position,
          add_user,
          username,
          password
        })
      }
    ).then(this.checkResponse)
  }

  updateEmployer ({
    id,
    name,
    short_name,
    phone = '',
    position,
    add_user = false,
    username = '',
    password = ''
  }
  ) {
    const token = cookies.get("auth_token");
    return fetch(
       `${URL}/api/employees/${id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          short_name,
          phone,
          position,
          add_user,
          username,
          password
        })
      }
    ).then(this.checkResponse)
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
  
  // getRecipe ({
  //   recipe_id
  // }) {
  //   const token = localStorage.getItem('token')
  //   const authorization = token ? { 'authorization': `Token ${token}` } : {}
  //   return fetch(
  //     `/api/recipes/${recipe_id}/`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         ...this._headers,
  //         ...authorization
  //       }
  //     }
  //   ).then(this.checkResponse)
  // }

  // createRecipe ({
  //   name = '',
  //   image,
  //   tags = [],
  //   cooking_time = 0,
  //   text = '',
  //   ingredients = []
  // }) {
  //   const token = localStorage.getItem('token')
  //   return fetch(
  //     '/api/recipes/',
  //     {
  //       method: 'POST',
  //       headers: {
  //         ...this._headers,
  //         'authorization': `Token ${token}`
  //       },
  //       body: JSON.stringify({
  //         name,
  //         image,
  //         tags,
  //         cooking_time,
  //         text,
  //         ingredients
  //       })
  //     }
  //   ).then(this.checkResponse)
  // }

  // updateRecipe ({
  //   name,
  //   recipe_id,
  //   image,
  //   tags,
  //   cooking_time,
  //   text,
  //   ingredients
  // }, wasImageUpdated) { // image was changed
  //   const token = localStorage.getItem('token')
  //   return fetch(
  //     `/api/recipes/${recipe_id}/`,
  //     {
  //       method: 'PATCH',
  //       headers: {
  //         ...this._headers,
  //         'authorization': `Token ${token}`
  //       },
  //       body: JSON.stringify({
  //         name,
  //         id: recipe_id,
  //         image: wasImageUpdated ? image : undefined,
  //         tags,
  //         cooking_time: Number(cooking_time),
  //         text,
  //         ingredients
  //       })
  //     }
  //   ).then(this.checkResponse)
  // }
}

export default new Api(process.env.API_URL || "http://localhost", {
  "content-type": "application/json",
});
