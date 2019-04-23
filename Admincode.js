const adminForm = document.querySelector(".admin-actions");
const loginButton = document.getElementById("login-button");
const signupButton = document.getElementById("signup-button");
const signupForm = document.querySelector("#signup-form");
const changepasswordForm = document.getElementById("changePasswordForm");
const loginForm = document.querySelector("#login-form");
const logout = document.getElementById("signout");
let uploadForm = document.getElementById("input");
let makeAdminButton = document.getElementById("make-admin");
let uploadItemButton = document.getElementById("upload-item");
let deleteItemButton = document.getElementById("delete-item");
let deleteForm = document.getElementById("deleteSerial");
let fileInputDiv = document.querySelector("#fileInputDiv");

document.getElementById("addAdmin").addEventListener("submit", e => {
  e.preventDefault();
  const adminEmail = document.querySelector("#admin-email").value;
  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

document.getElementById("removeAdmin").addEventListener("submit", e => {
  e.preventDefault();
  const adminRemoveEmail = document.querySelector("#adminRemoveEmail").value;
  const removeAdminRole = functions.httpsCallable("removeAdminRole");
  removeAdminRole({ email: adminRemoveEmail }).then(result => {
    console.log(result);
  });
});

loginButton.addEventListener("click", function() {
  changePasswordForm.style.display = "none";
  loginForm.style.display = "block";
  signupForm.style.display = "none";
});

signupButton.addEventListener("click", function() {
  changePasswordForm.style.display = "none";
  signupForm.style.display = "block";
  loginForm.style.display = "none";
});

const changePasswordButton = document.getElementById("changePasswordButton");
changePasswordButton.addEventListener("click", function() {
  changePasswordForm.style.display = "block";
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  document.getElementById("delete").style.display = "none";
  adminForm.style.display = "none";
  document.getElementById("upload").style.display = "none";
});

// signup
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user & add firestore data
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      signupForm.style.display = "none";
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

//changepassword form
changepasswordForm.onsubmit = function(event) {
  event.preventDefault();
  let email = document.getElementById("changePasswordEmail").value;
  console.log(typeof email);
  return auth
    .sendPasswordResetEmail(email)
    .then(() => console.log("email sent"))
    .catch(error => console.log(error));
};

loginForm.onsubmit = function(event) {
  event.preventDefault();

  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      console.log("logged in");
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
};

logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut();
});

makeAdminButton.addEventListener("click", function() {
  adminForm.style.display = "block";
  document.getElementById("upload").style.display = "none";
  document.getElementById("delete").style.display = "none";
  changepasswordForm.style.display = "none";
});

uploadItemButton.addEventListener("click", function() {
  document.getElementById("upload").style.display = "block";
  adminForm.style.display = "none";
  document.getElementById("delete").style.display = "none";
  changepasswordForm.style.display = "none";
});

deleteItemButton.addEventListener("click", function() {
  document.getElementById("delete").style.display = "block";
  adminForm.style.display = "none";
  document.getElementById("upload").style.display = "none";
  changepasswordForm.style.display = "none";
});

auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("user has logged out");
    document.getElementById("upload").style.display = "none";
    document.getElementById("delete").style.display = "none";
    loginButton.style.display = "inline";
    signupButton.style.display = "inline";
    document.getElementById("signout").style.display = "none";
    adminForm.style.display = "none";
    makeAdminButton.style.display = "none";
    uploadItemButton.style.display = "none";
    deleteItemButton.style.display = "none";
    changepasswordForm.style.display = "none";
  } else {
    document.getElementById("signout").style.display = "inline";

    user.getIdTokenResult().then(idTokenResult => {
      if (idTokenResult.claims.admin) {
        makeAdminButton.style.display = "inline";
        uploadItemButton.style.display = "inline";
        deleteItemButton.style.display = "inline";
        document.getElementById("signout").style.display = "inline";
        loginButton.style.display = "none";
        signupButton.style.display = "none";
        loginForm.style.display = "none";
        changepasswordForm.style.display = "none";
        loginForm.querySelector(".error").innerHTML = "";
      }
    });
  }
});



document.getElementById("fileUpload").addEventListener("change", addUploadButton)

function addUploadButton(event) {
  let inputs = event.target.parentNode.getElementsByTagName("INPUT")
  let inputValArr = [];
  for(let i = 0; i < inputs.length; i++){
    if (inputs[i].value != ""){
      inputValArr.push(inputs[i].value)
    }
  }
  if(inputValArr.length == inputs.length){
    let additionalFileInput = document.createElement("input");
    additionalFileInput.setAttribute("type", "file");
    additionalFileInput.setAttribute("class", "file-upload");
    let attMultiple = document.createAttribute("multiple");
    additionalFileInput.setAttributeNode(attMultiple);
    additionalFileInput.addEventListener("change", addUploadButton)
    fileInputDiv.appendChild(additionalFileInput);
  }
};

uploadForm.onsubmit = function(event) {
  event.preventDefault();
  let obj = {};
  filesArr = [];
  let pictures = document.getElementById("fileInputDiv").getElementsByTagName("INPUT");
  for (let i = 0; i < pictures.length; i++) {
    filesArr.push(pictures[i].files)
  }
  let picNameArr = [];
  for (let i = 0; i < filesArr.length; i++){
    let n = filesArr[i].length;
    let j = 0;
    while (j < n) {
      picNameArr.push(filesArr[i][j].name);
      let upload = storageRef.child(`Store/${filesArr[i][j].name}`).put(filesArr[i][j]);
      upload.on("state_changed", function progress(snapshot) {
        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById("uploader").value = percentage;
      });
      // , function error(error){
      //   console.log(error)
      // })
      // function complete(){
      // })
      j++;
    }
  }

  let input = document.getElementById("buyButton").value;
  obj.pics = picNameArr;
  obj.type = document.getElementById("sectionSelector").value;
  obj.brand = document.getElementById("brand").value;
  obj.model = document.getElementById("model").value;
  obj.ser = document.getElementById("ser").value;
  obj.description = document.getElementById("description").value;
  obj.price = document.getElementById("price").value;
  obj.shipping = document.getElementById("shipping").value;
  // obj.buyButton = arr.join("")
  obj.buyButton = input;
  db.ref("items")
    .push()
    .set(obj);

  let upload = document.getElementById("upload");
  let done = document.createElement("h4");
  done.setAttribute("id", "uploadComplete")
  let doneText = document.createTextNode("Upload Complete")
  done.appendChild(doneText);
  upload.appendChild(done);
};

document.getElementById("clearForm").addEventListener("click", function(){
    document.getElementById("uploadComplete").innerHTML = "";
})

deleteForm.onsubmit = function(event) {
  event.preventDefault();

  let serToDelete = document.getElementById("serial").value;
  firebase
    .database()
    .ref("items")
    .once("value")
    .then(function(data) {
      let items = data.val();
      let arr = Object.keys(items);
      for (let i = 0; i < arr.length; i++) {
        if (items[arr[i]].ser == serToDelete) {
          let picsToDelete = items[arr[i]].pics;
          for (let j = 0; j < picsToDelete.length; j++) {
            let deletPic = picsToDelete[j];
            storageRef.child("Store/" + deletPic).delete();
          }
          firebase
            .database()
            .ref("items/" + arr[i])
            .remove();
        }
      }
    });
};
