let btnPlay = document.getElementById("btnPlay");
let btnPause = document.getElementById("btnPause");
let btnNext = document.getElementById("btnNext");
let btnCreate = document.getElementById("createArrayBtn");

const ARRAY_LENGTH = 5;
const MAX_VALUE = 50;

let randomArray = [];
let range = document.getElementById("barContainer");

let barIndex = 0;
let lastIndex = ARRAY_LENGTH - 2;
let listBar,
  thisBar,
  nextBar = null;

let recipe = document.querySelector(".recipe");
let sortDescriptionContainer = document.getElementById("recipeContainer");
sortDescriptionContainer.innerText = "";
let node = document.createElement("DIV");

let sortDescription = document.createTextNode("");

let speed = document.getElementById("myRange").value;

let tlAnimationStart = gsap.timeline();
let tlAnimationDecide = gsap.timeline();

let createRandomArray = () => {
  for (let i = 0; i < ARRAY_LENGTH; i++) {
    //Creates array with random numbers between 1 and 100
    randomArray.push(Math.floor(Math.random() * MAX_VALUE) + 1);

    //Creates moving bubbles
    let bubble = document.createElement("div");
    bubble.setAttribute("data-value", randomArray[i]);
    let bubbleValue = bubble.getAttribute("data-value");
    if (bubbleValue <= 10) {
      bubble.style.transform = "scale(1,1)";
    } else if (bubbleValue <= 20) {
      bubble.style.transform = "scale(1.2,1.2)";
    } else if (bubbleValue <= 30) {
      bubble.style.transform = "scale(1.3,1.3)";
    } else if (bubbleValue <= 40) {
      bubble.style.transform = "scale(1.4,1.4)";
    } else {
      bubble.style.transform = "scale(1.5,1.5)";
    }

    bubble.innerText = bubbleValue;
    bubble.setAttribute("class", "bar");

    range.appendChild(bubble);

    sortDescriptionContainer.appendChild(node);
    node.appendChild(sortDescription);

    //Random Up and Down Movement of the bubbles in visualizer
    gsap.to(".bar", {
      duration: 6,
      y: "random(-20, 0)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
  gsap.to(".bar", {
    opacity: 1,
    stagger: 0.4,
    ease: "sine.inOut",
  });
};

//Sorting animation
let decide = () => {
  listBar = document.getElementsByClassName("bar");
  thisBar = listBar[barIndex];
  nextBar = listBar[barIndex + 1];

  tlAnimationDecide
    .to(thisBar, { className: "bar bar_hlgt" })
    .to(nextBar, { className: "bar bar_hlgt" }, "<");

  if (lastIndex < 0) {
    gsap.from(".bar", {
      backgroundColor: "#83c5be",
      borderColor: "#0B397B",
      duration: 2,
      stagger: 0.5,
    });
    sortDescriptionContainer.innerText = `Fertig sortiert!`;
    tlAnimationDecide.kill();
  } else {
    if (barIndex < lastIndex) {
      barIndex++;
    } else {
      barIndex = 0;
      lastIndex--;
    }
  }

  if (parseInt(thisBar.dataset.value) > parseInt(nextBar.dataset.value)) {
    tlAnimationDecide
      .to(thisBar, {
        className: "bar bar_high",
        duration: 1,
      })
      .to(nextBar, { className: "bar bar_low", duration: 1 }, "<")
      .to(thisBar, {
        opacity: 0,
        x: 20,
        transformOrigin: "center center",
        duration: 1,
        ease: "sine.inOut",
      })
      .to(
        nextBar,
        {
          opacity: 0,
          x: -20,
          transformOrigin: "center center",
          duration: 1,
          ease: "sine.inOut",
        },
        "<"
      )
      .call(swapBubbles, [thisBar, nextBar])
      .to(thisBar, {
        opacity: 1,
        x: 0,
        transformOrigin: "center center",
        duration: 1,
        ease: "sine.inOut",
      })
      .to(
        nextBar,
        {
          opacity: 1,
          x: 0,
          transformOrigin: "center center",
          duration: 1,
          ease: "sine.inOut",
        },
        "<"
      )
      .to(thisBar, { className: "bar" })
      .to(nextBar, { className: "bar" }, "<");
  } else {
    sortDescriptionContainer.innerText = `${thisBar.innerText} < ${nextBar.innerText} -> Kein Tausch`;
    console.log("kein Tausch");
    tlAnimationDecide
      .to(thisBar, { className: "bar bar_low", duration: 1 })
      .to(nextBar, { className: "bar bar_high", duration: 1 }, "<")
      .to(thisBar, { className: "bar" })
      .to(nextBar, { className: "bar" }, "<");
    if (lastIndex < 0) {
      sortDescriptionContainer.innerText = `Fertig sortiert!`;
      btnCreate.disabled = false;
      btnNext.disabled = false;
      btnPlay.style.backgroundColor = "#C6E0FB";
      btnPlay.style.color = "#0B397B";
      btnPause.style.backgroundColor = "#C6E0FB";
      btnPause.style.color = "#0B397B";
      btnPlay.style.cursor = "pointer";
      btnPause.style.cursor = "pointer";
    }
  }
};

//Swaps bubbles in sorting animation
let swapBubbles = (bubble1, bubble2) => {
  console.log("Tauschen");
  sortDescriptionContainer.innerHTML = `${thisBar.innerText} > ${nextBar.innerText} -> Tauschen`;
  const parent = bubble1.parentNode;
  const oldBubble = parent.removeChild(bubble1);
  bubble2.after(oldBubble);
};

//Deletes all bubbles (array items), calls "createRandomArray" to create new array
let resetArray = () => {
  btnPlay.style.display = "block";
  randomArray = [];
  barIndex = 0;
  lastIndex = ARRAY_LENGTH - 2;
  listBar = null;
  thisBar = null;
  nextBar = null;
  let barContainer = document.getElementById("barContainer");
  while (barContainer.hasChildNodes()) {
    barContainer.removeChild(barContainer.lastChild);
  }
  sortDescriptionContainer.innerText = "Unsortierte Reihe";
  createRandomArray();

  speed = 1;
};

//Plays sorting animation step by step
let nextStep = () => {
  tlAnimationDecide.clear();
  btnPlay.style.backgroundColor = "gray";
  btnPlay.style.color = "lightgrey";
  btnPause.style.backgroundColor = "gray";
  btnPause.style.color = "lightgrey";
  btnPlay.style.cursor = "not-allowed";
  btnPause.style.cursor = "not-allowed";
  btnCreate.disabled = true;

  if (!tlAnimationDecide.isActive()) {
    decide();
  }
};

//Sorting animation from start to end
let play = () => {
  if (!tlAnimationStart.isActive()) {
    tlAnimationDecide.eventCallback("onComplete", decide).timeScale(1);
    decide();
    document.getElementById("btnPlay").disabled = true;
    btnNext.disabled = true;

    btnPlay.style.display = "none";
    btnCreate.disabled = true;
  }
};

//Pause sorting animation
let pause = () => {
  tlAnimationDecide.paused(!tlAnimationDecide.paused());

  if (tlAnimationDecide.paused()) {
    btnPause.classList.remove("fa-pause");
    btnPause.classList.add("fa-play");
  } else if (!tlAnimationDecide.paused()) {
    btnPause.classList.remove("fa-play");
    btnPause.classList.add("fa-pause");
  }
};

//Adjust speed of sorting animation
let changeSpeed = (val) => {
  if (tlAnimationDecide.isActive()) {
    tlAnimationDecide.timeScale(val);
    console.log(speed);
  }
};

let tl_visualizer = gsap.timeline();

//Animates the sections of the visualizer
tl_visualizer
  .from(".menu", {
    x: -500,
    duration: 1,
    opacity: 0,
    ease: "sine.inOut",
  })
  .from("#recipeContainer", {
    x: 2300,
    duration: 1,
    ease: "sine.inOut",
  })
  .from("#barContainer", {
    x: 2300,
    duration: 1,
    ease: "sine.inOut",
  })
  .from(".menuItem", {
    opacity: 0,
    stagger: 0.4,
    duration: 2.4,
    ease: "sine.inOut",
  });
