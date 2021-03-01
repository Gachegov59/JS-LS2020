/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');
let cookie
let filterValue



filterNameInput.addEventListener('keyup', function () {
    filterValue = this.value
    render(this.value)
});

// ДОБОВЛЕНИЕ В COOKIE
addButton.addEventListener('click', cookieAdd);
addNameInput.addEventListener('keyup', (e) => {
    let keyCode = e.keyCode || e.charCode || e.which;

    if (keyCode === 13) {
        cookieAdd()
    }
})
addValueInput.addEventListener('keyup', (e) => {
    let keyCode = e.keyCode || e.charCode || e.which;

    if (keyCode === 13) {
        cookieAdd()
    }
})

function cookieAdd() {
    let nameInput = addNameInput.value;
    let valueInput = addValueInput.value;


    if (nameInput !== '' && valueInput !== '') {
        document.cookie = addNameInput.value + '=' + addValueInput.value;
        render(cookie)
    }

    if (nameInput === filterValue || valueInput === filterValue || filterValue === '' || filterValue === undefined) {
        render(cookie)
    }
}

// УДАЛЕНИЕ ИЗ СПИСКА И COOKIE
listTable.addEventListener('click', (e) => {
    let name = e.target.previousSibling.previousSibling.textContent

    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    render(cookie)
})

// ДОБОВЛЕНИЕ В DOM ИЗ COOKIE + filter
function render() {
    let fragment = document.createDocumentFragment()
    let cookieArr

    if (document.cookie.split(';').length) {
        cookieArr = document.cookie.split('; ')
    }

    while (listTable.lastElementChild) {
        listTable.removeChild(listTable.lastElementChild);
    }

    for (let i = 0; i < cookieArr.length; i++) {

        let tr = document.createElement('tr')
        let tableName = document.createElement('td')
        let tableValue = document.createElement('td')
        let tableBtn = document.createElement('button')

        let name = cookieArr[i].split('=')[0]
        let value = cookieArr[i].split('=')[1]


        if (cookieArr[i].length !== 0 && (name.indexOf(filterValue) > -1 || value.indexOf(filterValue) > -1 || filterValue === '' || filterValue === undefined)) {


            tableName.innerHTML = name
            tableValue.innerHTML = value
            tableBtn.innerHTML = 'удалить'

            tr.appendChild(tableName)
            tr.appendChild(tableValue)
            tr.appendChild(tableBtn)

            fragment.appendChild(tr)
        }
    }

    listTable.appendChild(fragment)
}

render()