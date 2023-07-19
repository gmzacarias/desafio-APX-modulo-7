import "dotenv/config";
import { map } from "lodash";

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? "https://desafio-apx-modulo-7.onrender.com"
  : "http://localhost:3000";

export const state = {
  data: {
    myPets: []
  },
  listeners: [],

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },


  getState() {
    console.log(`mi ubicacion es: Lat:${this.data.lat} ,Lng:${this.data.lng}`);
    return this.data;
  },

  getData() {
    const dataJSON = localStorage.getItem("data");
    return JSON.parse(dataJSON);
  },

  initState() {
    const retrievedData = this.getData()
    if (!retrievedData) {
      this.setState({
        data:{
          myPets:[]
        }
      })
    }else {
      return this.setState(retrievedData)
    }
  },

  setState(newState) {
    localStorage.setItem("data", JSON.stringify(newState))
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }

  },

  /*Verificar si el email del usuario existe en la db*/
  async checkUser(email: string) {
    const verifyEmail = await fetch(API_BASE_URL + "/check-email" + "?email=" + email, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    return await verifyEmail.json()
  },

  async checkResponse(email: string) {
    const currentState = this.getState()
    currentState.email = email;
    const userExist = await this.checkUser(email)

    if (userExist) {
      currentState.userId = userExist.id;
      currentState.userName = userExist.userName;
    }
    this.setState(currentState)
    return userExist
  },

  /*Iniciar sesion*/
  async signIn(password: string) {
    const currentState = this.getState()
    const checkToken = await fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentState.email,
        password
      })
    })
    const tokenResponse = await checkToken.json()
    return tokenResponse
  },

  /*Registrarse como nuevo usuario*/
  async signUp(data) {
    const currentState = this.getState()
    const registerUser = await fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data
      })
    })
    const newUser = await registerUser.json()
    currentState.userId = newUser

    this.signIn(data.password).then((token) => {
      currentState.userName = data.userName
      currentState.token = token
      currentState.loggedInUser = true
      this.setState(currentState)
    })
    return newUser
  },



  /*Registrarse o actualizar info sobre el usuario*/
  async signUpOrUpdateUser(userData) {
    const currentState = this.getState()
    const userExist = await this.checkUser(currentState.email)
    var response
    if (userExist) {
      response = await this.updateUser(userData)
    } else {
      response = await this.signUp(userData)
    }
    return response
  },

  /*Actualizar info sobre el usuario*/
  async updateUser(userData) {
    const currentState = this.getState()
    const updateUser = await fetch(API_BASE_URL + "/update-user" + "?userId=" + currentState.userId, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${currentState.token}`,
      },
      body: JSON.stringify(userData)
    })
    const newDataUser = await updateUser.json()
    if (newDataUser.userName) {
      currentState.userName = newDataUser.userName
      this.setState(currentState)
    }
    return
  },

  /*Crear reporte de una mascota*/
  async reportPet(data) {
    const currentState = this.getState()
    const createPet = await fetch(API_BASE_URL + "/create-pet" + "?userId=" + currentState.userId, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${currentState.token}`,
      },
      body: JSON.stringify(data)
    })
    const newPet = await createPet.json()
    return newPet
  },

  /*Actualizar informacion sobre la mascota*/
  async updatePet(data) {
    const currentState = this.getState()
    const updatePet = await fetch(API_BASE_URL + "/update-pet" + "?petId=" + currentState.editPetData.id, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${currentState.token}`,
      },
      body: JSON.stringify(data)
    })
    const updatePetRes = await updatePet.json()
    return updatePetRes
  },


  /*Mi posicion actual determinada por la latitud y longitud*/
  async myCurrentGeoLocation(lng, lat) {
    const currentState = this.getState()
    currentState.petToReportLat = lat
    currentState.petToReportLng = lng
    console.log("lat:", currentState.petToReportLat, " lng:", currentState.petToReportLng);

    this.setState(currentState)
  },

  /*Obtener mascotas cerca de mi ubicacion*/
  async petsAroundMe() {
    const currentState = this.getState()
    const getpetsAroundMe = await fetch(API_BASE_URL + "/pets-around-me" + "?lat=" + currentState.lat + "&lng=" + currentState.lng, {
      method: "get",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const petsToJson = await getpetsAroundMe.json()
    const petsToList = this.dataPets(petsToJson)

    return petsToList
  },

  /*Reportar Mascota*/
  async reportInfo(info, id) {
    const reportPetInfo = await fetch(API_BASE_URL + "/report-pet" + "?petId=" + id, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(info)
    })
    return reportPetInfo
  },

  /*Reportar info sobre una mascota*/
  async reportFound(petId) {
    const currentState = this.getState()
    const reportPetFound = await fetch(API_BASE_URL + "/pet-found" + "?petId=" + petId, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${currentState.token}`,
      }
    })
    const updatePetRes = await reportPetFound.json()
    return updatePetRes
  },


  /*Eliminar mascota por su id*/
  async deletePet(petId) {
    const currentState = this.getState()
    let indexMyPets = currentState.myPets?.indexOf(currentState.myPets.find((pet) => { return pet.id == petId }))
    currentState.myPets?.splice(indexMyPets, 1)
    this.setState(currentState)
    const deletePet = await fetch(API_BASE_URL + "/pet" + "?petId=" + petId, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${currentState.token}`,
      }
    })
    const deletePetRes = await deletePet.json()
    return deletePetRes
  },

  /*Mapeo de los datos de la mascota*/

  async dataPets(data) {
    let dataPetsMap = map(data)
    let dataPetsRes = dataPetsMap.map(pet => {
      return {
        id: pet.id,
        name: pet.name,
        imageURL: pet.image_URL,
        lat: pet.lat,
        lng: pet.lng,
        found: pet.found,
        zoneReport: pet.zone
      }
    })
    return dataPetsRes
  },

  /*Obtener todas las mascotas*/
  async getMyPets() {
    const currentState = this.getState()
    const myPets = await fetch(API_BASE_URL + "/user/pets" + "?userId=" + currentState.userId,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${currentState.token}`,
        }
      })
    let petsToJson = await myPets.json()

    let petsToList = this.dataPets(petsToJson)
    return petsToList
  },

  /*Cerrar sesion del usuario*/
  logOut() {
    this.setState({})
  }
}