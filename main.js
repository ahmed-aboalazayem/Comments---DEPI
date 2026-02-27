const commentsEL = document.querySelector(".comments");
const commentCards = document.querySelectorAll(".comment__card");

let comments = [];
let avatars = null;

const randomTime = () => {
    return Math.floor(Math.random() * 24) + 1;
};

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }
        });
    },
    { threshold: 0.1 },
);
commentCards.forEach((el) => observer.observe(el));

const displayData = () => {
    commentsEL.innerHTML = "";

    const limit = Math.min(comments.length, avatars.users.length);

    for (let i = 0; i < limit; i++) {
        const user = avatars.users[i];

        commentsEL.innerHTML += `
      <div class="comment__card comment__${comments[i].postId}">
        <img src="${user.image}" alt="User Image" />
        <div class="comment__content">
          <div class="comment__head">
            <div class="title">
            <div class="name__age">
            <h3 class="name">${user.firstName} ${user.lastName}</h3>
            <p class="age">age ${user.age}</p>
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

    const commentCards = commentsEL.querySelectorAll(".comment__card");
    commentCards.forEach((el) => observer.observe(el));
};
const getData = async () => {
    try {
        const [commentsRes, avatarsRes] = await Promise.all([
            fetch("https://jsonplaceholder.typicode.com/comments"),
            fetch("https://dummyjson.com/users?limit=100"),
        ]);

        if (!commentsRes.ok) {
            throw new Error("Comments request failed: " + commentsRes.status);
        }

        if (!avatarsRes.ok) {
            throw new Error("Avatars request failed: " + avatarsRes.status);
        }

        comments = await commentsRes.json();
        avatars = await avatarsRes.json();

        console.log("Comments:", comments.length);
        console.log("Avatars:", avatars.users.length);

        displayData();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
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
