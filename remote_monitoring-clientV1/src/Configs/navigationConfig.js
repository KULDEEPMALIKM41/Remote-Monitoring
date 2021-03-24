import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/dashboard",
  },
  {
    id: "users",
    title: "Users",
    type: "item",
    icon: <Icon.User size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/users-details",
  },
  {
    id: "clubs",
    title: "Clubs",
    type: "item",
    icon: <Icon.Briefcase size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/clubs-details"
  },
  // {
  //   id: "club_level",
  //   title: "Club Level",
  //   type: "item",
  //   icon: <Icon.Server size={20} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/pages/faq"
  // },
]

export default navigationConfig
