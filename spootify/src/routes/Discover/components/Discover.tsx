import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import axios from "axios";

//TODO: Fix `any` types here

interface IDiscoverProps {}

interface IDiscoverState {
  // Array<any>
  newReleases: any;
  playlists: any;
  categories: any;
}

function isUrlIncludeToken(){ // url token iceriyor mu kontrolu
  if(window.location.href.includes("#access_token=")) return true
  else return false
}

function newToken(){ // url-deki token-i ayirt edip alir
  const url = window.location.href
  const startOf = url.indexOf("#")
  const endOf = url.indexOf("&token")
  const bearerTokenFromUrl = url.slice(startOf + "#access_token=".length, endOf)
  return bearerTokenFromUrl
}

function requestNewToken(){ // refresh token almak icin
  var redirect_uri = "http://localhost:3000/callback/"
  const AUTHORIZE = "https://accounts.spotify.com/authorize"
  let url = AUTHORIZE
  url += "?response_type=token"
  url += "&redirect_uri=" + encodeURI(redirect_uri)
  url += "&client_id=" + process.env.REACT_APP_SPOTIFY_CLIENT_ID
  url += "&state=ilcwzk"
  window.location.href = url
}

export default class Discover extends Component<IDiscoverProps, IDiscoverState> {
  constructor(props: IDiscoverProps) {
    super(props);

    this.state = {
      newReleases: [],
      playlists: [],
      categories: []
    };
  }

  //TODO: Handle APIs
  async componentDidMount() {
    var bearerToken = localStorage.getItem("spotify_bearer_token")
    if(isUrlIncludeToken()) { // url token iceriyorsa, yani spotify authorize-dan gelindiyse..
      bearerToken = newToken()
      localStorage.setItem("spotify_bearer_token", bearerToken)
    }
    var headers = {
      'Authorization': 'Bearer ' + bearerToken,
      'Content-Type': 'application/json'
    };
    // "Get New Releases" api
    await axios.get('https://api.spotify.com/v1/browse/new-releases', { headers })
      .then(response => this.setState({ newReleases: response.data }))
      .catch(() => {
        requestNewToken() // localStorage-daki tokenin suresi dolmus demektir. Yeni token icin spotify-a gidilir
      });
    
    // "Get Featured Playlists" api
    const featuredPlaylistResponse = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', { headers });
    this.setState({ playlists: featuredPlaylistResponse.data }) // bu sorgu icin .then, .catch yazmaya gerek duyulmadi

    // "Get Several Browse Categories" api
    const genreSeedsResponse = await axios.get('https://api.spotify.com/v1/browse/categories', { headers });
    this.setState({ categories: genreSeedsResponse.data }) // bu sorgu icin .then, .catch yazmaya gerek duyulmadi
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      newReleases.albums !== undefined || playlists.playlists !== undefined || categories.genres !== undefined ? (
        <div className="discover">
          <DiscoverBlock text="RELEASED THIS WEEK" id="albums" data={newReleases} />
          <DiscoverBlock text="FEATURED PLAYLISTS" id="playlists" data={playlists} />
          <DiscoverBlock text="BROWSE" id="categories" data={categories} />
        </div>
      ) :
        <div className="discover">
          <p>Yüklenirken bir hata oluştu! Token süresi dolmuş. Getiriliyor...</p>
        </div>
    );
  }
}
