import {createRouter, createWebHistory} from 'vue-router'
import {generateRandomString} from "@/utils/index.js";


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            redirect: () => {
                const randomString = generateRandomString(5, 10);
                return `/${randomString}`;
            }
        },
        {
            path: '/',
            redirect: () => {
                const randomString = generateRandomString(5, 10);
                return `/${randomString}`;
            }
        },
        {
            path: '/:randomPath(\\S{5,})',
            component: () => import('@/views/HomeView.vue'),
        }, {
            path: '/:randomPath(\\S{1,4})',
            redirect: () => {
                return `/`;
            }
        }
    ]
})

export default router
