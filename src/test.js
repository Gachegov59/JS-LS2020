/* 8.1: Функция должна отслеживать добавление и удаление элементов внутри элемента переданного в параметре where
Как только в where добавляются или удаляются элементы, необходимо сообщать об этом при помощи вызова функции переданной в параметре fn

8.2: При вызове fn необходимо передавать ей в качестве аргумента объект с двумя свойствами:
    - type: типа события (insert или remove)
    - nodes: массив из удаленных или добавленных элементов (в зависимости от события)

8.3: Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов
    type: 'insert',
        nodes: [div]
----------------------
    type: 'remove',
        nodes: [div]       */

document.addEventListener('DOMContentLoaded', () => {
    let node = document.querySelector('body')

    observeChildNodes(node)
    console.log('node', node)

    function observeChildNodes(elem) {

        let observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // console.log('mutation', mutation);
                let obj = {
                    type: '',
                    nodes: []
                }

                if (!mutation.removedNodes.length) {
                    obj.type = 'insert'
                    obj.nodes = [...mutation.addedNodes]
                }
                if (mutation.removedNodes.length) {
                    obj.type = 'remove'
                    obj.nodes = [...mutation.removedNodes]
                }

                console.log('obj', obj)

            });
        });

        observer.observe(elem, {
            childList: true,
            subtree: true,
            characterDataOldValue: true
        })

    }

    let div = document.createElement('div')

    node.appendChild(div)
    node.firstElementChild.remove()

});