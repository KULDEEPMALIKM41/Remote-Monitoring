import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import classnames from "classnames"
import { User, Info, Share } from "react-feather"
import AccountTab from "./Profile/Account"
import InfoTab from "./Profile/Information"
import DoctorTab from "./Profile/AboutDoctor"
import "../assets/scss/pages/users.scss"
import { getPrifile } from "../redux/services/auth_curd";
import Spinner from "../ToolKit/spinner/Fallback-spinner"
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { history } from "../history"

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};
// const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)

class EditDoctor extends React.Component {
  state = {
    activeTab: "1",
    requestProfileData:false,
  }

  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  }

  componentDidMount(){
    let access = localStorage.getItem('authToken')
    getPrifile(access)
    .then((response) => {
      console.log(response.data)
        this.setState({requestProfileData:response.data})
    }, (error) => {
          console.log(error)
          if(error.response.status === 401){
            errorNotification('Session Expired!')
            localStorage.clear()
            setTimeout(function() { history.push('/'); }, 5000);
        }
    });
  }

  render() {
    return (
      <React.Fragment>
      <ToastContainer autoClose={5000} pauseOnHover draggable closeOnClick/>
      <Row>
        <Col sm="12">
          {this.state.requestProfileData ?
          <Card>
            <CardBody className="pt-2">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1"
                    })}
                    onClick={() => {
                      this.toggle("1")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">Account</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Information</span>
                  </NavLink>
                </NavItem>
                {this.state.requestProfileData.user_type == 'D' ? 
                  <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "3"
                    })}
                    onClick={() => {
                      this.toggle("3")
                    }}
                  >
                    <Share size={16} />
                    <span className="align-middle ml-50">Doctor</span>
                  </NavLink>
                </NavItem> 
                : null}
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <AccountTab requestProfileData={this.state.requestProfileData} />
                </TabPane>
                <TabPane tabId="2">
                  <InfoTab requestProfileData={this.state.requestProfileData} />
                </TabPane>
                <TabPane tabId="3">
                  <DoctorTab requestProfileData={this.state.requestProfileData} />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card> : <Spinner/> }

        </Col>
      </Row>
      </React.Fragment>
    )
  }
}
export default EditDoctor