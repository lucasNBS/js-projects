const buttonOpen = document.querySelector(".button-open")
const buttonClose = document.querySelector(".button-close")
const modal = document.querySelector(".modal-container")
const background = document.querySelector(".background")

buttonOpen.addEventListener("click", () => {
  background.classList.add("show")
  modal.classList.add("show")
})

background.addEventListener("click", (e) => {
  if (e.target !== background) {
    return
  }

  modal.classList.remove("show")
  background.classList.remove("show")
})

buttonClose.addEventListener("click", () => {
  modal.classList.remove("show")
  background.classList.remove("show")
})
