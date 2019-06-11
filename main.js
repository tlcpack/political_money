function query (selector) {
  return document.querySelector(selector)
}

function queryAll (selector) {
  return document.querySelectorAll(selector)
}

const search = query('.search_button')
const cands = query('.cands')
// const candApi = 'http://www.opensecrets.org/api/?method=candSummary&cid=N00007360&cycle=2018&apikey=fb22899678d9793a7656d81e78055803'

function getCandID (n) {
  const promise = fetch(`https://www.opensecrets.org/api/?method=getLegislators&id=${n}&apikey=fb22899678d9793a7656d81e78055803&output=json`).then(function (response) {
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
    for (let rep of reps.response.legislator) {
      addRepInfo(rep)
    }
  })
}

function addRepInfo (name) {
  let repName = document.createElement('div')

  cands.append(repName)

  repName.innerHTML = `<div>CID: "${name.response.legislator[0].attributes.cid}"</div>`
}

document.addEventListener('DOMContentLoaded', function () {
  query('.search').addEventListener('change', function (e) {
    updateID(event.target.value)
  })
})
