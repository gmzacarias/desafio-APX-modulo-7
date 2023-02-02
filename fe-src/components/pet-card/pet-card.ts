import { Router } from "@vaadin/router"
import { state } from "../../state";

customElements.define("pet-card", class PetCard extends HTMLElement {
  name: string;
  source: string;
  petId: string;
  reportable: string;
  found: string;
  zoneReport: string;
  constructor() {
    super()
  }
  connectedCallback() {
    this.name = this.getAttribute("name")
    this.source = this.getAttribute("source")
    this.petId = this.getAttribute("id")
    this.found = this.getAttribute("found")
    this.reportable = this.getAttribute("reportable") || "true"
    this.zoneReport = this.getAttribute("zone") || "Sin detalle del lugar"

    this.render()
  }
  addListeners() {
    const petId = this.petId;
    const petName = this.name;
    const currentState = state.getState()
    const cardContainer = this.querySelector(".card-container");
    const petImgEl = this.querySelector(".card_img-source");
    const editPetButton = this.querySelector(".card_edit-pet");
    const reportInfo = this.querySelector(".card_report-info");
    const deletePet = this.querySelector(".card_delete-pet");

    if (this.reportable == "false") {
      reportInfo.classList.add("no-report");
      editPetButton.classList.add("no-report");
    }

    editPetButton.addEventListener("click", async () => {
      let requestPets
      if (!currentState.pets) {
        let pets = await state.getMyPets()
        requestPets = pets.find(p => p.id == this.petId)
      } else {
        requestPets = currentState.userPets.find(p => p.id == this.petId)
      }

      currentState.editPetData = requestPets
      currentState.editMode = true
      state.setState(currentState)
      Router.go("/editPet")
    })

    /*Eliminar Reporte de la mascota*/
    if (this.found == "true") {
      this.reportable = "false"
      cardContainer.classList.add("found");
      editPetButton.classList.remove("no-report");
      petImgEl.classList.add("found");
      deletePet.classList.add("found");
      deletePet.addEventListener("click", () => {
        state.deletePet(this.petId)
        console.log("Reporte eliminado,gracias por colaborar")
        location.reload()
      })
    }
    reportInfo.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("report", {
          detail: {
            petId,
            petName
          },
          bubbles: true
        }))
    })
  };

  render() {
    let petbusqueda = "";
    if (this.found == "true") {
      petbusqueda = "Encontrado"
    } else {
      petbusqueda = "Perdido"
    };
    this.innerHTML = `
    <section class="card-container">
      <div class="card_img-container">
        <img class="card_img-source" src=${this.source}></img>
      </div>
      <div class="card_text-container">
        <h3>${this.name}</h3>
        <h4>${this.zoneReport}</h4>
        <h4>
          <p>Estado:${petbusqueda}</p>
        </h4>
        <a class="card_report-info">Reportar información</a>
        <a class="card_delete-pet">Eliminar</a>
      </div>
      <i class="fa-solid fa-pen-to-square card_edit-pet"></i>
    </section>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .card-container{
      background-color:var(--white-color-root);
      border: solid 2px var(--grey-bordercolor-root);
      border-radius: 30px 70px;
      width:250px;
      height:310px;
      padding:20px;
      display:flex;
      flex-direction:column;
      gap:10px;
      font-family:var(--font-family-root);
      color:var(--blue-color-root);
      font-size: 17px;
      font-weight: bold;
    }
        
    .card-container.found{
      border-color:var(--green-color-root);
      border: solid 2px var(--green-color-root);
    }

    .card_img-source{
      width: 150px;
      height: 150px;
      border: solid 4px var(--red-color-root);
      border-radius: 80px;
      object-fit: fill;
    }

    .card_img-source.found{
      border: solid 4px var(--green-color-root);
    }

    .card_img-container{
      display:flex;
      justify-content:center;
    }

    .card_text-container{
      display:flex;
      flex-direction:column;
      justify-content:space-between;
    }

    .card_report-info{
      margin: 5px;
      display: flex;
      justify-content: center;
      text-align:center;
      text-decoration: none;
      cursor: pointer;
    }
    
    .card_report-info.no-report{
      display:none;
    }

    .card_edit-pet{
      display:none;
    }

    .card_edit-pet.no-report{
      top: -95px;
      left: 182px;
      display: flex;
      cursor: pointer;
      position: relative;
      z-index: 2;
    }
         
    .card_delete-pet{
      display:none;
    }

    .card_delete-pet.found{
      margin: 5px;
      display: flex;
      justify-content: center;
      font-size: 20px;
      text-decoration: none;
      cursor: pointer;
    }

    .fa-pen-to-square{
      font-size: 30px;
    }           
    `;
    this.appendChild(style)
    this.addListeners()
  }

})