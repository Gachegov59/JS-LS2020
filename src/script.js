// eslint-disable-next-line no-unused-vars

document.addEventListener('DOMContentLoaded', () => {

    let marks = [
        {
            address: 'Екатерининская улица, 120',
            coordinates: [58.0078, 56.2327],
            reviews: [
                {
                    name: 'Петя',
                    date: '2018.01.10',
                    review: 'Хорошее место',
                    placeName: 'Суфра',
                }
            ]
        },
        {
            address: 'Ленина, 60',
            coordinates: [58.0094, 56.2332],
            reviews: [
                {
                    name: 'Вася',
                    date: '2018.11.05',
                    review: 'Норм',
                    placeName: 'Хуторок',

                },
                {
                    name: 'Лена',
                    date: '2019.01.10',
                    review: 'Не работают!',
                    placeName: 'Связной',
                }
            ]
        }
    ]

    ymaps.ready(init);

    function init() {
        let myMap = new ymaps.Map('map', {
            center: [58.01, 56.23],
            zoom: 14,
            controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
            // behaviors: ['drag']
        }, {
            searchControlProvider: 'yandex#search'
        });


        // ШАБЛОН БАЛУНА У МЕТКИ
        /*eslint-disable */
        let MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
            '<div class="popup">\n' +
            '        <div class="popup__head">\n' +
            '          <div class="popup__head-icon">' +
            '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35.219 35.219" style="enable-background:new 0 0 35.219 35.219;" xml:space="preserve">\n' +
            '<g>\n' +
            '\t<path d="M17.612,0C11.005,0,5.648,5.321,5.648,11.885c0,3.358,3.294,9.374,3.294,9.374l8.229,13.96l8.586-13.797\n' +
            '\t\tc0,0,3.814-5.74,3.814-9.537C29.572,5.321,24.216,0,17.612,0z M17.556,18.431c-3.784,0-6.849-3.065-6.849-6.853\n' +
            '\t\tc0-3.783,3.064-6.846,6.849-6.846c3.782,0,6.85,3.063,6.85,6.846C24.406,15.366,21.338,18.431,17.556,18.431z"></path>\n' +
            '</g>\n' +
            '</svg>\n' +
            '\n' +
            '          </div>\n' +
            '          <div class="popup__title">{{properties.address}}</div>\n' +
            '          <button class="popup__close"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">\n' +
            '    <path fill="white" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>\n' +
            '</svg>\n' +
            '          </button>\n' +
            '        </div>\n' +
            '        <div class="popup__inner">\n' +
            '          <div class="popup__reviews scroll">\n' +
            // '[if properties.review]да \n' +
            '{% for value in properties.reviews %} ' +
            '            <div class="review">\n' +
            '              <div class="review__info">\n' +
            '                <div class="review__name">{{value.name}}</div>\n' +
            '                <div class="review__about">{{value.placeName}} {{value.date}}</div>\n' +
            '              </div>\n' +
            '              <p class="review__text"> {{value.review}}</p>\n' +
            '            </div>\n' +
            ' {% endfor %}' +
            '          </div>\n' +
            '          <form class="popup__form form">\n' +
            '            <h3 class="form__title">ВАШ ОТЗЫВ</h3>\n' +
            '            <div class="form__input">\n' +
            '              <input placeholder="Ваше имя" type="text" name="name">\n' +
            '            </div>\n' +
            '            <div class="form__input">\n' +
            '              <input placeholder="Укажите место" type="text" name="placeName">\n' +
            '            </div>\n' +
            '            <div class="form__textarea">\n' +
            '              <textarea placeholder="Поделитесь впечатлениями" rows="8" name="review"></textarea>\n' +
            '            </div>\n' +
            '            <div class="popup__btn _right">\n' +
            '              <button class="btn">Добавить</button>\n' +
            '            </div>\n' +
            '          </form>\n' +
            '        </div>\n' +
            '      </div>',

            {
                // Переопределяем функцию build, чтобы при создании макета начинатьl
                build: function () {
                    // Сначала вызываем метод build родительского класса.
                    MyBalloonContentLayoutClass.superclass.build.call(this);

                    // А затем выполняем дополнительные действия.
                    const btn = document.querySelector('.btn')
                    const popupForm = document.querySelector('.popup__form')
                    const inputName = popupForm.name
                    const placeName = popupForm.placeName
                    const review = popupForm.review
                    let date = new Date()

                    let dataForm = {
                        name: '',
                        date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
                        dateTime: `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`,
                        review: '',
                        placeName: '',
                    }

                    inputName.addEventListener('keyup', function (e) {
                        dataForm.name = e.target.value
                    })
                    placeName.addEventListener('keyup', function (e) {
                        dataForm.placeName = e.target.value
                    })
                    review.addEventListener('keyup', function (e) {
                        dataForm.review = e.target.value
                    })
                    btn.addEventListener('click', function (e) {
                        e.preventDefault()
                        console.log(this)
                    })
                    // $('#counter-button').bind('click', this.onCounterClick);
                    // $('#count').html(counter);
                },
            });
        /* eslint-enable */


        // РЕНДЕР МЕТОК
        marks.forEach(function (obj) {
            let myPlacemark = new ymaps.Placemark(obj.coordinates, {
                name: obj.name,
                address: obj.address,
                metro: true,
                reviews: obj.reviews

            }, {
                balloonContentLayout: MyBalloonContentLayoutClass,
                // balloonPanelMaxMapArea: 0
            });

            myMap.geoObjects.add(myPlacemark);
        })

        // ОТКРЫТЬ БУЛЕТ ПО КЛИКУ
        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                let coords = e.get('coords');

                let myGeocoder = ymaps.geocode(coords);
                let address

                myGeocoder
                    .then(
                        function (res) {
                            address = res.geoObjects.get(0).properties.getAll().name
                        }
                    )
                    .then(
                        function () {
                            myMap.balloon.open(coords, {
                                content: '<div class="popup">\n' +
                                    '        <div class="popup__head">\n' +
                                    '          <div class="popup__head-icon">' +
                                    '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35.219 35.219" style="enable-background:new 0 0 35.219 35.219;" xml:space="preserve">\n' +
                                    '<g>\n' +
                                    '\t<path d="M17.612,0C11.005,0,5.648,5.321,5.648,11.885c0,3.358,3.294,9.374,3.294,9.374l8.229,13.96l8.586-13.797\n' +
                                    '\t\tc0,0,3.814-5.74,3.814-9.537C29.572,5.321,24.216,0,17.612,0z M17.556,18.431c-3.784,0-6.849-3.065-6.849-6.853\n' +
                                    '\t\tc0-3.783,3.064-6.846,6.849-6.846c3.782,0,6.85,3.063,6.85,6.846C24.406,15.366,21.338,18.431,17.556,18.431z"></path>\n' +
                                    '</g>\n' +
                                    '</svg>\n' +
                                    '\n' +
                                    '          </div>\n' +
                                    `          <div class="popup__title">${address}</div>\n` +
                                    '          <button class="popup__close"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">\n' +
                                    '    <path fill="white" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>\n' +
                                    '</svg>\n' +
                                    '          </button>\n' +
                                    '        </div>\n' +
                                    '        <div class="popup__inner">\n' +
                                    '          <div class="popup__reviews scroll">\n' +
                                    '            <div class="review">\n' +
                                    '              <div class="review__info">\n' +
                                    '                <div class="review__name">Отзывов пока нет...</div>\n' +
                                    // '                <div class="review__about">{{value.placeName}} {{value.date}}</div>\n' +
                                    '              </div>\n' +
                                    // '              <p class="review__text"> {{value.review}}</p>\n' +
                                    '            </div>\n' +
                                    '          </div>\n' +
                                    '          <form class="popup__form form">\n' +
                                    '            <h3 class="form__title">ВАШ ОТЗЫВ</h3>\n' +
                                    '            <div class="form__input">\n' +
                                    '              <input placeholder="Ваше имя" type="text" name="name">\n' +
                                    '            </div>\n' +
                                    '            <div class="form__input">\n' +
                                    '              <input placeholder="Укажите место" type="text" name="placeName">\n' +
                                    '            </div>\n' +
                                    '            <div class="form__textarea">\n' +
                                    '              <textarea placeholder="Поделитесь впечатлениями" rows="8" name="review"></textarea>\n' +
                                    '            </div>\n' +
                                    '            <div class="popup__btn _right">\n' +
                                    '              <button class="btn">Добавить</button>\n' +
                                    '            </div>\n' +
                                    '          </form>\n' +
                                    '        </div>\n' +
                                    '      </div>',
                            }, { closeButton: true })
                        }
                    )


            } else {
                myMap.balloon.close();
            }
        });

    }
})