'use strict';
//Script principal

//Imports:
import { tns } from "./node_modules/tiny-slider/src/tiny-slider.js";
import { getPosts, printPosts } from './assets/js/posts.js';
import { analogClock, digitalClock } from "./assets/js/clock.js";
import { formHtml, initFormChecking } from "./assets/js/register.js";
import { generateForm } from "./assets/js/quiz.js";

//Variables comunes:
let action = 'index';
let mainContainer = document.getElementById('main-content');

//Funció per cambiar el tema:
const theme = (theme) => { document.getElementById('theme-stylesheet').href = `assets/styles/themes/${theme}.css`; localStorage.setItem('theme', theme); }
//Cambiar el tema pel guardat al localStorage:
localStorage.getItem("theme") !== null ? theme(localStorage.getItem('theme')) : theme('vanilla')

//Action pels botons que canvien el tema:
document.getElementById('colors-menu').addEventListener('click', (e) => {
    if (e.target.id.split("-")[1] != 'menu') {
        theme(e.target.id.split("-")[1]);
    }
})

//Action per cada vegada que cliquen un botó del header.
document.querySelector('#main-nav ul').addEventListener('click', (e) => {
    action = e.target.id.split("-")[1]
    loadPage(action)
})


//Funció que carrega el contingut dinàmic:
function loadPage(action) {
    switch (action) {

        //Codi per la pàgina principal (la del slider i posts):
        case 'index':
            //Esquelet del la secció.
            mainContainer.innerHTML = `
            <div class="row mt-3">
                <div class="col">
                    <div class="main-slider">
                        <div><img src="assets/img/banner-1.jpeg" alt=""></div>
                        <div><img src="assets/img/banner-2.jpg" alt=""></div>
                    </div>
                </div>
            </div>
    
            <div class="row mb-3">
                <div class="col-12">
                    <h4>Introdueix una ciutat: </h4>
                    <form><input type="text" name="cityName" id="cityName" value="Manresa">
                    <input type="submit" class="btn btn-primary" id="searchCity"></input></form>
                </div>
            </div>
            <div class="row" id="posts-container">
            
            </div>
            `

            //Slider
            tns({
                container: '.main-slider',
                mode: 'gallery',
                slideBy: 'page',
                edgePadding: 50,
                controls: false,
                navPosition: 'bottom',
                autoplay: true,
                autoplayHoverPause: true,
                autoplayButtonOutput: false
            });

            //Formulari de cerca de ciutats:
            document.getElementById('searchCity').addEventListener('click', (event) => { event.preventDefault(); updatePosts() });

            //Funció per carregar els posts:
            function updatePosts() {
                let ciutat = document.getElementById('cityName').value
                let container = document.getElementById('posts-container');
                getPosts(ciutat).then((posts) => printPosts(posts, container));
            }

            updatePosts();
            break;

        //Codi per la pàgina del rellotge:
        case 'clock':
            //Esquelet de la secció.
            mainContainer.innerHTML = `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto" id="analog-clock">
            
                </div>
            </div>
            `;

            //Carregar el rellotge analògic:
            document.getElementById('analog-clock').appendChild(analogClock());

            //Carregar el rellotge digital:
            mainContainer.innerHTML += `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto">
                    <h2>Son les <span id="digital-clock">00:00<span></h2>
                </div>
            </div>
            `
            digitalClock(document.getElementById('digital-clock'), 5000);

            break;


        //Codi per la pàgina del formulari de registre:
        case 'register':

            //Muntar l'esquelet de la secció:
            mainContainer.innerHTML = `<div class="row mt-3 justify-content-center">${formHtml}</div>`;

            //Inicialitzar els esdeveniments del formulari.
            initFormChecking();

            break;


        //Codi per la pàgina del Quiz:
        case 'playground':
            //Esquelet de la secció:
            mainContainer.innerHTML = `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto" id="quiz-form-container">
                    <div class="spinner-border text-info" role="status">
                    </div>
                    <p>Carregant Quiz...</p>
                </div>
            </div>
            `;

            //Inicialitzar el formulari (Muntar les preguntes i esdeveniments).
            generateForm(document.getElementById('quiz-form-container'))

            break;
    }
}

//A l'obrir la pàgina, carregar la secció per defecte.
loadPage(action);