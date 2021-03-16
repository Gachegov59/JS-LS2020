/*eslint-disable */
import {svg, formTemplate, clusterTemplate} from './templates.js'
import {firebaseConfig} from "./server.js";
import {marksFB, getDataFB} from "./server.js";

document.addEventListener('DOMContentLoaded', () => {


    // let getDataFB = new Promise(function (res, rej) {
    //     // Initialize Firebase
    //     firebase.initializeApp(firebaseConfig);
    //     const bd = firebase.database();
    //
    //     const marks = bd.ref('marks');
    //
    //      marks.on('value', (elem) => {
    //         marksFB = elem.val()
    //         console.log('fb - marksFB', marksFB)
    //          res()
    //     });
    // })
    getDataFB
        .then(function () {
            let marks = marksFB
            // console.log(marksFB)
            let address
            let coords
            // let geoObjects = []
            ymaps.ready(init)

            function init() {
                let myMap = new ymaps.Map('map', {
                    center: [58.01, 56.23],
                    zoom: 14,
                    // controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
                    controls: ['smallMapDefaultSet'],
                }, {
                    searchControlProvider: 'yandex#search'
                });

                // ШАБЛОН БАЛУНА У МЕТКИ
                let MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
                    '<div class="popup">\n' +
                    '        <div class="popup__head">\n' +
                    '          <div class="popup__head-icon">' +
                    `${svg}\n` +
                    '          </div>\n' +
                    '          <div class="popup__title">{{properties.address}}</div>\n' +
                    '        </div>\n' +
                    '        <div class="popup__inner">\n' +
                    '          <div class="popup__reviews scroll">\n' +
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
                    `${formTemplate}\n` +
                    '        </div>\n' +
                    '      </div>',

                    {
                        build: function () {
                            // Сначала вызываем метод build родительского класса.
                            MyBalloonContentLayoutClass.superclass.build.call(this);
                            this._parentElement.offsetParent.parentElement.parentElement.classList.add('_custom')
                        },
                    });


                // ШАБЛОН БАЛУНА ПРИ КЛИКЕ
                myMap.events.add('click', function (e) {
                    document.body.classList.remove('valid')
                    coords = e.get('coords');
                    let myGeocoder = ymaps.geocode(coords);

                    if (!myMap.balloon.isOpen()) {

                        myGeocoder
                            .then(
                                function (res) {
                                    address = res.geoObjects.get(0).properties.getAll().name

                                }
                            )
                            .then(
                                function (res) {
                                    myMap.balloon.open(coords, {
                                        content:
                                            '<div class="popup">\n' +
                                            '        <div class="popup__head">\n' +
                                            '          <div class="popup__head-icon">' +
                                            `            ${svg}\n` +
                                            '          </div>\n' +
                                            `          <div class="popup__title">${address}</div>\n` +
                                            '        </div>\n' +
                                            '        <div class="popup__inner">\n' +
                                            '          <div class="popup__reviews scroll">\n' +
                                            '            <div class="review">\n' +
                                            '              <div class="review__info">\n' +
                                            '                <div class="review__name">Отзывов пока нет...</div>\n' +
                                            '              </div>\n' +
                                            '            </div>\n' +
                                            '          </div>\n' +
                                            `${formTemplate}\n` +
                                            '        </div>\n' +
                                            '          <script>\n' +
                                            '          </script>\n' +
                                            '      </div>'

                                    }, {closeButton: true})

                                }
                            )


                    } else {
                        myMap.balloon.close();
                    }
                });

                // ДОБОВЛЕНИЕ ОТЗЫВА В МАССИВ
                function addReview() {
                    let date = new Date()
                    let dataForm = {
                        name: '',
                        date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
                        dateTime: `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`,
                        review: '',
                        placeName: '',
                    }
                    let validName = false
                    let validPlaceName = false
                    let validReview = false

                    document.addEventListener('keyup', function (e) {

                        let pattern = /^[A-Za-zА-Яа-яЁё]{2,30}$/
                        // let patternReview = /[.+]{2,14}$/
                        let value = e.target.value


                        if(e.target.name === 'name') {
                            dataForm.name = e.target.value
                            validName = pattern.test(value)
                        }
                        if(e.target.name === 'placeName') {
                            dataForm.placeName = e.target.value
                            validPlaceName = pattern.test(value)
                        }
                        if(e.target.name === 'review') {
                            dataForm.review = e.target.value
                            // validReview = patternReview.test(value)
                            validReview = value.length > 1
                        }
                        console.log(validName, validPlaceName, validReview)
                    })
                    document.addEventListener('click', function (e) {
                        e.preventDefault()

                        if (e.target.classList[0] === 'btn') {

                            if ( validName && validPlaceName && validReview) {
                                const address = document.querySelector('.popup__title').textContent

                                function addObjData() {
                                    let step = false
                                    marks.forEach(function (obj) {

                                        if (obj.address === address) {
                                            step = true
                                            obj.reviews.push(dataForm)
                                        }

                                    })
                                    if (!step) {
                                        let arrR = []
                                        arrR.push(dataForm)

                                        marks.push({
                                            address: address,
                                            coordinates: coords,
                                            reviews: arrR //todo костыль ¯\_(ツ)_/¯
                                        })
                                    }

                                    //ЗАПИСЬ В FIREBASE
                                    function writeUserData() {
                                        firebase.database().ref('marks').set(marks);  //todo оптимизировать
                                    }

                                    writeUserData()
                                    validName = false
                                    validPlaceName = false
                                    validReview = false
                                }

                                addObjData()
                                myMap.balloon.close() //TODO: пооменять на update()?

                                addMarks()

                            } else {
                                document.body.classList.add('valid')
                            }

                        }
                    })
                }

                // ШАБЛОН ГРУПЫ МЕТОК
                let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
                    '<h2 class=ballon_header>{{ properties.balloonContentHeader}}</h2>' +
                    '{% for value in properties.reviews %} ' +
                    '<div class=ballon_wrapper>' +
                    '<div class=ballon_body>{{ value.name }}</div>' +
                    '<div class=ballon_footer>{{ value.review }}</div>' +
                    '</div>' +
                    ' {% endfor %}'
                );

                let clusterer = new ymaps.Clusterer({
                    clusterDisableClickZoom: true,
                    clusterOpenBalloonOnClick: true,
                    clusterBalloonContentLayout: 'cluster#balloonCarousel',
                    clusterBalloonItemContentLayout: customItemContentLayout,
                })

                // РЕНДЕР МЕТОК
                function addMarks() {
                    clusterer.removeAll();

                    let placemarks = []
                    marks.forEach(function (obj, i) {
                        let placemark = new ymaps.Placemark(obj.coordinates, {
                            address: obj.address,
                            reviews: obj.reviews,
                            hintContent: obj.address,
                            balloonContentHeader: obj.address,
                            iconContent: obj.reviews.length
                        }, {
                            balloonContentLayout: MyBalloonContentLayoutClass,
                        });
                        placemarks.push(placemark);
                    })

                    myMap.geoObjects.add(clusterer)
                    clusterer.add(placemarks)

                    clusterer.events
                        .add('mouseenter', function (e) {
                            e.get('target').options.set('preset', 'islands#greenIcon');
                        })
                        .add('mouseleave', function (e) {
                            e.get('target').options.unset('preset');
                        });

                }

                addReview()
                addMarks()
            }
        })

})