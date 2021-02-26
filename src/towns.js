/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns-content.hbs

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
    return full.toLowerCase().indexOf(chunk.toLowerCase()) > -1
}


const loadingBlock = homeworkContainer.querySelector('#loading-block');
const filterBlock = homeworkContainer.querySelector('#filter-block');
const filterInput = homeworkContainer.querySelector('#filter-input');
const filterResult = homeworkContainer.querySelector('#filter-result');

let citiesArr;
// let textLoad = document.querySelector('#loading-block')
// let filterBlock = document.querySelector('#filter-block')
// let filterInput = document.querySelector('#filter-input')


/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
    return new Promise(function (resolve, reject) {
        fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
            .then(res => {
                loadingBlock.classList.remove('hide')
                loadingBlock.style.display = 'block'

                return res.json()

            })
            .then(cities => {
                let sortCities = cities.sort((a, b) => {
                    return a.name < b.name ? -1 : 1
                })

                resolve(sortCities)
                loadingBlock.style.display = 'none'
            })
            .finally(() => {
                loadingBlock.classList.add('hide')
                // console.log(filterBlock)
                filterBlock.style.display = 'block'

                return filterBlock
            })
            .catch(e => reject(e))
    });
}

loadTowns().then(data => {
    citiesArr = data
})

filterInput.addEventListener('keyup', function() {
    filterCities(this.value)
});

function filterCities(val) {
    let newArr = citiesArr.slice()

    for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].name.toLowerCase().indexOf(val) < 0) {
            newArr.splice(i, 1)
            i--
        }
    }
    renderCities(newArr)
    if (val === '') {
        renderCities([])
    }
}

function renderCities(data) {
    let fragment = document.createDocumentFragment()

    while (filterResult.lastElementChild) {
        filterResult.removeChild(filterResult.lastElementChild);
    }

    data.forEach(el => {
        let li = document.createElement('li')

        li.innerHTML = el.name
        fragment.appendChild(li)
    })
    filterResult.appendChild(fragment)
}


export {
    loadTowns,
    isMatching
};


// ! Города работают в файле test