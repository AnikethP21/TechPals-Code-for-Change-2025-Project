window.location.hash = "home"


const error = document.querySelector(".error");
const app = document.getElementById("app");
const bookmark = document.getElementById("bookmark");
const loading = document.getElementById("loading");
const header = document.querySelector("header");

window.addEventListener("hashchange", () => {
  app.className = window.location.hash.substring(1)

  if (app.className !== "watch" && app.className !== "bookmark") {
    app.style.display = "none"
    bookmark.style.display = "none"
    if (app.className !== "home") error.style.display = "block"
    else {
      document.getElementById("intro-screen").style.display = "flex";
      loading.style.display = "none";
      header.style.display = "none";
    }
  }
  else {
    if (app.className == "watch") startEdTok()
    if (app.className == "bookmark") {
      header.style.display = "none";
      bookmark.style.display = "block"
      addSaved();
    }
    else if (app.className !== "bookmark") bookmark.style.display = "none"
    app.style.display = "block"
    error.style.display = "none"
  }
})

let userInterest = "";
let isLoading = false;
let searchOffset = 0;

async function fetchTopicRelatedTo(interest) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
    interest
  )}&sroffset=${searchOffset}&srlimit=1`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.query.search.length === 0) return null;

  const title = searchData.query.search[0].title;
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const summaryRes = await fetch(summaryUrl);
  const summaryData = await summaryRes.json();

  searchOffset += 1;
  return summaryData;
}

function createCard(data) {
  const card = document.createElement("section");
  card.className = "card";

  if (data.thumbnail?.source) {
    const img = document.createElement("img");
    img.src = data.thumbnail.source;
    img.alt = data.title;
    card.appendChild(img);
  }

  const title = document.createElement("h2");
  title.textContent = data.title;
  card.appendChild(title);

  const summary = document.createElement("p");
  summary.textContent = data.extract;
  card.appendChild(summary);

  const save = document.createElement("button");
  save.textContent = "save";
  card.appendChild(save);

  const link = document.createElement("a");
  link.href = data.content_urls?.desktop?.page || "#";
  link.target = "_blank";
  link.textContent = "Read more on Wikipedia";
  card.appendChild(link);

  save.addEventListener("click", e => {
    if (!localStorage.Saved) localStorage.setItem("Saved", card.innerHTML)
      
    if (localStorage.getItem("Saved").includes(card.innerHTML)) return;
    
    localStorage.setItem("Saved", localStorage.getItem("Saved") + "///" + card.innerHTML)
  })

  return card;
}

async function loadMore() {
  if (isLoading) return;
  isLoading = true;
  loading.style.display = "block";

  const topic = await fetchTopicRelatedTo(userInterest);
  if (topic) {
    const card = createCard(topic);
    app.appendChild(card);
  }

  isLoading = false;
  loading.style.display = "none";
}

async function startEdTok() {
  if (window.Location.hash !== "#watch") window.location.hash = "watch";

  userInterest = document.getElementById("interest").value.trim();
  if (!userInterest) return alert("Please enter a topic!");

  document.getElementById("intro-screen").style.display = "none";
  app.style.display = "block";
  loading.style.display = "block";
  header.style.display = "flex";

  for (let i = 0; i < 5; i++) {
    await loadMore();
  }
}

app.addEventListener("scroll", () => {
  if(app.scrollHeight - Math.abs(app.scrollTop) === app.clientHeight) {
    loadMore();
  }
});

document.querySelector("#home").addEventListener("click", () => {
  window.location.hash = "#home"
})

document.querySelector("#saved").addEventListener("click", () => {
  window.location.hash = "#bookmark"
})

function addSaved() {
  const c = localStorage.getItem("Saved").split("///")
  bookmark.innerHTML = "";
  c.forEach(i => {
    const elm = i.split("<button>save</button>")

    bookmark.innerHTML += `<section class="card">${elm[0]}${elm[1]}</section>`;
  })
}