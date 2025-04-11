const app = document.getElementById("app");
const loading = document.getElementById("loading");
let isLoading = false;

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

  const link = document.createElement("a");
  link.href = data.content_urls?.desktop?.page || "#";
  link.target = "_blank";
  link.textContent = "Read more on Wikipedia";
  card.appendChild(link);

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
}

init();

// Infinite scroll when near the bottom
app.addEventListener("scroll", () => {
  if (app.scrollHeight - Math.abs(app.scrollTop) === app.clientHeight) {
    loadMore();
  }
});
