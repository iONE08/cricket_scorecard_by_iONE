const runsButton = document.querySelectorAll(".runs-button");
const runsSpan = document.querySelector(".runs");
const ballsBowledDisplay = document.querySelector(".balls-bowled");
const specialBallsButton = document.querySelectorAll(".special-delivery");
const wicketsSpan = document.querySelector(".wickets");
const timelineDisplay = document.querySelector(".timeline");
const delPrevBallButton = document.querySelector(".delete-ball-button");
const resetButton = document.querySelector(".reset-button");
const screenshotButton = document.querySelector(".screenshot-button");


let allRuns = [];
let run;
let totalRuns = 0;
let totalWickets = 0;
let totalBallsBowled = 0;
let timelineArray = [];
let noBallPlusRuns;
let wicketPlusRuns;


function updateTextContent(updateOf, updateWith) {
  updateOf.textContent = updateWith;
}


// * sessionStorage.
function loadState() {
  const savedState = JSON.parse(sessionStorage.getItem("cricketGameState"));
  if (savedState) {
    allRuns = savedState.allRuns || [];
    totalRuns = savedState.totalRuns || 0;
    totalWickets = savedState.totalWickets || 0;
    totalBallsBowled = savedState.totalBallsBowled || 0;
    timelineArray = savedState.timelineArray || [];
    updateTextContent(runsSpan, totalRuns);
    updateTextContent(wicketsSpan, totalWickets);
    updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);
    updateTextContent(timelineDisplay, `Timeline: ${timelineArray}`);
  }
}
function saveState() {
  const state = {
    allRuns,
    totalRuns,
    totalWickets,
    totalBallsBowled,
    timelineArray,
  };
  sessionStorage.setItem("cricketGameState", JSON.stringify(state));
}

loadState();
// *


// * Balls bowled.
function ballsBowledIncrement() {
  totalBallsBowled++;
  updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);
}
// *


// * Timeline.
function updateTimeline(event) {
  timelineArray.push(event);
  updateTextContent(timelineDisplay, `Timeline: ${timelineArray}`);
  saveState();
}
// *


// * Runs (legal deliveries).
function addRuns(event) {
  run = Number(event.target.textContent);
  allRuns.push(run);
  updateTimeline(run);

  let reversedAllRuns = allRuns.reverse();
  totalRuns += reversedAllRuns[0];
  reversedAllRuns.reverse();

  updateTextContent(runsSpan, totalRuns);
  ballsBowledIncrement();
  saveState();
}

runsButton.forEach((button) => {
  button.addEventListener("click", addRuns);
});
// *


// * Special deliveries.
function specialBalls(event) {
  if (event.target.textContent === "Wd") {
    totalRuns++;

    updateTimeline("Wd");
  } else if (event.target.textContent === "Nb+") {
    noBallPlusRuns = prompt(
      "How many runs did the BATSMAN score off the NO-BALL?",
      0
    );
    totalRuns += Number(noBallPlusRuns) + 1;

    let wicketCheckOnNoBall = confirm(
      "Was there a WICKET on NO-BALL? \nOK --> yes \nCANCEL --> no"
    );
    if (wicketCheckOnNoBall) {
      totalWickets++;
      ballsBowledIncrement();
      updateTimeline(`Nb+W+${noBallPlusRuns}`);
    } else {
      updateTimeline(`Nb+${noBallPlusRuns}`);
    }
  } else if (event.target.textContent === "W+") {
    totalWickets++;

    ballsBowledIncrement();

    wicketPlusRuns = prompt(
      "How many runs did the BATSMAN score BEFORE getting OUT?",
      0
    );
    totalRuns += Number(wicketPlusRuns);

    updateTimeline(`W+${wicketPlusRuns}`);
  }

  updateTextContent(wicketsSpan, totalWickets);
  updateTextContent(runsSpan, totalRuns);
  saveState();
}

specialBallsButton.forEach((button) => {
  button.addEventListener("click", specialBalls);
});
// *


// * Delete previous ball.
function deletePrevious() {
  let previousBallRuns = timelineArray.pop();
  updateTextContent(timelineDisplay, `Timeline: ${timelineArray}`);

  totalBallsBowled -= 1;
  updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);

  if (previousBallRuns === "Wd") {
    totalRuns -= 1;

    totalBallsBowled += 1;
    updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);
  } else if (previousBallRuns === `Nb+${noBallPlusRuns}`) {
    totalRuns = totalRuns - (Number(noBallPlusRuns) + 1);

    totalBallsBowled += 1;
    updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);
  } else if (previousBallRuns === `Nb+W+${noBallPlusRuns}`) {
    totalRuns = totalRuns - (Number(noBallPlusRuns) + 1);

    totalWickets -= 1;
  } else if (previousBallRuns === `W+${wicketPlusRuns}`) {
    totalRuns -= Number(wicketPlusRuns);

    totalWickets -= 1;
  } else {
    totalRuns -= previousBallRuns;
  }


  updateTextContent(runsSpan, totalRuns);
  updateTextContent(wicketsSpan, totalWickets);
  saveState();
}

delPrevBallButton.addEventListener("click", deletePrevious);
// *


// * Reset.
function reset() {
  allRuns = [];
  run = 0;
  noBallPlusRuns = 0;
  wicketPlusRuns = 0;

  totalRuns = 0;
  updateTextContent(runsSpan, totalRuns);

  totalWickets = 0;
  updateTextContent(wicketsSpan, totalWickets);

  totalBallsBowled = 0;
  updateTextContent(ballsBowledDisplay, `Balls bowled: ${totalBallsBowled}`);

  timelineArray = [];
  updateTextContent(timelineDisplay, `Timeline: ${timelineArray}`);

  saveState();
}

resetButton.addEventListener("click", reset);
// *


// * Screenshot.
screenshotButton.addEventListener("click", function () {

  html2canvas(document.body).then(function (canvas) {

    let link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = canvas.toDataURL();
    link.click();

  });
});
// *