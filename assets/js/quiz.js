'use strict';

export {
    generateForm
}

const respostesContestades = []

const generateForm = (container) => {

    //Crear formulari:
    let form = Object.assign(
        document.createElement('form'),
        { classList: 'row g-3 mb-2', id: 'quiz-form', action : '#', method : 'POST' }
    );
    form.setAttribute('novalidate', '');

    fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
        .then((data) => data.json())
        .then((data) => {
            let preguntes = data.results
            let numPregunta = 0

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

                //Crear respostes:
                let respostes = pregunta.incorrect_answers;
                respostes.push(pregunta.correct_answer)

                //Mesclar la llista d'imatges.
                respostes = respostes
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)

                //HTML respostes:
                respostes.forEach(r => {
                    let inputBox = Object.assign(
                        document.createElement('div'),
                        { classList: 'form-check' }
                    )

                    let inputHTML = Object.assign(
                        document.createElement('input'),
                        { classList: 'form-check-input', type: 'radio', name: `pregunta_${numPregunta}`, value: r }
                    )
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

            //SubmitBtn:
            let sbmBtn = Object.assign(
                document.createElement('button'),
                { id: 'quiz-submit-btn', classList: 'btn btn-outline-secondary', innerText: 'Comprovar respostes' }
            )
            sbmBtn.setAttribute('disabled', '');

            form.appendChild(sbmBtn)

            //Actualitzar atribut "selected":
            form.addEventListener('click', e => {
                if (e.target.tagName == 'INPUT') {
                    for (let res of e.target.parentNode.parentNode.getElementsByTagName('input')) {
                        res.removeAttribute('selected')
                    }
                    e.target.setAttribute('selected', '')

                    respostesContestades.indexOf(e.target.name) === -1 ? respostesContestades.push(e.target.name) : null;
                    if (respostesContestades.length == preguntes.length) {
                        if (sbmBtn.hasAttribute('disabled')) {
                            sbmBtn.classList.replace('btn-outline-secondary','btn-primary')
                            sbmBtn.removeAttribute('disabled')
                        }
                    }
                }
            })

            container.innerHTML = '';

            container.appendChild(form)
            return preguntes
        })
        .then(preguntes=>{

            //Corregir Formulari:
            document.getElementById('quiz-submit-btn').addEventListener('click',e=>{
                e.preventDefault()
                e.stopPropagation()

                let respostesEncertades = 0
                for (let resposta of document.querySelectorAll('input[selected]')){

                    let numResposta = resposta.name.split("_")[1]

                    if (resposta.value == preguntes[numResposta].correct_answer) {
                        resposta.parentNode.querySelector('label').classList.add('text-success');
                        respostesEncertades++;
                    }else{
                        resposta.classList.add('text-danger')
                        for (let resCorrecte of resposta.parentNode.parentNode.getElementsByTagName('input')){
                            if (resCorrecte.value == preguntes[numResposta].correct_answer) {
                                resCorrecte.parentNode.querySelector('label').classList.add('text-warning');
                            }
                        }
                    }
                }

                //Borrar botó de submit:
                document.getElementById('quiz-submit-btn').remove()

                //Mostrar resposta a l'usuari:
                form.appendChild(Object.assign(
                    document.createElement('p'),
                    {id: 'quiz-feedback', innerHTML : `Has encertat <strong>${respostesEncertades}</strong> respostes!!!`}
                ))


            })
        })

}