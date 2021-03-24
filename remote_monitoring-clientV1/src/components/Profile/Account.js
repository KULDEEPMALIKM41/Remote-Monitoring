import React from "react"
import Radio from "../../ToolKit/radio/RadioVuexy"
import {
  Media,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Table
} from "reactstrap"
import { savePrifile } from "../../redux/services/auth_curd";
import userImg from "../../assets/img/portrait/small/avatar-s-18.jpg"
import Checkbox from "../../ToolKit/checkbox/CheckboxesVuexy"
import { Check, Lock } from "react-feather"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)


class UserAccountTab extends React.Component {
  state = {
    // photo_url: "",
    form_type: 'accountInfo',
    first_name: this.props.requestProfileData.first_name,
    last_name: this.props.requestProfileData.last_name,
    username: this.props.requestProfileData.username,
    email: this.props.requestProfileData.email,
    gender: this.props.requestProfileData.gender,
    user_type: this.props.requestProfileData.user_type,
    // date_of_birth: this.props.requestProfileData.date_of_birth,
    // phone : '8890834462',
    // alternate_phone : '8890834462',
    // user: '83e7fb92-9a85-49d3-869c-54a9c5a887d0',
    // symptoms: ['ok', 'bruh']
  }

  // componentDidMount(){
  //   console.log(this.props.requestProfileData)
  // }
  saveForm = (e) => {
    e.preventDefault();
    if (!this.state.gender){
      errorNotification('Please select Gender.')
      return
    }
    let access = localStorage.getItem('authToken')
    savePrifile(this.state, access)
    .then((response) => {
      let context = JSON.parse(localStorage.getItem('context'))
      context['first_name'] = this.state.first_name
      context['last_name'] = this.state.last_name
      console.log(context)
      localStorage.setItem('context', JSON.stringify(context))
      successNotification(response.data.message)
    }, (error) => {
          console.log(error)
          if(error.response.status === 400){
            errorNotification(error.response.data.message)
        }
    });
  }

  render() {
    return (
      <Row>
        <Col sm="12">
          <Media className="mb-2">
            <Media className="mr-2 my-25" left href="#">
              <Media
                className="users-avatar-shadow rounded"
                object
                src={require("../../assets/img/portrait/small/dummy-profile-pic.png")}
                alt="user profile image"
                height="84"
                width="84"
              />
            </Media>
            <Media className="mt-2" body>
              <Media className="font-medium-1 text-bold-600" tag="p" heading>
                {this.state.first_name} {this.state.last_name}
              </Media>
              <div className="d-flex flex-wrap">
                <Button.Ripple className="mr-1" color="primary" outline>
                  Change
                </Button.Ripple>
              </div>
            </Media>
          </Media>
        </Col>
        <Col sm="12">
          <Form onSubmit={this.saveForm}>
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    placeholder="First Name"
                    value={this.state.first_name}
                    onChange={e => this.setState({ first_name: e.target.value })}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    id="last_name"
                    placeholder="Last Name"
                    value={this.state.last_name}
                    onChange={e => this.setState({ last_name: e.target.value })}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Input disabled
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={this.state.username}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input disabled
                      type="text"
                      id="email"
                      placeholder="Email"
                      value={this.state.email}
                      required
                    />
                  </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                <Label className="d-block mb-50">Gender</Label>
                <div className="d-inline-block mr-1">
                  <Radio
                    label="Male"
                    color="primary"
                    defaultChecked={this.state.gender == 'M' ? true : false}
                    name="gender"
                    onClick={e => this.setState({ gender: 'M' })}
                  />
                </div>
                <div className="d-inline-block mr-1">
                  <Radio
                    label="Female"
                    color="primary"
                    defaultChecked={this.state.gender == 'F' ? true : false}
                    name="gender"
                    onClick={e => this.setState({ gender: 'F' })}
                  />
                </div>
                <div className="d-inline-block">
                  <Radio
                    label="Others"
                    color="primary"
                    defaultChecked={this.state.gender == 'O' ? true : false}
                    name="gender"
                    onClick={e => this.setState({ gender: 'O' })}
                  />
                </div>
              </FormGroup>
              </Col>
              <Col md="6" sm="12">
              <FormGroup>
                  <Label for="role">Role</Label>
                  <Input type="select" name="role" id="role" value={this.state.user_type} required disabled>
                  <option value="">Select Role</option>
                    <option value="P">Patient</option>
                    <option value="D">Doctor</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col
                className="d-flex justify-content-end flex-wrap mt-2"
                sm="12"
              >
                <Button.Ripple className="mr-1" color="primary">
                  Save Changes
                </Button.Ripple>
                <Button.Ripple color="flat-warning">Reset</Button.Ripple>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}
export default UserAccountTab
