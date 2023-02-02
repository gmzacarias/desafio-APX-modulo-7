import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";
import { initMapboxReport, mapSearch } from "../../../be-src/lib/mapbox";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

customElements.define("edit-pet-page", class EditPet extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const currentState = state.getState()
    const petNameInputEl = this.querySelector(".editPet-form_name");
    const petNameInput = petNameInputEl.querySelector("input");
    const mapboxMapEl = this.querySelector(".editPet-mapbox-map");
    const mapboxInputEl = this.querySelector(".editPet-mapbox_input");
    const mapboxInput = mapboxInputEl.querySelector("input");
    mapboxInput.setAttribute("type", "search");
    const saveReportButtonEl = this.querySelector(".save-report-button");
    const saveReportButton = saveReportButtonEl.querySelector("button");
    saveReportButton.style.backgroundColor = "var(--red-color-root)";
    const cancelButton = this.querySelector(".cancel-button");
    const unpublishButton = this.querySelector(".unpublish-button");

    /*Reportar Mascota como encontrada*/
    if (currentState.editMode) {
      const foundButton = this.querySelector(".found-button")
      const defaultPetName = petNameInput;
      const defaultMapboxInput = mapboxInput;
      defaultPetName.value = currentState.editPetData.name
      defaultMapboxInput.value = currentState.editPetData.zoneReport
      foundButton.classList.add("active");
      const foundButtonActive = this.querySelector(".found-button.active")
      foundButtonActive.addEventListener("click", () => {
        state.reportFound(currentState.editPetData.id)
        console.log("Mascota Encontrada")
        Router.go("/myReports")
      });
    }

    /*Despublicar Reporte*/
    unpublishButton.addEventListener("click", () => {
      state.deletePet(currentState.editPetData.id).then(() => {
        console.log("Reporte despublicado")
        Router.go("/myReports")
      })
    });

    /*Cancelar edicion del Reporte*/
    cancelButton.addEventListener("click", () => {
      currentState.editMode = false
      currentState.editPetData = ""
      Router.go("/home")
    });

    //Dropzone
    const dropzoneImg: any = this.querySelector(".editPet-dropzone_img");
    const dropzoneButton = this.querySelector(".editPet-dropzone_button");
    const dropzoneBTNAddFile = dropzoneButton.querySelector("button");

    let myDropzone = new Dropzone((dropzoneBTNAddFile), {
      url: `/falsa`,
      autoProcessQueue: false,
      maxFiles: 1,
      thumbnailWidth: 500,
      thumbnailHeight: 375,
    });

    let imageURL: string
    myDropzone.on("thumbnail", (file) => {
      dropzoneImg.src = file.dataURL;
      imageURL = file.dataURL;
    });

    //Definir latitud y longitud || obtener la ubicacion de la mascota desde el modo editar.
    let currentLat, currentLng
    if (currentState.lat && currentState.lng) {
      currentLat = currentState.lat
      currentLng = currentState.lng
    } else if (currentState.editMode) {
      currentLat = currentState.editPetData.lat
      currentLng = currentState.editPetData.lng
      state.myCurrentGeoLocation(currentLng, currentLat);
    }

    //se ingresa una direccion/ubicacion/latitud o longitud y se obtiene un marcador en el mapa
    let searchCoordinates;
    initMapboxReport(mapboxMapEl, currentLat, currentLng).then((map) => {
      const marker = new mapboxgl.Marker({ "color": "#b40219" });
      marker.setLngLat([currentLng, currentLat]).addTo(map);
      state.myCurrentGeoLocation(currentLng, currentLat);

      mapboxInputEl.addEventListener("search", (e) => {
        searchCoordinates = mapboxInput.value;
        mapSearch(searchCoordinates, (results) => {
          const firstResult = results[0];
          const [lng, lat] = firstResult?.geometry.coordinates;
          marker.setLngLat([lng, lat])
          map.setCenter([lng, lat]);
          map.setZoom(14);
          state.myCurrentGeoLocation(lng, lat);
          console.log(`La direccion ingresada es ${firstResult.place_name_es}`)
        });
      });

    });


    //Reportar una mascota , a partir de los datos ingresados
    saveReportButtonEl.addEventListener("click", () => {
      let petName = petNameInput.value;
      let petData = {
        petName: petName,
        imageURL: imageURL,
        lat: currentState.petToReportLat,
        lng: currentState.petToReportLng,
        zoneReport: searchCoordinates
      }
      if (currentState.editMode) {
        state.updatePet(petData).then(() => {
          currentState.editMode = false
          currentState.petToEdit = ""
          state.setState(currentState)
          console.log("Mascota Actualizada")
          Router.go("/myReports")
        })
      }
    });

  }
  render() {
    const currentState = state.getState()
    var defaultImg = require("../../assets/default-image.jpg");
    if (currentState.editMode) {
      defaultImg = currentState.editPetData.imageURL
    }
    this.innerHTML = `
    <header-component ></header-component>
    <section class="editPet-container">
      <h2 class="editPet-title">Editar mascota perdida</h2>
      <div class="editPet-form">
        <label class="editPet-form_label">Nombre</label>
        <input-component class="editPet-form_name" ></input-component>
        <div class="editPet-dropzone-container">
          <img class="editPet-dropzone_img"src=${defaultImg}></img>
          <button-secondary class="editPet-dropzone_button">Agregar/modificar foto</button-secondary>
        </div>
        <div class="editPet-mapbox-container">
          <div class="editPet-mapbox-map" style="width:-webkit-fill-available; height:200px;"></div>
          <div class="editPet-mapbox_input-container">
            <label class="editPet-form_label" style="display:block">Ubicacion</label>
            <input-component class="editPet-mapbox_input" type="text"></input-component>
          </div>
          <p class="editPet-info-text">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
        </div>
      </div>
        <button-secondary class="save-report-button buttons">Guardar</button-secondary>
        <button-secondary class="found-button buttons">Reportar como encontrado</button-secondary>
        <button-primary class="unpublish-button buttons">Despublicar</button-primary>
        <button-primary class="cancel-button buttons">Cancelar</button-primary>
    </section>
    `;


    const style = document.createElement("style");
    style.innerHTML = `
    .editPet-container{
      width: 500px;
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

    .editPet-title{
      width: 480px;
      height: 157px;
      padding: 20px;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
    }

    .editPet-form{
      width:100%;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .editPet-form_label{
      font-size:16px;
      font-weight:500;
    }
                                 
    /*Dropzone*/
    .editPet-dropzone-container{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:20px;
    }

    .editPet-dropzone_img{
      width:500px;
      height:375px;
    }
  
    .editPet-dropzone_button{
      width:100%;
    }

    .dz-preview{
      display:none;
    }

    /*Mapbox*/
    .editPet-mapbox-container{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
    }
    
    .editPet-mapbox_input-container{
      width: 100%;
      display: flex;
      gap: 5px;
      flex-direction:column;
    }

    .mapbox-button{
      width:80px;
    }

    .editPet-info-text{
      font-weight:500;
      text-align:left;
    }
    
    .buttons{
      display:flex;
      width:100%;
    }

    .founded-button{
      display:none;
    }

    .founded-button.active{
      display:flex;
    }

    .delete-report-button{
      display:none;
    }

    .delete-report-button.active{
      display:flex;
      text-decoration:none;
      cursor:pointer;
    }
    `;
    this.appendChild(style);
    this.addListeners();
  }
}
);
