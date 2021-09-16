let failedAttempts = document.querySelector(".attempts span");
let blocksContainer = document.querySelector(".imgs-container");
let time = document.querySelector(".timer");
let sec = 60;
let blocks = Array.from(blocksContainer.children);
let score = 0;
let yourName;
let highestScores = JSON.parse(localStorage.getItem("highestScores")) || [];
let playersList = document.getElementById("leader-board");
let orderedList = document.createElement("ol");
let switcher = false;
let counter = 0;
document.querySelector(".control-button").onclick = function () {
  yourName = prompt("Enter Your Name:");
  timer();
  resetCards();
  if (yourName == null || yourName == "") {
    document.querySelector(".info-container span").innerHTML = "Unknown";
  } else {
    document.querySelector(".info-container span").innerHTML = yourName;
  }

  document.querySelector(".control-button").remove();
};
orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  block.addEventListener("click", function () {
    flipCard(block);
  });
});
/*function to shuffle the orderRange array */
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;

    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}
function flipCard(block) {
  block.classList.add("is-flipped");
  let isFlipped = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped" || "matched")
  );
  console.log(isFlipped.length);
  if (isFlipped.length === 2) {
    stopClicking();
    isMatched(isFlipped[0], isFlipped[1]);
  }
}

function stopClicking() {
  blocksContainer.classList.add("stop-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("stop-clicking");
  }, 1000);
}
function isMatched(block1, block2) {
  if (block1.dataset.index === block2.dataset.index) {
    score++;
    counter++;
    block1.classList.remove("is-flipped");
    block2.classList.remove("is-flipped");
    block1.classList.add("matched");
    block2.classList.add("matched");
    document.getElementById("success").play();
  } else {
    failedAttempts.innerHTML = parseInt(failedAttempts.innerHTML) + 1;
    setTimeout(() => {
      block1.classList.remove("is-flipped");
      block2.classList.remove("is-flipped");
    }, 1000);
    document.getElementById("failed").play();
  }
  if (counter === 10) {
    sec = 0;
  }
}
function timer() {
  let timeDone = setInterval(() => {
    let min = Math.floor(sec / 60);
    let remSec = sec % 60;
    if (remSec < 10) {
      remSec = "0" + remSec--;
    }
    time.innerHTML = min + ":" + remSec;

    if (sec > 0) {
      sec--;
    } else {
      time.innerHTML = "Done";
      score =
        score === 0
          ? (score = 0)
          : `${Math.round(
              score *
                1000 *
                (failedAttempts === 0
                  ? (failedAttempts = 2 * 0.1)
                  : failedAttempts.innerHTML + 2 * 0.1 + sec)
            )}`;
      document.querySelector("#score span").innerHTML = score;
      clearInterval(timeDone);
      document.querySelector(".completed").style.display = "flex";
      leaderBoard();
    }
  }, 1000);
}
document.getElementById("again").onclick = function () {
  document.getElementById("list2").remove();
  resetCards();
  sec = 60;
  timer();
  failedAttempts.innerHTML = 0;

  document.querySelector(".completed").style.display = "none";
};
function resetCards() {
  score = 0;
  blocks.forEach((block) => {
    block.classList.remove("matched");
    block.classList.remove("is-flipped");
  });
  blocks.forEach((block) => {
    setTimeout(() => {
      block.classList.add("is-flipped");
      shuffle(orderRange);
      blocks.forEach((block, index) => {
        block.style.order = orderRange[index];
      });
    }, 1000);
    setTimeout(() => {
      block.classList.remove("is-flipped");
    }, 3000);
  });
}
function leaderBoard() {
  let orderedList = document.createElement("ol");
  orderedList.setAttribute("id", "list2");
  const Player = {
    name: yourName,
    playerScore: score,
  };
  highestScores.push(Player);
  highestScores.sort((a, b) => b.playerScore - a.playerScore);
  highestScores.splice(5);
  localStorage.setItem("highestScores", JSON.stringify(highestScores));

  for (let i = 0; i < highestScores.length; i++) {
    let listItem = document.createElement("li");
    let span1 = document.createElement("span");
    let span2 = document.createElement("span");

    span1.innerHTML = `${i + 1}. ` + highestScores[i].name;
    span2.innerHTML = highestScores[i].playerScore;

    listItem.appendChild(span1);
    listItem.appendChild(span2);
    orderedList.appendChild(listItem);
  }
  playersList.appendChild(orderedList);
}

document.getElementById("leaderButton").onclick = function () {
  playersList.style.display = "flex";
};
document.getElementById("back").onclick = function () {
  playersList.style.display = "none";
};
