// set up of map

let myMap = L.map('myMap')

// set up point
function myFunction(x) {
    if (x.matches) { // If media query matches
        myMap = myMap.setView([-34.76790908850057, -55.122879906552505], 10);
    } else {
        myMap = myMap.setView([-34.842001738580954, -55.109542666174136], 12);
    }
}

var x = window.matchMedia("(max-width: 1024px)")
myFunction(x) // Call listener function at run time

// tile and copyright declaration

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// set up variables for double click event

let iconTempMarker = L.icon({
    iconUrl: '/recursos/marker-default.png',
    iconSize: [80, 54],
    iconAnchor: [40, 54]
})


var tempLayer = new L.FeatureGroup();
var dblclickEvent = false;
// var detect;

const buttonB = document.getElementById('edit_div');
const bottomM = document.getElementById('bottom_menu');
const imagediv = document.getElementById('div__image');
const form = document.getElementById('form')
const formAnm = document.getElementById('div_form')
const modalmenu = document.getElementById('modal_menu');
const nameMarker = document.getElementById('name_marker');
const tipoMaker = document.getElementById('Tipo_marker');
const imgMaker = document.getElementById('img_marker');
const nameEdit = document.getElementById('name_edit');
const popEdit = document.getElementById('popUp_edit');
const tipoEdit = document.getElementById('tipo_edit');
const colorEdit = document.getElementById('edit__color');
const edifForm = document.getElementById('edit_form');
const modalImage = document.getElementById('modal_menu_i');
const formString = "form"
const bottomString = "edit__menu edit__button_move"
var imgChange = false;
var isOpen = false;
var isTouched = false;
var imgUp = false;
var latLong
var markersData;
var markerRes;


// crop image and submit form
var image = document.getElementById('image');
var cropper,reader,file,canvas;

