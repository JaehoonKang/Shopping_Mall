import axios from "axios";

const shopAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector(".root");

function login(token) {
  localStorage.setItem("token", token);
  shopAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
}

function logout() {
  localStorage.removeItem("token");
  delete shopAPI.defaults.headers["Authorization"];
}

const templates = {
  skillMain: document.querySelector("#skill-main").content,
  skillItem: document.querySelector('#skill-item').content,
  skillItemClicked: document.querySelector('#skill-item--clicked').content,
  skillRegi: document.querySelector("#skill-register").content,
  signUp: document.querySelector('#signup').content,
  intro: document.querySelector('#introduction').content,
  login: document.querySelector('#skill-login').content
};

function render(frag) {
  rootEl.textContent = "";
  rootEl.appendChild(frag);
};

async function indexPage(){

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

  const res = await shopAPI.get("/products?_expand=user");

  const skillFrag = document.importNode(templates.skillMain, true);
  const skillRegi = skillFrag.querySelector('.skill-register');
  const signUp = skillFrag.querySelector('.signup');
  const intro = skillFrag.querySelector('.skill-intro');
  const login = skillFrag.querySelector('.login');
  const logout = skillFrag.querySelector('.logout');


  skillRegi.addEventListener('click', e => {
    skillRegister();
  });

  signUp.addEventListener('click', e => {
    skillSignUp();
  });

  intro.addEventListener('click', e => {
    skillIntro();
  });

  login.addEventListener('click', e => {
    loginPage();
  });

  res.data.forEach(product => {
    const frag = document.importNode(templates.skillItem, true);
    const tutorName = frag.querySelector('.skill-time__p--tutorname');
    const productPic = frag.querySelector('.skill-item__small-img');
    const productTitle= frag.querySelector('.skill-item__p--title');
    const productPrice = frag.querySelector('.skill-item__p--price');
    const productCount = frag.querySelector('.skill-item__p--count');

    productPic.textContent = product.user.profileImg;
    tutorName.textContent = product.user.name;
    productTitle.textContent= product.title;
    productPrice.textContent = `$${product.price}`;
    productCount.textContent = product.count;


    skillFrag.querySelector('.skill-product').appendChild(frag);

  }
)



  render(skillFrag);
}


async function skillRegister() {

  const frag = document.importNode(templates.skillRegi, true);


  render(frag);
};

async function skillSignUp() {

  const frag = document.importNode(templates.signUp, true);
  const formEl = frag.querySelector('.signup-tem');

  formEl.addEventListener('submit', async e => {
    // const userPayload ={
    //   username: e.target.elements.username.value,
    //   password: e.target.elements.password.value
    // }
    // e.preventDefault();

    // const firstRes = await shopAPI.post('users/register', userPayload);

    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
      name: e.target.elements.name.value,
      email: e.target.elements.email.value,
      phone: e.target.elements.phone.value,
      profileImg: e.target.elements.resume.value,
      intro: e.target.elements.intro.value
    }

    const lastRest = await shopAPI.post('/users/register', payload);
    const firstRes = await shopAPI.post('/users', payload);

    indexPage();
  })


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

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

indexPage();
