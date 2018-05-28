import axios from "axios";

const shopAPI = axios.create({
  baseURL: process.env.API_URL
});

const rootEl = document.querySelector(".root");

function login(token) {
  localStorage.setItem("token", token);
  shopAPI.defaults.headers["Authorization"] = `Bearer ${token}`;
}

function logoutSkill() {
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
  login: document.querySelector('#skill-login').content,
  signupNext: document.querySelector('#signup-next').content
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

  const res = await shopAPI.get("/products?_expand=detail");

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

  logout.addEventListener('click', e => {
    logoutSkill();
    console.log("logout completely")
  })

  res.data.forEach(product => {
    const frag = document.importNode(templates.skillItem, true);

    const tutorName = frag.querySelector('.skill-time__p--tutorname');
    const productPic = frag.querySelector('.skill-item__small-img');
    const productTitle= frag.querySelector('.skill-item__p--title');
    const productPrice = frag.querySelector('.skill-item__p--price');
    const productCount = frag.querySelector('.skill-item__p--count');

    productPic.textContent = product.detail.profileImg;
    tutorName.textContent = product.detail.name;
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

  const formEl = frag.querySelector('.skill-service-register');

  formEl.addEventListener('submit',async e => {

    const productPayload = {
      title: e.target.elements.title.value,
      productImg: e.target.elements.resume.value,
      price: e.target.elements.price.value,
      description: e.target.elements.description.value,
      category: e.target.elements.select.value
    }
    e.preventDefault();

    const res = await shopAPI.post('/products', productPayload);

    indexPage();
  })
  


  render(frag);
};

async function skillSignUp() {

  const frag = document.importNode(templates.signUp, true);
  const formEl = frag.querySelector('.signup-tem');
  const regiButtonEl = formEl.querySelector('.signup-btn');
  const returnButton = frag.querySelector('.signup-back-btn');

  formEl.addEventListener('submit', async e => {

    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };

    e.preventDefault();
    
    const res = await shopAPI.post('users/register', payload);

    returnButton.addEventListener('click', e => {
      indexPage();
    });

    signupNext();
  });

  render(frag);
};

async function signupNext(){
  const frag = document.importNode(templates.signupNext, true);
  const formEl = frag.querySelector('.signup-tem');

  formEl.addEventListener('submit', async e => {
  const payload = {
    name: e.target.elements.name.value,
    email: e.target.elements.email.value,
    phone: e.target.elements.phone.value,
    profileImg: e.target.elements.resume.value,
    intro: e.target.elements.intro.value
    };

  e.preventDefault();

  const res = await shopAPI.post('/details', payload);

  indexPage();
  });

  render(frag);
}

function skillIntro(){

  const frag = document.importNode(templates.intro, true);
  const buttonEl = frag.querySelector('.introduction-btn');

  buttonEl.addEventListener('click', e => {
    indexPage();
  });
  
  render(frag);
};

async function loginPage(){

  const frag = document.importNode(templates.login, true);

  // const backButton = frag.querySelector('.login-back-btn');

  // const formEl = frag.querySelector('.skill-login');

  // formEl.addEventListener('submit', async e => {
  //   const payload = {
  //     username: e.target.elements.username.value,
  //     password: e.target.elements.password.value
  //   };
  //   e.preventDefault();

  //   const res = await shopAPI.post("/users/login", payload);

  //   login(res.data.token);
  //   indexPage();
  // });


  // backButton.addEventListener('click', e => {
  //   indexPage();
  // });

  render(frag);
}

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

indexPage();
