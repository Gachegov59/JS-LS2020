document.addEventListener('DOMContentLoaded', () => {
    let homeworkContainer = document.querySelector('#homework-container')
    let filterInput = document.querySelector('#filter-input')
    let citiesArr;

    loadTowns().then(data => {
        citiesArr = data
        renderCities(data)
    })

    filterInput.addEventListener('keyup', function (e) {
        filterCities(this.value)
    })
    document.addEventListener('click', e=> {
        if (e.target.tagName ==='LI') {
            console.log(e.target.textContent)
        }
    })

    function renderCities(data) {
        let fragment = document.createDocumentFragment()

        while (homeworkContainer.lastElementChild) {
            homeworkContainer.removeChild(homeworkContainer.lastElementChild);
        }

        data.forEach(el => {
            let li = document.createElement('li')

            li.innerHTML = el.name
            // li.addEventListener('click', function() {
            //     console.log(li.innerHTML)
            // })
            fragment.appendChild(li)
        })
        homeworkContainer.appendChild(fragment)
    }


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


    function loadTowns() {
        let loadingBlock = document.querySelector('#loading-block')
        let filterBlock = document.querySelector('#filter-block')

        return new Promise(function (resolve, reject) {
            fetch('https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json')
                .then(res => {
                    loadingBlock.classList.remove('hide')

                    return res.json()

                })
                .then(cities => {
                    let sortCities = cities.sort((a, b) => {
                        return a.name < b.name ? -1 : 1
                    })

                    resolve(sortCities)
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

});