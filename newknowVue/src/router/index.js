import Vue from "vue";
import Router from "vue-router";
import Index from "@/pages/index";
import Know from "@/pages/know";
import Test from "@/pages/test";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "index",
            component: Index
        },
        {
            path: "/know",
            name: "know",
            component: Know
        },
        {
            path: "/test",
            name: "test",
            component: Test
        }
    ]
});
