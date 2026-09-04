/**
 * Vehicle Finder Module
 *
 * Cascading Make -> Model -> Year select for the German-brand fitment search.
 * Submits as a GET filter to /products using the same
 * attributes[<slug>][]=<value> pattern the theme's existing attribute
 * filters use (see components/products/headless/filters/product-filters.jinja).
 *
 * Requires matching "Make" (slug: make), "Model" (slug: model), and "Year"
 * (slug: year) product attributes to be configured in the Zid admin with
 * these exact option values before filtering returns real results.
 */

const VEHICLES = {
  "Audi": ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
  "BMW": ["الفئة 3", "الفئة 5", "الفئة 7", "X3", "X5"],
  "Volkswagen": ["Golf", "Passat", "Tiguan", "Jetta"],
  "Porsche": ["911", "Macan", "Cayenne", "Panamera"]
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2005;

class VehicleFinder {
  constructor() {
    this.form = null;
    this.makeSelect = null;
    this.modelSelect = null;
    this.yearSelect = null;
  }

  init() {
    this.form = document.querySelector("[data-vehicle-finder]");
    if (!this.form) return;

    this.makeSelect = this.form.querySelector("[data-vehicle-make]");
    this.modelSelect = this.form.querySelector("[data-vehicle-model]");
    this.yearSelect = this.form.querySelector("[data-vehicle-year]");

    this.populateMakes();
    this.populateYears();

    this.makeSelect.addEventListener("change", () => this.populateModels());
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  populateMakes() {
    for (const make of Object.keys(VEHICLES)) {
      const option = document.createElement("option");
      option.value = make;
      option.textContent = make;
      this.makeSelect.appendChild(option);
    }
  }

  populateModels() {
    const make = this.makeSelect.value;
    const placeholder = this.modelSelect.dataset.placeholder || "";
    this.modelSelect.innerHTML = "";
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = placeholder;
    this.modelSelect.appendChild(placeholderOption);
    this.modelSelect.disabled = !make;
    if (!make) return;

    for (const model of VEHICLES[make]) {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      this.modelSelect.appendChild(option);
    }
  }

  populateYears() {
    for (let year = CURRENT_YEAR; year >= MIN_YEAR; year--) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      this.yearSelect.appendChild(option);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const make = this.makeSelect.value;
    const model = this.modelSelect.value;
    const year = this.yearSelect.value;

    const url = new URL(window.location.origin + "/products");
    if (make) url.searchParams.append("attributes[make][]", make);
    if (model) url.searchParams.append("attributes[model][]", model);
    if (year) url.searchParams.append("attributes[year][]", year);

    window.location.href = url.toString();
  }
}

const vehicleFinder = new VehicleFinder();

export function init() {
  vehicleFinder.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { vehicleFinder };
export default VehicleFinder;
