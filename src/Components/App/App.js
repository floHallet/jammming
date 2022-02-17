import React from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';
import './App.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
  }

  search(term) {
    Spotify.getAccessToken(); //Get a Spotify user’s access token
    Spotify.search(term).then(result => this.setState({ searchResults: result })); //Send a search request to the Spotify API
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.length ? this.state.playlistTracks.map(savedTrack => savedTrack.uri) : []; // is it ok???

    Spotify.getAccessToken(); //Get a Spotify user’s access token
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(result => this.setState({ playlistName: 'New Playlist', playlistTracks: [] }));
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    const newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.push(track); 
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  removeTrack(track) {
    const newPlaylistTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    this.setState({ playlistTracks: newPlaylistTracks });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}