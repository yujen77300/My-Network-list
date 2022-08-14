const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const cardBody = document.querySelector('.card-body');



let user = JSON.parse(localStorage.getItem('favoritePerson')) || [];


// 修改fake user list的函數
// < !--toggle 按下之後會跳出一個modal，target則代表會跳出哪個modal-- >
// i標籤這邊要改成fa-solid確認都有愛心
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
              <i class="fa-solid fa-heart fa-2x" data-id="${item.id}"></i></center>
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
    event.target.classList.remove('fa-solid')
    event.target.classList.add('fa-regular')
    removeFromFavorite(Number(event.target.dataset.id))
  }
})


  // 渲染收到我的最愛的清單
  fakeUserList(user)

// 功能二 : 收藏到我的最愛之後要可以刪除
// 刪除時候要找到正確的位置才能刪除


function removeFromFavorite(id){
  
  const personIndex = user.findIndex((person) => person.id === id)
  user.splice(personIndex,1)
  localStorage.setItem('favoritePerson',JSON.stringify(user))
  // 即時渲染最新的USER清單
  fakeUserList(user)
}