import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  TabContent,
  TabPane
} from "reactstrap"
import registerImg from "../assets/img/pages/register.jpg";
import Checkbox from "../ToolKit/checkbox/CheckboxesVuexy"
import { Check, } from "react-feather"
import Select from "react-select"
import { history } from "../history"
import { CardBody, FormGroup, Form, Input, Button, Label } from "reactstrap"
import { register } from "../redux/services/auth_curd";
import "../assets/scss/pages/authentication.scss"
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)

class Register extends React.Component {
  state = {
    userType:'',
    name:'',
    username:'',
    email:'',
    password:'',
    confirmPass:''
  }

  componentDidMount(){
    if(localStorage.getItem('authToken') && localStorage.getItem('context')){
      history.push({pathname: "/edit-profile"});
    }
  }
  
  handleRegister = (e) => {
    e.preventDefault();
    if(this.state.userType ===''){
      errorNotification('Please select user type.')
      return
    }else if(this.state.password !== this.state.confirmPass){
      errorNotification('Password and Confirm Password not match.')
      return
    }
    register(this.state)
    .then((response) => {
      successNotification(response.data.message)
      setTimeout(function() { history.push('/'); }, 5000);
    }, (error) => {
        if(error.response.status === 400){
            errorNotification(error.response.data.message)
            return
          }
        errorNotification("Server in under maintenance.")
    });
  }

  render() {
    return (
      <>
      <ToastContainer autoClose={5000} pauseOnHover draggable closeOnClick/>
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={registerImg} alt="registerImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                  <CardHeader className="pt-1 pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Create Account</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                  Fill the below form to create a new account.
                  </p>

                  <TabContent activeTab={'1'}>
                    <TabPane tabId="1">
                    <CardBody className="pt-1">
                      <Form onSubmit={this.handleRegister}>
                      <FormGroup className="form-label-group">
                        <Select
                          required
                          onChange={(e) => this.setState({ userType: e.value })}
                          className="React"
                          classNamePrefix="select"
                          defaultValue={{ value: "", label: "Select User" }}
                          options={[
                            { value: "P", label: "Patient" },
                            { value: "D", label: "Doctor" }
                          ]}
                          isClearable={false}
                        />
                        <Label>User Type</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={this.state.name}
                          onChange={e => this.setState({ name: e.target.value })}
                        />
                        <Label>Full Name</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="text"
                          placeholder="Username"
                          required
                          value={this.state.username}
                          onChange={e => this.setState({ username: e.target.value })}
                        />
                        <Label>Username</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="email"
                          placeholder="Email"
                          required
                          value={this.state.email}
                          onChange={e => this.setState({ email: e.target.value })}
                        />
                        <Label>Email</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="password"
                          placeholder="Password"
                          required
                          value={this.state.password}
                          onChange={e => this.setState({ password: e.target.value })}
                        />
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="form-label-group">
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          required
                          value={this.state.confirmPass}
                          onChange={e => this.setState({ confirmPass: e.target.value })}
                        />
                        <Label>Confirm Password</Label>
                      </FormGroup>
                      <FormGroup>
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label=" I accept the terms & conditions."
                          defaultChecked={true}
                        />
                      </FormGroup>
                      <div className="d-flex justify-content-between">
                        <Button.Ripple
                          color="primary"
                          outline
                          onClick={() => {
                            history.push("/")
                          }}
                        >
                          Login
                        </Button.Ripple>
                        <Button.Ripple color="primary" type="submit">
                          Register
                        </Button.Ripple>
                      </div>
                      </Form>
                    </CardBody>
                    </TabPane>
                  </TabContent>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      </>
    )
  }
}
export default Register