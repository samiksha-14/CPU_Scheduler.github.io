"use strict";
//ADDing poping window functionality
const btnUserGuide = document.querySelector(".user"); //to select button of user guide
const windisplay = document.querySelector(".UserGuide"); //to select pop-up window
const closebtn = document.querySelector(".close");
const ovrlay = document.querySelector(".overlay");
// console.log(ovrlay);
// console.log(winbtn);
// console.log(windisp);
// console.log(closebtn);
btnUserGuide.addEventListener("click", function () {
  windisplay.classList.remove("visiblity");
  ovrlay.classList.remove("hidden");
});
closebtn.addEventListener("click", function () {
  windisplay.classList.add("visiblity");
  ovrlay.classList.add("hidden");
});
