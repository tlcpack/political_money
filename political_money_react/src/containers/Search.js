import React from 'react'
import Suggestions from '../components/Suggestions'

require('dotenv').config()
const API_KEY = process.env.REACT_APP_DEV_API_KEY

// using https://dev.to/sage911/how-to-write-a-search-component-with-suggestions-in-react-d20
class Search extends React.Component {
  state = {
    query: '',
    error: null,
    isLoaded: false,
    results: []
  }

  getInfo = () => {
    fetch(`https://api.propublica.org/campaign-finance/v1/2016/candidates/search.json?query=${this.state.query}`, {
      method: 'GET',
      headers: {
        'X-API-Key': `${API_KEY}`
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            results: result.results
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          })
        }
      )
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) {
      }
    })
  }

  render() {
    return (
      <form>
        <input
          placeholder='Search for...'
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <Suggestions results={this.state.results} />
      </form>
    )
  }
}

export default Search
