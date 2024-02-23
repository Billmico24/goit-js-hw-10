import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const elements = {
  selectEl: document.querySelector('.breed-select'),
  textMarkEl: document.querySelector('.cat-info'),
  loaderContainerEl: document.querySelector('.loader-container'),
};

const { selectEl, textMarkEl, loaderContainerEl } = elements;

loaderContainerEl.classList.remove('is-hidden');

selectEl.addEventListener('change', createMarkUp);

updateSelect();

function updateSelect(data) {
  fetchBreeds(data)
    .then(data => {
      let markSelect = data.map(({ name, id }) => {
        return `<option value ='${id}'>${name}</option>`;
      });
      selectEl.insertAdjacentHTML('beforeend', markSelect);
      new SlimSelect({
        select: selectEl,
      });
    })
    .catch(onFetchError)
    .finally(() => {
      hideLoaderAfterDelay();
    });
}

function createMarkUp(event) {
  selectEl.classList.add('is-hidden');
  loaderContainerEl.classList.remove('is-hidden');
  textMarkEl.innerHTML = '';

  const breedId = event.currentTarget.value;

  fetchCatByBreed(breedId)
    .then(data => {
      const { url, breeds } = data[0];

      textMarkEl.innerHTML = `<img src="${url}" alt="${breeds[0].name}" width="400"/><div class="box"><h2>${breeds[0].name}</h2><p>${breeds[0].description}</p><p><strong>Temperament:</strong> ${breeds[0].temperament}</p></div>`;
      textMarkEl.classList.remove('is-hidden');
    })
    .catch(onFetchError)
    .finally(() => {
      hideLoader();
    });
}

function hideLoaderAfterDelay() {
  setTimeout(() => {
    hideLoader();
  }, 1000);
}

function hideLoader() {
  loaderContainerEl.classList.add('is-hidden');
}

function onFetchError(error) {
  Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!'
  );
}
