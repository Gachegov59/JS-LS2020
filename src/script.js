document.addEventListener('DOMContentLoaded', () => {
    VK.init({
        apiId: 7782703
    })

    function auth() {
        return new Promise((res, rej) => {
            VK.Auth.login(data => {
                if (data.session) {
                    res();
                } else {
                    rej(new Error('не удалось авторизоватсья'))
                }
            }, 2)
        })
    }

    function callAPI(method, params) {
        params.v = '5.76';

        return new Promise((res, rej) => {
            VK.api(method, params, (data) => {
                if (data.error) {
                    rej(data.error);
                } else {
                    res(data.response)
                }
            })
        })
    }


    auth()
        .then(() => {
            return callAPI('users.get', { name_case: 'gen' })
        })
        .then(([me]) => {
            const headerInfo = document.querySelector('#headerInfo')

            headerInfo.textContent = `Друзья на странице ${me.first_name} ${me.last_name}`

            return callAPI('friends.get', { order: 'random', fields: 'city, country, photo_100' })
        })
        .then(friends => {
            let values = {
                items: []
            }

            friends.items.forEach(item => {
                if (item.first_name !== 'DELETED') {
                    values.items.push(item)
                }
            });
            console.log(friends)
            console.log(values)

            return values


        })
        .then(values => {

            const template = document.querySelector('#user-template').textContent;

            const render = Handlebars.compile(template);
            const html = render(values);
            const results = document.querySelector('#results');

            // console.log(friends.items)
            results.innerHTML = html
        })
})