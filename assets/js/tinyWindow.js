'use strict';
//Modul que permet obtenir i mostrar posts.

export {
    makeMiniWindow
}

function makeMiniWindow(parent, info) {

    let window = document.createElement('div');
    window.classList.add('miniWindow');
    window.classList.add('container-fluid');

    let windowContainer = Object.assign(
        document.createElement('div'),
        { classList: 'row my-3'}
    );

    let closeBtn = Object.assign(
        document.createElement('div'),
        { classList : 'col-2 close-button', innerHTML: '<button type="button" class="btn-close" aria-label="Close"></button>' }
    )
    closeBtn.addEventListener('click', (e) => e.path[3].remove());

    

    let content = document.createElement('div');
    content.classList.add('col-10');


    
    content.appendChild(Object.assign(
        document.createElement('div'),
        { className: 'col mt-4', innerHTML: '<div class="spinner-border text-warning loading-spinner" role="status"><span class="visually-hidden">Loading...</span></div>' }
    ))

    windowContainer.append(content, closeBtn);
    window.appendChild(windowContainer);
    parent.appendChild(window);

    getMoreInfo(content, info)
}

async function getMoreInfo(miniWindow, wikidata){

    let info = await
    fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidata}.json`)
        .then((data) => {
            if (data.ok) {
                return data.json();
            } else {
                return new Error('Ha fallat l\'API d\'obtenir mes info dels llocs')
            }
        })
        .catch(error => console.log(error));

    info = info.entities[wikidata]

    let titol = info.labels.hasOwnProperty('ca') ? info.labels.ca.value : 
    info.labels.hasOwnProperty('es') ? info.labels.es.value : 
    info.labels.hasOwnProperty('en') ? info.labels.en.value : 'No name found.' ;

    let descripcio = info.descriptions.hasOwnProperty('ca') ? info.descriptions.ca.value : 
    info.descriptions.hasOwnProperty('es') ? info.descriptions.es.value : 
    info.descriptions.hasOwnProperty('en') ? info.descriptions.en.value : 'No type found.';

    let link = info.sitelinks.hasOwnProperty('cawiki') ? info.sitelinks.cawiki.url : 
    info.sitelinks.hasOwnProperty('eswiki') ? info.sitelinks.eswiki.url : 
    info.sitelinks.hasOwnProperty('enwiki') ? info.sitelinks.enwiki.url
    : info.sitelinks[Object.keys(info.sitelinks)[0]].url;
    let html = `
    
    <h2 class="small">${titol}</h2>
    <h6 class="small">Tipus: ${descripcio}</h6>
    <a href="${link}" class="btn btn-outline-primary mt-2" role="button" target="_blank">Enllaç a wikipedia</a>
    
    
    
    `;

    miniWindow.innerHTML = html;
}