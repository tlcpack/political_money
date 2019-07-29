// using ProPublica API: https://projects.propublica.org/api-docs/campaign-finance/candidates/

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
const committees = query('.committees')
const zips = query('.zips')

function numberWithCommas (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getCandID (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/search.json?query=${n}`, {
    method: 'GET',
    headers: {
      'X-API-Key': PropublicaAPI
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
      'X-API-Key': PropublicaAPI
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })
  return promise
}

function candFromState (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/races/${n}.json`, {
    method: 'GET',
    headers: {
      'X-API-Key': PropublicaAPI
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
      'X-API-Key': PropublicaAPI
    }

  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    return response.json()
  })
  return promise
}

function getDonorDetails (n) {
  const promise = fetch(`https://api.propublica.org/campaign-finance/v1/2016/committees/${n}.json`, {
    method: 'GET',
    headers: {
      'X-API-Key': PropublicaAPI
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
    cands.innerHTML = ''
    donors.innerHTML = ''
    for (let org of orgs.results) {
      if (org.support_or_oppose === 'S') {
        addDonors(org)
      }
    }
  })
}

function getDonorId (n) {
  getDonors(n).then(function (orgs) {
    let idList = []
    committees.innerHTML = ''
    for (let org of orgs.results) {
      if (org.support_or_oppose === 'S') {
        idList.push(org.fec_committee)
        showDonorId(org)
      }
    }
    // for (let id of idList) {
    //   getDonorDetails(n).then(function (org) {
    //     showDonorZip(id)
    //   })
    // }
    return idList
  })
}

// function getDonorIdArray (n) {
//   let x = getDonors(n).then(function (orgs) {
//     let idList = []
//     for (let org of orgs.results) {
//       if (org.support_or_oppose === 'S') {
//         idList.push(org.fec_committee)
//       }
//     }
//     return idList
//   })
//   console.log(x)
// }

function listDonorZip (n) {
  getDonorDetails(n).then(function (cmte) {
    zips.innerHTML = ''
    showDonorZip(cmte.results[0])
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

function showDonorId (name) {
  let donorId = document.createElement('div')
  const cmteInfo = name.fec_committee.split('/')
  const cmteFile = cmteInfo[2]
  const cmteArray = cmteFile.split('.')
  const cmteId = cmteArray[0]

  committees.append(donorId)

  donorId.innerHTML = `<div>Committee ID: ${cmteId}</div>`
}

function showDonorZip (name) {
  let donorZip = document.createElement('div')

  zips.append(donorZip)

  donorZip.innerHTML = `<div>Donor Zip: ${name.zip}</div>`
  // geocodeAddress(geocoder, name.zip)
}

function initMap () {
  var durham = { lat: 35.994, lng: -78.899 }
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 5, center: durham })
  var marker = new google.maps.Marker({ position: durham, map: map })
  
  var geocoder = new google.maps.Geocoder()

  document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map)
  })
  
  //map recenter not working yet, trying to use fitbounds
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(marker);
  bounds.extend(document.getElementById('address').value);
  map.fitBounds(bounds);
}

// Geocode code from: https://stackoverflow.com/questions/11147803/how-to-use-zip-code-instead-lat-and-lng-in-google-maps-api
function geocodeAddress (geocoder, resultsMap) {
  var address = document.getElementById('address').value
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location)
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      })
    } else {
      alert('Geocode was not successful for the following reason: ' + status)
    }
  })
}

document.addEventListener('DOMContentLoaded', initMap)
document.addEventListener('DOMContentLoaded', function () {
  query('.cand_id').addEventListener('keyup', function (e) {
    updateID(event.target.value)
  })
  query('.state').addEventListener('change', function (e) {
    fromState(event.target.value)
  })
  query('.candidate').addEventListener('change', function (e) {
    candInfo(event.target.value)
  })
  query('.candidate').addEventListener('change', function (e) {
    listDonors(event.target.value)
  })
  query('.candidate').addEventListener('change', function (e) {
    getDonorId(event.target.value)
  })
  query('.zip').addEventListener('change', function (e) {
    listDonorZip(event.target.value)
  })
})
