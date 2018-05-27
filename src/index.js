import axios from "axios";

const todoAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector(".root");

// function login(token) {
//   localStorage.setItem("token", token);
//   todoAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
// }

// function logout() {
//   localStorage.removeItem("token");
//   delete todoAPI.defaults.headers["Authorization"];
// }

const templates = {
  skillMain: document.querySelector("#skill-main").content,
  skillRegi: document.querySelector("#skill-register").content,
  signUp: document.querySelector('#signup').content,
  intro: document.querySelector('#introduction').content,
  login: document.querySelector('#skill-login').content
};

function render(frag) {
  rootEl.textContent = "";
  rootEl.appendChild(frag);
}




async function indexPage(){

  const skillFrag = document.importNode(templates.skillMain, true);
  const skillRegi = skillFrag.querySelector('.skill-register');
  const signUp = skillFrag.querySelector('.signup');
  const intro = skillFrag.querySelector('.skill-intro');
  const login = skillFrag.querySelector('.login');
  const logout = skillFrag.querySelector('.logout');

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

  
  signUp.addEventListener('click', e => {
    skillSignUp();
  });

  intro.addEventListener('click', e => {
    skillIntro();
  });

  login.addEventListener('click', e => {
    loginPage();
  })
  render(skillFrag);
}


async function skillRegister() {

  const frag = document.importNode(templates.skillRegi, true);


  render(frag);
};

async function skillSignUp() {

  const frag = document.importNode(templates.signUp, true);

  render(frag);
};

function skillIntro(){

  const frag = document.importNode(templates.intro, true);

  render(frag);
};


async function loginPage(){

  const frag = document.importNode(templates.login, true);

  render(frag);
}

// if (localStorage.getItem("token")) {
//   login(localStorage.getItem("token"));
// }

indexPage();
