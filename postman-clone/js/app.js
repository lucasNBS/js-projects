import axios from "axios"
import prettyBytes from "pretty-bytes"
import setupEditors from "./setupEditor.js"

// Tabs
const requestTabs = document.querySelectorAll("[data-request-tab]")
const requestTabsContent = document.querySelectorAll("[data-request-tab-content]")

const responseTabs = document.querySelectorAll("[data-response-tab]")
const responseTabsContent = document.querySelectorAll("[data-response-tab-content]")

function handleTabs(tabs, tabDataAttribute, tabsContent, tabContentDataAttribute) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      tabs.forEach((tab) => {
        if (tab.dataset[tabDataAttribute] === e.target.dataset[tabDataAttribute]) {
          tab.classList.add("active")
        } else {
          tab.classList.remove("active")
        }
      })
  
      tabsContent.forEach((tabContent) => {
        if (tabContent.dataset[tabContentDataAttribute] === e.target.dataset[tabDataAttribute]) {
          tabContent.classList.remove("hide")
        } else {
          tabContent.classList.add("hide")
        }
      })
    })
  })
}

handleTabs(requestTabs, "requestTab", requestTabsContent, "requestTabContent")
handleTabs(responseTabs, "responseTab", responseTabsContent, "responseTabContent")

// Add fields
const addButtons = document.querySelectorAll("[data-request-add-button]")
const fieldsContainers = document.querySelectorAll("[data-request-fields-container]")

addButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let fieldsContainer
    fieldsContainers.forEach((field) => {
      if (field.dataset.requestFieldsContainer === e.target.dataset.requestAddButton) {
        fieldsContainer = field
      }
    })

    const fieldContainer = document.createElement("div")
    fieldContainer.classList.add("field")
    fieldContainer.dataset.requestField = e.target.dataset.requestAddButton

    const keyInput = document.createElement("input")
    keyInput.classList.add("field-input")
    keyInput.dataset.key = ""
    keyInput.setAttribute("type", "text")
    keyInput.setAttribute("placeholder", "key")

    const valueInput = document.createElement("input")
    valueInput.classList.add("field-input")
    valueInput.dataset.value = ""
    valueInput.setAttribute("type", "text")
    valueInput.setAttribute("placeholder", "value")

    const removeButton = document.createElement("button")
    removeButton.classList.add("field-remove-button")
    removeButton.dataset.requestRemoveButton = ""
    removeButton.innerText = "Remove"

    fieldContainer.append(keyInput)
    fieldContainer.append(valueInput)
    fieldContainer.append(removeButton)

    fieldsContainer.append(fieldContainer)

    handleRemove()
  })
})

// Remove fields
function handleRemove() {
  const removeButtons = document.querySelectorAll("[data-request-remove-button]")

  removeButtons.forEach((button) => {
    button.removeEventListener("click", removeButtonEventListenerFunction)
  })

  removeButtons.forEach((button) => {
    button.addEventListener("click", removeButtonEventListenerFunction)
  })
}

const removeButtonEventListenerFunction = (e) => {
  e.target.closest(".field").remove()
}

// Send request
const sendButton = document.querySelector("#send-button")
const urlField = document.querySelector("#url-field")
const methodField = document.querySelector("#method-field")

const responseContainer = document.querySelector(".response-container")

const headersContainer = document.querySelector("[data-response-tab-content='headers']")

axios.interceptors.request.use(request => {
  request.customData = request.customData || {}
  request.customData.startTime = new Date().getTime()
  return request
})

axios.interceptors.response.use(updateEndTime, e => {
  return Promise.reject(updateEndTime(e.response))
})

function updateEndTime(response) {
  response.customData = response.customData || {}
  response.customData.time = new Date().getTime() - response.config.customData.startTime
  return response
}

const { requestEditor, updateResponseEditor } = setupEditors()
sendButton.addEventListener("click", () => {
  const queryFields = document.querySelectorAll("[data-request-field='query']")
  const headersFields = document.querySelectorAll("[data-request-field='headers']")

  let data

  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null)
  } catch (err) {
    alert("JSON is malformed")
    return
  }

  axios({
    url: urlField.value,
    method: methodField.value,
    params: createObject(queryFields),
    headers: createObject(headersFields),
    data: data,
  })
  .catch(e => e)
  .then(response => {
    responseContainer.classList.remove("hide")
    updateResponseInfo(response)
    updateHeaders(response.headers)
    updateResponseEditor(response.data)
  })
})

function createObject(container) {
  return [...container].reduce((data, field) => {
    const key = field.querySelector("[data-key]").value
    const value = field.querySelector("[data-value]").value

    if (!key) return data

    return {...data, [key]: value}
  }, {})
}

// Update response data
function updateResponseInfo(response) {
  document.querySelector("[data-response-info-status]").innerText = response.status
  document.querySelector("[data-response-info-time]").innerText = response.customData.time
  document.querySelector("[data-response-info-size]").innerText = prettyBytes(
    JSON.stringify(response.data).length + JSON.stringify(response.headers).length
  )
}

function updateHeaders(headers) {
  headersContainer.innerHTML = ""

  Object.entries(headers).forEach(([key, value]) => {
    const container = document.createElement("div")
    container.classList.add("header-data-field-container")
    
    const keyElement = document.createElement("div")
    keyElement.textContent = key
    container.append(keyElement)

    const valueElement = document.createElement("div")
    valueElement.textContent = value
    container.append(valueElement)

    headersContainer.append(container)
  })
}
