const URL = "http://localhost:8000"

class Api {
  constructor (url, headers) {
    this._url = url
    this._headers = headers
  }

  checkResponse (res) {
    return new Promise((resolve, reject) => {
      if (res.status === 204) {
        return resolve(res)
      }
      const func = res.status < 400 ? resolve : reject
      res.json().then(data => func(data))
    })
  }

  signin ({ username, password }) {
    console.log(username)
    console.log(password)
    return fetch(
      URL + '/api/auth/token/login/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          username, password
        })
      }
    ).then(this.checkResponse)
  }

  signout () {
    const token = localStorage.getItem('token')
    return fetch(
      URL + '/api/auth/token/logout/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  signup ({ email, password, username, first_name, last_name }) {
    return fetch(
      URL + `/api/users/`,
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password, username, first_name, last_name
        })
      }
    ).then(this.checkResponse)
  }

  getUserData () {
    const token = localStorage.getItem('token')
    return fetch(
      URL + `/api/users/me/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
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

export default new Api(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })