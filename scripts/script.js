//Shows or hides paragraphs with more information
let toggleDisplay = (elementId, btnId) => {
  let el = document.getElementById(elementId);
  let btn = document.getElementById(btnId);

  const closeBtnContainer = document.createElement("div");
  const closeButton = document.createElement("button");

  if (el.style.display === "none" || el.style.display === "") {
    el.style.display = "block";
    el.style.zIndex = 1;
    btn.classList.remove("fa-chevron-down");
    btn.classList.add("fa-chevron-up");

    //Create Button to close the overlay
    closeButton.innerText = "X";
    closeButton.setAttribute("id", "closeButton");
    closeBtnContainer.classList.add("closeBtnContainer");
    el.appendChild(closeBtnContainer);

    closeBtnContainer.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
      closeButton.remove();
      el.style.display = "none";
      btn.classList.remove("fa-chevron-up");
      btn.classList.add("fa-chevron-down");
    });

    gsap.from("#algo, #allgemein, #vorgehen, #komplex", {
      opacity: 0,
      y: -200,
      duration: 1,
    });
  } else {
    gsap.to("#algo, #allgemein, #vorgehen, #komplex", {
      opacity: 0,
      y: -200,
      duration: 1,
    });
    el.style.display = "none";
    btn.classList.remove("fa-chevron-up");
    btn.classList.add("fa-chevron-down");
  }
};

//Changes Navigation to a burger menu if display width is small
let burgerMenu = () => {
  let x = document.getElementById("navUl");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
};
