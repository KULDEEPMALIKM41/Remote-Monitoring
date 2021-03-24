import React from "react"
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import {
  Link,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Codepen,
  Slack
} from "react-feather"
import Select from "react-select"
import chroma from "chroma-js"

import { savePrifile } from "../../redux/services/auth_curd";

import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)

const specialization = [
  { value: "Anesthesiologist", label: "Anesthesiologist", color: "#7367f0" },
  { value: "Cardiologist", label: "Cardiologist", color: "#7367f0" },
  { value: "Cardiovascular surgeon", label: "Cardiovascular surgeon", color: "#7367f0" },
  { value: "Allergist", label: "Allergist", color: "#7367f0" },
  { value: "Addiction psychiatrist", label: "Addiction psychiatrist", color: "#7367f0" },
  { value: "Pediatrician", label: "Pediatrician", color: "#7367f0" },
  { value: "Neurologist", label: "Neurologist", color: "#7367f0" },
  { value: "Podiatrist", label: "Podiatrist", color: "#7367f0" },
]

const symptoms = [
  { value: "Fever", label: "Fever", color: "#7367f0" },
  { value: "Heart", label: "Heart", color: "#7367f0" },
  { value: "Eye", label: "Eye", color: "#7367f0" },
  { value: "Headache", label: "Headache", color: "#7367f0" },
  { value: "Stomachache", label: "Stomachache", color: "#7367f0" },
  { value: "Depression", label: "Depression", color: "#7367f0" },
  { value: "Body pain", label: "Body pain", color: "#7367f0" },
  { value: "Chest pain", label: "Chest pain", color: "#7367f0" },
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

class UserSocialTab extends React.Component {
  state = {
    form_type: 'doctorInfo',
    npi: this.props.requestProfileData.npi,
    symptoms : this.props.requestProfileData.symptoms,
    symptoms_view: [],
    specialization : this.props.requestProfileData.specialization,
    specialization_view: [],
    undergraduate_degree : this.props.requestProfileData.undergraduate_degree,
    postgraduate_degree : this.props.requestProfileData.postgraduate_degree,
  }

  componentDidMount(){
    let data1 = []
    if (this.props.requestProfileData.symptoms){
      for (let item1 of this.props.requestProfileData.symptoms){
        for (let item2 of symptoms){
          if (item1 == item2.value){
            data1.push(item2)
          }
        }
      }
      this.setState({symptoms_view: data1})
    }
    let data2 = []
    if (this.props.requestProfileData.specialization){
      for (let item3 of this.props.requestProfileData.specialization){
        for (let item4 of specialization){
          if (item3 == item4.value){
            data2.push(item4)
          }
        }
      }
      this.setState({specialization_view: data2})
    }
  }
  
  saveForm = (e) => {
    e.preventDefault();
    console.log(this.state)
    if (!this.state.symptoms){
      errorNotification('Please select minimun 1 symptoms.')
      return
    }else if (!this.state.symptoms.length){
      errorNotification('Please select minimun 1 symptoms.')
      return
    }
    if (!this.state.specialization){
      errorNotification('Please select minimun 1 specialization.')
      return
    }else if (!this.state.specialization.length){
      errorNotification('Please select minimun 1 specialization.')
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

  handleSymSpecial = (items, handleType) => {
    let data = []
    if (handleType == 'symptoms'){
      if (items){
        for(let item of items){
          data.push(item.value)
        }
      }
      this.setState({
        symptoms_view:items,
        symptoms: data
      })
    }else if (handleType == 'specialization'){
      if (items){
        for(let item of items){
          data.push(item.value)
        }
      }
      this.setState({
        specialization_view:items,
        specialization: data
      })
    }
  }


  render() {
    return (
      <Form className="mt-2" onSubmit={this.saveForm}>
        <h5 className="mb-1">
          <Link size={15} />
          <span className="align-middle ml-50">About Doctor</span>
        </h5>
        <Row>
          <Col md="6" sm="12">
            <FormGroup>
              <Label for="npi">NPI</Label>
              <Input
                type="text"
                id="npi"
                placeholder="NPI"
                value={this.state.npi}
                onChange={e => this.setState({ npi: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="symptoms">Symptoms</Label>
              <Select
                isMulti
                isClearable={true}
                styles={colourStyles}
                options={symptoms}
                className="React"
                classNamePrefix="select"
                id="symptoms"
                placeholder="Symptoms" 
                value={this.state.symptoms_view}
                onChange={e => this.handleSymSpecial(e, 'symptoms')}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="specialization">Specialization</Label>
              <Select
                isMulti
                isClearable={true}
                styles={colourStyles}
                options={specialization}
                className="React"
                classNamePrefix="select"
                id="specialization"
                placeholder="Specialization" 
                value={this.state.specialization_view}
                onChange={e => this.handleSymSpecial(e, 'specialization')}
                required
              />
            </FormGroup>
          </Col>
          <Col md="6" sm="12">
          <FormGroup>
              <Label for="undergraduate">Undergraduate Degree</Label>
              <Input
                type="text"
                id="undergraduate"
                placeholder="Undergraduate Degree"
                value={this.state.undergraduate_degree}
                onChange={e => this.setState({ undergraduate_degree: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="postgraduate">Postgraduate Degree</Label>
              <Input
                type="text"
                id="postgraduate"
                placeholder="Postgraduate Degree"
                value={this.state.postgraduate_degree}
                onChange={e => this.setState({ postgraduate_degree: e.target.value })}
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
    )
  }
}
export default UserSocialTab
