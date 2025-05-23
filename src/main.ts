import {createApp} from "vue";
import {PullRefresh, BackTop, Icon} from "vant";
import App from "./App.vue";
import videojs from "video.js";
import "vant/lib/index.css";
import "video.js/dist/video-js.css";
import "./style.css";

const app = createApp(App);

app.use(PullRefresh);
app.use(BackTop);
app.use(Icon);

app.mount("#app");
