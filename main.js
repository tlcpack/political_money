// using ProPublica API: https://projects.propublica.org/api-docs/campaign-finance/candidates/
// key: 5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd
// Google maps api key: AIzaSyBz155-bRr2_uAAeK5ftNH8tFZMaM6TBAc

function query (selector) {
  return document.querySelector(selector)
}

function queryAll (selector) {
  return document.querySelectorAll(selector)
}

const search = query('.search_button')
const cands = query('.cand_search')
const candidate = query('.candidates')
const stateRep = query('.stateRep')
const donors = query('.donors')
// const candApi = 'http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2018&apikey=fb22899678d9793a7656d81e78055803'

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getCandID (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/search.json?query=${n}`, {
    method: 'GET',
    headers: {
      'X-API-Key': '5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd'
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })
  return promise
}

function getCand (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/${n}.json`, {
    method: 'GET',
    headers: {
      'X-API-Key': '5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd'
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })
  console.log(promise)
  return promise
}

function candFromState (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/races/${n}.json`, {
    method: 'GET',
    headers: {
      'X-API-Key': '5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd'
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })

  return promise
}

function getDonors (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/${n}/independent_expenditures.json`, {
    method: 'GET',
    headers: {
      'X-API-Key': '5kMXtbKMfmdYhn87JENQ9vcAzqXDonYCYzmYZazd'
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })
  console.log(promise)
  return promise
}

function updateID (n) {
  getCandID(n).then(function (reps) {
    cands.innerHTML = ''
    for (let rep of reps.results) {
      addCandID(rep)
    }
  })
}

function candInfo (n) {
  getCand(n).then(function (id) {
    candidate.innerHTML = ''
    addRepInfo(id.results[0])
  })
}

function fromState (n) {
  candFromState(n).then(function (reps) {
    stateRep.innerHTML = ''
    for (let rep of reps.results) {
      idFromState(rep)
    }
  })
}

function listDonors (n) {
  getDonors(n).then(function (orgs) {
    donors.innerHTML = ''
    for (let org of orgs.results) {
      if org.results.support_or_oppose = "O"{
        addDonors(org)
      }
    }
  })
}

function addCandID (name) {
  let repName = document.createElement('div')

  cands.append(repName)

  repName.innerHTML = `<div>Name: ${name.candidate.name}, CID: ${name.candidate.id}</div>`
}

function addRepInfo (name) {
  let repID = document.createElement('div')
  if (name.district === null) {
    repID.innerHTML = '<div>Info not found, please re-search</div>'
  }
  const repInfo = name.district.split('/')
  const distState = repInfo[2]
  const repDistrict = repInfo[4].substr(0, 2)

  candidate.append(repID)

  repID.innerHTML = `<div>Name: ${name.name}, ${distState}-${repDistrict}</div><div><br>Contributions from individuals: $${numberWithCommas(name.total_from_individuals)}<br>Contributions from PACs: $${numberWithCommas(name.total_from_pacs)}</div>`
}

function idFromState (name) {
  let repState = document.createElement('div')

  stateRep.append(repState)

  repState.innerHTML = `<div>Name: ${name.candidate.name}, CID: ${name.candidate.id}</div>`
}

function addDonors (name) {
  let candDonor = document.createElement('div')

  donors.append(candDonor)

  candDonor.innerHTML = `<div>Name: ${name.fec_committee_name}</div>`
}

function initMap () {
  var durham = { lat: 35.994, lng: -78.899 }
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 4, center: durham })
  var marker = new google.maps.Marker({ position: durham, map: map })
}

// document.addEventListener('DOMContentLoaded', initMap)
document.addEventListener('DOMContentLoaded', function () {
  query('.cand_id').addEventListener('change', function (e) {
    updateID(event.target.value)
  })
  query('.state').addEventListener('change', function (e) {
    fromState(event.target.value)
  })
  query('.candidate').addEventListener('change', function (e) {
    candInfo(event.target.value)
  })
  query('.donor').addEventListener('change', function (e) {
    listDonors(event.target.value)
  })
})
