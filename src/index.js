import listTemplate from '../src/templates/list.hbs';
import cardTemplate from '../src/templates/card.hbs';
import API from './fetchCountries.js';
import { debounce } from 'debounce';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
import '@pnotify/mobile/dist/PNotifyMobile.css';
// import '@pnotify/desktop/dist/PNotifyDesktop';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('#search__input'),
  list: document.querySelector('.js-list'),
  cardContainer: document.querySelector('.js-card-container'),
};

refs.input.addEventListener('input', debounce(handleSearch, 500));

function handleSearch(e) {
  const query = e.target.value;

  API.fetchCountry(query)
    .then(countries => {
      if (countries.length > 10) {
        error({
          title: 'Too many matches found.',
          text: 'Please enter a more specific query!',
          styling: 'brighttheme',
          delay: 1000,
        });

        refs.cardContainer.innerHTML = '';
        refs.list.innerHTML = '';
      }

      if (countries.length > 1 && countries.length < 11) {
        renderCountryList(countries);
        refs.cardContainer.innerHTML = '';
      }
      if (countries.length === 1) {
        refs.list.innerHTML = '';
        renderCountryCard(countries);
      }
      if (countries.status === 404) {
        error({
          title: 'No matches found.',
          text: 'Please enter another query!',
          styling: 'brighttheme',
          delay: 1000,
        });
        refs.cardContainer.innerHTML = '';
        refs.list.innerHTML = '';
      }
    })
    .catch(onFetchError);
}

function renderCountryList(result) {
  const markup = listTemplate(result);
  refs.list.innerHTML = markup;
}

function renderCountryCard(result) {
  const markup = cardTemplate(result);
  refs.cardContainer.innerHTML = markup;
}

function onFetchError(error) {
  console.log('Something went wrong, try entering the country name in English');
}
// const checkboxEl = document.querySelector('#theme-switch-toggle');
// const bodyEl = document.querySelector('body');
// const ulMenuEl = document.querySelector('.js-menu');

// checkboxEl.addEventListener('change', onCheckboxChange);
// document.addEventListener('DOMContentLoaded', checkTheme);
// // window.onload = checkTheme();

// function onCheckboxChange(e) {
//   if (checkboxEl.checked) {
//     bodyEl.classList.replace(Theme.LIGHT, Theme.DARK);
//     localStorage.setItem('theme', JSON.stringify(Theme.DARK));
//   }
//   if (!checkboxEl.checked) {
//     bodyEl.classList.replace(Theme.DARK, Theme.LIGHT);
//     localStorage.setItem('theme', JSON.stringify(Theme.LIGHT));
//   }
// }

// function checkTheme(e) {
//   const savedSettings = localStorage.getItem('theme');
//   const parsedSettings = JSON.parse(savedSettings);
//   if (parsedSettings === Theme.DARK) {
//     bodyEl.classList.add(Theme.DARK);
//     checkboxEl.checked = true;
//   }
//   if (parsedSettings !== Theme.DARK) {
//     bodyEl.classList.add(Theme.LIGHT);
//     checkboxEl.checked = false;
//   }
// }

// const cardsMarkup = createCardsMarkup(menu);
// function createCardsMarkup(menu) {
//   return cardsTemplate(menu);
// }

// ulMenuEl.insertAdjacentHTML('beforeend', cardsMarkup);
