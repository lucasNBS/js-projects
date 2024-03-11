const form = document.querySelector("#form")

let name = document.querySelector("#name")
let password = document.querySelector("#password")
let nameError = document.querySelector("#name-error")
let passwordError = document.querySelector("#password-error")

form.addEventListener("submit", (e) => {
  e.preventDefault()

  nameError.innerText = ""
  passwordError.innerText = ""

  if (name.value.trim() === "") {
    nameError.innerText = "Name is required!"
  }

  if (password.value.trim() === "") {
    passwordError.innerText = "Password is required!"
  }

  if (password.value.length < 6) {
    passwordError.innerText = "Minimum is 6 characters"
  }

  if (nameError.innerText === "" && passwordError.innerText === "") {
    name.value = ""
    password.value = ""
    
    alert("Form was send!")
  }
})