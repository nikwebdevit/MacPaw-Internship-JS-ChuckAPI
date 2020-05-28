$(document).ready(function () {

  

  $('.random').click(function () {
    $('.search__input').css('display', 'none')
    $('.wrapper-categories').css('display', 'none')
  });

  $('.categories').click(function () {
    $('.search__input').css('display', 'none')
    $('.wrapper-categories').slideDown({
      duration: 200,
      start: function () {
        $(this).css({
          display: 'block'
        })
      }
    });
  });

  $('.search').click(function () {
    $('.wrapper-categories').css('display', 'none')
    $('.search__input').slideDown({
      duration: 200,
      start: function () {
        $(this).css({
          display: 'block'
        })
      }
    });
  });


});


const jokeForm = document.getElementById('jokeForm');
const jokes = document.getElementById('main__joke');


jokeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('clicked the button');

  const random = document.getElementById('radio').checked;
  const categories = document.getElementById('categories').checked;
  const search = document.getElementById('search').checked;
  if (random == true) {
    var url = 'https://api.chucknorris.io/jokes/random';
  } else if (categories == true) {
    var animal = document.getElementById('animal').checked;
    var career = document.getElementById('career').checked;
    var celebrity = document.getElementById('celebrity').checked;
    var dev = document.getElementById('dev').checked;
    if (animal == true) {
      var url = 'https://api.chucknorris.io/jokes/random?category=animal';
    } else if (career == true) {
      var url = 'https://api.chucknorris.io/jokes/random?category=career';
    } else if (celebrity == true) {
      var url = 'https://api.chucknorris.io/jokes/random?category=celebrity';
    } else if (dev == true) {
      var url = 'https://api.chucknorris.io/jokes/random?category=dev';
    }
  } else if (search == true) {
    var searchs = document.getElementById('searchs').value;
    var url1 = 'https://api.chucknorris.io/jokes/search?query=' + searchs;
  }




  console.log(searchs);
  if (random == true || categories == true) {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        jokes.insertAdjacentHTML(
          'afterbegin',
          showJoke(data.id, data.categories, data.value, data.updated_at)
        );
      });
  } else if (search == true) {
    fetch(url1)
      .then((res1) => {
        return res1.json();
      })
      .then(data => {
        console.log(data);
        for (var i = 0; i < 25; i++) {
          jokes.insertAdjacentHTML(
            'afterbegin',
            showJoke(data.result[i].id, data.result[i].categories, data.result[i].value, data.result[i].updated_at)
          );
        }
      });
  }
  $('.card__img').click(function () {
    $(this).attr('src', 'img/heart.png');
  });
});


const showJoke = (id, category, joke, updated) => {
  return `
  <div class="card">
    <div class="card__main">
      <img src="img/heart1.png" class="card__img">
      <div class="card-id">
        ID: <a href="https://api.chucknorris.io/jokes/${id}">${id}<img src="img/interface.svg" alt="link"></a>
      </div>
      <div class="card-text">
        ${joke}
      </div>
      <div class="card-bottom">
        <div class="card-bottom__date">Last update: ${updated} hours ago</div>
        <div class="card-bottom__categories">${category}</div>
      </div>
    </div>
  </div>
  `
};