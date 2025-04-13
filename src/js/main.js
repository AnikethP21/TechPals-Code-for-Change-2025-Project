
const error = document.querySelector(".error");
const app = document.getElementById("app");
const loading = document.getElementById("loading");
let isLoading = false;

window.addEventListener("hashchange", () => {
  app.className = window.location.hash.substring(1)

  if (app.className !== "watch" && app.className !== "save") {
    app.style.display = "none"
    error.style.display = "block"
  }
  else {
    app.style.display = "block"
    error.style.display = "none"
  }
})

async function fetchRandomTopic() {
  const response = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
  const data = await response.json();
  return data;
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

  const share = document.createElement("button");
  share.textContent = "share";
  card.appendChild(share);

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

  const topic = await fetchRandomTopic();
  const card = createCard(topic);
  app.appendChild(card);

  isLoading = false;
  loading.style.display = "none";
}

async function init() {
    await loadMore();
    window.location.hash = "watch"
}

init();

app.addEventListener("scroll", () => {
  if (app.scrollHeight - Math.abs(app.scrollTop) === app.clientHeight) {
    loadMore();
  }
});