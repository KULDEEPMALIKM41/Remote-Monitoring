import React from "react"
import { Row, Col, Button, Form, Input, Label, FormGroup } from "reactstrap"
import Checkbox from "../../ToolKit/checkbox/CheckboxesVuexy"
import Radio from "../../ToolKit/radio/RadioVuexy"
import { Check, User, MapPin } from "react-feather"
import Select from "react-select"
import chroma from "chroma-js"
import Flatpickr from "react-flatpickr";
import { savePrifile } from "../../redux/services/auth_curd";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"

import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)


const languages = [
  { value: "EN", label: "English", color: "#7367f0" },
  { value: "FR", label: "French", color: "#7367f0" },
  { value: "ES", label: "Spanish", color: "#7367f0" },
  { value: "RU", label: "Russian", color: "#7367f0" },
  { value: "IT", label: "Italian", color: "#7367f0" }
]

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color ? chroma(data.color) : "#7367f0"
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? data.color : "#7367f0")
      }
    }
  },
  multiValue: (styles, { data }) => {
    const color = data.color ? chroma(data.color) : "#7367f0"
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    }
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color ? data.color : "#7367f0"
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color ? data.color : "#7367f0",
      color: "white"
    }
  })
}
class UserInfoTab extends React.Component {
  state = {
    // photo_url: "",
    form_type: 'generalInfo',
    date_of_birth: this.props.requestProfileData.date_of_birth,
    // date_of_birth: new Date("1995-05-22"),
    phone : this.props.requestProfileData.phone,
    alternate_phone : this.props.requestProfileData.alternate_phone,
    preferred_languages : this.props.requestProfileData.preferred_languages,
    lang_view: [],
    address : this.props.requestProfileData.address,
    city : this.props.requestProfileData.city,
    country_of_origin : this.props.requestProfileData.country_of_origin,
    country : this.props.requestProfileData.country
    // new Date("1995-05-22")
  }

  componentDidMount(){
    let data = []
    if (this.props.requestProfileData.preferred_languages){
      for (let item1 of this.props.requestProfileData.preferred_languages){
        for (let item2 of languages){
          if (item1 == item2.value){
            data.push(item2)
          }
        }
      }
      this.setState({lang_view: data})
    }
  }

  saveForm = (e) => {
    e.preventDefault();
    console.log(this.state)
    if (!this.state.date_of_birth){
      errorNotification('Please select date of birth.')
      return
    }
    if (!this.state.preferred_languages){
      errorNotification('Please select minimun 1 language.')
      return
    }else if (!this.state.preferred_languages.length){
      errorNotification('Please select minimun 1 language.')
      return
    }
    let access = localStorage.getItem('authToken')
    savePrifile(this.state, access)
    .then((response) => {
      successNotification(response.data.message)
    }, (error) => {
          console.log(error)
          if(error.response.status === 400){
            errorNotification(error.response.data.message)
        }
    });
  }

  handleDate = date => {
    console.log(date)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    console.log(year, month, day)
    if (month < 9){
      month = '0' + month
    }
    if (day < 9){
      day = '0' + day
    }
    console.log(year, month, day)
    this.setState({
      date_of_birth: year +'-'+ month +'-'+ day
    })
  }

  handleLang = languages => {
    console.log(languages)
    let data = []
    if (languages){
      for(let item of languages){
        data.push(item.value)
      }
    }
    this.setState({
      lang_view:languages,
      preferred_languages: data
    })
  }
  render() {
    return (
    <>
      {/* <ToastContainer autoClose={5000} pauseOnHover draggable closeOnClick/> */}
      <Form onSubmit={this.saveForm}>
        <Row className="mt-1">
          <Col className="mt-1" md="6" sm="12">
            <h5 className="mb-1">
              <User className="mr-50" size={16} />
              <span className="align-middle">Personal Info</span>
            </h5>
            <FormGroup>
              <Label className="d-block" for="dob">
                Date of birth
              </Label>
              <Flatpickr
                id="dob"
                className="form-control"
                options={{ dateFormat: "Y-m-d" }}
                value={this.state.date_of_birth}
                // onChange={date => this.handledob(date)}
                onChange={date => this.handleDate(date[0])}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactnumber">Contact Number</Label>
              <Input
                type="number"
                id="contactnumber"
                placeholder="Contact Number"
                value={this.state.phone}
                onChange={e => this.setState({ phone: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="alternatecontactnumber">Alternate Contact Number</Label>
              <Input
                type="number"
                id="alternatecontactnumber"
                placeholder="Alternate Contact Number"
                value={this.state.alternate_phone}
                onChange={e => this.setState({ alternate_phone: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="languages">Preferred Languages</Label>
              <Select
                isMulti
                isClearable={true}
                styles={colourStyles}
                options={languages}
                className="React"
                classNamePrefix="select"
                id="languages"
                placeholder="Preferred Languages" 
                value={this.state.lang_view}
                onChange={e => this.handleLang(e)}
                required
              />
            </FormGroup>
          </Col>
          <Col className="mt-1" md="6" sm="12">
            <h5 className="mb-1">
              <MapPin className="mr-50" size={16} />
              <span className="align-middle">Address</span>
            </h5>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input 
                type="text"
                id="address"
                placeholder="Address Here" 
                value={this.state.address}
                onChange={e => this.setState({ address: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input
                type="text"
                id="city"
                placeholder="City"
                value={this.state.city}
                onChange={e => this.setState({ city: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="State">State</Label>
              <Input
                type="text"
                id="State"
                placeholder="State"
                value={this.state.country_of_origin}
                onChange={e => this.setState({ country_of_origin: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="Country">Country</Label>
              <Input
                type="text"
                id="Country"
                placeholder="Country"
                value={this.state.country}
                onChange={e => this.setState({ country: e.target.value })}
                required
              />
            </FormGroup>
          </Col>
          <Col className="d-flex justify-content-end flex-wrap" sm="12">
            <Button.Ripple className="mr-1" color="primary">
              Save Changes
            </Button.Ripple>
            <Button.Ripple color="flat-warning">Reset</Button.Ripple>
          </Col>
        </Row>
      </Form>
    </>
    )
  }
}
export default UserInfoTab
