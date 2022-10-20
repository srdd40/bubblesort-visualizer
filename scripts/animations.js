let tl_Navigation = gsap.timeline();

//Animation of Navigation and h1
tl_Navigation
  .to(".navItem", {
    y: 0,
    opacity: 1,
    rotationX: 360,
    stagger: 0.3,
    duration: 1.5,
  })
  .from("#headerText", {
    opacity: 0,
    duration: 3,
  });

//Random Bubble Movement at of the 3 bubbles at "Lernen"
gsap.to(".section", {
  duration: 6,
  stagger: 0.1,
  y: "random(-20,100, 5)",
  x: "random(-40, 40, 5)",
  repeat: -1,
  repeatRefresh: true,
  ease: "sine.inOut",
});
