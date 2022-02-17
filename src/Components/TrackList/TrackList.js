import React from 'react';
import { Track } from '../Track/Track';
import './TrackList.css';

export class TrackList extends React.Component {
    render() {
        const listOfTracks = this.props.tracks ? this.props.tracks.map(track => <li key={track.id}><Track track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} /></li>) : [];

        return (
            <div className="TrackList">
                <ul>{listOfTracks}</ul>
            </div>
        );
    }
}