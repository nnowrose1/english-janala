// console.log('JS file connected');

const manageSpinner = (status) =>{
    if(status == true){
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
    }
}

// Loading and displaying the lessons
const loadLessons = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(response => response.json())
    .then(data => {
        // console.log(data.data);
        displayLessons(data.data);
    })
}
const displayLessons = (lessons) =>{
    //   console.log(lessons);
            // 1. get the parent
        const lessonContainer = document.getElementById("lesson-container");
        lessonContainer.innerHTML = " ";
    lessons.forEach(lesson => {
        // console.log(lesson);
        // 2. create an element
        const div = document.createElement("div");
        div.innerHTML =` <div>
        <button id="active-button-${lesson.level_no}" onclick = "loadWordsOfLevels(${lesson.level_no})" class="btn bg-white lesson-btn border-[#422AD5] text-[#422AD5] font-semibold"><i class="fa-brands fa-leanpub"></i> Lesson - ${lesson.level_no}</button>
                </div>
        `;
        // append the child
        lessonContainer.appendChild(div);
    }) 
}
loadLessons();

// Loading and Displaying word of each lesson
const loadWordsOfLevels = (id) =>{
    // console.log(id);
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(response => response.json())
    .then(data =>{
        // Making the active button
        const lessonButtons = document.getElementsByClassName("lesson-btn");
        // console.log(lessonButtons);
        for(const lessonButton of lessonButtons){
            lessonButton.classList.remove("active");
        }
        const activeButton = document.getElementById(`active-button-${id}`);
        // console.log(activeButton);
        activeButton.classList.add("active");

        displayLevelWords(data.data); 
        
    })
}
const displayLevelWords = (words) =>{
    //  console.log(words);
     const wordContainer = document.getElementById('word-container');
       wordContainer.innerHTML = " ";
       const emptyLessonContainer=document.getElementById("empty-lesson");
        emptyLessonContainer.innerHTML=" ";
        // If no word in a a lesson
      if(words.length === 0){
        const div = document.createElement("div");
        div.innerHTML = `
                    <div class="bg-gray-200 rounded-3xl h-auto text-center py-16">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="text-[#79716B] my-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <p class="font-medium text-4xl text-[#292524]">নেক্সট Lesson এ যান</p>
            </div>
        `;
        emptyLessonContainer.appendChild(div);
        manageSpinner(false);
        return;
    }
//    Showing each word of a lesson
    words.forEach(word => {
        // console.log(word);
        
        const wordCard = document.createElement("div");

        wordCard.innerHTML = `            
        <div class="bg-white rounded-lg text-center m-7">
         <div class="py-14 px-36 flex flex-col items-center justify-center">
                <p class="font-bold text-3xl text-[#000000]">${word.word ? word.word : "Unavailable"}</p>
                <p class="font-medium text-xl text-[#000000] my-6">Meaning/Pronunciation</p>
                <p class="font-bangla mb-14 font-semibold text-3xl text-[#18181B] whitespace-nowrap">"${word.meaning ? word.meaning : "Unavailable" }" /${word.pronunciation ? word.pronunciation: "Unavailable"}"</p>
                </div>
                <div class="flex items-center justify-between px-14 pb-14">
                    <button onclick ="loadWordDetail(${word.id})" class="w-10 h-10 bg-[#1A91FF10] flex items-center justify-center rounded-md"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="w-10 h-10 bg-[#1A91FF10] flex items-center justify-center rounded-md"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `
        wordContainer.appendChild(wordCard);
        manageSpinner(false);
    })
}

// load and Show details of a word
const loadWordDetail = (id) =>{
   fetch(`https://openapi.programming-hero.com/api/word/${id}`)
   .then(response => response.json())
   .then(data =>{
    showWordDetail(data.data);
   })
}
const showWordDetail = (word) => {
// console.log(word);
// "data": {
// "word": "Diligent",
// "meaning": "পরিশ্রমী",
// "pronunciation": "ডিলিজেন্ট",
// "level": 5,
// "sentence": "He is a diligent student who studies every day.",
// "points": 5,
// "partsOfSpeech": "adjective",
// "synonyms": [
// "hardworking",
// "industrious",
// "persistent"
// ],
const modalContainer = document.getElementById("modal-container");
modalContainer.innerHTML =`
<h2 class="font-semibold text-4xl text-[#000000]">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
  <p class="font-semibold text-2xl text-[#000000] mt-8 mb-2.5">Meaning</p>
  <p class="font-bangla font-medium text-2xl text-[#000000]">${word.meaning}</p>
  <p class="text-[#000000] font-semibold text-2xl mt-8 mb-2">Example</p>
  <p class="text-[#000000] text-2xl">${word.sentence}</p>
  <p class="mt-8 mb-2.5 font-bangla font-medium text-2xl text-[#000000]">সমার্থক শব্দ গুলো</p>
  <div class="flex gap-3">
  <span class="btn bg-[#BADEFF36] border-none shadow-md text-[#00000090] font-semibold">${word.synonyms[0] ? word.synonyms[0] : "Unavailable" }</span>
  <span class="btn bg-[#BADEFF36] border-none shadow-md text-[#00000090] font-semibold">${word.synonyms[1] ? word.synonyms[1] : "Unavailable" }</span>
  <span class="btn bg-[#BADEFF36] border-none shadow-md text-[#00000090] font-semibold">${word.synonyms[2] ? word.synonyms[2] : "Unavailable" }</span>
  </div>
   <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn bg-[#422AD5] text-white font-semibold relative right-[90%]">Complete Learning</button>
      </form>
    </div>
`;
document.getElementById("my_modal_5").showModal();
}

// Search
document.getElementById("search").addEventListener("click", () =>{
    const input = document.getElementById("input").value.trim().toLowerCase();
    console.log(input);

    // fetching all words
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(response => response.json())
    .then(data =>{
       const dataValues = data.data;
       console.log(dataValues);
       const matchingWords = dataValues.filter(dataValue => dataValue.word.toLowerCase().includes(input));
       displayLevelWords(matchingWords); 
    })
     document.getElementById("input").value = " ";
    
})