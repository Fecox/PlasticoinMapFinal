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

const form = document.getElementById('form')
const formAnm = document.getElementById('div_form')
const formString = "form"
var latLong

// crop image and submit form
const croppImg = document.getElementById('preview')
var image = document.getElementById('image');
var cropper,reader,file,canvas;

$("body").on("change", ".image", function(e){
    
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
    
    
    canvas = cropper.getCroppedCanvas({
        height: 300,
        width: 300
    }).toBlob(function(blob){
        file = new File([blob], `${name}.png`, {type: blob.type});
        fomrdata.set('image', file)
        fetch('/api', {
            method: 'POST',
            body: fomrdata
        }).then(setTimeout(function(){
    			location.reload();
		},2000);)
    })
})

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
        formAnm.classList.toggle("form__move")
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
            shadowUrl: '/frames/empresa.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
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
            shadowUrl: '/frames/acopio.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
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
            shadowUrl: '/frames/beneficio.png',

            shadowSize: [46, 46],
            shadowAnchor: [23, 23],
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    
       var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
       Beneficio.addLayer(marker);
    }
    return false;
}

// poot the grouplayer in the map

myMap.addLayer(Empresa);
myMap.addLayer(Acopio);
myMap.addLayer(Beneficio);


// funcion call of all markers

getData();
