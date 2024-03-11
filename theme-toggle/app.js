const body = document.querySelector("body")
const themeButton = document.querySelector(".theme-button")
const themeIndicator = document.querySelector(".theme-indicator-container")
const sun = document.querySelector(".sun")
const moon = document.querySelector(".moon")

themeButton.addEventListener("click", (e) => {
  const currentThemeColor = getComputedStyle(body).getPropertyValue("--theme-color")
  const opositeThemeColor = getComputedStyle(body).getPropertyValue("--oposite-theme-color")
  
  let rotation = Number(getComputedStyle(themeIndicator).getPropertyValue("--rotation"))

  body.style.setProperty("--theme-color", opositeThemeColor)
  body.style.setProperty("--oposite-theme-color", currentThemeColor)
  themeIndicator.style.setProperty("--rotation", rotation += 180)

  sun.classList.toggle("dark")
  moon.classList.toggle("dark")
})