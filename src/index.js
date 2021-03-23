/*eslint-disable */
import {svg, formTemplate, MyBalloonContentLayoutClassTemplate, customItemContentLayoutTemplate} from './templates.js'
import {getDataFB} from "./server.js";

document.addEventListener('DOMContentLoaded', () => {

    getDataFB
        .then(function (res) {
            let marks = res
            let address
            let coords
            ymaps.ready(init)

            function init() {
                let myMap = new ymaps.Map('map', {
                    center: [58.01, 56.23],
                    zoom: 14,
                    controls: ['smallMapDefaultSet'],
                }, {
                    searchControlProvider: 'yandex#search'
                });

                // ШАБЛОН БАЛУНА У МЕТКИ
                let MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
                    MyBalloonContentLayoutClassTemplate,
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
                            .then( res => address = res.geoObjects.get(0).properties.getAll().name )
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
                    let newDate = new Date()
                    let reviewName, reviewPlaceName, reviewText
                    let date = `${newDate.getDate()}.${newDate.getMonth()}.${newDate.getFullYear()}`

                    let validName = false
                    let validPlaceName = false
                    let validReview = false

                    document.addEventListener('keyup', function (e) {

                        let pattern = /^[A-Za-zА-Яа-яЁё_ ]{2,30}$/
                        let value = e.target.value


                        if (e.target.name === 'name') {
                            reviewName = e.target.value
                            validName = pattern.test(value)
                        }
                        if (e.target.name === 'placeName') {
                            reviewPlaceName = e.target.value
                            validPlaceName = value.length > 1
                        }
                        if (e.target.name === 'review') {
                            reviewText = e.target.value
                            validReview = value.length > 1
                        }

                    })
                    document.addEventListener('click', function (e) {
                        e.preventDefault()

                        if (e.target.classList[0] === 'btn') {
                            if ( validName && validPlaceName && validReview) {
                                let formId = e.target.form.getAttribute('data-id')
                                function addObjData() {

                                    let reviewObj = Object.assign({}, {
                                        name: reviewName,
                                        date: date,
                                        review: reviewText,
                                        placeName: reviewPlaceName
                                    });

                                    let newItem = true
                                    marks.forEach(function (obj) {
                                        // если такой есть => добовяем отзыв
                                        if (obj.id === Number(formId)) {
                                            newItem = false
                                            obj.reviews.push(reviewObj)
                                        }
                                    })

                                    if (newItem) {
                                        let arrR = []
                                        arrR.push(reviewObj)

                                        marks.push({
                                            address: address,
                                            coordinates: coords,
                                            id: marks.length + 1,
                                            reviews: arrR
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

                                myMap.balloon.close() //TODO: пооменять на update()?
                                addObjData()
                                addMarks()

                            } else {
                                document.body.classList.add('valid')
                            }

                        }
                    })
                }

                // ШАБЛОН ГРУПЫ МЕТОК
                let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
                    customItemContentLayoutTemplate
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
                            id: marks.length,
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
                }
                addReview()
                addMarks()
            }
        })

})