/*eslint-disable */
import {svg, formTemplate} from './test.js'
import {firebaseConfig} from "./server.js";




document.addEventListener('DOMContentLoaded', () => {



    let data = new Promise(function (res,rej) {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const bd = firebase.database();

        const marks = bd.ref('marks');
        let marksFB
        return marks.on('value', (elem) => {
             marksFB = elem.val()

            console.log('fb - marksFB', marksFB)
        });
    })
    data
        .then( function (res){
        console.log(res)
    })




    // let marks = marksFB

    let marks = [
        {
            address: 'Екатерининская улица, 120',
            coordinates: [58.0078, 56.2327],
            reviews: [
                {
                    name: 'Петя',
                    date: '2018.01.10',
                    dateTime: '22.01.10',
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
                    dateTime: '12.01.10',
                    review: 'Норм',
                    placeName: 'Хуторок',

                },
                {
                    name: 'Лена',
                    date: '2019.01.10',
                    dateTime: '10.11.10',
                    review: 'Не работают!',
                    placeName: 'Связной',
                }
            ]
        }
    ]
    let address
    let coords
    let newCoords
    let geoObjects = []
    ymaps.ready(init)



    function init() {
        let myMap = new ymaps.Map('map', {
            center: [58.01, 56.23],
            zoom: 14,
            controls: ['zoomControl', 'searchControl', 'fullscreenControl'],
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
                },
            });


        // ШАБЛОН БАЛУНА ПРИ КЛИКЕ
        myMap.events.add('click', function (e) {
            if (!myMap.balloon.isOpen()) {
                coords = e.get('coords');
                let myGeocoder = ymaps.geocode(coords);


                myGeocoder
                    .then(
                        function (res) {
                            address = res.geoObjects.get(0).properties.getAll().name
                        }
                    )
                    .then(
                        function () {
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
                                    '      </div>',
                            }, {closeButton: true})
                        }
                    )
            } else {
                myMap.balloon.close();
            }
        });


        myMap.events.add('click', function (e) {
            // console.log(e.get('coords'))
            newCoords = e.get('coords')
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

            document.addEventListener('keyup', function (e) {
                if (e.target.name === 'name') {
                    dataForm.name = e.target.value
                }
                if (e.target.name === 'placeName') {
                    dataForm.placeName = e.target.value
                }
                if (e.target.name === 'review') {
                    dataForm.review = e.target.value
                }
            })
            document.addEventListener('click', function (e) {
                if (e.target.classList[0] === 'btn') {
                    e.preventDefault()
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
                                coordinates: newCoords,
                                reviews: arrR //todo костыль ¯\_(ツ)_/¯
                            })
                            console.log('dataForm', dataForm)
                            console.log('marks', marks)

                            // myMap.geoObjects.add(coordinates, {
                            //     address: address,
                            //     reviews: dataForm,
                            //     hintContent: address,
                            //
                            // }, {
                            //     balloonContentLayout: MyBalloonContentLayoutClass,
                            // })


                        }

                    }

                    addObjData()
                    myMap.balloon.close() //TODO: пооменять на update()?

                    addMarks()


                }
            })
        }

        // РЕНДЕР МЕТОК
        function addMarks() {
            // console.log(marksFB) //todo: продолжить переход на FB
            marks.forEach(function (obj, i) {
                geoObjects[i] = new ymaps.Placemark(obj.coordinates, {
                    address: obj.address,
                    reviews: obj.reviews,
                    hintContent: obj.address,

                }, {
                    balloonContentLayout: MyBalloonContentLayoutClass,
                });
            })
            console.log('geoObjects', geoObjects)

            let clusterer = new ymaps.Clusterer({})

            myMap.geoObjects.add(clusterer)
            clusterer.add(geoObjects)
        }


        addReview()
        addMarks()

        // function addMarks() {
        //     let myPacemark
        //     marks.forEach(function (obj, i) {
        //         myPacemark = new ymaps.Placemark(obj.coordinates, {
        //             address: obj.address,
        //             reviews: obj.reviews,
        //             hintContent: obj.address,
        //
        //         }, {
        //             balloonContentLayout: MyBalloonContentLayoutClass,
        //         });
        //         myMap.geoObjects.add(myPacemark)
        //     })
        //
        // }
    }
})