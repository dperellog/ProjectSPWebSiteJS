'use strict';
//Modul que permet obtenir i mostrar posts.

import { makeMiniWindow } from "./tinyWindow.js";

export {
    getPosts,
    printPosts
}

//Funció que obté els posts de la API.
async function getPosts(ciutat) {
    //Obtindre les dades de la API OpenTripMap i retornar un objecte personalitzat.

    //Obtindre unes coordenades a partir del nom de la ciutat.
    return fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${ciutat}&apikey=5ae2e3f221c38a28845f05b6fc86ab02fb9d16e3f4498659512994da`)
        .then((data) => {
            if (data.ok) {
                return data.json();
            } else {
                return new Error('Ha fallat l\'API d\'obtenir les coordenades')
            }
        })
        .then((data) =>

            //Obtindre llocs destacats a un radi de 8Km a partir de les coordenades.
            fetch(`https://api.opentripmap.com/0.1/en/places/radius?radius=8000&lon=${data.lon}&lat=${data.lat}&src_attr=wikidata&rate=3h&limit=8&apikey=5ae2e3f221c38a28845f05b6fc86ab02fb9d16e3f4498659512994da`))
        .then((data) => {
            if (data.ok) {
                return data.json();
            } else {
                return new Error('Ha fallat l\'API d\'obtenir els llocs rellevants.')
            }
        })
        .then(async (data) => {

            //Obtenir més informació a partir dels posts rebuts i muntar l'objecte personalitzat.
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

                        //Muntar l'objecte personalitzat.
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
                //Retornar l'objecte:
                .then(data => data)
                .catch(err => console.log(err))

            return posts

        })
        .catch((data) => {
            console.log(data)
        })
}

//Funció que genera una targeta Bootstrap amb les dades d'una llista de posts.
function printPosts(posts = [], container) {
    container.innerHTML = '';

    posts.forEach(post => {

        //Contenidor de la targeta:
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('col-sm-3');
        cardContainer.classList.add('mb-4');
        cardContainer.classList.add('d-flex');
        cardContainer.classList.add('align-items-stretch');

        let card = document.createElement('div');
        card.className = 'card';
        card.style.position = 'relative';

        //Imatge de la targeta:
        let img = document.createElement('img');
        img.src = post.img ? post.img : 'assets/img/noimg.jpg';
        img.className = 'card-img-top';
        img.style.height = '15em';
        img.alt = `Imatge de ${post.nom}`;
        card.appendChild(img);

        //Container del contingut.
        let cbody = document.createElement('div');
        cbody.className = 'card-body';

        //Títol de la targeta.
        let title = document.createElement('h5');
        title.className = 'card-title';
        title.innerText = post.nom;
        cbody.appendChild(title);

        //Descripció de la targeta:
        let des = document.createElement('p');
        let desTxt = post.descripcio;
        const maxLength = 200
        des.className = 'card-text';
        des.innerText = desTxt.length > maxLength ? desTxt.substring(0, maxLength - 3) + "..." : desTxt;
        cbody.appendChild(des);

        //Botó d'enllaç a Wikipedia.
        let anchor = document.createElement('button');
        anchor.href = document.wikiLink
        anchor.classList.add('btn');
        anchor.classList.add('btn-primary');
        anchor.innerText = 'Més informació';

        //Al clicar sobre l'enllaç a altres targetes, eliminar les que estiguin obertes.
        //Així només hi ha sempre una finestra auxiliar oberta.
        anchor.addEventListener('click', () => {
            //Eliminar finestres existents:
            for (let finestra of document.getElementsByClassName('miniWindow')) {
                finestra.remove();
            }

            //Cridar a la funció que genera una finestra auxiliar.
            makeMiniWindow(card, post.wikiData)
        })

        //Appends.
        cbody.appendChild(anchor);

        card.appendChild(cbody);
        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
}