import axios from "axios";

const shopAPI = axios.create({
  baseURL: process.env.API_URL
});

let currentCount = 0;

const rootEl = document.querySelector(".root");

function login(token) {
  // localStorage.setItem("userId")
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
  signupNext: document.querySelector('#signup-next').content,
  applyForm: document.querySelector('#applyForm').content
};

function render(frag) {
  rootEl.textContent = "";
  rootEl.appendChild(frag);
};

async function indexPage(userId){

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

  //indexPage 로그인시 나오는 것!
  if (localStorage.getItem("token")) {
    console.log(userId);
  }else{
    console.log('logout')
  }
  

  const skillRes = await shopAPI.get('/details');
  
  // console.log(skillRes.data.pop().id)

  const skillFrag = document.importNode(templates.skillMain, true);
  
  const skillRegi = skillFrag.querySelector('.skill-register');
  const signUp = skillFrag.querySelector('.signup');
  const intro = skillFrag.querySelector('.skill-intro');
  const login = skillFrag.querySelector('.login');
  const logout = skillFrag.querySelector('.logout');
  
  
  skillRegi.addEventListener('click', e => {
    console.log(userId);
    skillRegister(userId);
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
  });

  const res = await shopAPI.get("/products?_expand=detail");
  
  const skillProduct = skillFrag.querySelector('.skill-product');
  
  res.data.forEach(product => {
    const frag = document.importNode(templates.skillItem, true);

    const tutorName = frag.querySelector('.skill-item__p--tutorname');
    const productPic = frag.querySelector('.skill-item__small-img');
    const productTitle= frag.querySelector('.skill-item__p--title');
    const productPrice = frag.querySelector('.skill-item__p--price');
    // const productCount = frag.querySelector('.skill-item__p--count');
    const productDetailButton = frag.querySelector('.skill-item__detail-btn');

    tutorName.textContent = product.detail.name;
    productPic.src = product.detail.profileImg;
    productTitle.textContent= product.title;
    productPrice.textContent = `$${product.price}`;
    // productCount.textContent = product.count;
    productDetailButton.addEventListener('click', e => {
      console.log('clicked');
      console.log(product.id);
      showProductDetail(product.id);
    });

    skillProduct.appendChild(frag);
  }
);

render(skillFrag);
}



async function skillRegister(skillId) {
  
  console.log(skillId);
  
  const reFrag = document.importNode(templates.skillRegi, true);

  const formEl = reFrag.querySelector('.skill-service-register');


  formEl.addEventListener('submit', async e => {

    // const tutorRes = await shopAPI.get('/detail?_expand=user');
    // console.log(skillId);
    const productPayload = {
        title: e.target.elements.title.value,
        productImg: e.target.elements.resume.value,
        price: e.target.elements.price.value,
        description: e.target.elements.description.value,
        category: e.target.elements.select.value,
        curriculum: e.target.elements.curriculum.value,
        location: e.target.elements.location.value,
        userId: skillId,
        detailId: skillId
      };

      e.preventDefault();
      
      // console.log(productPayload)
      const productRes = await shopAPI.post('/products', productPayload);

      if (localStorage.getItem("token")) {
        console.log(skillId);
        indexPage(skillId);
      }else{
        console.log('logout')
        indexPage();
      };
    });

  render(reFrag);
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

    const userRes = await shopAPI.get('/users');

    userRes.data.forEach(user => {
      signupNext(user.id);
    });
  });

  render(frag);
};

async function signupNext(userId){
  const frag = document.importNode(templates.signupNext, true);
  const formEl = frag.querySelector('.signup-tem');

  formEl.addEventListener('submit', async e => {
  const payload = {
    name: e.target.elements.name.value,
    email: e.target.elements.email.value,
    phone: e.target.elements.phone.value,
    profileImg: e.target.elements.resume.value,
    intro: e.target.elements.intro.value,
    userId: userId
    };

  e.preventDefault();

  const res = await shopAPI.post('/details', payload);

  indexPage();
  });
  render(frag);
}


async function showProductDetail(product){
  
  const frag = document.importNode(templates.skillItemClicked, true);
  const infoRes = await shopAPI.get('/products?_expand=detail');
  const applyButton = frag.querySelector('.skill-item--clicked__section--apply-btn');
  
  infoRes.data.forEach(item => {

    const sectionEl = frag.querySelector('.skill-item--clicked__section');

    const tutorName = sectionEl.querySelector('.skill-item--clicked__section--tutorname');
    const productPic = sectionEl.querySelector('.skill-item--clicked__section--productImg');
    const productTitle= sectionEl.querySelector('.skill-item--clicked__section--title');
    const productPrice = sectionEl.querySelector('.skill-item--clicked__section--price');
    const productCurriculum = sectionEl.querySelector('.skill-item--clicked__section--curriculum');
    const productLocation = sectionEl.querySelector('.skill-item--clicked__section--location');
    const productDescription = sectionEl.querySelector('.skill-item--clicked__section--description');
    
    productPic.src = item.productImg;
    tutorName.textContent = item.detail.name;
    productTitle.textContent= item.title;
    productPrice.textContent = `$${item.price}`;
    productCurriculum.textContent = item.curriculum;
    productLocation.textContent = item.location;
    productDescription.textContent = item.description;


    applyButton.addEventListener('click', e => {
      currentCount ++;
      console.log("product:" + product);
      console.log("currentCount:" + currentCount);
      applyForm(currentCount, product);
    });

  });



  
  
  render(frag);
};



function applyForm(currentCount, product){
  const frag = document.importNode(templates.applyForm, true);

  const applyForm = frag.querySelector('.applyForm');

  applyForm.addEventListener('submit',async e => {
    
    const payload = {
      applicant: e.target.elements.applicant.value,
      phone: e.target.elements.cell.value,
      reason: e.target.elements.reason.value,
      count: currentCount,
      productId: product
    };

    e.preventDefault();

    const res = await shopAPI.post('/forms', payload);

    console.log("곧 연락드릴게요!");
    indexPage();
  });


  render(frag);
};

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
  const formEl = frag.querySelector('.skill-login');

  formEl.addEventListener('submit', async e => {
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    };

    e.preventDefault();

    const res = await shopAPI.post("/users/login", payload);
    login(res.data.token);
    const userRes = await shopAPI.get('/me');

    const userId = userRes.data.id;

    indexPage(userId);
  });
  render(frag);
};

if (localStorage.getItem("token")) {
  login(localStorage.getItem("token"));
}

indexPage();


