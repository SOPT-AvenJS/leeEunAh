const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const chanceP = $('.chance');
const guessP = $('.guess');
const wordDiv = $('.word');

let quizWord = ''; // 가져오는 정답 단어
let wordList = ''; // 소문자로 바꾼 리스트
let tempWord = ''; // 정답 체크용 문자열
let guessList = []; // 사용자가 눌렀던 단어 리스트
let count = 0;

window.addEventListener('keydown', guessWord);

async function getQuizWord() {
  const word = await fetch('https://puzzle.mead.io/puzzle?wordCount=1')
    .then((response) => response.json())
    .then((data) => data.puzzle)
    .catch((error) => console.log('요청 실패 : ', error));

  quizWord = word;
  wordList = quizWord.toLowerCase().split('');
  tempWord = quizWord.toLowerCase();
  guessList = [];
  count = quizWord.length + 3;
}

function guessWord(e) {
  const guessAns = e.key;
  guessList.push(guessAns);

  if (wordList.includes(guessAns.toLowerCase())) {
    while (tempWord.indexOf(guessAns.toLowerCase()) != -1) {
      const idx = tempWord.indexOf(guessAns.toLowerCase());

      const wordLi = $$('.word__content');
      wordLi[idx].innerHTML = `${guessAns.toLowerCase()}`;

      const tempList = tempWord.split('');
      tempList[idx] = '*';
      tempWord = tempList.join('');
    }

    if (tempWord === '*'.repeat(quizWord.length)) {
      showModal('YOU WIN');
    }
  } else {
    count--;
    chanceP.innerHTML = `Chance : ${count}`;

    if (count == 0) {
      showModal(`Answer: ${quizWord}`);
    }
  }
  guessP.innerHTML = `You guess : ${guessList.join(', ')}`;
}

function showModal(sentence) {
  const modal = $('.modal');
  const modalBody = $('p.modal__body');

  modalBody.innerHTML = sentence;
  modal.classList.remove('hide');

  setTimeout(function () {
    modal.classList.add('hide');
    setGame();
  }, 3000);
}

function resetGame() {
  const button = $('.reset');
  button.addEventListener('click', setGame);
}

async function setGame() {
  await getQuizWord();

  while (wordDiv.hasChildNodes()) {
    wordDiv.removeChild(wordDiv.firstChild);
  }

  for (let i = 0; i < wordList.length; i++) {
    const li = document.createElement('li');
    li.className = 'word__content';
    li.innerHTML = '*';
    wordDiv.appendChild(li);
  }

  chanceP.innerHTML = `Chance : ${count}`;
  guessP.innerHTML = `You guess :`;
}

setGame();
resetGame();
