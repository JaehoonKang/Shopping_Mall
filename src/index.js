import axios from "axios";

const todoAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector(".root");

function login(token) {
  localStorage.setItem("token", token);
  todoAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
}

function logout() {
  localStorage.removeItem("token");
  delete todoAPI.defaults.headers["Authorization"];
}

const templates = {
  skillMain: document.querySelector("#skill-main").content,
  skillRegi: document.querySelector("#skill-register").content
};

function render(frag) {
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}


async function indexPage(){

  const skillFrag = document.importNode(templates.skillMain, true);
  const skillRegi = skillFrag.querySelector('.skill-register');

  $(document).ready(function() {
    // main slider
    setInterval(function () {      
        var sliderOne = $('.slider-wrapper__slider1');
        var sliderTwo = $('.slider-wrapper__slider2');
        
        if(sliderOne.css('margin-left') == '0px') {
            sliderTwo.css({'margin-left' : '100%'});
            sliderTwo.animate({marginLeft : '0px'}, 'slow');
            sliderOne.animate({marginLeft : '-100%'}, 'slow');
        } else {
            sliderOne.css({'margin-left' : '100%'});
            sliderOne.animate({marginLeft : '0px'}, 'slow');
            sliderTwo.animate({marginLeft : '-100%'}, 'slow');
        }
    }, 7000);
  });


  skillRegi.addEventListener('click', e => {
    skillRegister();
  })


  render(skillFrag);
}


async function skillRegister() {

  const frag = document.importNode(templates.skillRegi, true);


  render(frag);
}


indexPage();
