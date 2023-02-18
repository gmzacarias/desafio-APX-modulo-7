import { Router } from "@vaadin/router"
import { state } from "../../state"

customElements.define("myreports-page", class MyReportsPage extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const currentState = state.getState()
    if (!currentState.loggedInUser && !currentState.newUser) {
      Router.go("/login")
    }
    this.render();
  };
  async addListeners() {
    const currentState = state.getState();
    const noPetsEl = document.querySelector(".myReports_message-noPets");
    const petsContainer = this.querySelector(".myReports_pets-container");
    const pets = await state.getMyPets()
    if (pets.length > 0) {

      pets.forEach((pet) => {
        const petCard = document.createElement("pet-card")
        petCard.setAttribute("id", (pet.id).toString())
        petCard.setAttribute("reportable", "false")
        petCard.setAttribute("name", pet.name)
        petCard.setAttribute("source", pet.imageURL)
        petCard.setAttribute("found", pet.found)
        petCard.setAttribute("zone", pet.zoneReport)
        currentState.userPets = pets
        petsContainer.appendChild(petCard)
        console.log(pets)
      })
      state.setState(currentState)
    } else {
      noPetsEl.classList.add("active");
    }
  }

  render() {
    this.innerHTML = `
    <header-component></header-component>
    <section class="myReports-container">
      <h2 class="myReports_title">Mis mascotas reportadas</h2></div>
      <div class="myReports_pets-container"></div> 
      <div class="myReports_message-noPets">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>No hay mascotas reportadas</p>
      </div> 
    </section>
    `;
    const style = document.createElement("style")
    style.innerHTML = `
    .myReports-container{
      width: 90%;
      height: 100%;
      margin: 0 auto;
      padding: 50px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap:20px;  
      font-family:var(--font-family-root);
      color:var(--blue-color-root);
    }
  
    .myReports_title{
      width: 328px;
      height: 163px;
      padding: 20px;
      font-size: 40px;
      font-weight: bold;
      text-align: center;
    }
      
    .myReports_pets-container{
      display: grid;
      grid-template-columns: 250px 1fr;
      column-gap: 10px;
      grid-row-gap: 20px;
    }

    @media(max-width:768px){
      .myReports_pets-container{
        display: grid;
        grid-template-columns: none;
        column-gap: 10px;
        grid-row-gap: 20px;
      }
    }

    /* Popup error */
    
    .myReports_message-noPets {
      top: 50%;
      left: 50%;
      display:none;
      transform: translate(-50%, -50%);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
    
    .myReports_message-noPets.active{
      top:380px;
      width: 280px;
      height: 166px;
      padding: 20px;
      border: solid 2px var(--red-color-root);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      position: absolute;
      z-index: 1;
      transition: all 0.3s ease;
      transform: translate(-50%, -50%) scale(1.2);
    }
    
    .myReports_message-noPets i {
      font-size: 60px;
      color:var(--red-color-root);
    }
    
    .myReports_message-noPets p {
      font-size: 16px;
      color:var(--blue-color-root);
      font-weight:bold;
      text-align: center;
    }
    `;
    this.appendChild(style)
    this.addListeners()
  }
})