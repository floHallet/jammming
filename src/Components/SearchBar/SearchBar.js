import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.state = { term: ''};
    }

    search() {
        //console.log(this.state.term);
        //if (this.state.term) {
            this.props.onSearch(this.state.term);
        //} else {
        //    alert('Please enter a Song, Album or Artist');
        //}
    }

    handleTermChange(e) {
        //console.log(this.state.term);
        //console.log(e.target.value);
        this.setState({ term: e.target.value });
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        );
    }
}