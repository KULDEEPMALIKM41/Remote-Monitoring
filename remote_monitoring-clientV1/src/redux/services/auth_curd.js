import axios from "axios";

// export const BASEURL = "http://127.0.0.1:8000/"
export const BASEURL = "http://159.65.154.37:8000/"

export const REGISTER_URL = BASEURL.concat("user/register");
export const LOGIN_URL = BASEURL.concat("api/v1/login");
export const GET_USER_PROFILE_URL = BASEURL.concat("user/get-user-profile");
export const USER_PROFILE_URL = BASEURL.concat("user/profile");
export const GET_DOCTORS_URL = BASEURL.concat("user/get-doctors");
export const ADD_TO_CONTACT_URL = BASEURL.concat("user/add-to-contact");



export function register(data) {
  return axios.post(REGISTER_URL, data);
}

export function login(username, password, user_type) {
  return axios.post(LOGIN_URL, {username: username, password:password, user_type:user_type});
}

export function getPrifile(access){
  return axios.get(GET_USER_PROFILE_URL, { headers: { Authorization: 'Bearer '.concat(access) } } )
}

export function savePrifile(data, access){
  return axios.post(USER_PROFILE_URL, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
}

export function getDoctors(access, data){
  return axios.post(GET_DOCTORS_URL, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
}

export function addContact(access, data){
  return axios.post(ADD_TO_CONTACT_URL, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
}

// export function getUserData(access){
//   return axios.get(USERS_URL, { headers: { Authorization: 'Bearer '.concat(access) } } )
// }

// export function getClubData(access){
//   return axios.get(CLUBS_URL, { headers: { Authorization: 'Bearer '.concat(access) } } )
// }

// export function getAdminVerification(access) {
//   return axios.post(ADMIN_VERIFY_URL, {}, { headers: { Authorization: 'Bearer '.concat(access) } } );
// }

// export function updateUser(data, access){
//   return axios.put(USERS_URL+'/'+data.user_id, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
// }

// export function updateClub(data, access){
//   return axios.put(CLUBS_URL+'/'+data.club_id, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
// }

// export function updateUserConfig(data, access){
//   return axios.put(USER_CONFIG_URL, data, { headers: { Authorization: 'Bearer '.concat(access) } } )
// }

// export function deleteClub(club_id, access){
//   return axios.delete(CLUBS_URL+'/'+club_id ,{ headers: { Authorization: 'Bearer '.concat(access) } })
// }

// export function deleteRawReport(data, access){
//   return axios.delete(REPORTS_URL+'/'+data['ids'],{ headers: { Authorization: 'Bearer '.concat(access) } } );
// }
