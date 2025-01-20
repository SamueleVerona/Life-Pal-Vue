import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import BaseButton from "./components/base/BaseButton.vue";
import BaseDialog from "./components/base/BaseDialog.vue";
import BaseCard from "./components/base/BaseCard.vue";
import ListItem from "./components/base/ListItem.vue";
import store from "../src/store/index.js";

const app = createApp(App);
app.component("base-button", BaseButton);
app.component("base-dialog", BaseDialog);
app.component("base-card", BaseCard);
app.component("list-item", ListItem);

app.use(router);
app.use(store);

router.isReady().then(() => app.mount("#app"));
