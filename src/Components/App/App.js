import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'

import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    const { playlistTracks } = this.state
    if (playlistTracks.length === 0 || playlistTracks.find(savedTrack => savedTrack.id !== track.id)) {
      playlistTracks.push(track)
      this.setState({ playlistTracks: playlistTracks })
    }
  }

  removeTrack(track) {
    const { playlistTracks } = this.state;
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      playlistTracks.pop(track)
      this.setState({ playlistTracks: playlistTracks })
    }
  }

  updatePlaylistName(name) {
    this.setState({ plalistName: name })

  }

  savePlaylist() {
    const trackURIs = []

    this.state.playlistTracks.forEach(track => {
      trackURIs.push(track.uri);
    })

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      })
    })

  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <SearchBar onSearch={this.search} />
        </div>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist
            plalistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
        </div>
      </div>
    )
  }
}

export default App;
