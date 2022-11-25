'use strict';
//Modul que permet obtenir i mostrar posts.

import { makeMiniWindow } from "./tinyWindow.js";

export {
    getPosts,
    printPosts
}

async function getPosts(ciutat) {

    return fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${ciutat}&apikey=5ae2e3f221c38a28845f05b6fc86ab02fb9d16e3f4498659512994da`)
        .then((data) => {
            if (data.ok) {
                return data.json();
            } else {
                return new Error('Ha fallat l\'API d\'obtenir les coordenades')
            }
        })
        .then((data) =>
            fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${data.lon}&lat=${data.lat}&src_attr=wikidata&rate=3h&limit=8&apikey=5ae2e3f221c38a28845f05b6fc86ab02fb9d16e3f4498659512994da`))
        .then((data) => {
            if (data.ok) {
                return data.json();
            } else {
                return new Error('Ha fallat l\'API d\'obtenir els llocs rellevants.')
            }
        })
        .then(async (data) => {

            const posts = await Promise.all(data.features.map(lloc => {

                return new Promise((success, error) => {
                    fetch(`https://api.opentripmap.com/0.1/en/places/xid/${lloc.properties.xid}?apikey=5ae2e3f221c38a28845f05b6fc86ab02fb9d16e3f4498659512994da`)
                        .then((data) => {
                            if (data.ok) {
                                return data.json();
                            } else {
                                return new Error('Ha fallat l\'API d\'obtenir mes info dels llocs')
                            }
                        })
                        .then((data) => {
                            let objecte = {}

                            objecte['nom'] = data.name;
                            objecte['img'] = data.hasOwnProperty('preview') ? data.preview.source : null;
                            objecte['descripcio'] = data.hasOwnProperty('wikipedia_extracts') ? data.wikipedia_extracts.text : 'Sense informació del lloc.';
                            objecte['wikiLink'] = data.hasOwnProperty('wikipedia') ? data.wikipedia : `https://www.wikidata.org/wiki/${data.wikidata}`;
                            objecte['wikiData'] = data.wikidata;

                            success(objecte)
                        })
                })

            }))
                .then(data => data)
                .catch(err => console.log(err))

            return posts

        })
        .catch((data) => {
            console.log(data)
        })
}

function printPosts(posts = [], container) {
    container.innerHTML = '';

    posts.forEach(post => {

        let cardContainer = document.createElement('div');
        cardContainer.classList.add('col-sm-3');
        cardContainer.classList.add('mb-4');
        cardContainer.classList.add('d-flex');
        cardContainer.classList.add('align-items-stretch');

        let card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';


        let img = document.createElement('img');
        img.src = post.img ? post.img : 'assets/img/noimg.jpg';
        img.className = 'card-img-top';
        img.style.height = '15em';
        img.alt = `Imatge de ${post.nom}`;
        card.appendChild(img);

        let cbody = document.createElement('div');
        cbody.className = 'card-body';

        let title = document.createElement('h5');
        title.className = 'card-title';
        title.innerText = post.nom;
        cbody.appendChild(title);

        let des = document.createElement('p');
        let desTxt = post.descripcio;
        const maxLength = 200
        des.className = 'card-text';
        des.innerText = desTxt.length > maxLength ? desTxt.substring(0, maxLength - 3) + "..." : desTxt;
        cbody.appendChild(des);

        let anchor = document.createElement('button');
        anchor.href = document.wikiLink
        anchor.classList.add('btn');
        anchor.classList.add('btn-primary');
        anchor.innerText = 'Més informació';
        anchor.addEventListener('click', () => {
            //Eliminar finestres existents:
            for (let finestra of document.getElementsByClassName('miniWindow')){
                finestra.remove();
            }
            
            
            makeMiniWindow(card, post.wikiData)})
        cbody.appendChild(anchor);

        card.appendChild(cbody);
        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
}