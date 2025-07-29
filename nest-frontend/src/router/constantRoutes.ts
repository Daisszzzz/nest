/**
 * @description 📚 Route Parameter Configuration Overview
 * @param path ==> Menu Path
 * @param name ==> Menu Alias
 * @param redirect ==> Redirect Address
 * @param component ==> View File Path
 * @param meta ==> Menu Information
 * @param meta.icon ==> Menu Icon
 * @param meta.title ==> Menu Title
 * @param meta.activeMenu ==> The menu that needs to be highlighted when the current route is a detail page
 * @param meta.isLink ==> Is it an external link
 * @param meta.isHide ==> Is it hidden
 * @param meta.isFull ==> Is it fullscreen (Example: Data Dashboard Page)
 * @param meta.isAffix ==> Is it fixed in the tabs nav
 * @param meta.isKeepAlive ==> Is it cached
 * */

import { RouteRecordRaw } from 'vue-router'
import { HOME_URL, LOGIN_URL } from '@/config/config'

const LAYOUT = () => import('@/layouts/index.vue')

/**
 * @description Static Routes
 */
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: LOGIN_URL,
    name: 'login',
    meta: {
      isHide: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      isHide: true,
    },
    component: () => import('@/views/error/error-404.vue'),
  },
  {
    path: '/',
    name: 'LAYOUT',
    component: LAYOUT,
    redirect: HOME_URL,
    meta: {
      title: 'Home Page',
      icon: 'HomeFilled',
      isHide: false,
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: 'Home Page',
          icon: 'HomeFilled',
          affix: true,
        },
      },
      {
        path: '/system/user',
        component: () => import('@/views/system/user/user.vue'),
        meta: {
          title: 'Staff List',
          icon: 'UserFilled',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/system/post',
        component: () => import('@/views/system/post/post.vue'),
        meta: {
          title: 'Position List',
          icon: 'Postcard',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/apartmentManagement/apartmentManagement/apartmentManagement',
        component: () =>
          import(
            '@/views/apartmentManagement/apartmentManagement/apartmentManagement.vue'
          ),
        meta: {
          title: 'Building List',
          icon: 'OfficeBuilding',
          isHide: false,
          activeMenu: '',
        },
        children: [],
      },
      {
        path: '/apartmentManagement/apartmentManagement/addOrEditApartment',
        component: () =>
          import(
            '@/views/apartmentManagement/apartmentManagement/components/addOrEditApartment.vue'
          ),
        meta: {
          title: 'Apartment Details',
          icon: 'Document',
          isHide: true,
          activeMenu:
            '/apartmentManagement/apartmentManagement/apartmentManagement',
        },
        children: [],
      },
      {
        path: '/apartmentManagement/roomManagement/roomManagement',
        component: () =>
          import(
            '@/views/apartmentManagement/roomManagement/roomManagement.vue'
          ),
        meta: {
          title: 'Room List',
          icon: 'House',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/apartmentManagement/roomManagement/addOrEditRoom',
        component: () =>
          import(
            '@/views/apartmentManagement/roomManagement/components/addOrEditRoom.vue'
          ),
        meta: {
          title: 'Room Details',
          icon: 'Document',
          isHide: true,
          activeMenu: '/apartmentManagement/roomManagement/roomManagement',
        },
        children: [],
      },
      {
        path: '/apartmentManagement/attributeManagement/attributeManagement',
        component: () =>
          import(
            '@/views/apartmentManagement/attributeManagement/attributeManagement.vue'
          ),
        meta: {
          title: 'Attribute List',
          icon: 'List',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/rentManagement/appointment/appointment',
        component: () =>
          import('@/views/rentManagement/appointment/appointment.vue'),
        meta: {
          title: 'Appointment List',
          icon: 'Clock',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/agreementManagement/agreement/agreement',
        component: () =>
          import('@/views/rentManagement/agreement/agreement.vue'),
        meta: {
          title: 'Lease List',
          icon: 'CreditCard',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
      {
        path: '/rentManagement/agreement/addOrEditAgreement',
        component: () =>
          import(
            '@/views/rentManagement/agreement/components/addOrEditAgreement.vue'
          ),
        meta: {
          title: 'Lease Details',
          icon: null,
          isHide: true,
          activeMenu: '/agreementManagement/agreement/agreement',
        },
        children: [],
      },
      {
        path: '/userManagement/userManagement',
        component: () => import('@/views/userManagement/userManagement.vue'),
        meta: {
          title: 'User Management',
          icon: 'UserFilled',
          isHide: false,
          activeMenu: null,
        },
        children: [],
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    meta: {
      isHide: true,
    },
    component: () => import('@/views/error/error-404.vue'), // This is my own path
  },
]
