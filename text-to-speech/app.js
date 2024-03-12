const textArea = document.querySelector(".text-container")

const speed = document.querySelector("#speed")
const playButton = document.querySelector("#play-button")
const pauseButton = document.querySelector("#pause-button")
const stopButton = document.querySelector("#stop-button")

playButton.addEventListener("click", () => {
  playText(textArea.value)
})
pauseButton.addEventListener("click", pauseText)
stopButton.addEventListener("click", stopText)

function playText(text) {
  if (speechSynthesis.speaking) {
    return speechSynthesis.resume()
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = speed.value ? speed.value : 1
  speed.disabled = true

  utterance.addEventListener("end", () => {
    speed.disabled = false
    textArea.disabled = false
  })

  textArea.disabled = true
  speechSynthesis.speak(utterance)
}

function pauseText() {
  if (speechSynthesis.speaking) speechSynthesis.pause()
}

function stopText() {
  speechSynthesis.resume()
  speechSynthesis.cancel()
  textArea.disabled = false
  speed.disabled = false
}