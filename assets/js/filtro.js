
const filterMenu = document.getElementById("menu_filter")
const button = document.getElementById("button")
const body = document.getElementById("body")
const lupa = document.getElementById("lupa")
const arrow = document.getElementById("arrow");

function menuToggle(){
    filterMenu.classList.toggle("filter__menu_move");
    button.classList.toggle("menu__button_move");
    lupa.classList.toggle("lupa__move");
    arrow.classList.toggle("arrow__move");
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


