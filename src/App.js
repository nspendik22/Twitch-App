import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery'; 
import './App.css';
import Suggestions from './Suggestions';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

library.add(faSearch)



const URL = 'https://api.twitch.tv/kraken/search/channels';
let headers = new Headers();
headers.append('Accept', 'application/vnd.twitchtv.v5+json');
headers.append('Client-ID', 'ut67uxo8b0gr6hs2f0cyu596di1lcg');



class App extends Component {
constructor(props){
  super(props);

  this.state = {
    query: '',
    results: [],
    streams: [],
    openedModal: null,
  }
}



onOpenModal = id => {
  this.setState({ openedModal: id });
};

onCloseModal = () => {
  this.setState({ openedModal: null });
};

componentDidMount(){
  fetch('https://api.twitch.tv/kraken/streams?limit=12', { headers: { 'Accept' : 'application/vnd.twitchtv.v5+json', 'Client-ID': 'ut67uxo8b0gr6hs2f0cyu596di1lcg' } })
  .then(result => result.json())
  .then(data => {this.setState({streams: data.streams});console.log(this.state.streams);});
  
} 

getInfo = () => {
  axios.get(`${URL}?query=${this.state.query}&limit=5`, { headers: { 'Accept' : 'application/vnd.twitchtv.v5+json', 'Client-ID': 'ut67uxo8b0gr6hs2f0cyu596di1lcg' } })
    .then(({ data }) => {
      this.setState({
        results: data.channels
      })
      console.log(this.state.results);
    })
    
}

handleInputChange = () => {
  this.setState({
    query: this.search.value
  }, () => {
    if (this.state.query && this.state.query.length > 1) {
      $('.users').show();
        this.getInfo()
    } else if (!this.state.query) {
      $('.users').hide();
    }
  })
}


  render() {
    const { streams } = this.state;
    return (
      <div className="App">

      <h1>Twitch React App</h1>
      <div className="wrapper">
        <form>
        <input type="text" name="" className="search-txt" placeholder="Search for Channels..." ref={input => this.search = input}
          onChange={this.handleInputChange}
          />
        </form>
        <a className="search-btn">
        <FontAwesomeIcon icon="search" />
        </a>
        <Suggestions results={this.state.results} />
        
      </div>
      
      <div className="streams">
        <div className="subheading"><h3>You may be interested in some of these live streams</h3></div>
          <div className="streams-wrapper">
            {streams
            .sort((a, b) => b.channel.followers - a.channel.followers)
              .map(res => (
                
                  <div key={res._id} className="stream-card">
                    
                    <a onClick={() => this.onOpenModal(res._id)}>
                    <div className="stream-thumbnail">
                      <img src={res.preview.medium}/>
                    </div>
                    <div className="stream-info">
                      <div className="image-wrapper"><img src={`${res.channel.logo}`}/></div>
                      
                      <div className="card-info">
                        <a className="stream-title">{`${res.channel.status.substring(0,35)+'...'}`}</a>
                        <div className="subtitle">
                          <div className="card-subtitle-user">
                            <a className="stream-user">{res.channel.display_name}</a>
                          </div>
                          <div className="card-subtitle-user">
                            <a className="stream-game">{res.channel.game}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    </a>

                    <Modal
                        isOpen={this.state.openedModal === res._id}
                        toggle={this.closeModal}
                      >
                        <ModalHeader>
                        <Button className="close" onClick={this.onCloseModal}>X</Button>
                        </ModalHeader>
                        <ModalBody>
                        <div className="resp-container"> 
                        <iframe className="resp-iframe" src={`https://player.twitch.tv/?channel=${res.channel.display_name}`} frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
                        </div>
                        </ModalBody>
                        
                      </Modal>
                  
                  </div>
              ))
              
            }
              
            
          </div>
      </div>
      <footer>Copyright © 2019 Nikolas Spendik</footer>
    </div>
    );
  }
}

export default App;
