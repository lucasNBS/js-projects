const cardsContainer = document.querySelectorAll(".card-container")

cardsContainer.forEach((card) => {
  const text = card.querySelector(".card-text")
  
  const buttonContainer = card.querySelector(".button-container")
  const button = buttonContainer.querySelector(".button")

  if (!(text.scrollHeight > text.clientHeight)) {
    card.removeChild(buttonContainer)
  }

  button.addEventListener("click", () => {
    text.classList.toggle("expanded")
    button.classList.toggle("expanded")
    buttonContainer.classList.toggle("expanded")
    const isExpanded = button.classList.contains("expanded")
    
    button.innerText = isExpanded ? "Read Less" : "Read More"

    console.log(text.scrollHeight, text.clientHeight)
  })
})