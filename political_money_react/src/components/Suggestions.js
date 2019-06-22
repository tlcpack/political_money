import React from 'react'

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.candidate.id}>
      {r.candidate.name}
    </li>
  ))
  return <ul class='candidates'>{options}</ul>
}

export default Suggestions
