let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

fetch("http://localhost:3000/toys")
.then(res => res.json())
.then(toyCollection => renderToys(toyCollection))
.then(() => {
  likeBtns = document.querySelectorAll('.like-btn');
  likeBtns.forEach(likeBtn => {
    likeBtn.addEventListener('click', event => {
      let toyId = likeBtn.id;
      let currentNumberOfLikes = event.target.previousSibling.textContent.split()[0];
      currentNumberOfLikes = parseInt(currentNumberOfLikes, 10)
      let newNumberOfLikes = currentNumberOfLikes + 1;
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          "likes": newNumberOfLikes
        })
      })
      .then(res => res.json())
      .then(res => {
        event.target.previousSibling.textContent = `${newNumberOfLikes} Likes`
      })
    })
  })
});

let form = document.querySelector('form');
form.addEventListener('submit', event => {
  let name = event.target[0].value;
  let imageURL = event.target[1].value;
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": name,
      "image": imageURL,
      "likes": 0
    })
  })
  .then(res => res.json())
  .then(res => addingRenderedToys(res))
})

function renderToys(toyCollection) {
  toyCollection.forEach(toyObj => addingRenderedToys(toyObj))
}

function addingRenderedToys(toyObj) {
  const toyHTMLCollection = document.getElementById('toy-collection');
    let div = document.createElement('div');
    let h2 = document.createElement('h2');
    let img = document.createElement('img');
    let p = document.createElement('p');
    let btn = document.createElement('button');

    h2.textContent = toyObj.name;
    img.src = toyObj.image;
    p.textContent = `${toyObj.likes} Likes`;
    btn.textContent = "LIKE"

    div.classList.add('card');
    img.classList.add('toy-avatar');
    btn.classList.add('like-btn')
    btn.id = toyObj.id;

    div.appendChild(h2)
    div.appendChild(img)
    div.appendChild(p)
    div.appendChild(btn);
    toyHTMLCollection.appendChild(div);
}
