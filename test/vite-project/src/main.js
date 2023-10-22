import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "./style.css";
import App from "./App.vue";
//import router from "./router";
import "primevue/resources/themes/bootstrap4-light-blue/theme.css";

import FileUpload from 'primevue/fileupload';
//import useToast from 'primevue/usetoast';



const app = createApp(App);


app.component("FileUpload", FileUpload);
//app.component("useToast", useToast)
app.use(PrimeVue);
//app.use(useToast)
//app.use(router).mount("#app");
app.mount("#app")