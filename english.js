//fetching the lessons from url
const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

// id: 101
// lessonName: "Basic Vocabulary"
// level_no: 1

// adding the lessons in UI
const displayLesson = (lessons) => {
  const lessonContainer = document.getElementById("lesson-dom");
  lessonContainer.innerHTML = "";
  for (const lesson of lessons) {
    const lessonBtn = document.createElement("div");
    lessonBtn.innerHTML = `
    <button id= "lesson-btn-${lesson.level_no}" onClick= "lessonWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"
            ><i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no} </button
          >
    `;
    lessonContainer.append(lessonBtn);
  }
};

loadLessons();

//remove activation function
const removeActive = () => {
  const lessonBtns = document.querySelectorAll(".lesson-btn");
  lessonBtns.forEach((btn) => btn.classList.remove("active"));
};

// fetching lessons words from url

const lessonWord = (id) => {
  manageSpinner(true);
  //active the lesson-btn and remove activation
  removeActive();
  const clickBtn = document.getElementById(`lesson-btn-${id}`);
  clickBtn.classList.add("active");
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLessonWord(data.data));
};

// id: 98​​​
// level: 2
// meaning: "লাফানো"
// pronunciation: "জাম্প" ​​​
// word: "Jump"

// adding the words in UI

const displayLessonWord = (words) => {
  const wordContainer = document.getElementById("word-dom");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div
            class="text-center col-span-full rounded-xl py-10 space-y-6 bangla-font"
          >
            <img class="mx-auto" src="assets/alert-error.png" alt="" />
            <p class="text-xl font-medium text-gray-400">
              এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
            </p>
            <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
          </div>
    `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
            <h1 class="font-bold text-2xl">
                ${word.word ? word.word : "শব্দ পাওয়া যায়নি"}
            </h1>
            <p class="font-semibold"> Meaning /Pronounciation</p>
            <div class="text-2xl font-medium bangla-font">
                "${word.meaning ? word.meaning : "পাওয়া যায়নি"} / ${
      word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"
    }"
            </div>
            <div class="flex justify-between">
              <button class="bg-slate-200 p-3 rounded-lg" onclick="wordDetails(${
                word.id
              })">
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button class="bg-slate-200 p-3 rounded-lg " onclick="pronounceWord('${
                word.word
              }')">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
    `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};

//pronounce function for words
function pronounceWord(word) {
  console.log(word);
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// fetching the word details from url

const wordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
  <div>
            <h1 class="text-2xl font-bold">${
              word.word
            } (<i class="fa-solid fa-microphone-lines"></i>:${
    word.pronunciation
  })</h1>
          </div>
          <div>
            <h1 class="font-bold">Meaning</h1>
            <p>${word.meaning}</p>
          </div>
          <div>
            <h1 class="font-bold">Example</h1>
            <p>${word.sentence}</p>
          </div>
          <div>
            <h1>সমার্থক শব্দ গুলো</h1>
             <div class= "space-x-2">
              ${createElements(word.synonyms)}
             </div>
          </div>
  `;
  document.getElementById("word_modal").showModal();
};

//function for synonyms

const createElements = (arr) => {
  const htmlElemnents = arr.map((el) => `<span class= "btn">${el}</span>`);
  return htmlElemnents.join("");
};
// word	"Benevolent"
// meaning	"দয়ালু"
// pronunciation	"বেনেভোলেন্ট"
// level	6
// sentence	"The benevolent man donated food to the poor."
// points	4
// partsOfSpeech	"adjective"
// synonyms
// 0	"kind"
// 1	"generous"
// 2	"compassionate"
// id

//spinner function

const manageSpinner = (status, time = 2000) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-dom").classList.add("hidden");
    setTimeout(() => {
      document.getElementById("spinner").classList.add("hidden");
      document.getElementById("word-dom").classList.remove("hidden");
    }, 2000);
  }
};

// search function for vocabulary

document.getElementById("btn-search").addEventListener("click", () => {
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLessonWord(filterWords);
    });
});
