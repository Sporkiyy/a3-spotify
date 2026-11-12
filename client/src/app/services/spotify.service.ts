import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    var endpoint:string = '/search/' + category + '/' + encodeURIComponent(resource);
    return this.sendRequestToExpress(endpoint).then((data) => {
      var items = data[category + 's']['items'];
      return items.map((item) => {
        if (category == 'artist') {
          return new ArtistData(item);
        } else if (category == 'album') {
          return new AlbumData(item);
        } else {
          return new TrackData(item);
        }
      });
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    var endpoint:string = '/artist/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) =>{
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //use the top tracks endpoint to make a request to express.
    var endpoint:string = '/artist-top-tracks/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data['tracks'].map((track) =>{
        return new TrackData(track);
      });
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //use the albums for an artist endpoint to make a request to express.
    var endpoint:string = '/artist-albums/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data['items'].map((album) => {
        return new AlbumData(album);
      });
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //use the album endpoint to make a request to express.
    var endpoint:string = '/album/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //use the tracks for album endpoint to make a request to express.
    var endpoint:string = '/album-tracks/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data['items'].map((item) => {
        return new TrackData(item);
      });
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //use the track endpoint to make a request to express.
    var endpoint:string = '/track/' + encodeURIComponent(trackId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}