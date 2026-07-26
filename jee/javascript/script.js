// ==============================
// JEE Portal JavaScript
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // Welcome Message
    console.log("Welcome to JEE Preparation Portal");

});


// ==============================
// Get Started Button
// ==============================

function getStarted() {
    window.location.href = "register.html";
}


// ==============================
// Login Button
// ==============================

function login() {
    window.location.href = "login.html";
}


// ==============================
// Mock Test Button
// ==============================

function startMockTest() {
    window.location.href = "mocktest.html";
}


// ==============================
// PYQ Button
// ==============================

function openPYQ() {
    window.location.href = "pyq.html";
}


// ==============================
// Performance Page
// ==============================

function openPerformance() {
    window.location.href = "performance.html";
}


// ==============================
// Profile Page
// ==============================

function openProfile() {
    window.location.href = "profile.html";
}


// ==============================
// Settings Page
// ==============================

function openSettings() {
    window.location.href = "settings.html";
}


// ==============================
// Counter Animation
// ==============================

const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

counter.innerText="0";

const updateCounter=()=>{

const target=+counter.getAttribute("data-target");

const c=+counter.innerText;

const increment=target/100;

if(c<target){

counter.innerText=Math.ceil(c+increment);

setTimeout(updateCounter,20);

}else{

counter.innerText=target;

}

};

updateCounter();

});


// ==============================
// FAQ Toggle
// ==============================

const faq=document.querySelectorAll(".faq-question");

faq.forEach(item=>{

item.addEventListener("click",()=>{

item.classList.toggle("active");

const answer=item.nextElementSibling;

if(answer.style.maxHeight){

answer.style.maxHeight=null;

}else{

answer.style.maxHeight=answer.scrollHeight+"px";

}

});

});


// ==============================
// Scroll To Top Button
// ==============================

const topBtn=document.createElement("button");

topBtn.innerHTML="⬆";

topBtn.style.position="fixed";

topBtn.style.bottom="20px";

topBtn.style.right="20px";

topBtn.style.padding="12px 16px";

topBtn.style.border="none";

topBtn.style.borderRadius="50%";

topBtn.style.background="#1565C0";

topBtn.style.color="white";

topBtn.style.cursor="pointer";

topBtn.style.display="none";

document.body.appendChild(topBtn);

window.onscroll=function(){

if(document.documentElement.scrollTop>200){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

};

topBtn.onclick=function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

};


// ==============================
// Dark Mode
// ==============================

function darkMode(){

document.body.classList.toggle("dark");

}


// ==============================
// Alert Buttons
// ==============================

function enroll(course){

alert("You selected : "+course);

}


function downloadPYQ(year){

alert("Downloading JEE "+year+" Paper");

}


function practicePYQ(year){

alert("Opening Practice Paper : "+year);

}


function logout(){

if(confirm("Are you sure you want to logout?")){

window.location.href="login.html";

}

}


// ==============================
// Contact Form
// ==============================

function submitForm(){

alert("Thank You! Your message has been submitted.");

}


// ==============================
// Search
// ==============================

function searchCourse(){

let input=document.getElementById("search").value;

alert("Searching for : "+input);

}


// ==============================
// Notification
// ==============================

setTimeout(()=>{

console.log("Keep Practicing Daily 🚀");

},3000);


// ==============================
// Footer Year
// ==============================

const year=document.getElementById("year");

if(year){

year.innerHTML=new Date().getFullYear();

}