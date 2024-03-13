const input = document.querySelector(".input")
const bar = document.querySelector(".bar")
const warningsContainer = document.querySelector(".warnings-container")

input.addEventListener("input", (e) => {
  warningsContainer.innerHTML = ""

  const warnings = []

  const password = e.target.value

  if (password === "") {
    warningsContainer.innerHTML = ""
    bar.style.setProperty("--width", 0)
    return
  }

  warnings.push(validateLength(password))
  warnings.push(validateCase(password, /[a-z]/g, "lowercase"))
  warnings.push(validateCase(password, /[A-Z]/g, "uppercase"))
  warnings.push(validateNumber(password))
  warnings.push(validateSpecialCharacters(password))

  bar.style.setProperty("--width", 100)
  warnings.forEach((warning) => {
    if (warning == null) return

    const width = getComputedStyle(bar).getPropertyValue("--width")
    bar.style.setProperty("--width", width - warning.value)

    const warningElement = document.createElement("p")
    warningElement.classList.add("warning-text")
    warningElement.innerText = warning.message
    warningsContainer.append(warningElement)
  })
})

function validateLength(password) {
  const length = password.length

  if (length < 5) {
    return {
      message: "Password is too short",
      value: 30
    }
  }

  if (length < 10) {
    return {
      message: "Password could be longer",
      value: 10
    }
  }
}

function validateCase(password, regex, text) {
  const chars = password.match(regex) || []

  if (chars.length === 0) {
    return {
      message: `Password doesn't has ${text} characters`,
      value: 15
    }
  }

  if (chars.length < 3) {
    return {
      message: `Password could have more ${text} characters`,
      value: 5
    }
  }
}

function validateNumber(password) {
  const chars = password.match(/[0-9]/g) || []

  if (chars.length === 0) {
    return {
      message: "Password doesn't contain numbers",
      value: 20
    }
  }

  if (chars.length <= 4) {
    return {
      message: "Password could contain more numbers",
      value: 5
    }
  }
}

function validateSpecialCharacters(password) {
  const chars = password.match(/[!@#$%&*.,/?]/g) || []

  if (chars.length === 0) {
    return {
      message: "Password doesn't contain special characters",
      value: 20
    }
  }

  if (chars.length <= 2) {
    return {
      message: "Password could contain more special characters",
      value: 5
    }
  }
}