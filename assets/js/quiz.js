'use strict';
//Mòdul que permet generar un Quiz

export {
    generateForm
}

const respostesContestades = []

//Funció que obté les dades de la API de quiz i monta el formulari HTML.
const generateForm = (container) => {

    //Crear etiqueta formulari:
    let form = Object.assign(
        document.createElement('form'),
        { classList: 'row g-3 mb-2', id: 'quiz-form', action: '#', method: 'POST' }
    );
    form.setAttribute('novalidate', '');

    //Obtenir les preguntes:
    fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
        .then((data) => data.json())
        .then((data) => {
            let preguntes = data.results
            let numPregunta = 0

            //Per cada pregunta rebuda:
            preguntes.forEach(pregunta => {

                //Crear contenidor.
                let preguntaCont = Object.assign(
                    document.createElement('div'),
                    { classList: 'col-12' }
                )

                //Crear pregunta:
                let label = Object.assign(
                    document.createElement('label'),
                    { classList: "form-label", innerText: pregunta.question }
                )
                preguntaCont.appendChild(label)

                //Crear llista de respostes:
                let respostes = pregunta.incorrect_answers;
                respostes.push(pregunta.correct_answer)

                //Mesclar la llista de respostes.
                respostes = respostes
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)

                //Crear HTML de respostes:
                respostes.forEach(r => {
                    //Container del Radio
                    let inputBox = Object.assign(
                        document.createElement('div'),
                        { classList: 'form-check' }
                    )

                    //Radio
                    let inputHTML = Object.assign(
                        document.createElement('input'),
                        { classList: 'form-check-input', type: 'radio', name: `pregunta_${numPregunta}`, value: r }
                    )

                    //Titol de la resposta.
                    let inputLabel = Object.assign(
                        document.createElement('label'),
                        { classList: 'form-check-label', innerText: r }
                    )
                    inputBox.appendChild(inputHTML)
                    inputBox.appendChild(inputLabel)
                    preguntaCont.appendChild(inputBox)
                });

                form.appendChild(preguntaCont);
                numPregunta++;
            });

            //Crear botó d'enviar formulari (deshabilitat):
            let sbmBtn = Object.assign(
                document.createElement('button'),
                { id: 'quiz-submit-btn', classList: 'btn btn-outline-secondary', innerText: 'Comprovar respostes' }
            )
            sbmBtn.setAttribute('disabled', '');

            form.appendChild(sbmBtn)

            //Actualitzar atribut "selected" dels radios quan se seleccionin:
            form.addEventListener('click', e => {
                if (e.target.tagName == 'INPUT') {
                    for (let res of e.target.parentNode.parentNode.getElementsByTagName('input')) {
                        res.removeAttribute('selected')
                    }
                    e.target.setAttribute('selected', '')

                    //Afegir la resposta seleccionada a la llista de respostes i comprovar si es pot habilitar el botó de submit.
                    respostesContestades.indexOf(e.target.name) === -1 ? respostesContestades.push(e.target.name) : null;
                    if (respostesContestades.length == preguntes.length) {
                        if (sbmBtn.hasAttribute('disabled')) {
                            sbmBtn.classList.replace('btn-outline-secondary', 'btn-primary')
                            sbmBtn.removeAttribute('disabled')
                        }
                    }
                }
            })


            //Append del formulari al HTML de la secció:
            container.innerHTML = '';
            container.appendChild(form)
            return preguntes
        })
        .then(preguntes => {

            //Habilitar esdeveniment per corregir formulari al clicar el botó de submit:
            document.getElementById('quiz-submit-btn').addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()

                let respostesEncertades = 0

                //Obtenir totes les respostes que l'usuari ha seleccionat:
                for (let resposta of document.querySelectorAll('input[selected]')) {

                    //Obtenir el número de la pregunta:
                    let numResposta = resposta.name.split("_")[1]

                    //Comprovar si la resposta és vàlida o no i mostrar a l'usuari feedback amb colors.
                    if (resposta.value == preguntes[numResposta].correct_answer) {
                        resposta.parentNode.querySelector('label').classList.add('text-success');
                        respostesEncertades++;
                    } else {
                        resposta.classList.add('text-danger')
                        for (let resCorrecte of resposta.parentNode.parentNode.getElementsByTagName('input')) {
                            if (resCorrecte.value == preguntes[numResposta].correct_answer) {
                                resCorrecte.parentNode.querySelector('label').classList.add('text-warning');
                            }
                        }
                    }
                }

                //Borrar botó de submit:
                document.getElementById('quiz-submit-btn').remove()

                //Mostrar feedback respostes correctes a l'usuari:
                form.appendChild(Object.assign(
                    document.createElement('p'),
                    { id: 'quiz-feedback', innerHTML: `Has encertat <strong>${respostesEncertades}</strong> respostes!!!` }
                ))
            })
        })
}