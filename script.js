'use strict';
//Script principal

import { tns } from "./node_modules/tiny-slider/src/tiny-slider.js";
import { getPosts, printPosts } from './assets/js/posts.js';
import { analogClock, digitalClock } from "./assets/js/clock.js";
import { formHtml, initFormChecking } from "./assets/js/register.js";
import { generateForm } from "./assets/js/quiz.js";


let action = 'index';
let mainContainer = document.getElementById('main-content');

const theme = (theme) => {document.getElementById('theme-stylesheet').href=`assets/styles/themes/${theme}.css`; localStorage.setItem('theme', theme);}

localStorage.getItem("theme") !== null ? theme(localStorage.getItem('theme')) : theme('vanilla')
console.log();


document.querySelector('#main-nav ul').addEventListener('click', (e) =>{
    action=e.target.id.split("-")[1]
    loadPage(action)
})

//Update theme
document.getElementById('colors-menu').addEventListener('click', (e) =>{
    if (e.target.id.split("-")[1] != 'menu'){
        theme(e.target.id.split("-")[1]);
    } 
    
})


function loadPage(action) {
    switch (action) {
        case 'index':
            
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
            
            //Onclick
            document.getElementById('searchCity').addEventListener('click', (event) => {event.preventDefault(); updatePosts()});
            
            function updatePosts(){
                let ciutat = document.getElementById('cityName').value
                let container = document.getElementById('posts-container');
                getPosts(ciutat).then((posts) => printPosts(posts, container));
            }
            
            updatePosts();

            break;
        
        case 'clock':

            mainContainer.innerHTML = `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto" id="analog-clock">
            
                </div>
            </div>
            `;

            document.getElementById('analog-clock').appendChild(analogClock());

            mainContainer.innerHTML += `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto">
                    <h2>Son les <span id="digital-clock">00:00<span></h2>
                </div>
            </div>
            `
            digitalClock(document.getElementById('digital-clock'), 5000);
            break;

        case 'register':

            mainContainer.innerHTML = `<div class="row mt-3 justify-content-center">${formHtml}</div>`;
            initFormChecking();
        
            break;

        case 'playground':
            mainContainer.innerHTML = `
            <div class="row mt-3 justify-content-center">
                <div class="col-auto" id="quiz-form-container">
                    <div class="spinner-border text-info" role="status">
                    </div>
                    <p>Carregant Quiz...</p>
                </div>
            </div>
            `;

            generateForm(document.getElementById('quiz-form-container'))

            break;
    }
    
}

loadPage(action);