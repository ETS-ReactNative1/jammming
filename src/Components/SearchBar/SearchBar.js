import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchURI: []
    };
    this.search = this.search.bind(this)
    this.handleTermChange = this.handleTermChange.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
  }

  handleTermChange(event) {
    this.setState({
      searchURI: event.target.value
    })
  }

  pressEnter(event) {
    this.props.onKeyPress(event, this.state.searchURI)
  }

  search() {
    this.props.onSearch(this.state.searchURI)
  }

  render() {
    return(
    <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onKeyPress={this.pressEnter} onChange={this.handleTermChange}/>
      <a onClick={this.search} >SEARCH</a>
    </div>
  );
 }
}

export default SearchBar;
