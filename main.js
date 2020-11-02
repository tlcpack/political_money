// using ProPublica API: https://projects.propublica.org/api-docs/campaign-finance/candidates/

// Google maps api key: AIzaSyBz155-bRr2_uAAeK5ftNH8tFZMaM6TBAc

function query(selector) {
  return document.querySelector(selector);
}

const cands = query(".cand_search");
const houseReps = query(".houseReps");
const repDetails = query(".repDetails");

const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
let allHouse = [];

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function safetyAnalysis(party, cook, dw) {
  if (cook && dw) {
    if (party == cook[0] && dw > 0 && party == 'R') {
      return "Safe";
    } 
    if (party == cook[0] && dw < 0 && party == 'D') {
      return 'Safe';
    }
    else {
      return "Not safe";
    }
  }
  else {
    return "Unsure";
  }
}

function getAllHouse() {
  const promise = fetch(
    `https://api.propublica.org/congress/v1/116/house/members.json`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "LJgQYwDfuk9k4KkmrZj1DcbU6AJ5nawhLGaiN5oM",
      },
    }
  ).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
  return promise;
}

function getSpecificHouseMember(n) {
  const promise = fetch(
    `https://api.propublica.org/congress/v1/members/${n}.json`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "LJgQYwDfuk9k4KkmrZj1DcbU6AJ5nawhLGaiN5oM",
      },
    }
  ).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });
  // console.log(promise);
  return promise;
}

function addRepName(rep) {
  let repName = document.createElement("div");
  houseReps.append(repName);
  repName.classList.add("rep");
  if (rep.party === "R") {
    repName.classList.add("R");
  } else if (rep.party === "D") {
    repName.classList.add("D");
  }

  const repId = rep.id;

  repName.onclick = function () {
    showRepDetails(repId);
  };
  console.log(rep);

  const safety = safetyAnalysis(rep.party, rep.cook_pvi, rep.dw_nominate);
  if (safety == 'Unsure') {
    repName.classList.add("unsure")
  }

  repName.innerHTML = `<div>${rep.first_name} ${rep.last_name} (${rep.party}) - District: ${rep.district}</div></br>`;
  repName.innerHTML += `<div>Cook district rating: ${rep.cook_pvi}</div></br>
  <div>DW rating: ${rep.dw_nominate}</div></br>
  <div><b><i>Analysis: ${safety}</i></b></div>`;
  houseReps.appendChild(repName);
}

// function findHouseRep(state) {
//   getAllHouse().then(function (reps) {
//     houseReps.innerHTML = "";
//     repDetails.innerHTML = "";
//     for (let rep of reps.results[0].members) {
      // if (rep.state === state.toUpperCase()) {
      //   addRepName(rep);
      // }
//     }
//   });
// }
function displayReps(state) {
  houseReps.innerHTML = "";
  repDetails.innerHTML = "";
  for (let rep of allHouse) {
    if (rep.state === state.toUpperCase()) {
      addRepName(rep);
    }
  }
}

function createHouseList() {
  getAllHouse().then(function (reps) {
    for (let rep of reps.results[0].members) {
      allHouse.push(rep);
    }
    allHouse.sort((a, b) => (a.dw_nominate > b.dw_nominate) ? 1 : -1)
  });
}

function addRepDetails(rep) {
  let repInfo = document.createElement("div");
  repDetails.innerHTML = "";
  repDetails.append(repInfo);
  repInfo.classList.add("repInfo");

  if (rep.current_party === "R") {
    repInfo.classList.add("rBorder");
  } else if (rep.current_party === "D") {
    repInfo.classList.add("dBorder");
  }

  repInfo.innerHTML = `<div>${rep.first_name} ${rep.last_name}</div><br><div class="cardContainer">
  <div class="card" onclick="this.classList.toggle('flipped');">
  <div class="side front">Partisan info</div>
  <div class="side back"><div>Cook report District rating - ${rep.roles[0].cook_pvi}</div><br>
  <div>DW_Nominate rating: ${rep.roles[0].dw_nominate}</div><br>
  <div>Votes with party: ${rep.roles[0].votes_with_party_pct}</div></div></div>
  <div class="card" onclick="this.classList.toggle('flipped');">
  <div class="side front">Contact info</div>
  <div class="side back"><div>Phone: ${rep.roles[0].phone}</div><br>
  <div>Twitter: ${rep.roles[0].twitter_account}</div></div></div>`;
}

function showRepDetails(n) {
  getSpecificHouseMember(n).then(function (id) {
    console.log(id);
    houseReps.innerHTML = "";
    addRepDetails(id.results[0]);
  });
}

function getRepDetails(n) {
  getSpecificHouseMember(n).then(function (id) {
    const value = getCook(id.results[0]);
  });
}

function getCook(id) {
  const cook = id.roles[0].cook_pvi;
  return cook;
}

function getDW(id) {
  const dw = id.roles[0].dw_nominate;
  return dw;
}

// countdown functionality
const deadline = "2020-11-3";

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function initializeClock(id, endtime) {
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector(".days");
  const hoursSpan = clock.querySelector(".hours");
  const minutesSpan = clock.querySelector(".minutes");
  const secondsSpan = clock.querySelector(".seconds");

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
    minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
    secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}
initializeClock("clockdiv", deadline);

document.addEventListener("DOMContentLoaded", function () {
  createHouseList();
  query(".state").addEventListener("change", function (e) {
    console.log(e.target.value.toUpperCase());
    if (states.includes(e.target.value.toUpperCase())) {
    displayReps(e.target.value);
    }
    else {
      repDetails.innerHTML = "<div style='color:red;display: flex;justify-content: space-evenly;'><i>Please enter valid state abbreviation</i></div>"
    }
  });
});
