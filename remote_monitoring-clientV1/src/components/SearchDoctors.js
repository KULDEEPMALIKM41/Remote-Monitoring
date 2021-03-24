import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import Post from './Post';
import {ToastContainer} from 'react-toastify'

// all available theme props
const theme = {
	background: '#f5f8fb',
	fontFamily: 'Helvetica Neue',
	headerBgColor: '#1AAFB3',
	headerFontColor: '#fff',
	headerFontSize: '15px',
	botBubbleColor: '#1AAFB3',
	botFontColor: '#fff',
	userBubbleColor: '#fff',
	userFontColor: '#4a4a4a',
};

// all available config props
const config ={
  	width: "auto",
  	height: "470px",
  	hideUserAvatar:true,
  	placeholder: 'Type your response.',
  	headerTitle: "Health Assistante"
};


class SearchDoctors extends Component {
	render() {
		return (
            <>
            <ToastContainer autoClose={5000} pauseOnHover draggable closeOnClick/>
			<ThemeProvider theme={theme}>
				<ChatBot 
					steps={[
						{
				            id: 'welcome',
				            message:"Hi, Before beginning this session, Kindly let me know who this consultation is for?",
				            trigger: '1',
				        },
				        {
				            id: '1',
				            options: [
				              { value: 'M', label: 'Myself', trigger: '2' },
				              { value: 'SE', label: 'Someone else', trigger: '2' },
				            ],
				        },
				        {
				            id: '2',
				            message: "Okay. Please describe the problem that you are facing.",
				            trigger:'symptoms',
				        },
				        {
				            id: 'symptoms',
                            options: [
                                { value: "Fever", label: "Fever", trigger:'4' },
                                { value: "Heart", label: "Heart", trigger:'4' },
                                { value: "Eye", label: "Eye", trigger:'4' },
                                { value: "Headache", label: "Headache", trigger:'4' },
                                { value: "Stomachache", label: "Stomachache", trigger:'4' },
                                { value: "Depression", label: "Depression", trigger:'4' },
                                { value: "Body pain", label: "Body pain", trigger:'4' },
                                { value: "Chest pain", label: "Chest pain", trigger:'4' },
                              ],
				        },
				        {
							id:'4', 
							message:"Do you have any pre-existing condition?", 
							trigger:'pre_existing_condition'
						},
						{
							id:'pre_existing_condition', 
                            options: [
                                {value: 'None', label: 'None', trigger:'6'},
                                {value: 'Diabetes', label: 'Diabetes', trigger:'6'},
                                {value: 'Asthma', label: 'Asthma', trigger:'6'},
                                {value: 'High Blood pressur', label: 'High Blood pressure', trigger:'6'},
                                {value: 'Low Blood Pressue', label: 'Low Blood Pressue', trigger:'6'},
                                {value: 'Post Heart Attack', label: 'Post Heart Attack', trigger:'6'},
                                {value: 'Pregnancy', label: 'Pregnancy', trigger:'6'},
                                {value: 'HIV', label: 'HIV', trigger:'6'},
                                {value: 'TB (Tuberculosis)', label: 'TB (Tuberculosis)', trigger:'6'},
                                {value: 'Cancer', label: 'Cancer', trigger:'6'},
                              ]
						},
						{
							id:'6', 
							message:"What is your gender?", 
							trigger:'7',
						},
						{
							id:'7', 
                            options: [
                                {value: 'M', label: 'Male', trigger:'8'},
                                {value: 'F', label: 'Female', trigger:'8'},
                                {value: 'O', label: 'Other', trigger:'8'},
                              ],
						},
						{
							id:'8', 
							message:"Do you want to consult with any Specialist", 
							trigger:'specialization',
						},
						{
							id:'specialization', 
                            options: [
                                { value: "None", label: "None", trigger:'10' },
                                { value: "Anesthesiologist", label: "Anesthesiologist", trigger:'10' },
                                { value: "Cardiologist", label: "Cardiologist", trigger:'10' },
                                { value: "Cardiovascular surgeon", label: "Cardiovascular surgeon", trigger:'10' },
                                { value: "Allergist", label: "Allergist", trigger:'10' },
                                { value: "Addiction psychiatrist", label: "Addiction psychiatrist", trigger:'10' },
                                { value: "Pediatrician", label: "Pediatrician", trigger:'10' },
                                { value: "Neurologist", label: "Neurologist", trigger:'10' },
                                { value: "Podiatrist", label: "Podiatrist", trigger:'10' }
                              ],

						},
						
                        
						{
							id:'10', 
							message:'Do you wish to submit?', 
							trigger:'submit'
						},
						{
							id:'submit', 
							options:[
							{value:'y', label:'Yes', trigger:'end-message'},
							{value:'n', label:'No', trigger:'no-submit'},
							] 
						},
						{
				            id: 'no-submit',
				            message:'Your information was not submitted.', 
				            end: true,
				         },
	                    {
				            id: 'end-message',
				            component: <Post />,
				            asMessage: true,
				            end: true,
				         },
					]}
					{...config}
				/>
			</ThemeProvider>
            </>
				
		);
	}

}

export default SearchDoctors;