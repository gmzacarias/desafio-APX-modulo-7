import { Router } from "@vaadin/router";
import { state } from "../../state";
import Dropzone from "dropzone";
import { initMapboxReport, mapSearch } from "../../../be-src/lib/mapbox";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const defaultLocation = {
  lng: -58.381512,
  lat: -34.603719
};

customElements.define("report-pet-page", class ReportPet extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const currentState = state.getState()
    if (!currentState.loggedInUser && !currentState.newUser) {
      Router.go("/login")
    }
    this.render();
  }

  addListeners() {
    const currentState = state.getState()
    const showPopup = document.querySelector(".popup-error_box");
    const messageEl = document.querySelector(".message");
    const closePopup = document.querySelector(".close-button");
    closePopup.addEventListener("click", () => {
      showPopup.classList.remove("active")
    });

    const petNameInputEl = this.querySelector(".reportPet-form_name");
    const mapboxMapEl = this.querySelector(".reportPet-mapbox_map");
    const mapboxInputEl = this.querySelector(".reportPet-mapbox_input");
    const mapboxInput = mapboxInputEl.querySelector("input");
    mapboxInput.setAttribute("type", "search");
    const reportButtonEl = this.querySelector(".report-button");
    const reportButton = reportButtonEl.querySelector("button");
    reportButton.style.backgroundColor = "var(--red-color-root)";
    const cancelReportButton = this.querySelector(".cancel-report");

    //Dropzone
    const dropzoneImg: any = this.querySelector(".reportPet-dropzone_img");
    const dropzoneButton = this.querySelector(".reportPet-dropzone_button");
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

    //Definir latitud y longitud.
    let currentLat, currentLng
    if (currentState.lat && currentState.lng) {
      currentLat = currentState.lat
      currentLng = currentState.lng
    } else {
      currentLat = defaultLocation.lat
      currentLng = defaultLocation.lng
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
    reportButtonEl.addEventListener("click", () => {
      let petName = petNameInputEl.querySelector("input").value
      let petData = {
        petName: petName,
        imageURL: imageURL,
        lat: currentState.petToReportLat,
        lng: currentState.petToReportLng,
        zoneReport: searchCoordinates,
      }
      if (!petName || !imageURL || !searchCoordinates) {
        showPopup.classList.add("active");
        messageEl.innerHTML = "faltan datos,debes completar todos los campos";
      } else if (petData.petName && petData.imageURL &&
        petData.lat && petData.lng && petData.zoneReport) {
        state.reportPet(petData).then(() => {
          Router.go("/myReports")
        });
      }
    });

    /*Cancelar edicion del Reporte*/
    cancelReportButton.addEventListener("click", () => {
      currentState.editMode = false
      currentState.editPetData = ""
      Router.go("/home")
    });

  }
  render() {
    let defaultImg = require("../../assets/default-image.jpg");
    this.innerHTML = `
    <header-component ></header-component>
    <section class="reportPet-container">
      <h2 class="reportPet-title">Reportar mascota perdida</h2>
        <div class="reportPet-form">
          <label class="reportPet-form_label">Nombre</label>
          <input-component class="reportPet-form_name"></input-component>
          <div class="reportPet-dropzone-container">
            <img class="reportPet-dropzone_img" src=${defaultImg}></img>
            <button-secondary class="reportPet-dropzone_button">Agregar/modificar foto</button-secondary>
          </div>
          <div class="reportPet-mapbox-container">
            <div class="reportPet-mapbox_map" style="width:-webkit-fill-available; height:200px;"></div>
            <div class="reportPet-mapbox_input-container">
              <label class="reportPet-form_label" style="display:block">Ubicacion</label>
              <input-component class="reportPet-mapbox_input"  type="text"></input-component>
            </div>
            <p class="reportPet-info-text">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
          </div>
          <div class="popup-error_box">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h3>Error!</h3>
            <p class="message">${this.innerHTML}</p>
            <button class="close-button">Aceptar</button>
          </div>
          <button-secondary class="report-button">Reportar como perdido</button-secondary>
          <button-primary class="cancel-report">Cancelar</button-primary>
        </div>
    </section>
    `;
    const style = document.createElement("style");
    style.innerHTML = `
    .reportPet-container{
      width: 80%;
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

    .reportPet-title{
      width: 480px;
      height: 157px;
      padding: 20px;
      font-size: 40px;
      font-weight: 700;
      text-align: center;
    }

    .reportPet-form{
      width:100%;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .reportPet-form_label{
      font-size:16px;
      font-weight:500;
    }

    /*Dropzone*/
    .reportPet-dropzone-container{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:20px;
    }

    .reportPet-dropzone_img{
      width:100%;
      height:375px;
    }
  
    .reportPet-dropzone_button{
      width:100%;
    }

    .dz-preview{
      display:none;
    }

    /*Mapbox*/
    .reportPet-mapbox-container{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:10px;
    }

    .reportPet-mapbox_input-container{
      width: 100%;
      display: flex;
      gap: 5px;
      flex-direction:column;
    }

    .reportPet-mapbox_input{
      width:100%;
    }

    .mapbox-button{
      width:80px;
    }
    
    .reportPet-info-text{
      font-weight:500;
      text-align:left;
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
      top:800px;
      width: 325px;
      height: 235px;
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
    .popup-error_box h3 {
      color:var(--black-color-root);
      font-size: 25px;
      font-weight:bold;
    }

    .popup-error_box p {
      color:var(--black-color-root);
      font-size: 16px;
      font-weight:bold;
      text-align: center;
    }
   
    .popup-error_box .close-button {
      top:186px;
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
    this.addListeners();
  }
}
);
