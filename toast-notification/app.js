const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  canClose: true,
  pauseOnHover: true,
  showProgress: true,
};

class Toast {
  toastElement;
  removeFunction;
  time;

  constructor(options) {
    this.toastElement = document.createElement("div");
    this.toastElement.classList.add("toast");

    requestAnimationFrame(() => {
      this.toastElement.classList.add("show");
    });

    Object.entries({ ...defaultOptions, ...options }).forEach(
      ([key, value]) => {
        this[key] = value;
      }
    );

    this.toastElement.style.setProperty("--time", `${this.time}ms`);
  }

  set position(value) {
    const selector = `.container[data-position="${value}"]`;

    const container =
      document.querySelector(selector) || createContainer(value);

    container.append(this.toastElement);
  }

  set text(value) {
    this.toastElement.textContent = value;
  }

  set autoClose(value) {
    if (!value) return;

    this.time = value;

    this.startTime = Date.now();
    this.removeFunction = setTimeout(() => this.remove(), value);
  }

  set canClose(value) {
    if (value) {
      this.toastElement.classList.add("can-close");
      this.toastElement.addEventListener("click", () => this.remove());
    }
  }

  set pauseOnHover(value) {
    if (value) {
      this.toastElement.addEventListener("mouseover", () => {
        this.toastElement.classList.add("stop");
        this.timeRemaining = this.time + this.startTime - Date.now();
        clearTimeout(this.removeFunction);
      });

      this.toastElement.addEventListener("mouseleave", () => {
        this.toastElement.classList.remove("stop");
        this.removeFunction = setTimeout(() => {
          this.remove();
        }, this.timeRemaining);
        this.startTime = Date.now();
        this.time = this.timeRemaining;
      });
    }
  }

  set showProgress(value) {
    if (value) {
      this.toastElement.classList.add("show-progress");
    }
  }

  remove() {
    const container = this.toastElement.parentElement;
    this.toastElement.classList.remove("show");

    if (this.onClose) this.onClose();

    this.toastElement.addEventListener("transitionend", () => {
      this.toastElement.remove();
      if (!container.hasChildNodes()) container.remove();
    });
  }
}

function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
}

const buttonElement = document.querySelector("button");

buttonElement.addEventListener("click", () => {
  new Toast({
    position: "top-right",
    text: "Hello World",
  });
});
