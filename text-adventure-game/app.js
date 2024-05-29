import { textNodes } from "./textNodes.js"

const textElement = document.querySelector("#text")
const optionButtons = document.querySelector("#option-buttons")

let state = {}

function startGame() {
  state = {}
  showTextNode(1)
}

function selectOption(option) {
  const nextTextNode = option.nextText

  if (nextTextNode <= 0) {
    return startGame()
  }

  state = Object.assign(state, option.setState)
  showTextNode(nextTextNode)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  
  textElement.innerText = textNode.text
  optionButtons.innerHTML = ""

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement("button")
      
      button.innerText = option.text
      button.classList.add("button")
      button.addEventListener("click", () => {
        selectOption(option)
      })

      optionButtons.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

startGame()