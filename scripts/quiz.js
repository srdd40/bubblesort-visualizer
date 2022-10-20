const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answerText"));
const questionCounterText = document.getElementById("counter");
const scoreText = document.getElementById("score");

//Modal Buttons
const restart = document.getElementById("restart");
const close = document.getElementById("close");
let questionCounter;
let score;

//Change amount of questions up to number of questions provided in quiz.json
//Beware: Adjustments to "motivational" text at end of game modal must be made! (Lines 143 - 151)
//Default: 8 Questions
const MAX_QUESTIONS = 8;

let changeQuestionAnim = gsap.timeline();

//True: Click on answer gets registered, false: Click doesn't get registered
let acceptingAnswers;

//Main function
let startGame = () => {
  questionCounter = 0;
  score = 0;
  acceptingAnswers = true;
  console.log(questions);

  availableQuestions = getRandomQuestions(questions, MAX_QUESTIONS);
  console.log(availableQuestions);

  getNewQuestion();
};

//Loads questions from quiz.json file
let loadQuestions = () => {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "scripts/quiz.json", false);

  xhr.send();

  xhr.onLoad = () => {
    if (this.status == 200) {
      //console.log(this.response);
    } else {
      console.log("Something went wrong while loading questions");
    }
  };

  return xhr.response;
};

console.log(loadQuestions);

//All the questions from quiz.json
let questions = JSON.parse(loadQuestions());

//Randomization of question order
const getRandomQuestions = (arr, num) => {
  let len = arr.length;

  if (num > len) {
    throw new RangeError(
      "getRandomQuestions: more elements taken, than available!"
    );
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return (selected = shuffled.slice(0, num));
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    displayResults();
    return;
  }

  questionCounter++;

  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  currentQuestion = availableQuestions[0];
  console.log(currentQuestion);

  question.innerText = currentQuestion.question;

  console.log(answers);

  answers.forEach((answer) => {
    answer.innerText = currentQuestion[answer.dataset["answer"]];
  });

  //Checks weather the selected answer is correct or incorrect
  //colors the clicked answer green if correct or orange if incorrect
  answers.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      if (!acceptingAnswers) {
        return;
      }

      acceptingAnswers = false;

      const clickedAnswer = e.target;

      const answeredLetter = clickedAnswer.dataset["answer"];

      let classToApply = "incorrect";

      if (answeredLetter === currentQuestion.answer) {
        score++;
        scoreText.innerText = score;
        classToApply = "correct";
      }

      clickedAnswer.parentElement.classList.add(classToApply);
      setTimeout(() => {
        clickedAnswer.parentElement.classList.remove(classToApply);
        getNewQuestion();

        acceptingAnswers = true;
      }, 2000);
      changeQuestionAnim
        .to(".answerText", {
          autoAlpha: 0,
          duration: 2,
          rotationX: "+=180",
        })
        .to(".answerText", {
          autoAlpha: 1,
          rotationX: "+=180",
        });
    });
  });
  availableQuestions.shift();
};

//Modal at end of game
let displayResults = () => {
  const modal = new mdb.Modal(endGameModal);
  const modalBody = document.getElementById("modalBody");
  if (score < 4) {
    modalBody.innerText = `Richtig beantwortet: ${score} von ${MAX_QUESTIONS} Fragen. \n \n Ohje, das war wohl nichts. Lies dir unter "Lernen" am besten in Ruhe die Erklärungen durch. Beim nächsten Versuch läuft es dann bestimmt besser!`;
  } else if (score >= 4 && score <= 5) {
    modalBody.innerText = `Richtig beantwortet: ${score} von ${MAX_QUESTIONS} Fragen. \n \n Vielleicht solltest du dir die Erklärungen noch einmal durchlesen und dir im Visualizer anschauen, wie der Bubble Sort Algorithmus abläuft. In der nächsten Runde hast du es dann sicher voll drauf!`;
  } else if (score >= 6 && score <= 7) {
    modalBody.innerText = `Richtig beantwortet: ${score} von ${MAX_QUESTIONS} Fragen. \n \n Gar nicht schlecht. Lies das was du noch nicht verstanden hast nochmal nach und probier es dann nochmal :)`;
  } else {
    modalBody.innerText = `Richtig beantwortet: ${score} von ${MAX_QUESTIONS} Fragen. \n  \nWow! Ein super Ergebnis! Den Bubble Sort hast du definitiv verstanden. Herzlichen Glückwunsch :)`;
  }
  modal.show();
  gsap.fromTo(
    ".modal",
    {
      scale: 0,
    },
    {
      scale: 1,
      transformOrigin: "center",
      duration: 1.5,
      ease: "sine.inOut",
    }
  );
  acceptingAnswers = false;
};

//Modal Close Button
let closeButton = () => {
  acceptingAnswers = false;
  score = 0;
  scoreText.innerText = score;
};

//Modal Restart Button
let restartGame = () => {
  score = 0;
  scoreText.innerText = score;
  startGame();
};

restart.addEventListener("click", restartGame);

close.addEventListener("click", closeButton);

startGame();
