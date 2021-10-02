    // create the map atributtion 
    let myMap = L.map('myMap', {
        center: [-34.9112377243155, -54.96569965207551],
        zoom: 15,
    })

    // set the tile from library and corresponding copyright

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

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
                shadowUrl: '/frames/acopio.png',

                shadowSize: [46, 46],
                shadowAnchor: [23, 23],
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        
        var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
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
            console.log(`${data[3].popUpinfo}`)
            let iconMarker = L.icon({
                iconUrl: data[i].icon_url,
                shadowUrl: '/frames/beneficio.png',

                shadowSize: [46, 46],
                shadowAnchor: [23, 23],
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })
        
        var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker})
        marker.bindPopup(`${data[i].popUpinfo}`);
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
