import pic1 from './assets/멀쩡.png';
import pic2 from './assets/오른발.png';
import pic3 from './assets/오른다리.png';
import pic4 from './assets/왼발.png';
import pic5 from './assets/왼다리.png';
import pic6 from './assets/오른손.png';
import pic7 from './assets/오른팔.png';
import pic8 from './assets/왼손.png';
import pic9 from './assets/왼팔.png';
import pic10 from './assets/몸.png';
import pic11 from './assets/목.png';
import pic12 from './assets/머리.png';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const chanceP = $('.chance');
const guessP = $('.guess');
const wordDiv = $('.word');
const image = $('.kingman');
const modal = $('.modal');

let quizWord = ''; // 가져오는 정답 단어
let checkWord = ''; // 정답 체크용 문자열
let guessWordList = []; // 사용자가 눌렀던 단어 리스트
let count = 0; // 단어 + 3 횟수
let imageCount = 0; // 이미지 횟수

const imageList = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10, pic11, pic12];

window.addEventListener('keydown', guessWord);

async function requestWord() {
  const word = await fetch('https://puzzle.mead.io/puzzle?wordCount=1')
    .then((response) => response.json())
    .then((data) => data.puzzle)
    .catch((error) => console.log('요청 실패 : ', error));
  return word.toLowerCase();
}

async function getQuizWord() {
  showModal('Choosing a Quiz...', true);
  let word = await requestWord();
  while (word.length != 8) {
    word = await requestWord();
  }
  modal.classList.add('hide');

  quizWord = word;
  checkWord = word;
  guessWordList = [];
  count = quizWord.length + 3;
  imageCount = 0;
  return word;
}

function guessWord(e) {
  const guessAns = e.key;
  guessWordList.push(guessAns);

  if (quizWord.split('').includes(guessAns.toLowerCase())) {
    while (checkWord.indexOf(guessAns.toLowerCase()) !== -1) {
      const idx = checkWord.indexOf(guessAns.toLowerCase());

      const wordLi = $$('.word__content');
      wordLi[idx].innerHTML = `${guessAns.toLowerCase()}`;

      const tempList = checkWord.split('');
      tempList[idx] = '*';
      checkWord = tempList.join('');
    }

    if (checkWord === '*'.repeat(quizWord.length)) {
      showModal('YOU WIN');
    }
  } else {
    count--;
    imageCount++;
    chanceP.innerHTML = `Chance : ${count}`;
    showImg();

    if (count == 0) {
      showModal(`Answer: ${quizWord}`);
    }
  }
  guessP.innerHTML = `You guess : ${guessWordList.join(', ')}`;
}

function showModal(sentence, loading = false) {
  const modalBody = $('p.modal__body');

  modalBody.innerHTML = sentence;
  modal.classList.remove('hide');

  if (!loading) {
    setTimeout(function () {
      modal.classList.add('hide');
      setGame();
    }, 3000);
  }
}

function resetGame() {
  const button = $('.reset');
  button.addEventListener('click', setGame);
}

function showImg() {
  image.src = imageList[imageCount];
}

async function setGame() {
  await getQuizWord();

  while (wordDiv.hasChildNodes()) {
    wordDiv.removeChild(wordDiv.firstChild);
  }

  for (let i = 0; i < quizWord.split('').length; i++) {
    const li = document.createElement('li');
    li.className = 'word__content';
    li.innerHTML = '*';
    wordDiv.appendChild(li);
  }

  chanceP.innerHTML = `Chance : ${count}`;
  guessP.innerHTML = `You guess :`;
  showImg();
}

window.onload = () => {
  setGame();
  resetGame();
};
