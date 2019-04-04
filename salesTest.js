let config = {
  apiKey: "AIzaSyCPCE_xtAMGPPMjw0E6AZA2DwC0UlgBpJ0",
  authDomain: "spencer-s-site.firebaseapp.com",
  databaseURL: "https://spencer-s-site.firebaseio.com",
  projectId: "spencer-s-site",
  storageBucket: "spencer-s-site.appspot.com",
  messagingSenderId: "614107400154"
};
firebase.initializeApp(config);

firebase
  .database()
  .ref("items")
  .once("value")
  .then(function(data) {
    let items = data.val();
    // console.log(items)
    function createSpots(obj) {
      let picArea = document.getElementById("pics");
      // picArea.innerHTML = "";
      for (let item in obj) {
        let area = document.createElement("div");
        area.setAttribute("class", "area");
        area.className += " " + obj[item].type;
        let p = document.createElement("p");
        p.innerHTML = "Click to expand";
        p.setAttribute("class", "p");
        area.appendChild(p);
        let focusPic = document.createElement("div");
        focusPic.setAttribute("class", "focusPicArea");
        area.appendChild(focusPic);
        let lightboxContent;
        let itemPicArr = obj[item].pics;
        let lightbox = document.createElement("div");

        for (let i = 0; i < itemPicArr.length; i++) {
          if (i == 0) {
            let pic = document.createElement("img");
            // pic.setAttribute("src", "pictures/" + obj[item].pics[i]);
            pic.setAttribute("id", itemPicArr[i] + "BIG");
            pic.setAttribute("alt", "stuff");
            pic.setAttribute("class", "focusPic");
            pic.picNum = 0;
            focusPic.appendChild(pic);
            lightbox.setAttribute("class", "modal");
            let close = document.createElement("span");
            close.setAttribute("class", "close cursor");
            close.addEventListener("click", closeModal);
            close.innerHTML = "&times;";
            lightbox.appendChild(close);
            lightboxContent = document.createElement("div");
            // lightboxContent.setAttribute("class", "modal-content");
            lightboxContent.className = "modal-content smooth";
            lightbox.appendChild(lightboxContent);
            area.appendChild(lightbox);
          }
          let pic = document.createElement("img");
          // pic.setAttribute("src", "pictures/" + obj[item].pics[i]);
          pic.setAttribute("id", itemPicArr[i]);
          pic.setAttribute("alt", "stuff");
          pic.setAttribute("height", "40");
          pic.setAttribute("class", "pic");
          pic.picNum = i;
          area.appendChild(pic);
        }

        for (let i = 0; i < itemPicArr.length; i++) {
          let slidePic = document.createElement("img");
          slidePic.setAttribute("class", "mySlides");
          slidePic.setAttribute("id", itemPicArr[i] + i);
          lightboxContent.appendChild(slidePic);
        }
        let prev = document.createElement("a");
        // prev.addEventListener("click", plusSlides);
        prev.setAttribute("class", "prev");
        prev.value = -1;
        prev.innerHTML = "&#10094;";
        lightbox.appendChild(prev);
        let next = document.createElement("a");
        // next.addEventListener("click", plusSlides);
        next.setAttribute("class", "next");
        next.innerHTML = "&#10095;";
        next.value = 1;
        lightbox.appendChild(next);
        let thumbPlace;
        for (let i = 0; i < obj[item].pics.length; i++) {
          if (i === 0) {
            thumbPlace = document.createElement("div");
            thumbPlace.setAttribute("id", "modalThumbPics");
          }
          let thumbNail = document.createElement("img");
          thumbNail.setAttribute("class", "demo");
          // thumbNail.setAttribute("src", "pictures/" + obj[item].pics[i]);
          thumbNail.setAttribute("id", itemPicArr[i] + i + i);
          thumbNail.picNum = i;
          thumbNail.addEventListener("click", setSlideIndex);
          thumbNail.setAttribute("alt", "stuff");
          thumbPlace.appendChild(thumbNail);
        }
        lightbox.appendChild(thumbPlace);

        let Brand = document.createElement("p");
        let BrandName = document.createTextNode("Brand: " + obj[item].brand);
        Brand.appendChild(BrandName);
        area.appendChild(Brand);
        let model = document.createElement("p");
        let modelNumber = document.createTextNode(
          "Model Number: " + obj[item].model
        );
        model.appendChild(modelNumber);
        area.appendChild(model);
        let serial = document.createElement("p");
        let ser = document.createTextNode("Serial Number: " + obj[item].ser);
        serial.appendChild(ser);
        area.appendChild(serial);
        let description = document.createElement("p");
        let wordsArr = obj[item].description;
        let wordsVar = "";
        for (let i = 0; i < wordsArr.length; i++) {
          // need to change this. this is not necessary anymore
          wordsVar += wordsArr[i];
        }
        let words = document.createTextNode(wordsVar);
        description.appendChild(words);
        area.appendChild(description);
        // console.log(obj[item])

        let priceData = obj[item].price;
        if (priceData) {
          let priceNode = document.createElement("p");
          let price = document.createTextNode("Price: $" + obj[item].price);
          priceNode.appendChild(price);
          area.appendChild(priceNode);
        }

        let shipData = obj[item].shipping;
        if (shipData) {
          let shipNode = document.createElement("p");
          let shipping = document.createTextNode(
            "Shipping: $" + obj[item].shipping
          );
          shipNode.appendChild(shipping);
          area.appendChild(shipNode);
        }

        let buyButton = obj[item].buyButton;
        if (buyButton) {
          let button = document.createElement("div");
          button.innerHTML = buyButton;
          area.appendChild(button);
        }
        picArea.appendChild(area);

        let storage = firebase.storage();
        for (let j = 0; j < itemPicArr.length; j++) {
          let refPath = storage.ref("Store/" + itemPicArr[j]);
          (function() {
            let picDownloadSpot = document.getElementById(itemPicArr[j]);
            let modalDownloadSpot = document.getElementById(itemPicArr[j] + j);
            let thumbNailDownloadSpot = document.getElementById(
              itemPicArr[j] + j + j
            );
            refPath
              .getDownloadURL()
              .then(function(url) {
                picDownloadSpot.setAttribute("src", url);
                modalDownloadSpot.setAttribute("src", url);
                thumbNailDownloadSpot.setAttribute("src", url);
              })
              .catch(function(error) {
                console.log(error);
              });
          })();
        }
        let refPath = storage.ref("Store/" + itemPicArr[0]);
        (function() {
          let largePic = document.getElementById(itemPicArr[0] + "BIG");
          refPath
            .getDownloadURL()
            .then(function(url) {
              largePic.setAttribute("src", url);
            })
            .catch(function(error) {
              console.log(error);
            });
        })();
      }
    }
    createSpots(items);
    if (sessionStorage.param && sessionStorage.param != "All Sales") {
      let param = sessionStorage.param;
      console.log(param);
      let picAreas = document.getElementsByClassName("area");
      let picAreasArray = new Array(...picAreas);
      if (param.includes(" ")) {
        param = param.slice(0, param.indexOf(" "));
      }
      let showingPicAreas = document.getElementsByClassName(param);
      console.log(showingPicAreas);
      picAreasArray.forEach(function(element) {
        // element.style.display = "none"
        console.log(typeof element.className);
        if (element.className.includes(param)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
      changePicListener();
      focusPicListener();
    } else {
      changePicListener();
      focusPicListener();
    }
  });

function sectionListeners() {
  let list = document.getElementById("sectionPages").getElementsByTagName("LI");
  let len = list.length;
  let i = 0;
  while (i < len) {
    list[i].addEventListener("click", sectionParameters);
    i++;
  }
}
sectionListeners();

function sectionParameters(event) {
  let param = event.target.textContent;
  console.log(param);
  let obj = data.val();
  for (item in obj) {
    if (obj[item].type != param) {
      delete obj[item];
    }
  }
  // createSpots(obj);
  changePicListener();
  focusPicListener();
}

function changePic(event) {
  let picture = event.target.parentNode.childNodes[1];
  let areaWidth = picture.clientWidth;
  let picWidth = picture.childNodes[0].clientWidth;
  let width = Math.round((picWidth / areaWidth) * 100);
  let margin = (100 - width) / 2;
  let id = setInterval(shrink, 5);
  function shrink() {
    if (width < 0) {
      newPic();
      clearInterval(id);
    } else {
      width -= 6;
      margin += 3;
      picture.style.width = width + "%";
      picture.style.marginLeft = margin + "%";
    }
  }
  function newPic() {
    picture.removeChild(picture.childNodes[0]);
    let newPic = document.createElement("img");
    newPic.setAttribute("src", event.target.src);
    newPic.setAttribute("class", "focusPic");
    newPic.picNum = event.target.picNum;
    newPic.addEventListener("click", openModal);
    newPic.addEventListener("click", currentSlide);
    picture.appendChild(newPic);
    let id = setInterval(expand, 10);
    function expand() {
      const interval = 6;
      if (width + interval >= 100) {
        picture.style.width = "100%";
        picture.style.marginLeft = "0%";
        clearInterval(id);
      } else {
        width += interval;
        margin -= 3;
        picture.style.width = width + "%";
        picture.style.marginLeft = margin + "%";
      }
    }
  }
}

function changePicListener() {
  let picClass = document.getElementsByClassName("pic");
  for (let i = 0; i < picClass.length; i++) {
    picClass[i].addEventListener("click", changePic);
  }
}


function openModal(event) {
  event.target.parentNode.parentNode.childNodes[2].style.opacity = 0;
  event.target.parentNode.parentNode.childNodes[2].style.display = "block";
  document.body.style.overflow = "hidden";
  let opacity = 0;
  let interval = setInterval(fadeIn, 5);
  function fadeIn() {
    if (opacity > 1) {
      clearInterval(interval);
      currentDisplay = event.target.parentNode.parentNode.childNodes[2];
    } else {
      opacity += 0.02;
      event.target.parentNode.parentNode.childNodes[2].style.opacity = opacity;
    }
  }
}

let currentDisplay;

function closeModal() {
  let opacity = 1;
  let interval = setInterval(fadeOut, 5);
  function fadeOut() {
    if (opacity <= 0) {
      clearInterval(interval);
      currentDisplay.style.display = "none";
    } else {
      document.body.style.overflow = "visible";
      opacity -= 0.02;
      currentDisplay.style.opacity = opacity;
    }
  }
}

let slideIndex = 0;
function setSlideIndex(event) {
  slideIndex = event.target.picNum;
  let modal = event.target.parentNode.parentNode
  modal.querySelector(".modal-content").style.setProperty("--i", slideIndex);
  modal.querySelector(".modal-content").style.setProperty("--f", 1);  

  showSlides(modal);
}


function currentSlide(event) {
  slideIndex = event.target.picNum;
  modal = event.target.parentNode.parentNode.querySelector(".modal");
  modal.querySelector(".modal-content").style.setProperty("--i", slideIndex);
  showSlides(modal);
}

function showSlides(modal) {
  let slides, dots;
  slides = modal.getElementsByClassName("mySlides");
  dots = modal.getElementsByClassName("demo");

  const _C = modal.querySelector(".modal-content"),
    N = slides.length;

  let x0 = null,
    locked = false,
    w;

  function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }

  function lock(e) {
    x0 = unify(e).clientX;
    _C.classList.toggle("smooth", !(locked = true));
  }

  function drag(e) {
    e.preventDefault();

    if (locked)
      _C.style.setProperty("--tx", `${Math.round(unify(e).clientX - x0)}px`);
  }

  function move(e) {
    if (locked) {
      let dx = unify(e).clientX - x0,
        s = Math.sign(dx),
        f = +((s * dx) / w).toFixed(2);

      if ((slideIndex > 0 || s < 0) && (slideIndex < N - 1 || s > 0) && f > 0.2) {
        _C.style.setProperty("--i", (slideIndex -= s));
        slideIndex = slideIndex;
        // slideIndex = slideIndex;
        console.log(slideIndex);
        f = 1 - f;
      }

      _C.style.setProperty("--tx", "0px");
      _C.style.setProperty("--f", f);
      _C.classList.toggle("smooth", !(locked = false));
      x0 = null;
      dotOpacity();
    }
  }

  function plusSlides(event) {
    let n = event.target.value;
    slideIndex += n;
    console.log(slideIndex)
    if (slideIndex > slides.length - 1) {
      slideIndex = 0;
    }
    if (slideIndex < 0) {
      slideIndex = slides.length - 1;
    }
    modal.querySelector(".modal-content").style.setProperty("--i", slideIndex);  
    modal.querySelector(".modal-content").style.setProperty("--f", 0.75);  
    dotOpacity();
  }

  function size() {
    w = window.innerWidth;
    picSize();
  }

  function picSize() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.paddingLeft = "0px";
      slides[i].style.paddingRight = "0px";
      let picWidth = slides[i].clientWidth;
      let sidePadding = (w - picWidth) / 2 + "px";
      slides[i].style.paddingLeft = sidePadding;
      slides[i].style.paddingRight = sidePadding;
    }
    dotOpacity();
  }

  function dotOpacity(){
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  
    dots[slideIndex].className += " active";
  }
  _C.style.setProperty("--n", N);
  size();

  addEventListener("resize", size, false);

//put some browser detection here to change the code that gets used

  _C.onmousedown = lock;
  // _C.addEventListener("touchstart", lock, false);
  _C.ontouchstart = lock;


  _C.onmousemove = drag;
  // _C.addEventListener("touchmove", drag, false);
  _C.ontouchmove = drag;

  _C.onmouseup = move;
  // _C.addEventListener("touchend", move, false);
  _C.ontouchend = move;


  modal.querySelector(".prev").onclick = plusSlides;
  modal.querySelector(".next").onclick = plusSlides;

}

function focusPicListener() {
  let focusPicClass = document.getElementsByClassName("focusPic");
  for (let i = 0; i < focusPicClass.length; i++) {
    focusPicClass[i].addEventListener("click", openModal);
    focusPicClass[i].addEventListener("click", currentSlide);
  }
}

dropdownForm = document
  .getElementById("sectionSelector")
  .addEventListener("change", function() {
    let param = document.getElementById("sectionSelector").value;
    let picAreas = document.getElementsByClassName("area");
    let picAreasArray = new Array(...picAreas);
    if (param != "All Sales") {
      if (param.includes(" ")) {
        param = param.slice(0, param.indexOf(" "));
      }
      let showingPicAreas = document.getElementsByClassName(param);
      console.log(showingPicAreas);
      picAreasArray.forEach(function(element) {
        console.log(typeof element.className);
        if (element.className.includes(param)) {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    } else {
      picAreasArray.forEach(function(element) {
        element.style.display = "block";
      });
    }
    changePicListener();
    focusPicListener();
  });
