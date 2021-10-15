// set up of map


let myMap = L.map('myMap').setView([-34.9112377243155, -54.96569965207551], 15)

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
const formString = "form"
const bottomString = "edit__menu edit__button_move"
var imgChange = false;
var latLong
var isOpen = false
var markersData;
var markerRes;


// crop image and submit form
var image = document.getElementById('image');
var cropper,reader,file,canvas;

$("body").on("change", ".image", function(e){

    imagediv.classList.toggle("div__image_hide");

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
    const fomrdata = new FormData(form)
    const name = fomrdata.get('name')
    fomrdata.delete('image')
    fomrdata.set('lat', latLong.lat)
    fomrdata.set('lon', latLong.lng)
    var file
    // convert areatext to hmtl text multiline
    var pop = fomrdata.get('popUpinfo')
    pop = pop.replace(/(?:\r\n|\r|\n)/g, '<br>');
    fomrdata.delete('popUpinfo')
    fomrdata.set('popUpinfo', pop)
    console.log(fomrdata.get('image'));
    
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
            formAnm.classList.toggle("form__move");
            buttonB.classList.toggle("edit__div_hide");
            bottomM.classList.toggle("edit__button_move");  
        }else{
            formAnm.classList.toggle("form__move");
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
    var formHide = formAnm.classList.value;
    if (!isOpen) {
        if (formHide !== formString) {
            tempLayer.clearLayers()
            formAnm.classList.toggle("form__move")
            buttonB.classList.toggle("edit__div_hide");    
        }else{
            buttonB.classList.toggle("edit__div_hide");
        }
        isOpen = true;
        getmarkers(e);
    }else{
        getmarkers(e);
    }
}

// find marker in database
function getmarkers(info){
    var tipo = info.sourceTarget._shadow.src;
    tipo = tipo.replace("http://localhost:3000/frames/", '');
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

async function modifyMarker(){
    const formdata = new FormData(edifForm);
    if (imgChange) {
        console.log("se subio imagen");    
    }
    else{
        formdata.set('id', markerRes[0]._id);
        formdata.delete('Tipo');
        fetch('/modify',{
            method: 'POST',
            body: formdata
        }).then(setTimeout(function(){
            location.reload()
        },2000))
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
    popEdit.value = pop;
    tipoEdit.innerHTML = markerRes[0].Tipo;
    switch (markerRes[0].Tipo){
        case 'Empresas Responsables':
            colorEdit.classList.toggle("checkmark__beneficio");
            break;
        case 'Empresa Adheridas':
            colorEdit.classList.toggle("checkmark__empresa");
            break;
        case 'Centros de Acopio':
            colorEdit.classList.toggle("checkmark__acopio");
            break;
        default:
            console.log("algo salio mal");
    }
}

// poot the grouplayer in the map

myMap.addLayer(Empresa);
myMap.addLayer(Acopio);
myMap.addLayer(Beneficio);


// funcion call of all markers

getData();
