import { LOCAL_API_URL, API_URL } from "../../../settings.js"
import { handleHttpErrors } from "../../../utils.js"

let firstName;
let lastName;
let email;

let street;
let city;
let zip;

export function initAddUser() {
    document.getElementById("btn-addUser").onclick = () => addUser(getUserDetails())

    document.getElementById("firstName").innerText = firstName
    document.getElementById("lastName").innerText = lastName
    document.getElementById("email").innerText = email
    
    document.getElementById("city").innerText = city
    document.getElementById("zip").innerText = zip
    document.getElementById("street").innerText = street

}


function makeUsername() {
    const fName = document.getElementById("firstName").value.toLowerCase()
    const lName = document.getElementById("lastName").value.toLowerCase()
    if(fName.length === 0) {
        return
    }
    let num = Math.floor((Math.random() * 4))+1
    let username = fName.slice(0,(6-num)) + lName.slice(0,num) + (Math.floor(Math.random() * 8999)+1000)
    return username
}

function makePassword() {
    // long random text
    const psd = (Math.floor(Math.random()*100000000))+100000000
    return psd
}

async function addUser(user) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(user),
    }
    try {
        // security - get token and put bearer header 

        const data = await fetch(LOCAL_API_URL+"/users",options).then(handleHttpErrors)

        // return data - display
        // 'realistically' send email with username and password to the worker


    } catch (error) {

    }


}


function getUserDetails() {
    const user = {}
    user.firstName = document.getElementById("firstName").value
    user.lastName = document.getElementById("lastName").value
    user.street = document.getElementById("street").value
    user.zip = document.getElementById("zip").value
    user.city = document.getElementById("city").value
    user.email = document.getElementById("email").value
    user.username = makeUsername()
    user.password = makePassword()
    user.worker = true;
    //user phones
    return user
}





