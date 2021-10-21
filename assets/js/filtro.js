
// variables declarations

// menu variables
const filterMenu = document.getElementById("menu_filter")
const button = document.getElementById("button")
const body = document.getElementById("body")
const lupa = document.getElementById("lupa")
const arrow = document.getElementById("arrow");
const desMenu = document.getElementById("desmenu");
// search variables
const searchBar = document.getElementById("inputSearch");
const boxSearch = document.getElementById("search_container");
const UlSearch = document.getElementById("box_search");
const searchCont = document.getElementById("search_container");


// left menu functions 
function menuToggle(){
    filterMenu.classList.toggle("filter__menu_move");
    button.classList.toggle("menu__button_move");
    lupa.classList.toggle("lupa__move");
    arrow.classList.toggle("arrow__move");
    boxSearch.style.display = "none"
    if (searchBar.value !== "") {
        searchBar.value = "";
        searchBar.style.borderRadius = "5px";
    }
    if (searchBar.value === "") {
        searchCont.style.display = "none";
    }
}

function hiddeShowDesMenu(){
    if (desMenu.className == 'menu__des') {
        desMenu.className = 'menu__des hidden';
    }else if (desMenu.className == 'menu__des hidden'){
        desMenu.className = 'menu__des';
    }
}

const empresasChBtn = document.getElementById('empresas')
const beneficoChBtn = document.getElementById('beneficio')
const acopioChBtn = document.getElementById('acopio')



empresasChBtn.addEventListener('change', (e) =>{
    if(empresasChBtn.checked){
       getEmpresa();
    }else{
     Empresa.clearLayers();
    }

})

acopioChBtn.addEventListener('change', (e) =>{
    if(acopioChBtn.checked){
       getAcopio();
    }else{
     Acopio.clearLayers();
    }

})

beneficoChBtn.addEventListener('change', (e) =>{
    if(beneficoChBtn.checked){
       getBeneficio();
    }else{
     Beneficio.clearLayers();
    }

})

// left menu search functions
searchBar.addEventListener("keyup", buscador);

function buscador(){
    filter = searchBar.value.toUpperCase();
    li = UlSearch.getElementsByTagName("li");
    // look elements to filter in li
    for(i = 0; i < li.length; i++){

        a = li[i].getElementsByTagName("a")[0];
        textValue = a.textContent || a.innerText;

        if (textValue.toUpperCase().indexOf(filter) > -1) {
            
            li[i].style.display = "";
            searchCont.style.display = "block";
            searchBar.style.borderRadius = "5px 5px 0 0";
            if (searchBar.value === "") {
                searchBar.style.borderRadius = "5px";
                searchCont.style.display = "none";
            }
        }else{

            li[i].style.display = "none";
        }
    }
}


