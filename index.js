const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

const paginator = document.querySelector('.pagination')
const formSeclect = document.querySelector('.form-select')
// 當前選的性別為預設性別，就是沒有選擇
let selectGender = formSeclect.options[formSeclect.selectedIndex].value


// 每頁只顯示12個人
const PEOPLE_PER_PAGE = 12



let user = [];
axios.get(INDEX_URL).then((response) => {
  user.push(...response.data.results);
  // 分頁器的數量
  renderPaginator(user.length)
  //一開始只有第一頁，其他的會在監聽器後重新渲染
  fakeUserList(getUsersByPage(1));

});

// 功能一 : 搜尋
// 定義一個陣列儲存篩選後的姓名
let filteredName = []
// 搜尋表所使用的事件為submitt
searchForm.addEventListener('submit', function (event) {

  // 如果點擊button[type:submit]預防自動跳頁
  event.preventDefault()
  //取得input值
  let enterName = searchInput.value.trim().toLowerCase()
  if (!enterName.length) {
    alert('請輸入有效字串')
  }
  // 姓氏和名字都要找
  //透過條件式選擇當前的性別式哪個值，已決定要使用來FILTER的陣列

  if (selectGender === 'Gender...') {
    filteredName = user.filter((specificedUser) =>
      specificedUser.name.toLowerCase().includes(enterName) || specificedUser.surname.toLowerCase().includes(enterName)
    )
  } else if (selectGender === 'male') {
    filteredName = maleUser.filter((specificedUser) =>
      specificedUser.name.toLowerCase().includes(enterName) || specificedUser.surname.toLowerCase().includes(enterName)
    )
  } else if (selectGender === 'female') {
    filteredName = femaleUser.filter((specificedUser) =>
      specificedUser.name.toLowerCase().includes(enterName) || specificedUser.surname.toLowerCase().includes(enterName)
    )
  }

  // 利用for of 練習一次
  // for (const specificedUser of user){
  //   if (specificedUser.name.toLowerCase().includes(enterName) || specificedUser.surname.toLowerCase().includes(enterName)){
  //     filteredName.push(specificedUser)
  //   }
  // }
  if (filteredName.length === 0) {
    return alert('Cannot find someone with keyword: ' + enterName)
  }
  renderPaginator(filteredName.length)
  // 要放搜尋過後的電影資料
  fakeUserList(getUsersByPage(1))
})




// 修改fake user list的函數
// < !--toggle 按下之後會跳出一個modal，target則代表會跳出哪個modal-- >
// data - bs - target 要等於modal的id
function fakeUserList(data) {
  let rawHTML = ``;
  data.forEach(function (item) {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top userImg" alt="User image" data-bs-toggle="modal" data-bs-target="#userModal" data-id="${item.id}">
            <div class="card-body">
              <center><p class="card-text">${item.name} ${item.surname}</p>
              <i class="fa-regular fa-heart fa-2x" data-id="${item.id}"></i></center>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}



// 修改user的modal資料
function showUserModal(id) {
  const modalName = document.querySelector('#modalName')
  const modalBitrh = document.querySelector('#modalBitrh')
  const modalAge = document.querySelector('#modalAge')
  const modalEmail = document.querySelector('#modalEmail')
  const modalRegion = document.querySelector('#modalRegion')
  const modalImg = document.querySelector('#modalImg')
  axios.get(INDEX_URL + id).then((response) => {
    modalName.innerHTML = `${response.data.name} ${response.data.surname}`
    modalBitrh.innerHTML = `生日 : ${response.data.birthday}`
    modalAge.innerHTML = `年齡 : ${response.data.age}`
    modalEmail.innerHTML = `信箱 : ${response.data.email}`
    modalRegion.innerHTML = `地區 : ${response.data.region}`
    modalImg.innerHTML = `<img src="${response.data.avatar}" alt="User image" class="img-fuid"/>`
  });
}

//點擊圖片就會修改modal的資料，用mateches來鎖定class確定是選到圖片
// 點擊愛心會透過font-awsone換icon
dataPanel.addEventListener('click', function (event) {
  if (event.target.matches('.userImg')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-heart')) {
    console.log(user[1])
    for (let i = 0; i < user.length; i++) {
      if (user[i].id === Number(event.target.dataset.id)) {
        console.log('yes')
      }
    }
    // 可能可以透過card的-id找
    event.target.classList.remove('fa-regular')
    event.target.classList.add('fa-solid')
    addToFavorite(Number(event.target.dataset.id))
  }
})


// 功能二 : 收藏到我的最愛
//使用者點到愛心就要將其送到local storage存起來
// 在新增一個html去呈現loca storage的資料
function addToFavorite(id) {
  // 設定一個收藏清單list，運用or 與 falsy讓第一次取值為空陣列
  const list = JSON.parse(localStorage.getItem('favoritePerson')) || []
  const person = user.find((person) => person.id === id)
  if (list.some((person) => person.id === id)) {
    alert('此聯絡人已在於我的最愛清單')
    // 避免存到我的最愛清單第二次 
    return
  }
  list.push(person)
  // 存到localstortage
  localStorage.setItem('favoritePerson', JSON.stringify(list))
}


//功能三 : 進行分頁
//輸入第x個page，會回傳第x頁該出現的清單
//一個是完整的電影清單，一個是經過使用者搜尋過的電影清單，用一個data來決定
function getUsersByPage(page) {

  let data = []
  // 三元運算子，有資料就用前面的，沒有就用後面的
  if (selectGender === 'Gender...') {
    data = filteredName.length ? filteredName : user
  } else if (selectGender === 'male') {
    data = filteredName.length ? filteredName : maleUser
    console.log('hi')
  } else if (selectGender === 'female') {
    data = filteredName.length ? filteredName : femaleUser
    console.log('tony')
  }
  const startIndex = (page - 1) * PEOPLE_PER_PAGE
  return data.slice(startIndex, startIndex + PEOPLE_PER_PAGE)

}

// 在將此函數放到axios
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / PEOPLE_PER_PAGE)
  let rawHTML = ``
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


paginator.addEventListener('click', function (e) {
  if (e.target.tagName !== 'A') return
  fakeUserList(getUsersByPage(Number(e.target.dataset.page)))

})

//新功能 : 透過下拉式選單男女生，並產生只有女生或男生的陣列
let maleUser = []
let femaleUser = []

formSeclect.addEventListener('change', function (event) {
  let gender = event.target.value
  // 如果改掉性別 user的陣列裡面存的要改變
  selectGender = formSeclect.options[formSeclect.selectedIndex].value


  //取得需要哪個使用者的陣列user, maleUser或是femaleUser
  userChagendByGender(gender)
  //放入篩選性別後的陣列
  fakeUserList(getUsersByPage(1))
  renderPaginator(userChagendByGender(gender).length)


})





function userChagendByGender(gender) {
  //避免點第二次male會造成陣列變成兩倍
  if (gender === 'male' && maleUser.length === 0) {
    user.forEach(eachPerson => {
      if (eachPerson.gender === 'male')
        maleUser.push(eachPerson)
    })
    // console.log(maleUser)
    return maleUser
    //避免點第二次female會造成陣列變成兩倍
  } else if (gender === 'female' && femaleUser.length === 0) {
    user.forEach(eachPerson => {
      if (eachPerson.gender === 'female')
        femaleUser.push(eachPerson)
    })
    return femaleUser
    //已經呼叫過一次可以直接回傳
  } else if (gender === 'male' && maleUser.length > 0) {
    return maleUser
  } else if (gender === 'female' && femaleUser.length > 0) {
    return femaleUser
  } else {
    return user
  }
}