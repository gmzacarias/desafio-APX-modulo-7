import { state } from "../../state"

customElements.define("home-page", class HomePage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render()
  }

  async render() {
    this.innerHTML = `
    <header-component></header-component>
    <section class="home-container">
      <h2 class="title-home">Mascotas perdidas cerca tuyo</h2>
      <p class="p-home">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación</p>
      <button-primary class="my-location">mi ubicacion</button-primary>
      <div class="pets-container"></div>
      <div class="report-pet-info__container"></div>
      <div class="popup-error_box">
      <i class="fa-solid fa-circle-exclamation"></i>
      <p class="message">No hay mascotas reportadas</p>
      <button class="close-button">Aceptar</button>
      </div>
      </section>
      `;
    const currentState = state.getState();
    const petContainerEl = this.querySelector(".pets-container");
    const buttonlocation = this.querySelector(".my-location")
    const reportPetInfo = this.querySelector(".report-pet-info__container");
    const showPopup = document.querySelector(".popup-error_box");
    const messageEl = document.querySelector(".message");
    const closePopup = document.querySelector(".close-button");
    closePopup.addEventListener("click", () => {
      showPopup.classList.remove("active")
    });

    buttonlocation.addEventListener("click", (e) => {
      e.preventDefault()
      const myUbication = navigator.geolocation;
      myUbication.getCurrentPosition((position: GeolocationPosition) => {
        currentState.lat = position.coords.latitude;
        currentState.lng = position.coords.longitude;
        state.setState(currentState)

        state.petsAroundMe().then(async (petsRes) => {
          const pets = petsRes.filter((p) => { return p.found == false });

          console.log(pets)

          if (pets < 1) {
            console.log("no hay mascotas reportadas")
            showPopup.classList.add("active");
          } else {
            let myPetsById
            if (currentState.userPets) {
              myPetsById = currentState.userPets.map((p) => { return p.id.toString() })

            } else if (currentState.loggedInUser) {
              let getPets = await state.getMyPets()
              let petsById = getPets.map((p) => { return p.id.toString() })
              myPetsById = petsById
            }

            pets.forEach(pet => {

              const petEl = document.createElement("div");
              petEl.innerHTML = `<pet-card class="pet-card"
              id=${pet.id} 
              source=${pet.imageURL}
              name=${pet.name} 
              zone=${pet.zoneReport} 
              reportable=${myPetsById ? (myPetsById.includes((pet.id).toString()) ? "false" : "true") : "true"}>
              </pet-card>`
              petEl.addEventListener("report", (e: any) => {
                const reportInfoEl = document.createElement("report-info")
                reportInfoEl.setAttribute("id", e.detail.petId)
                reportInfoEl.setAttribute("name", e.detail.petName)
                reportPetInfo.appendChild(reportInfoEl)
              })
              petContainerEl.appendChild(petEl);
            });
          }
        });
      });
    });

    const style = document.createElement("style")
    style.innerHTML = `
    .home-container {
      width: 60%;
      height: 100%;
      margin:0 auto;
      padding: 50px 0;
      display: flex;
      flex-direction:column;
      align-items: center;
      gap: 15px;  
      font-family:var(--font-family-root);
      color:var(--blue-color-root);
    }
    
    .title-home {
      width: 375px;
      height: 218px;
      padding: 20px;
      font-size: 40px;
      font-weight:bold;
      text-align: center; 
    }
    
    .p-home {
      width: 328px;
      height: 80px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      padding: 10px;
    }
    
    .my-location{
      padding:10px 0 30px 0;
    }
    
    .pets-container {
      width:96%;
      display: grid;
      grid-template-columns: 250px 1fr;
      column-gap: 10px;
      grid-row-gap: 20px;
    }

    @media(max-width:768px){
      .pets-container{
        grid-template-columns: none;
        grid-template-rows:310px 1fr;
        grid-row-gap: 10px;
      }
    }


    .pet-card_container {
      display:none;
    }
   
    .pet-card_container.active {
      display:flex;  
    }
  
    /* Popup error */
    .popup-error_box {
      background-color:var(--white-color-root);
      top: 50%;
      left: 50%;
      display:none;
      transform: translate(-50%, -50%);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
        
    .popup-error_box.active{
      top:550px;
      width: 325px;
      height: 171px;
      padding: 20px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      border-radius: 24px;
      position: absolute;
      z-index: 1;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%) scale(1.2);
    }
        
    .popup-error_box i {
      color:var(--red-color-root);
      font-size: 60px;
    }
      
    .popup-error_box p {
      font-size: 16px;
      font-weight:bold;
      text-align: center;
    }
     
    .popup-error_box .close-button {
      top:122px;
      margin: 0 10px;
      padding: 6px 12px;
      font-size: 14px;
      font-weight:bold;
      cursor:pointer;
    }
        
    .close-button {
      background-color: var(--green-color-root);
      padding: 14px 22px;
      border: none;
      border-radius: 6px;
      color: var(--black-color-root);
      font-size: 18px;
      font-weight:bold;
      position:absolute;
    }
   
    `;
    this.appendChild(style);
  };
});