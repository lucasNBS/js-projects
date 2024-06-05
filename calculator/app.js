const previewElement = document.querySelector("[data-preview]")
const resultElement = document.querySelector("[data-result]")

class Calculator {
  constructor(previous, current) {
    this.previewElement = previous
    this.resultElement = current
  }

  get previewElementValue() {
    return this.previewElement.innerText
  }

  get resultElementValue() {
    return this.resultElement.innerText
  }

  set previewElementValue(value) {
    this.previewElement.innerText = value
  }

  set resultElementValue(value) {
    this.resultElement.innerText = value
  }

  clear() {
    this.updateScreen("", "")
    this.lastOperation = null
  }

  insertNumber(number) {
    if (this.lastOperation === "/" && (this.resultElementValue == "" && number == 0)) return
    if (this.resultElementValue.includes(".") && number == ".") return

    let resultNumber = this.formatNumber(
      this.unformatNumber(this.resultElementValue + String(number))
    )

    if (this.unformatNumber(this.resultElementValue + String(number)).includes(".")) {
      let [integerSection, decimalSection] = this.unformatNumber(
        this.resultElementValue + String(number)
      ).split(".")

      resultNumber = this.formatNumber(this.unformatNumber(integerSection)) + "." + decimalSection
      this.resultElementValue = resultNumber
    } else {
      this.resultElementValue = resultNumber
    }
  }

  removeNumber() {
    const resultAsArray = this.resultElementValue.slice(0, -1)

    let number = this.unformatNumber(resultAsArray)

    if (number.includes(".")) {
      let [integerSection, decimalSection] = number.split(".")

      number = this.formatNumber(this.unformatNumber(integerSection)) + "." + decimalSection
      this.resultElementValue = number
    } else {
      this.resultElementValue = this.formatNumber(number)
    }
  }

  executeOperation(operation) {
    if (this.resultElementValue == "" && this.previewElementValue == "") {
      return
    }

    if (this.resultElementValue == "") {
      this.updateScreen(
        this.previewElementValue.substring(
          0, this.previewElementValue.length - 2
        ) + " " + operation,
        ""
      )
    } else if (this.lastOperation != null && this.previewElementValue != "") {
      this.compute(this.previewElementValue, this.resultElementValue, operation)
    } else {
      this.updateScreen(this.resultElementValue + " " + operation, "")
    }
    
    this.lastOperation = operation
  }

  compute(preview, result, operation) {
    const previousNumber = parseFloat(this.unformatNumber(preview.substring(0, preview.length - 2)))
    const resultValue = parseFloat(this.unformatNumber(result))

    let equals

    switch (this.lastOperation) {
      case "+":
        equals = Math.round((previousNumber + resultValue) * 1000) / 1000
        break
      case "-":
        equals = Math.round((previousNumber - resultValue) * 1000) / 1000
        break
      case "/":
        equals = Math.round((previousNumber / resultValue) * 1000) / 1000
        break
      case "*":
        equals = Math.round((previousNumber * resultValue) * 1000) / 1000
        break
    }

    if (String(equals).includes(".")) {
      if (operation === "=") {
        this.updateScreen(
          "", this.formatNumber(String(equals).split(".")[0]) + "." + String(equals).split(".")[1]
        )
      } else {
        this.updateScreen(
          this.formatNumber(
            String(equals).split(".")[0]
          ) + "." + String(equals).split(".")[1] + " " + operation, ""
        )
      }
    } else {
      if (operation === "=") {
        this.updateScreen("", this.formatNumber(String(equals)))
      } else {
        this.updateScreen(this.formatNumber(String(equals)) + " " + operation, "")
      }
    }
  }

  equals() {
    if (this.resultElementValue == "" || this.previewElementValue == "") return
    this.compute(this.previewElementValue, this.resultElementValue, "=")
  }

  updateScreen(preview, result) {
    this.previewElementValue = preview
    this.resultElementValue = result
  }

  formatNumber(number) {
    const numberArray = [...number]

    const finalArray = []

    let val = 0;
    while (numberArray.length > 0) {
      if (val === 3) {
        finalArray.push(",")
      } else {
        finalArray.push(numberArray.pop())
      }

      if (val < 3) {
        val++
      } else {
        val = 0
      }
    }

    return finalArray.reverse().reduce((pre, curr) => {
      return pre += String(curr)
    }, "")
  }

  unformatNumber(number) {
    return number.toString().replaceAll(",", "")
  }
}

const calculator = new Calculator(previewElement, resultElement)

const clearElement = document.querySelector("[data-ac]")
const deleteElement = document.querySelector("[data-del]")
const equalsElement = document.querySelector("[data-eq]")

const digitElements = document.querySelectorAll("[data-digit]")
const operationElements = document.querySelectorAll("[data-operation]")

clearElement.addEventListener("click", () => calculator.clear())
deleteElement.addEventListener("click", () => calculator.removeNumber())
equalsElement.addEventListener("click", () => calculator.equals())

digitElements.forEach(digit => {
  digit.addEventListener("click", () => calculator.insertNumber(digit.dataset.value))
})

operationElements.forEach(digit => {
  digit.addEventListener("click", () => calculator.executeOperation(digit.dataset.value))
})
