'use strict';
//Mòdul que genera i verifica el formulari de registre.

export{
    formHtml,
    initFormChecking
}

//Variables del mòdul.
let formCorrect = true
let formValues = {}

//Esquelet del formulari:
let formHtml = `
    <form action="#" method="POST" class="col" id="register-form" novalidate>
        <div class="form-group row mb-2">
            <label for="name" class="col-4 col-form-label">Nom</label>
            <div class="col-8">
                <input id="name" name="name" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group row mb-2">
            <label for="surname" class="col-4 col-form-label">Cognoms</label>
            <div class="col-8">
                <input id="surname" name="surname" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group row mb-2">
            <label for="email" class="col-4 col-form-label">Email</label>
            <div class="col-8">
                <input id="email" name="email" type="text" class="form-control">
            </div>
        </div>
        <div class="form-group row mb-2">
            <label for="gender" class="col-4 col-form-label">Gènere</label>
            <div class="col-8">
                <select id="gender" name="gender" class="custom-select">
                    <option value="null" selected disabled hidden>Selecciona una opció</option>
                    <option value="male">Home</option>
                    <option value="female">Dona</option>
                    <option value="gender-fluid">No binari</option>
                </select>
            </div>
        </div>
        <div class="form-group row mb-2">
            <label for="birth" class="col-4 col-form-label">Data naixament</label>
            <div class="col-8">
                <input id="birth" name="birth" type="date" class="form-control">
            </div>
        </div>
        <div class="form-group row mb-2">
            <label for="age" class="col-4 col-form-label">Edat</label>
            <div class="col-8">
                <input id="age" name="age" type="text" class="form-control" disabled>
            </div>
        </div>
        <div class="form-group row mb-2">
            <div class="offset-4 col-8 mt-2">
                <button name="submit" id="submitBtn" type="submit" class="btn btn-primary" disabled>Enviar</button>
            </div>
        </div>
    </form>
`;

//Funció que habilita el dinamisme del formulari.
function initFormChecking(){

    let form = document.querySelector('#register-form');

    //JSON que guarda si els camps s'han validat correctament o no.
    let inputs = {name : false, surname : false, email : false, gender : false, birth : false}

    //A l'haver una modificació dins del formulari:
    form.addEventListener('change', e => {

        //Validar dades:
        inputs[e.target.id] = formChecker(e.target)

        //Comprovar si tots els inputs són correctes i actualitzar el booleà:
        formCorrect = true
        Object.keys(inputs).forEach(k => {
            if (!inputs[k]){
                formCorrect = false
            }
        });

        
        //Si el booleà de formulari correcte està actiu, habilitar el botó d'enviament de formulari.
        if (formCorrect) {
            document.getElementById('submitBtn').disabled = false;

        }else{
            document.getElementById('submitBtn').disabled = true;
        }
    })
    

    //Al clicar el botó submit, enviar dades al backend:
    document.getElementById('submitBtn').addEventListener('click', (e)=>{
        e.preventDefault()
        e.stopPropagation()

        sendDataToBackend(formValues);
    })
}

//Funció que verifica el camp que se li passa.
function formChecker(target){
    //Element que mostra el feedback:
    let rNode = document.createElement('div')
    let responseTxt = '';

    //Booleà que marca si el camp és correcte o no.
    let valid = true;

    //Variable que guarda el valor del camp.
    let value = target.value;

    //Segons el camp a validar, executa la peça de codi que el valida:
    switch (target.id) {
        case 'name':
            valid= /^[a-zA-Z àáèéíòóúüçñ·.]+$/.test(value)
            responseTxt=valid ? "Nom vàlid" : "Nom invàlid!";
            valid ? formValues['name'] = value : null;
            break;

        case 'surname':
            valid= /^[a-zA-Z àáèéíòóúüçñ·.]+$/.test(value)
            responseTxt=valid ? "Cognoms vàlids" : "Cognoms invàlids!";
            valid ? formValues['surname'] = value : null;
            break;

        case 'email':
            valid= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
            responseTxt=valid ? "Correu vàlid" : "Format de correu invàlid!";
            valid ? formValues['email'] = value : null;
            break;

        case 'gender':
            if (['male', 'female', 'gender-fluid'].includes(value)) {
                valid= true
                responseTxt = "Gènere vàlid";
                formValues['gender'] = value;
            }else{
                valid= false
                responseTxt="Gènere invàlid!";
            }
        break;

        case 'birth':
            let timestamp = new Date(value).getTime();
        
            if (timestamp <= new Date().getTime()){
                valid=true
                responseTxt= "Data de naixement vàlida!";
                formValues['birth'] = value;

                //Si la data de naixement és vàlida, calcular l'edat i mostrar-la al seu camp.
                let edat = new Date().getFullYear() - new Date(value).getFullYear();

                document.getElementById('age').value = `${edat} anys`;
                formValues['age'] = edat;

            }else{
                valid=false
                responseTxt= "Data de naixement invàlida!";
                document.getElementById('age').value = "";
            }
            
        break;
    }

    //Modificar HTML del camp per mostrar el feedback (Validation Bootstrap): 
    rNode.innerText=responseTxt;
    rNode.className= valid ? "valid-feedback" : "invalid-feedback";

    target.classList.remove(valid ? 'is-invalid' : 'is-valid');
    target.parentNode.parentNode.classList.remove(valid ? 'is-invalid' : 'is-valid');

    target.classList.add(valid ? 'is-valid' : 'is-invalid');
    target.parentNode.parentNode.classList.add(valid ? 'is-valid' : 'is-invalid');
    
    //Eliminar feedback anterior per evitar que es dupliqui.
    target.parentNode.childNodes.length > 3 ? target.parentNode.removeChild(target.parentNode.lastElementChild) : null;
    
    target.parentNode.appendChild(rNode)
    return valid
}

//Funció que envia les dades a una API backend.
const sendDataToBackend = (dadesForm) => {

    //Enviar dades per POST.
    fetch('https://app.fakejson.com/q', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "token": "Q1xKZBAvRjhwf4lOFMDPxw",
        "data" : {
            "personNickname": dadesForm.name,
            "personGender": dadesForm.surname,
            "personAvatar": dadesForm.email,
            "personPassword": dadesForm.gender,
            "personMaritalStatus": dadesForm.birth,
            "personLanguage": dadesForm.age
          }}),
    })

    .then((response) => response.json())
    .then((data) => {

        //Si les dades s'han enviat correctament, mostrar per pantalla missatge de confirmació.
        document.getElementById('register-form').appendChild(Object.assign(
            document.createElement('div'),
            {classList : 'alert alert-success', innerText : 'Dades enviades correctament!'}
        ))
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}