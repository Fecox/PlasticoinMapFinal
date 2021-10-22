    // create the map atributtion 
    let myMap = L.map('myMap', {
        center: [-34.842001738580954, -55.109542666174136],
        zoom: 12
    })

    
    // set the tile from library and corresponding copyright

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // variables
    const listCont = document.getElementById("box_search");


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
        
        var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker}).on('click', clickzoom)
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
        
        var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker}).on('click', clickzoom)
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
        
        var marker = L.marker([data[i].lat, data[i].lon,], { icon: iconMarker}).on('click', clickzoom)
        marker.bindPopup(`${data[i].popUpinfo}`)
        Beneficio.addLayer(marker);
        }
        return false;
    }

    // poot the grouplayer in the map

    myMap.addLayer(Empresa);
    myMap.addLayer(Acopio);
    myMap.addLayer(Beneficio);


    // funcion call

    getData();
    createList()

    // on marker click zoom function
    function clickzoom(e){
        myMap.setView(e.target.getLatLng(),15);
    }


    // search marker whit browser
    async function markerFuncion(id){
        const res = await fetch('/mapDB');
        const data = await res.json();
        for(i = 0; i < data.length; i++){
            var markerID = data[i].name;
            var position = {lat: data[i].lat, lng: data[i].lon}
            if (markerID == id) {
                myMap.setView(position, 15)
                menuToggle();
                if (data[i].Tipo == "Empresa Adheridas") {
                    for(o = 0; o < data.length; o++){
                        markers = Empresa.getLayers();
                        var name = markers[o]._icon.src;
                        name = name.replace("https://www.map.plasticoin.com.uy/img/", '');
                        name = name.replace(".png", '');
                        name = name.replace(/%20/g, " ");
                        if (name == data[i].name) {
                            markers[o].openPopup();
                        }
                    }
                }
                if (data[i].Tipo == "Centros de Acopio") {
                    for(o = 0; o < data.length; o++){
                        markers = Acopio.getLayers();
                        var name = markers[o]._icon.src;
                        name = name.replace("https://www.map.plasticoin.com.uy/img/", '');
                        name = name.replace(".png", '');
                        name = name.replace(/%20/g, " ");
                        if (name == data[i].name) {
                            markers[o].openPopup();
                        }
                    }
                }
                if (data[i].Tipo == "Empresas Responsables") {
                    for(o = 0; o < data.length; o++){
                        markers = Beneficio.getLayers();
                        var name = markers[o]._icon.src;
                        name = name.replace("https://www.map.plasticoin.com.uy/img/", '');
                        name = name.replace(".png", '');
                        name = name.replace(/%20/g, " ");
                        if (name == data[i].name) {
                            markers[o].openPopup();
                        }
                    }
                }
            }
        }
    }
    
    


    // create li and a
    async function createList(){
        const res = await fetch('/mapDB');
        const data = await res.json();

        for(i = 0; i < data.length; i++){
            var a = document.createElement("a");
            var text = document.createTextNode(`${data[i].name}`);
            a.id = `${data[i].name}`;
            a.href = "#";
            a.onclick = function(){
                markerFuncion($(this)[0].id);
            }
            a.appendChild(text);
            var li = document.createElement("li");
            li.appendChild(a);
            listCont.appendChild(li);
        }
    }

    /*
    a.onclick = function (){
        console.log("fuicnikon");
    }
    


    /*
    $("a").click(function(){
        markerFuncion($(this)[0].id);
        console.log("funciona y el id es:" + $(this)[0].id);
    })
    */
