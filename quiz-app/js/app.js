import questions from "./questions.js"

const start = document.querySelector(".start-button")
const next = document.querySelector(".next-button")

const container = document.querySelector(".container")
const question = document.querySelector(".card-title")
const answersContainer = document.querySelector(".answers-container")
const actionsButtonsContainer = document.querySelector(".actions-buttons-container")

let questionIndex = 0

start.addEventListener("click", startGame)
next.addEventListener("click", () => {
  if (questionIndex < questions.length) {
    showNextQuestion()
  } else {
    gameOver()
  }
})

function startGame() {
  questionIndex = 0
  start.classList.add("hide")
  container.style.setProperty("--hue", 200)

  actionsButtonsContainer.classList.remove("center")
  actionsButtonsContainer.classList.add("hide")
  
  question.classList.remove("hide")
  answersContainer.classList.remove("hide")

  showNextQuestion()
}

function showNextQuestion() {
  answersContainer.innerHTML = ""
  actionsButtonsContainer.classList.add("hide")
  next.classList.add("hide")
  question.innerText = questions[questionIndex].question
  container.style.setProperty("--hue", 200)
  
  for (let i = 0; i < questions[questionIndex].answers.length; i++) {
    const answer = questions[questionIndex].answers[i]
    
    const button = document.createElement("button")
    button.classList.add("answer-button")
    button.innerText = answer.text

    if (answer.correct) {
      button.dataset.correct = true
    }

    answersContainer.append(button)
    button.addEventListener("click", (e) => {
      answerQuestion(e.target)
    })
  }
}

function answerQuestion(target) {
  answersContainer.childNodes.forEach((answer) => {
    if (answer.dataset.correct) {
      answer.classList.add("correct")
      answer.setAttribute("disabled", true)
    } else {
      answer.classList.add("wrong")
      answer.setAttribute("disabled", true)
    }
  })

  if (target.dataset.correct) {
    container.style.setProperty("--hue", 100)
    target.classList.add("correct")
    actionsButtonsContainer.classList.remove("hide")
    next.classList.remove("hide")
    questionIndex++
  } else {
    container.style.setProperty("--hue", 0)
    target.classList.add("wrong")
    actionsButtonsContainer.classList.remove("hide")
    actionsButtonsContainer.classList.add("center")
    start.classList.remove("hide")
    start.innerText = "Restart"
  }
}

function gameOver() {
  question.innerText = "You Won!"
  answersContainer.innerHTML = ""
  next.classList.add("hide")
  start.classList.remove("hide")
  start.innerText = "Restart"
  actionsButtonsContainer.classList.add("center")
}