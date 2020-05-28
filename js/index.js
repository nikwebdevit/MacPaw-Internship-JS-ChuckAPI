let random = document.querySelector('#random');
let rub = document.querySelector('#categories');
let search = document.querySelector('#search');
const rubsec = document.querySelector('.wrapper__rub');
const searchs = document.querySelector('#searchs');
const menu = document.querySelector('.menu');


rub.addEventListener('click', function () {
  rubsec.style.display = 'block';
  searchs.style.display = '';
});

search.addEventListener('click', function () {
  searchs.style.display = 'block';
  rubsec.style.display = '';
});

random.addEventListener('click', function () {
  searchs.style.display = '';
  rubsec.style.display = '';
});

menu.addEventListener('click', function () {
  const menuSpan = this.querySelector('span');
  const aside = document.querySelector('.wrapper-aside');
  menuSpan.classList.toggle('close');
  let claass = menuSpan.getAttribute('class');
  if (claass == 'close') {
    aside.style.display = 'block';
  } else {
    aside.style.display = '';
  }
})


// --------------------------

const jokes = [];

(function (arrOfJokes) {
  const objOfJokes = arrOfJokes.reduce((acc, joke) => {
    acc[joke.id] = joke;
    return acc;
  }, {});


  // Elemnts UI
  const cards = document.querySelector('.main-cards');
  const acards = document.querySelector('.aside-cards');
  const form = document.forms['getJoke'];

  // Events
  fav()
  renderAllJokes(objOfJokes);
  form.addEventListener('submit', onFormSubmitHandler);
  cards.addEventListener('click', onCardLike);
  acards.addEventListener('click', onCardLike);

  function fav() {
    const keys = Object.keys(localStorage)
    let ikeys = keys.length
    while (ikeys--) {
      const keysObj = JSON.parse(localStorage.getItem(keys[ikeys]))
      createNewJoke(keysObj.id, keysObj.url, keysObj.value, keysObj.updated_at, keysObj.categories, keysObj.like);
    }
  }

  function renderAllJokes(jokesList) {
    Object.values(jokesList).forEach(joke => {
      const id = document.querySelector('#_' + joke.id);
      if (id == null) {
        const card = ItemTemplate(joke);
        cards.insertAdjacentElement('afterbegin', card);
        if (joke.like == true) {
          acards.insertAdjacentElement('afterbegin', card);
        }
      }
    });
  };


  function ItemTemplate({ id, url, value, updated_at, categories, like } = {}) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-joke-id', id);
    card.setAttribute('id', '_' + id);

    const cardId = document.createElement('div');
    cardId.classList.add('card-id');
    cardId.textContent = 'ID:';

    const cardIdurl = document.createElement('a');
    cardIdurl.setAttribute('href', url);
    cardIdurl.setAttribute('target', '_blank');
    cardIdurl.textContent = id;

    const cardIdimg = document.createElement('img');
    cardIdimg.setAttribute('src', 'img/interface.svg');

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    cardText.textContent = value;

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card-info');

    const cardDate = document.createElement('div');
    cardDate.classList.add('card-date');
    cardDate.textContent = 'Last update: ';

    const cardDateSpan = document.createElement('span');
    let time = Date.parse(updated_at)
    let timeNow = Date.parse(new Date());
    cardDateSpan.textContent = ((timeNow - time) / (1000 * 60 * 60)).toFixed() + ' hours ago';

    const cardRub = document.createElement('div');
    cardRub.classList.add('card-rub');
    cardRub.textContent = categories;

    const cardlike = document.createElement('img');
    cardlike.classList.add('card-like');
    if (like == true) {
      cardlike.setAttribute('src', 'img/heart.png');
    } else {
      cardlike.setAttribute('src', 'img/heart1.png');
    }

    cardId.appendChild(cardIdurl);
    cardIdurl.appendChild(cardIdimg);
    card.appendChild(cardId);
    card.appendChild(cardText);
    cardInfo.appendChild(cardDate);
    if (categories.length != 0) {
      cardInfo.appendChild(cardRub);
    }
    cardDate.appendChild(cardDateSpan);
    card.appendChild(cardInfo);
    card.appendChild(cardlike);

    return card;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();

    const radio = form.elements['main'].value;

    if (radio == 'Random') {
      var url = 'https://api.chucknorris.io/jokes/random'; fetchAsync();
    }
    else if (radio == 'Categories') {
      let catrub = form.elements.rub.value
      var url = 'https://api.chucknorris.io/jokes/random?category=' + catrub;
      fetchAsync();
    }
    else if (radio == 'Search') {
      let searchs = form.elements['search1'].value;
      if (searchs.length < 3) {
        alert('Введите Ваш запрос!')
      } else {
        var url = 'https://api.chucknorris.io/jokes/search?query=' + searchs;
        SearchFetchAsync();
      }
    }

    async function fetchAsync() {
      const res = await fetch(url)
      const data = await res.json()
      createNewJoke(data.id, data.url, data.value, data.updated_at, data.categories);
      renderAllJokes(objOfJokes);
    }

    async function SearchFetchAsync() {
      const res = await fetch(url)
      let data = await res.json()
      const dataResult = data.result
      for (let data of dataResult) {
        createNewJoke(data.id, data.url, data.value, data.updated_at, data.categories);
      }
      renderAllJokes(objOfJokes);
    }


  }

  function createNewJoke(id, url, value, updated_at, categories, like) {
    const newJoke = {
      id,
      url,
      value,
      updated_at,
      categories,
      like: like || false
    };

    objOfJokes[newJoke.id] = newJoke;

    return { ...newJoke };
  }

  function onCardLike({ target }) {
    if (target.classList.contains('card-like')) {
      const parent = target.closest('[data-joke-id]');
      const id = parent.dataset.jokeId;
      onLike(id, target, parent);
    }
  }
  function onLike(id, target, parent) {
    const { like } = objOfJokes[id];
    let imgSrc = target.closest('.card-like');
    if (like == true) {
      objOfJokes[id].like = false;
      imgSrc.setAttribute('src', 'img/heart1.png')
      deleteFavouriteJokes(parent)
      localStorage.removeItem(objOfJokes[id].id)
    }
    else if (like == false) {
      objOfJokes[id].like = true;
      imgSrc.setAttribute('src', 'img/heart.png');
      renderFavouriteJokes(parent);
      localStorage.setItem(objOfJokes[id].id, JSON.stringify(objOfJokes[id]));
    }
  }

  function renderFavouriteJokes(id) {
    id.remove();
    renderAllJokes(objOfJokes);

  }
  function deleteFavouriteJokes(id) {
    id.remove();
    renderAllJokes(objOfJokes);
  }

})(jokes);