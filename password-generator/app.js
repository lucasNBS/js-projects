const range = document.querySelector("#chars-range")
const number = document.querySelector("#chars-count")
const form = document.querySelector(".form-container")
const passwordField = document.querySelector(".password")

range.addEventListener("input", (e) => {
  const value = e.target.value
  number.value = value
})

number.addEventListener("input", (e) => {
  const value = e.target.value
  range.value = value
})

const includeUppercase = document.querySelector("#uppercase")
const includeNumbers = document.querySelector("#numbers")
const includeSymbols = document.querySelector("#symbols")

const UPPERCASE_CHARS = generateArray(65, 90)
const LOWERCASE_CHARS = generateArray(97, 122)
const NUMBERS_CHARS = generateArray(48, 57)
const SYMBOLS_CHARS = generateArray(33, 47).concat(generateArray(58, 64))

function computeArray() {
  const array = [...LOWERCASE_CHARS]

  if (includeUppercase.checked) {
    array.push(...UPPERCASE_CHARS)
  }
  if (includeNumbers.checked) {
    array.push(...NUMBERS_CHARS)
  }
  if (includeSymbols.checked) {
    array.push(...SYMBOLS_CHARS)
  }

  return array
}

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const FINAL_ARRAY = computeArray()

  const password = generatePassword(number.value, FINAL_ARRAY)

  passwordField.innerText = password
})

function generateArray(min, max) {
  const array = []
  for (let i = min; i <= max; i++) {
    array.push(i)
  }
  return array
}

function generatePassword(length, availableCharacters) {
  let password = ""

  for (let i = 0; i < length; i++) {
    password += String.fromCharCode(
      availableCharacters[getRandomNumber(0, availableCharacters.length)]
    )
  }

  return password
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}