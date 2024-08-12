import React from 'react'
import {
    LuLayoutDashboard,
    LuShapes,
    LuShoppingBag,
    LuTag,
    LuUserCircle
} from 'react-icons/lu'

export const navLinks = [
    {
        url:'/',
        icon: React.createElement(LuLayoutDashboard),
        label: 'Dashboard',
    },
    {
        url:'/collections',
        icon: React.createElement(LuShapes),
        label: 'Collections',
    },
    {
        url:'/products',
        icon: React.createElement(LuShoppingBag),
        label: 'Products',
    },
    {
        url:'/orders',
        icon: React.createElement(LuTag),
        label: 'Orders',
    },
    {
        url:'/customers',
        icon: React.createElement(LuUserCircle),
        label: 'Customers',
    },
]