import "dotenv/config";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl'
import * as MapboxClient from "../../node_modules/mapbox/lib/mapbox.js";

const mapboxClient=new MapboxClient(process.env.MAPBOX_ACCESS_TOKEN)

export async function initMapboxReport(mapEl: Element, lat: number, lng: number) {
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  return await new mapboxgl.Map({
    container: mapEl as HTMLElement,
    center: [lng, lat],
    zoom: 14,
    style: "mapbox://styles/mapbox/streets-v11",
  })
}


export function mapSearch(location:string, callback) {
  mapboxClient.geocodeForward(location, {
    country: "ar", autocomplete: true, language: "es",
  },
    function (err, data, res) {
      if (!err) callback(data.features);
    }

  );

}


