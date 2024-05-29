const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random"

const quoteDisplayElement = document.querySelector("#quoteDisplay")
const quoteInputElement = document.querySelector("#quoteInput")
const timerElement = document.querySelector("#timer")

quoteInputElement.addEventListener("input", () => {
  const quoteArray = quoteDisplayElement.querySelectorAll("span")
  const valueArray = quoteInputElement.value.split('')
  let correct = true

  quoteArray.forEach((characterSpan, index) => {
    const character = valueArray[index]

    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (characterSpan.innerText === character) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.add('incorrect')
      characterSpan.classList.remove('correct')
      correct = false
    }
  })

  if (correct) renderNewQuote()
})


async function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = null
  
  quote.split('').forEach(character => {
    const characterSpan = document.createElement("span")
    characterSpan.innerText = character
    quoteDisplayElement.append(characterSpan)
  })
  
  quoteInputElement.value = null
  startTimer()
}

let startTime
function startTimer() {
  timerElement.innerText = 0

  startTime = new Date()

  setInterval(() => {
    timerElement.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

renderNewQuote()
