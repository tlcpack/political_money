// using ProPublica API: https://projects.propublica.org/api-docs/campaign-finance/candidates/

// Google maps api key: AIzaSyBz155-bRr2_uAAeK5ftNH8tFZMaM6TBAc

function query(selector) {
  return document.querySelector(selector);
}

const cands = query(".cand_search");
const candidate = query(".candidates");
const stateRep = query(".stateRep");
const donors = query(".donors");
const committees = query(".committees");
const zips = query(".zips");
const social = query(".social");
const houseReps = query(".houseReps");
const repDetails = query(".repDetails");

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCandID(n) {
  const promise = fetch(
    `https://api.propublica.org/campaign-finance/v1/2016/candidates/search.json?query=${n}`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd",
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

function getCongressID(n) {
  const promise = fetch(
    `https://api.propublica.org/congress/v1/2016/candidates/search.json?query=${n}`,
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

function getCandFinanceInfo(n) {
  const promise = fetch(
    `https://api.propublica.org/campaign-finance/v1/2016/candidates/${n}.json`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd",
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

function candFromState(n) {
  const promise = fetch(
    `https://api.propublica.org/campaign-finance/v1/2016/races/${n}.json`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd",
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

function getDonors(n) {
  const promise = fetch(
    `https://api.propublica.org/campaign-finance/v1/2016/candidates/${n}/independent_expenditures.json`,
    {
      method: "GET",
      headers: {
        "X-API-Key": "5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd",
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

function getCandidateDetails(n) {
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
  return promise;
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
  console.log(promise);
  return promise;
}

function updateID(n) {
  getCongressID(n).then(function (reps) {
    cands.innerHTML = "";
    for (let rep of reps.results) {
      addCandID(rep);
    }
  });
}

function addCandID(name) {
  let repName = document.createElement("div");

  cands.append(repName);

  repName.innerHTML = `<div>Name: ${name.candidate.name}, CID: ${name.candidate.id}</div>`;
}

function candInfo(n) {
  getCandFinanceInfo(n).then(function (id) {
    candidate.innerHTML = "";
    addRepInfo(id.results[0]);
  });
}

function addRepInfo(name) {
  let repID = document.createElement("div");
  if (name.district === null) {
    repID.innerHTML = "<div>Info not found, please re-search</div>";
  }
  const repInfo = name.district.split("/");
  const distState = repInfo[2];
  const repDistrict = repInfo[4].substr(0, 2);

  candidate.append(repID);

  repID.innerHTML = `<div>Name: ${
    name.name
  }, ${distState}-${repDistrict}</div><div><br>Contributions from individuals: $${numberWithCommas(
    name.total_from_individuals
  )}<br>Contributions from PACs: $${numberWithCommas(
    name.total_from_pacs
  )}</div>`;
}

// function fromState(n) {
//   candFromState(n).then(function (reps) {
//     stateRep.innerHTML = "";
//     for (let rep of reps.results) {
//       idFromState(rep);
//     }
//   });
// }

function idFromState(name) {
  let repState = document.createElement("div");

  stateRep.append(repState);

  repState.innerHTML = `<div>Name: ${name.candidate.name}, CID: ${name.candidate.id}</div>`;
}

function listDonors(n) {
  getDonors(n).then(function (orgs) {
    cands.innerHTML = "";
    donors.innerHTML = "";
    for (let org of orgs.results) {
      if (org.support_or_oppose === "S") {
        addDonors(org);
      }
    }
  });
}

function addDonors(name) {
  let candDonor = document.createElement("div");

  donors.append(candDonor);

  candDonor.innerHTML = `<div>Name: ${name.fec_committee_name}</div>`;
}

function showCandidateDetails(n) {
  getCandidateDetails(n).then(function (id) {
    addSocial(id.results[0]);
  });
}

function addSocial(name) {
  let repSocial = document.createElement("div");
  social.innerHTML = "";
  social.append(repSocial);

  repSocial.innerHTML = `<div>Name: ${name.facebook_account}</div>`;
}

function addRepName(rep) {
  let repName = document.createElement('div');
  houseReps.append(repName);

  repName.innerHTML = `<div>${rep.first_name} ${rep.last_name} - ${rep.id}</div>`
}

function findHouseRep(state) {
  getAllHouse().then(function (reps) {
    for (let rep of reps.results[0].members) {
      if (rep.state === state.toUpperCase()) {
        addRepName(rep);
      }
    }
  });
}

function addRepDetails(rep) {
  let repInfo = document.createElement('div');
  repDetails.innerHTML = '';
  repDetails.append(repInfo);

  repInfo.innerHTML = `<div>${rep.facebook_account}<div>`
}

function showRepDetails(n) {
  getSpecificHouseMember(n).then(function (id) {
    addRepDetails(id.results[0]);
  })
}

document.addEventListener("DOMContentLoaded", function () {
  query(".cand_id").addEventListener("keyup", function (e) {
    updateID(event.target.value);
  });
  // query(".state").addEventListener("change", function (e) {
  //   fromState(event.target.value);
  // });
  // query(".candidate").addEventListener("change", function (e) {
  //   candInfo(event.target.value);
  // });
  // query(".candidate").addEventListener("change", function (e) {
  //   listDonors(event.target.value);
  // });
  // query(".candidate").addEventListener("change", function (e) {
  //   showCandidateDetails(event.target.value);
  // });
  query(".state").addEventListener("change", function (e) {
    findHouseRep(event.target.value);
  });
  query(".repDetail").addEventListener("change", function (e) {
    showRepDetails(event.target.value);
  });
});
