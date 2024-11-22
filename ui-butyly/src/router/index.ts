import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LinkAnalytics from "../views/LinkAnalytics.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/analytics/:id',
            name: 'analytics',
            component: LinkAnalytics,
            props: true
        }
    ]
})
