/*eslint-disable */

export let svg = '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35.219 35.219" style="enable-background:new 0 0 35.219 35.219;" xml:space="preserve">\n' +
    '<g>\n' +
    '\t<path d="M17.612,0C11.005,0,5.648,5.321,5.648,11.885c0,3.358,3.294,9.374,3.294,9.374l8.229,13.96l8.586-13.797\n' +
    '\t\tc0,0,3.814-5.74,3.814-9.537C29.572,5.321,24.216,0,17.612,0z M17.556,18.431c-3.784,0-6.849-3.065-6.849-6.853\n' +
    '\t\tc0-3.783,3.064-6.846,6.849-6.846c3.782,0,6.85,3.063,6.85,6.846C24.406,15.366,21.338,18.431,17.556,18.431z"></path>\n' +
    '</g>\n' +
    '</svg>'

export let formTemplate =
    '          <form class="popup__form form">\n' +
    '            <h3 class="form__title">ВАШ ОТЗЫВ</h3>\n' +
    '            <div class="form__input">\n' +
    '              <input placeholder="Ваше имя" type="text" name="name" autofocus>\n' +
    '            </div>\n' +
    '            <div class="form__input">\n' +
    '              <input placeholder="Укажите место" type="text" name="placeName" pattern="[A-Za-zА-Яа-яЁё]">\n' +
    '            </div>\n' +
    '            <div class="form__textarea">\n' +
    '              <textarea placeholder="Поделитесь впечатлениями" rows="5" name="review"></textarea>\n' +
    '            </div>\n' +
    '            <div class="popup__btn _right">\n' +
    '              <button class="btn">Добавить</button>\n' +
    '            </div>\n' +
    '          </form>'

export let clusterTemplate  =
    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
    '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
    '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
    '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
