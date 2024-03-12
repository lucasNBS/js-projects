const tabsNav = document.querySelectorAll(".navbar-item")
const tabsContent = document.querySelectorAll(".tab-content")

tabsNav.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    const selectedTab = e.target.dataset.nav
    
    tabsNav.forEach((tab) => {
      if (tab.dataset.nav === selectedTab) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    tabsContent.forEach((tab) => {
      if (tab.dataset.content === selectedTab) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })
  })
})