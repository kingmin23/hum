// 시계
const clockEl = document.getElementById("clock");
function updateTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  clockEl.textContent = `${hh}:${mm}`;
}
updateTime();
setInterval(updateTime, 60000);

// 날짜
const dateEl = document.getElementById("date");
function updateDate() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  dateEl.textContent = `${year}.${month}.${day}`;
}
updateDate();

updateDate();
setInterval(updateDate, 60000);

// 배너 랜덤 이미지
const banner = document.getElementById("banner");
const imgs = [
  //"이미지 주소 경로" - 저작권 문제
  /*"https://i.pinimg.com/1200x/6b/58/76/6b58761bdc1e7415900de1612cfe04ec.jpg",
  "https://i.pinimg.com/736x/7c/73/95/7c7395b7b76d01ad40efba8d92e6ae99.jpg",
  "https://i.pinimg.com/736x/c2/fb/86/c2fb86b80dca262cb71baf6ab2184cde.jpg",
  "https://i.pinimg.com/736x/bc/24/93/bc2493939b79445346fa427634efa773.jpg",
  "https://i.pinimg.com/736x/26/ab/ee/26abee0f00471e17664aa231aadc83f5.jpg",
  "https://i.pinimg.com/736x/81/d7/22/81d722d68b0f7e98d55b13c3ef4d2e9d.jpg",*/
];
const img = new Image();
img.src = imgs[Math.floor(Math.random() * imgs.length)];
img.alt = "banner";
img.onload = () => {
  banner.innerHTML = "";
  img.style.width = "96%";
  img.style.height = "96%";
  img.style.objectFit = "cover";
  banner.appendChild(img);
};

// 명언 랜덤
const qEl = document.getElementById("quote");
const quotes = [
  "小さなことに心を尽くす人は、やがて大きな世界を持つ。",
  "꽃은 스스로 피어나지 않는다. 정성으로 피운다.",
  "落ち着いて、息をして。今日も一歩。",
  "피어나지 않아도, 존재만으로 아름답다.",
  "하루를 가꾸면 인생이 꽃핀다.",
];
qEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];

// 섹션 전환
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
}

// 게시판 기능
const STORAGE_KEY = "flower_posts";
const postList = document.getElementById("postList");

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  postList.innerHTML = "";
  posts.forEach((text, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${text}</span>
      <button onclick="editPost(${i})">수정</button>
      <button onclick="deletePost(${i})">삭제</button>
    `;
    postList.appendChild(li);
  });
}

function savePost() {
  const input = document.getElementById("postInput");
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (input.value.trim()) {
    posts.push(input.value.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    input.value = "";
    loadPosts();
  }
}

function deletePost(i) {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  posts.splice(i, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  loadPosts();
}

function editPost(i) {
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const newText = prompt("새 내용:", posts[i]);
  if (newText !== null) {
    posts[i] = newText;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    loadPosts();
  }
}

loadPosts();

function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.remove("active");
  });
  const section = document.getElementById(id);
  if (section) section.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // 달력 생성
  const calendar = document.getElementById("calendar");
  const daysInMonth = 30;

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.innerText = i;
    day.dataset.day = i;
    calendar.appendChild(day);
  }

  let hue = 120; // 기준 색상!!완전 중요
  let selectedDay = null;
  let selectedColor = `hsl(${hue}, 70%, 70%)`;

  const colorBar = document.getElementById("colorBar");
  const colorModal = document.getElementById("colorModal");
  const applyColor = document.getElementById("applyColor");

  // 그라데이션 바 업데이트
  function updateColorBar() {
    colorBar.style.background = `
      linear-gradient(
        to right,
        hsl(${hue}, 70%, 95%),
        hsl(${hue}, 70%, 80%),
        hsl(${hue}, 70%, 65%),
        hsl(${hue}, 70%, 50%),
        hsl(${hue}, 70%, 40%)
      )
    `;
  }
  updateColorBar();

  // 저장된 색 불러오기
  const savedColors = JSON.parse(localStorage.getItem("diaryColors") || "{}");
  for (const [day, color] of Object.entries(savedColors)) {
    const dayEl = document.querySelector(`[data-day='${day}']`);
    if (dayEl) dayEl.style.background = color;
  }

  // 날짜 클릭 → 색 선택창
  calendar.addEventListener("click", (e) => {
    if (e.target.dataset.day) {
      selectedDay = e.target;
      colorModal.classList.remove("hidden");
    }
  });

  // 색 바 클릭 → 밝기(lightness) 조절
  colorBar.addEventListener("click", (e) => {
    const rect = colorBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const lightness = 95 - percent * 55;
    selectedColor = `hsl(${hue}, 70%, ${lightness}%)`;
    colorBar.style.setProperty("--pointer", `${percent * 100}%`);
  });

  // 색 적용 + 저장
  applyColor.addEventListener("click", () => {
    if (selectedDay) {
      selectedDay.style.background = selectedColor;
      savedColors[selectedDay.dataset.day] = selectedColor;
      localStorage.setItem("diaryColors", JSON.stringify(savedColors));
    }
    colorModal.classList.add("hidden");
  });

  // 전체 초기화 버튼
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "모두 초기화";
  clearBtn.style.display = "block";
  clearBtn.style.margin = "10px auto";
  clearBtn.addEventListener("click", () => {
    calendar
      .querySelectorAll("div")
      .forEach((day) => (day.style.background = ""));
    localStorage.removeItem("diaryColors");
  });
  calendar.parentNode.appendChild(clearBtn);

  // hue 변경
  window.setHue = (newHue) => {
    hue = newHue;
    updateColorBar();
    selectedColor = `hsl(${hue}, 70%, 70%)`;
  };
});

//----study diary S----//
