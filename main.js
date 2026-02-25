const commentsEL = document.querySelector(".comments");

let comments = [];
let avatars = null;

const randomTime = () => {
    return Math.floor(Math.random() * 24) + 1;
};

const displayData = () => {
    commentsEL.innerHTML = "";

    const limit = Math.min(comments.length, avatars.results.length);

    for (let i = 0; i < limit; i++) {
        const user = avatars.results[i];

        commentsEL.innerHTML += `
      <div class="comment__card comment__${comments[i].postId}">
        <img src="${user.picture.large}" alt="User Image" />
        <div class="comment__content">
          <div class="comment__head">
            <div class="title">
            <div class="name__age">
            <h3 class="name">${user.name.first} ${user.name.last}</h3>
            <p class="age">age ${user.dob.age}</p>
            </div>
              <p class="email">${user.email}</p>
            </div>

            <div class="more">
              <p class="duration">${randomTime()}h ago</p>
              <i class="fa-solid fa-ellipsis-vertical modal__ico"></i>
            </div>
          </div>

          <div class="comment__text__content">
            <p class="content__title">${comments[i].name}</p>
            <p class="content__text">${comments[i].body}</p>
          </div>

          <div class="comment__btns">
            <div class="comment__btn">
              <i class="fa-regular fa-heart heart"></i>
              <p class="num love__num">${randomTime()}</p>
            </div>
            <div class="comment__btn">
              <i class="fa-regular fa-comment"></i>
              <p class="num">${randomTime()}</p>
            </div>
            <div class="comment__btn">
              <i class="fa-solid fa-share"></i>
              <p class="num">${randomTime()}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    }
};

const getData = () => {
    const getComments = new XMLHttpRequest();
    const getAvatars = new XMLHttpRequest();

    let commentsReady = false;
    let avatarsReady = false;

    const tryRender = () => {
        if (commentsReady && avatarsReady) displayData();
    };

    getComments.open("GET", "https://jsonplaceholder.typicode.com/comments");
    getComments.send();

    getAvatars.open("GET", "https://randomuser.me/api/?results=100");
    getAvatars.send();

    getComments.addEventListener("readystatechange", function () {
        if (getComments.readyState === 4) {
            if (getComments.status >= 200 && getComments.status < 300) {
                comments = JSON.parse(getComments.responseText);
                commentsReady = true;
                tryRender();
            } else {
                console.error("Comments request failed:", getComments.status);
            }
        }
    });

    getAvatars.addEventListener("readystatechange", function () {
        if (getAvatars.readyState === 4) {
            if (getAvatars.status >= 200 && getAvatars.status < 300) {
                avatars = JSON.parse(getAvatars.responseText);
                console.log(avatars);

                avatarsReady = true;
                tryRender();
            } else {
                console.error("Avatars request failed:", getAvatars.status);
            }
        }
    });
};

getData();

commentsEL.addEventListener("click", function (e) {
    if (e.target.classList.contains("heart")) {
        const heart = e.target;
        const numberEl = heart
            .closest(".comment__btn")
            .querySelector(".love__num");

        let currentNumber = parseInt(numberEl.textContent);

        if (heart.classList.contains("fa-regular")) {
            // Like
            heart.classList.remove("fa-regular");
            heart.classList.add("fa-solid", "active");
            numberEl.textContent = currentNumber + 1;
        } else {
            // Unlike
            heart.classList.remove("fa-solid", "active");
            heart.classList.add("fa-regular");
            numberEl.textContent = currentNumber - 1;
        }
    }
});
