import React from "react"
import { CardBody, FormGroup, Form, Input, Button, Label } from "reactstrap"
import { Link } from "react-router-dom"
import Checkbox from "../../ToolKit/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check, } from "react-feather"
import { history } from "../../history"
import { login } from "../../redux/services/auth_curd";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)

class LoginDoctor extends React.Component {
  state = {
    email: "",
    password: "",
    remember: false
  }

  handleRemember = e => {
    this.setState({
      remember: e.target.checked
    })
  }

  handleLogin = (e) => {
    e.preventDefault();
    login(this.state.username, this.state.password, 'D')
    .then((response) => {
        localStorage.setItem('authToken', response.data.access)
        localStorage.setItem('context', JSON.stringify(response.data.context))
        history.push({pathname: "/edit-profile"});
        // console.log(response.data)
    }, (error) => {
          if(error.response){
          if(error.response.status === 401){
            errorNotification('Username and Password combination doesn’t match any records.')
        }else{
          errorNotification('Server in under maintanance.')
        }
      }
      else{
        errorNotification('Server in under maintanance.')
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer autoClose={5000} pauseOnHover draggable closeOnClick/>
        <CardBody className="pt-1">
        <Form onSubmit={this.handleLogin}>
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
              required
            />
            <div className="form-control-position">
              <Mail size={15} />
            </div>
            <Label>Username</Label>
          </FormGroup>
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              required
            />
            <div className="form-control-position">
              <Lock size={15} />
            </div>
            <Label>Password</Label>
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="Remember me"
                defaultChecked={false}
                onChange={this.handleRemember}
              />
              <div className="float-right">
                <Link to="/pages/forgot-password">Forgot Password?</Link>
              </div>
            </FormGroup>
            <div className="d-flex justify-content-between">
              <Button.Ripple
                color="primary"
                outline
                onClick={() => {
                  history.push("/register")
                }}
              >
                Register
              </Button.Ripple>
              <Button.Ripple color="primary" type="submit">
                Login
              </Button.Ripple>
            </div>
        </Form>
        </CardBody>
      </React.Fragment>
    )
  }
}

export default LoginDoctor
