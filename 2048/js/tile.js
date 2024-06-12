export class Tile {
  #value;
  #x;
  #y;

  constructor(container, value = Math.random() > 0.5 ? 2 : 4) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.textContent = value;
    this.tileElement = tile;
    container.appendChild(tile);
    this.value = value;
    this.hasBeenMerged = false;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    const lightness = 100 - 9 * Math.log2(value);

    this.tileElement.style.setProperty(
      "--background-lightness",
      `${lightness}%`
    );
    this.tileElement.style.setProperty(
      "--text-lightness",
      lightness < 60 ? "90%" : "10%"
    );

    this.tileElement.textContent = value;
    this.#value = value;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    this.#x = value;
    this.tileElement.style.setProperty("--x", value);
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    this.#y = value;
    this.tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.tileElement.classList.add("to-remove");
  }
}
