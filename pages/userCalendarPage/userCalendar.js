export function loadUserDom() {
  const people =    { id:1, name: "Kristian Wede", age: 22, email: "kristanwede@gmail.com", tlf:"22 22 22 22" }
    
  document.getElementById("name-id").innerHTML = people.name
  document.getElementById("name-id").style.fontSize = "1.5rem"
  document.getElementById("userid-id").innerHTML = "id "+ people.id
  document.getElementById("email-id").innerHTML = people.email
  document.getElementById("tlf-id").innerHTML = people.tlf
    }