import React from 'react';
import {GoogleMap, withScriptjs, withGoogleMap, Marker} from 'react-google-maps';
import Geocode from 'react-geocode';
import './BodyStyle.css';
import axios from 'axios';
import IndCareHomeComp from './IndCareHomeComp';
import ReactDOM from 'react-dom'
require('dotenv').config();


export default class Map extends React.Component{
   
   render(){
      return(
         <div className="containMap">
            <WrappedMap 
               googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_API_KEY}`}
               loadingElement = {<div className="mapDiv"/>} 
               containerElement = {<div className="mapDiv"/>} 
               mapElement = {<div className="mapDiv"/>}
            >
            </WrappedMap>     
         </div>
      )
   }
}

class Googlemap extends React.Component{
   constructor(props){
      super(props)

      this.state = {
         count: 0,
         address: '',
         home: [
            {
               position: {lat: 0, lng: 0}
            }
         ],
         name: '',
         pageNum: 0,
         resultId: '',
         checkPrev: 0
      }

      this.setSelectedHome = this.setSelectedHome.bind(this);
   }


   componentDidMount(){
      axios.get('/api/skills_assessment')
      .then(res =>{
         const count = res.data.count;
         const firstAddress = res.data.results[0].full_address;
         const name = res.data.results[0].name;
         const resultId = res.data.results[0].id;
         var checkPrev = this.state.checkPrev;
         this.setState({count: count, address: firstAddress, name: name, resultId: resultId, checkPrev: checkPrev+1}, () => {
            // console.log(this.state.checkPrev)
            // console.log(this.state.resultId)
            Geocode.setRegion('gb')
            Geocode.setApiKey(`${process.env.REACT_APP_API_KEY}`);
            Geocode.fromAddress(this.state.address)
            .then(res => {
               const lat = res.results[0].geometry.location.lat
               const lng = res.results[0].geometry.location.lng
               this.setState({home: [
                  {
                     position: {lat: lat, lng:lng}
                  }
               ]})
            }) 
         });
      })
   }

   showNext = () => {
      if(this.state.pageNum <= this.state.count){
         axios.get(`/api/skills_assessment/?limit=1&offset=${this.state.pageNum}`)
         .then(res =>{
            const address = res.data.results[0].full_address;
            const name = res.data.results[0].name;
            const resultId = res.data.results[0].id;
            var checkPrev = this.state.checkPrev;
            this.setState({address:address, name: name, resultId:resultId, checkPrev: checkPrev+1}, () => {
               Geocode.setRegion('gb')
               Geocode.setApiKey(`${process.env.REACT_APP_API_KEY}`);
               Geocode.fromAddress(this.state.address)
               .then(res => {
                  const lat = res.results[0].geometry.location.lat
                  const lng = res.results[0].geometry.location.lng
                  this.setState({home: [
                     {
                        position: {lat: lat, lng:lng}
                     }
                  ]})
               })  
            })
         })
      }
      else{
         this.setState({pageNum: 0})
      }
   }

   nextPage = () =>{
      var pageNum = this.state.pageNum;
      this.setState({pageNum: pageNum+1}, () => {
         this.showNext();
      }
      )
   }

   setSelectedHome = () =>{
      const checkPrev = this.state.checkPrev;
      this.setState({checkPrev: checkPrev+1})
      ReactDOM.render(<IndCareHomeComp {...this.state}/>, document.getElementById('displayResult'));
   }

   render(){
      return(
            <GoogleMap
            defaultZoom={9}
            defaultCenter={{lat: 51.509865, lng: -0.118092}}
         > 
               <Marker
                  position = {{
                     lat: this.state.home[0].position.lat,
                     lng: this.state.home[0].position.lng
                  }}
                  onClick = {() =>{
                     this.setSelectedHome();
                  }}
               />
         <button onClick={this.nextPage}>Next Result</button>
         </GoogleMap>
      );
   }
}
const WrappedMap = withScriptjs(withGoogleMap(Googlemap))


