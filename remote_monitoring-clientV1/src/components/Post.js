import React, { Component } from 'react';
import {Media} from "reactstrap"
import {getDoctors, addContact} from "../redux/services/auth_curd"
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const successNotification = (message) => toast.success(message)
const errorNotification = (message) => toast.error(message)

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors:[]
    }
  }


  componentDidMount() {
    let data = {
      symptoms:[this.props.steps.symptoms.value],
      specialization:[this.props.steps.specialization.value]
    };
    // console.log(data)
    let access = localStorage.getItem('authToken')
    console.log(access)
    getDoctors(access, data)
    .then(res => {
      // console.log(res.data[0].specialization)
      this.setState({doctors:res.data})
    }).catch(function(error) {
      console.log(error);
    });
  }

  addTOContact(friend) {
    let data = {
      friend:friend
    };
    let access = localStorage.getItem('authToken')
    addContact(access, data)
    .then(res => {
      successNotification(res.data.message)
    }).catch(function(error) {
      console.log(error);
      errorNotification('Something went to wrong! Please try again.')
    });
  }

  render() {
    return(
      
      <div className="media-list media-bordered">
      {this.state.doctors.length ? 
      this.state.doctors.map((item, index) => {
      return(
      <Media>
      <Media body>
        <Media heading className="text-white">Dr. {item.first_name} {item.last_name} 
          <button
          onClick={() => this.addTOContact(item.user)}
          className="ml-1 add-doctor-button" color="flat-primary">
            Add To Contact
          </button>
        </Media>
        Dr {item.first_name} {item.last_name} has spent more than eight years in {item.specialization.join(", ")}. Having worked on both the agency and hospital side, Haley has a deep understanding of the pain points and motivations of hospital marketers. His experience has given him a well-rounded view of what it takes to deliver exceptional surguries.
      </Media>
      <Media right href="#">
        <Media
          className="rounded-circle"
          object
          src={require("../assets/img/portrait/small/dummy-profile-pic.png")}
          height="64"
          width="64"
          alt="Generic placeholder image"
        />
      </Media>
    </Media> )})
      : "No doctor available."}
    </div>
    
    );
    }
  };


  export default Post;