$("body").on("change", ".image", function(e){

    imagediv.classList.toggle("div__image_hide");
    modalImage.style.visibility = "visible";
    modalImage.style.opacity = "1";
    imgUp = true;

    var files = e.target.files;
    var done = function(url){
        image.src = url;
    };

    if(files && files.length > 0){
        file = files[0];

        if(URL){
            done(URL.createObjectURL(file));
        }else if (FileReader){
            reader = new FileReader();
            reader.onload = function(e){
                done(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
})

image.addEventListener('load', function(e){
    imgChange = true;
    cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 2,
        preview: '.preview'
    })
})

form.addEventListener('submit', (e) =>{
    const fomrdata = new FormData(form);
    const name = fomrdata.get('name');
    fomrdata.delete('image');
    fomrdata.set('lat', latLong.lat);
    fomrdata.set('lon', latLong.lng);
    var file;
    // convert areatext to hmtl text multiline
    var pop = fomrdata.get('popUpinfo');
    str = pop.replace(/(?:\r\n|\r|\n)/g, '<br>');
    fomrdata.delete('popUpinfo');
    // blackwords when **
    var count = countOccurences(str,"*")/2; 

    for(var i=0; i < count; i++){
        firstas = str.indexOf("*") + 1;
        nextas = str.indexOf("*", firstas + 1);
        substr = str.substring(firstas, nextas);
        str = str.replace(`*${substr}*`, `<b>${substr}</b>`);
    }
    fomrdata.set('popUpinfo', str);
    

    
    canvas = cropper.getCroppedCanvas({
        height: 300,
        width: 300
    }).toBlob(async function(blob){
        file = new File([blob], `${name}.png`, {type: blob.type});
        fomrdata.set('image', file)
        
        await fetch('/api', {
            method: 'POST',
            body: fomrdata
        }).then(setTimeout(function(){
            location.reload()
        },2000))
    })
})

function closeCrop(){
    imagediv.classList.toggle("div__image_hide");
    modalImage.style.visibility = "hidden";
    modalImage.style.opacity = "0";
}
function bottomMenu(){
    var formHide = formAnm.classList.value;
    if (formHide !== formString) {
        tempLayer.clearLayers()
        formAnm.classList.toggle("form__move")
        buttonB.classList.toggle("edit__div_hide");
        bottomM.classList.toggle("edit__button_move");   
    }else{
        buttonB.classList.toggle("edit__div_hide");
        bottomM.classList.toggle("edit__button_move");   
    }
}

// doble click event

myMap.on('dblclick', (e) =>{
    // delete any tem marker
    tempLayer.clearLayers()
    // get selected lat-long
    latLong = myMap.mouseEventToLatLng(e.originalEvent)
    // create marker and poot in a layer and then in the map
    let tempmarker = L.marker([latLong.lat, latLong.lng], { icon: iconTempMarker})
    tempLayer.addLayer(tempmarker);
    myMap.addLayer(tempLayer);
    // aadadadad
    var formHide = formAnm.classList.value;
    if(formHide === formString){
        var editHide = bottomM.classList.value;
        if (editHide === bottomString) {
            isTouched = false;
            formAnm.classList.toggle("form__move");
            bottomM.classList.toggle("edit__button_move");  
        }else{
            var buttonHide = buttonB.classList.value;
            console.log(buttonHide);
            if (buttonHide === "edit__div") {
                isTouched = false;
                buttonB.classList.toggle("edit__div_hide");
                formAnm.classList.toggle("form__move");
            }else{
                formAnm.classList.toggle("form__move");
            }
            
        }
    }
})

// declaration of layer groups for the tree tags

var Empresa = new L.FeatureGroup()
var Acopio = new L.FeatureGroup()
var Beneficio = new L.FeatureGroup()

// get all marker when page initial

function getData() {
    getEmpresa();
    getAcopio();
    getBeneficio();
}

// get markers from databes whit tag empresa

async function getEmpresa() {
    const res = await fetch('/empresa');
    const data = await res.json();


    for (var i=0;i<data.length;i++){
        
        let iconMarker = L.icon({
            iconUrl: data[i].icon_url,
            shadowUrl: '/frames/Empresa Adheridas.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
       marker.on('click', onClick);
       marker.bindPopup(`${data[i].popUpinfo}`);       
       Empresa.addLayer(marker);
    }
    return false;
}

// get markers from databes whit tag acopio

async function getAcopio() {
    const res = await fetch('/acopio');
    const data = await res.json();


    for (var i=0;i<data.length;i++){
        
        let iconMarker = L.icon({
            iconUrl: data[i].icon_url,
            shadowUrl: '/frames/Centros de Acopio.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
       marker.on('click', onClick);
       marker.bindPopup(`${data[i].popUpinfo}`);
       Acopio.addLayer(marker);
    }
    return false;
}


// get markers from databes whit tag beneficio

async function getBeneficio() {
    const res = await fetch('/beneficio');
    const data = await res.json();


    for (var i=0;i<data.length;i++){
        
        let iconMarker = L.icon({
            iconUrl: data[i].icon_url,
            shadowUrl: '/frames/Empresas Responsables.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
       marker.on('click', onClick);
       marker.bindPopup(`${data[i].popUpinfo}`);
       Beneficio.addLayer(marker);
    }
    return false;
}


// onclick in marker
function onClick(e){
    if (imgUp) {
        location.reload();
    }else{
        var formHide = formAnm.classList.value;
        if (!isTouched) {
            if (formHide !== formString) {
                tempLayer.clearLayers()
                formAnm.classList.toggle("form__move");
                buttonB.classList.toggle("edit__div_hide");
            }else{
                buttonB.classList.toggle("edit__div_hide");
            }
            isTouched = true;
            getmarkers(e);
        }else{
            if (isOpen) {
                bottomM.classList.toggle("edit__button_move");
                buttonB.classList.toggle("edit__div_hide");
                isOpen = false;
                getmarkers(e);    
            }
            else{
                getmarkers(e);    
            }
        }
    }
}



// find marker in database
function getmarkers(info){
    var tipo = info.sourceTarget._shadow.src;
    tipo = tipo.replace("https://www.map.plasticoin.com.uy/frames/", '');
    tipo = tipo.replace(".png", '');
    tipo = tipo.replace(/%20/g, " ");
    var lat = info.latlng.lat;
    var lon = info.latlng.lng;
    var data = {lat: `${lat}`, lon: `${lon}`, tipo: `${tipo}`}
    
    
    fetch('/markers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .catch(error => console.error('error:', error))
    .then(response => markerRes = response);
}

// confirm delete marker
function confirmDelete(){
    modalmenu.classList.toggle("modal__menu__anim");
    nameMarker.innerHTML = markerRes[0].name;
    tipoMaker.innerHTML = markerRes[0].Tipo;
    imgMaker.src=`${markerRes[0].icon_url}`;
}

// edit marker

function modifyMarker(){
    if (imgChange) {
        id = markerRes[0]._id;
        const formdata = new FormData(edifForm);
        formdata.delete('Tipo');
        formdata.set('id', id);
        formdata.delete('image');
        formdata.set('oldPath', markerRes[0].icon_url);
        const name = formdata.get('name');
        var file;
        // convert areatext to hmtl text multiline
        var pop = formdata.get('popUpinfo');
        str = pop.replace(/(?:\r\n|\r|\n)/g, '<br>');
        formdata.delete('popUpinfo');
        // blackwords when **
        var count = countOccurences(str,"*")/2; 

        for(var i=0; i < count; i++){
            firstas = str.indexOf("*") + 1;
            nextas = str.indexOf("*", firstas + 1);
            substr = str.substring(firstas, nextas);
            str = str.replace(`*${substr}*`, `<b>${substr}</b>`);
        }
        formdata.set('popUpinfo', str);
        
        canvas = cropper.getCroppedCanvas({
            height: 300,
            width: 300
        }).toBlob(async function(blob){
            file = new File([blob], `${name}.png`, {type: blob.type});
            formdata.set('image', file)
            
            await fetch('/modifyImage', {
                method: 'POST',
                body: formdata
            }).then(setTimeout(function(){
                location.reload()
            },2000))
        })
    }
    else{
        var id = markerRes[0]._id;
        var name = edifForm.name.value;
        // convert areatext to hmtl text multiline
        var pop = edifForm.popUpinfo.value;
        str = pop.replace(/(?:\r\n|\r|\n)/g, '<br>');
        // blackwords when **
        var count = countOccurences(str,"*")/2; 

        for(var i=0; i < count; i++){
            firstas = str.indexOf("*") + 1;
            nextas = str.indexOf("*", firstas + 1);
            substr = str.substring(firstas, nextas);
            str = str.replace(`*${substr}*`, `<b>${substr}</b>`);
        }
        var popUpinfo = str;

        var data = {id: `${id}`, name: `${name}`,popUpinfo: `${popUpinfo}`}
        fetch('/modify',{
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'    
            }
        }).then(setTimeout(function(){
            location.reload()
        },2000));
    }
}

// delete marker 
function deleteMarker(){ 

    fetch('/delete', {
        method: 'POST',
        body: JSON.stringify(markerRes),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(console.log("marker eliminado"))
    .catch(error => console.error('error:', error))
    .then(setTimeout(function(){
        location.reload()
    },2000))
}
// modify marker
function modifyButton(){
    isOpen = true;
    var formHide = formAnm.classList.value;
    if (formHide !== formString) {
        tempLayer.clearLayers()
        formAnm.classList.toggle("form__move")
        buttonB.classList.toggle("edit__div_hide");
        bottomM.classList.toggle("edit__button_move");   
    }else{
        buttonB.classList.toggle("edit__div_hide");
        bottomM.classList.toggle("edit__button_move");   
    }
    nameEdit.value = markerRes[0].name;
    var pop = markerRes[0].popUpinfo;
    pop = pop.replace(/<br>/g, "\r\n");

    // blackwords to **
    var count = countOccurences(pop,"<b>"); 
    
    for(var i=0; i < count; i++){
        substr = pop.substring(pop.indexOf("<b>") + 3, pop.indexOf("/b") - 1);
        pop = pop.replace(`<b>${substr}</b>`, `*${substr}*`);
    }
    
    popEdit.value = pop;
    tipoEdit.innerHTML = markerRes[0].Tipo;
    var color = colorEdit.classList.value;
    console.log(color);
    switch (markerRes[0].Tipo){
        case 'Empresas Responsables':
            if (color === "checkmark") {
                colorEdit.classList.toggle("checkmark__beneficio");    
            }
            if (color === "checkmark checkmark__empresa") {
                colorEdit.classList.toggle("checkmark__empresa");
                colorEdit.classList.toggle("checkmark__beneficio");    
            }
            if(color === "checkmark checkmark__acopio"){
                colorEdit.classList.toggle("checkmark__acopio");   
                colorEdit.classList.toggle("checkmark__beneficio");
            }
            break;
        case 'Empresa Adheridas':
            if (color === "checkmark") {
                colorEdit.classList.toggle("checkmark__empresa");    
            }
            if (color === "checkmark checkmark__beneficio") {
                colorEdit.classList.toggle("checkmark__beneficio");
                colorEdit.classList.toggle("checkmark__empresa");    
            }
            if (color === "checkmark checkmark__acopio") {
                colorEdit.classList.toggle("checkmark__acopio");   
                colorEdit.classList.toggle("checkmark__empresa");
            }
            break;
        case 'Centros de Acopio':
            if (color === "checkmark") {
                colorEdit.classList.toggle("checkmark__acopio");   
            }
            if (color === "checkmark checkmark__beneficio") {
                colorEdit.classList.toggle("checkmark__beneficio");
                colorEdit.classList.toggle("checkmark__acopio");   
            }
            if (color === "checkmark checkmark__empresa") {
                colorEdit.classList.toggle("checkmark__empresa");
                colorEdit.classList.toggle("checkmark__acopio"); 
            }
            break;
        default:
            console.log("algo salio mal");
    }
}
// cancel modify button
function cancelBtn(){
    if (imgUp) {
        location.reload();
    }else{
        buttonB.classList.toggle("edit__div_hide");
        bottomM.classList.toggle("edit__button_move");
        isOpen = false;
    }
}


// poot the grouplayer in the map

myMap.addLayer(Empresa);
myMap.addLayer(Acopio);
myMap.addLayer(Beneficio);


// funcion call of all markers

getData();

function countOccurences(string, word) {
    return string.split(word).length - 1;
 }
