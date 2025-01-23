import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import BaseDialog from "./components/base/BaseDialog.vue";
import ListItem from "./components/base/ListItem.vue";
import store from "../src/store/index.js";
import "./assets/styles/fonts.css";

const app = createApp(App);
app.component("base-dialog", BaseDialog);
app.component("list-item", ListItem);

app.use(router);
app.use(store);

router.isReady().then(() => app.mount("#app"));
