/**
 * Estado da aplicação (state)
 */
let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let formatNumber = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');

  // prettier-ignore
  totalPopulationFavorites = 
    document.querySelector('#totalPopulationFavorites');

  formatNumber = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

const fetchCountries = async () => {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();

  allCountries = json.map((country) => {
      const { numericCode, translations, population, flag } = country;

      return {
        id: numericCode,
        name: translations.pt,
        population,
        formattedPopulation: formatNumberFn(population),
        flag,
      };
    }).filter(country => {
      return !!country.id;
    }); // Inclusão extra - filtrando somente países com id válido

  render();
};

const render = () => {
  renderCountryList();
  renderFavorites();
  renderSummary();

  handleCountryButtons();
};

const renderCountryList = () => {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, formattedPopulation } = country;

    const countryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn">+</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>  
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';
  tabCountries.innerHTML = countriesHTML;
};

const renderFavorites = () => {
  let favoritesHTML = '<div>';

  favoriteCountries.forEach(country => {
    const { name, flag, id, formattedPopulation } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>  
    `;

    favoritesHTML += favoriteCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
};

const renderSummary = () => {
  countCountries.innerHTML = allCountries.length;
  countFavorites.innerHTML = favoriteCountries.length;

  const totalPopulation = allCountries.reduce((a, b) => a + b.population, 0);
  const totalFavorites = favoriteCountries.reduce((a, b) => a + b.population,0);

  totalPopulationList.innerHTML = formatNumberFn(totalPopulation);
  totalPopulationFavorites.innerHTML = formatNumberFn(totalFavorites);
};

const handleCountryButtons = () => {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach(button => {
    button.addEventListener('click', () => {
      addToFavorites(button.id)
    });
  });

  favoriteButtons.forEach(button => {
    button.addEventListener('click', () =>{ 
      removeFromFavorites(button.id)});
  });
};

const addToFavorites = (id) => {
  const countryToAdd = allCountries.find(country => country.id === id);

  favoriteCountries.push(countryToAdd);

  favoriteCountries.sort((a, b) => a.name.localeCompare(b.name));

  allCountries = allCountries.filter(country => country.id !== id);

  render();
};

const removeFromFavorites=(id)=> {
  const countryToRemove = favoriteCountries.find(country => country.id === id);

  allCountries.push(countryToRemove);

  allCountries.sort((a, b) => a.name.localeCompare(b.name));

  favoriteCountries = favoriteCountries.filter(country => country.id !== id);
  render();
}

const formatNumberFn=(number)=> {
  return formatNumber.format(number);
}
