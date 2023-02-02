import "./components/header/header"
import "./components/button-primary/button"
import "./components/button-secondary/button"
import "./components/input/input"
import "./components/pet-card/pet-card"
import "./components/report-info/report-info"

import "./pages/home/home"
import "./pages/login/login"
import "./pages/password/password"
import "./pages/my-data/my-data"
import "./pages/report-pet/report-pet"
import "./pages/edit-pet/edit-pet"
import "./pages/my-reports/my-reports"
import "./router"
import { state } from "./state"
import { initRouter } from "./router"

(function main() {
  state.init()
  initRouter(document.querySelector(".root"))
})();