/*eslint-disable */
import {auth, vkAPI} from './vk.js'

let myMap
let clusterer

ymaps.ready(async () => {
    const cache = new Map();

    await auth()

    const [me] = await vkAPI('users.get', {fields: 'city, country'})
    const friends = await vkAPI('friends.get', {fields: 'city, country'})

    friends.items.push(me)

    myMap = new ymaps.Map('map', {
        center: [58.01, 56.23],
        zoom: 10,
        controls: ['smallMapDefaultSet'],
    }, {searchControlProvider: 'yandex#search'});
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel'
    })

    myMap.geoObjects.add(clusterer)

    function geocode(address) {
        if (cache.has(address)) {
            return cache.get(address)
        }

        const geocodePromise = ymaps.geocode(address)
            .then(result => {
                const points = result.geoObjects.toArray();

                if (points.length) {
                    return points[0].geometry.getCoordinates();
                }
            })
        cache.set(address, geocodePromise)

        return cache.get(address)
    }


    console.log('friends.items', friends.items)

    friends.items
        .filter(friend => friend.first_name !== 'DELETED' && friend.country && friend.country.title)
        .map(friend => {
            let parts = friend.country.title
            if (friend.city) {
                parts += ' ' + friend.city.title
            }
            return parts
        })
        .map(async address => {
            const coord = await geocode(address)
            const placemark = new ymaps.Placemark(coord, {}, {preset: 'islands#blueHomeCircleIcon'})
            clusterer.add(placemark)
            // myMap.setBounds(myMap.geoObjects.getBounds());
            myMap.setBounds(clusterer.getBounds());
        })


})





