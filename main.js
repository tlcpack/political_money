// using ProPublica API: https://projects.propublica.org/api-docs/campaign-finance/candidates/

function query (selector) {
  return document.querySelector(selector)
}

function queryAll (selector) {
  return document.querySelectorAll(selector)
}

const search = query('.search_button')
const cands = query('.cand_search')
const candidate = query('.candidates')
// const candApi = 'http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2018&apikey=fb22899678d9793a7656d81e78055803'

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
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/${n}`, {
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

function updateID (n) {
  getCandID(n).then(function (reps) {
    cands.innerHTML = ''
    for (let rep of reps.results) {
      addCandID(rep)
    }
  })
}

function candInfo (n) {
  getCand(n).then(function (rep) {
    candidate.innerHTML = ''
    addRepInfo(rep.results)
  })
}

function addCandID (name) {
  let repName = document.createElement('div')

  cands.append(repName)

  repName.innerHTML = `<div>Name: ${name.candidate.name}, CID: ${name.candidate.id}</div>`
}

function addRepInfo (name) {
  let rep = document.createElement('div')

  candidate.append(rep)
  console.log(candidate);
  rep.innerHTML = `<div>Name: ${name.first_name}</div>`
}

document.addEventListener('DOMContentLoaded', function () {
  query('.cand_id').addEventListener('change', function (e) {
    updateID(event.target.value)
  })
  query('.candidate').addEventListener('change', function (e) {
    candInfo(event.target.value)
  })
})
