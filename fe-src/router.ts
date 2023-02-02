import { Router } from "@vaadin/router"
export function initRouter(rootEl: Element) {

  const router = new Router(rootEl);

  router.setRoutes([
    { path: '/', component: 'home-page' },
    { path: '/home', component: 'home-page' },
    { path: '/login', component: 'login-page' },
    { path: '/myData', component: 'mydata-page' },
    { path: '/password', component: 'password-page' },
    { path: '/reportPet', component: 'report-pet-page' },
    { path: '/editPet', component: 'edit-pet-page' },
    { path: '/myReports', component: 'myreports-page' },

  ]);
  if (location.pathname === "/") {
    Router.go("/home");
  }
}
