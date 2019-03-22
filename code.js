var slideIndex = 1;
var slides = document.getElementsByClassName("mySlides");
var dots = document.getElementsByClassName("dot");
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
function picHeight() {
    var w = window.outerWidth;
    var h = window.outerHeight;
    var images = document.getElementsByClassName('pic');
    var activePic = slides[slideIndex-1];
    var width = activePic.offsetHeight;
    console.log(width);
}


function sectionListeners(event){
  let list = document.getElementById('dropdown').getElementsByTagName('LI');
  let len = list.length;
  let i = 0;
  while (i < len){
    list[i].addEventListener("click", saveParam)
    i++;
  }
}
sectionListeners();

function saveParam(event){
  if(typeof(Storage) !== "undefined") {
    sessionStorage.param = event.target.textContent;
  }
}
let clearStorage = document.getElementById("sale").addEventListener("click", function(){
    sessionStorage.clear();
  })
