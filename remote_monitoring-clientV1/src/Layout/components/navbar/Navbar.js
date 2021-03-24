import React from "react"
import { Navbar, NavItem, NavLink, UncontrolledTooltip } from "reactstrap"
import { connect } from "react-redux"
import classnames from "classnames"
// import { useAuth0 } from "../../../authServices/auth0/auth0Service"
import { history } from "../../../history"
import {
  Eye,
  Code,
  Menu,
  CheckSquare,
  MessageSquare,
  Mail,
  Calendar,
  Star,
  Search,
  Bell,
  PlusSquare,
  DownloadCloud,
  AlertTriangle,
  CheckCircle,
  File,
  Power,
  User,
  Heart
} from "react-feather"
import NavbarBookmarks from "./NavbarBookmarks"
import NavbarUser from "./NavbarUser"
import userImg from "../../../assets/img/portrait/small/avatar-s-11.jpg"

const handleNavigation = (e, path) => {
  e.preventDefault()
  history.push(path)
}

const ThemeNavbar = props => {
  const colorsArr = [ "primary", "danger", "success", "info", "warning", "dark"]
  const navbarTypes = ["floating" , "static" , "sticky" , "hidden"]
  return (
    <React.Fragment>
      <div className="content-overlay" />
      <div className="header-navbar-shadow" />
      <Navbar
        className={classnames(
          "header-navbar navbar-expand-lg navbar navbar-with-menu navbar-shadow",
          {
            "navbar-light": props.navbarColor === "default" || !colorsArr.includes(props.navbarColor),
            "navbar-dark": colorsArr.includes(props.navbarColor),
            "bg-primary":
              props.navbarColor === "primary" && props.navbarType !== "static",
            "bg-danger":
              props.navbarColor === "danger" && props.navbarType !== "static",
            "bg-success":
              props.navbarColor === "success" && props.navbarType !== "static",
            "bg-info":
              props.navbarColor === "info" && props.navbarType !== "static",
            "bg-warning":
              props.navbarColor === "warning" && props.navbarType !== "static",
            "bg-dark":
              props.navbarColor === "dark" && props.navbarType !== "static",
            "d-none": props.navbarType === "hidden" && !props.horizontal,
            "floating-nav":
              (props.navbarType === "floating" && !props.horizontal) || (!navbarTypes.includes(props.navbarType) && !props.horizontal),
            "navbar-static-top":
              props.navbarType === "static" && !props.horizontal,
            "fixed-top": props.navbarType === "sticky" || props.horizontal,
            "scrolling": props.horizontal && props.scrolling

          }
        )}
      >
        <div className="navbar-wrapper">
          <div className="navbar-container content">
            <div
              className="navbar-collapse d-flex justify-content-between align-items-center"
              id="navbar-mobile"
            >
              <div className="bookmark-wrapper">
                {/* <NavbarBookmarks
                  sidebarVisibility={props.sidebarVisibility}
                  handleAppOverlay={props.handleAppOverlay}
                /> */}
                <div className="mr-auto float-left bookmark-wrapper d-flex align-items-center">
                <ul className="navbar-nav d-xl-none d-none">
                  <NavItem className="mobile-menu mr-auto">
                    <NavLink className="nav-menu-main menu-toggle hidden-xs is-active">
                      <Menu className="ficon" />
                    </NavLink>
                  </NavItem>
                </ul>
                <ul className="nav navbar-nav bookmark-icons">
                  {/* <NavItem className="nav-item d-none d-lg-block">
                    <NavLink to="/app-todo" id="appTodo">
                      <CheckSquare size={21} />
                    </NavLink>
                  </NavItem> */}
                  <NavItem className="nav-item d-lg-block">
                    <NavLink onClick={e => handleNavigation(e, "/chat")}>
                      <MessageSquare id="positionBottom" className="text-warning" size={21} />
                      <UncontrolledTooltip placement="bottom" target="positionBottom">
                        Chat
                      </UncontrolledTooltip>
                    </NavLink>
                  </NavItem>
                  {localStorage.getItem('authToken') && localStorage.getItem('context') ? JSON.parse(localStorage.getItem('context')).user_type == 'P' ?
                  <NavItem className="nav-item  d-lg-block">
                    <NavLink onClick={e => handleNavigation(e, "/search-doctors")}>
                      <button
                        className="ml-1 search-doctor-button" color="flat-primary">
                          Search Doctors
                      </button>
                    </NavLink>
                  </NavItem> : null : 
                  history.push({pathname: "/"})
                  }
                  
                  {/* <NavItem className="nav-item d-none d-lg-block">
                    <NavLink>
                      <Mail size={21} />
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-item d-none d-lg-block">
                    <NavLink>
                      <Calendar size={21} />
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-item d-none d-lg-block">
                    <NavLink>
                      <Star className="text-warning" size={21} />
                    </NavLink>
                  </NavItem> */}
                </ul>
              </div>
              </div>
              {props.horizontal ? (
                <div className="logo d-flex align-items-center">
                  <div className="brand-logo mr-50"></div>
                  <h2 className="text-primary brand-text mb-0">Remote Monitoring</h2>
                </div>
              ) : null}
               { localStorage.getItem('authToken') && localStorage.getItem('context') ? 
              <NavbarUser
                handleAppOverlay={props.handleAppOverlay}
                changeCurrentLang={props.changeCurrentLang}
                userName={JSON.parse(localStorage.getItem('context')).first_name+ ' ' + JSON.parse(localStorage.getItem('context')).last_name}
                userImg={
                  require("../../../assets/img/portrait/small/dummy-profile-pic.png")
                }
                loggedInWith={
                  props.user !== undefined &&
                  props.user.login.values !== undefined
                    ? props.user.login.values.loggedInWith
                    : null
                } 
              />  : history.push({pathname: "/"}) }
            </div> 
          </div>
        </div>
      </Navbar>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps, {})(ThemeNavbar)
