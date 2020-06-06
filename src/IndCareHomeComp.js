import React from 'react';
import axios from 'axios';

export default class IndCareHomeComp extends React.Component{
   constructor (props){
      super(props);
      
      this.state = {
         resultId: '',
         careHome: {},
         recievedVacBeds: 0
      }

      this.handleVacancyChange = this.handleVacancyChange.bind(this);
   }

  componentDidUpdate(prevProps){
      if(this.props.checkPrev !== prevProps.checkPrev){
         axios.get(`/api/skills_assessment/${this.props.resultId}/`)
      .then(res => {
         const careHome = res.data;
         this.setState({careHome: careHome})
      })
      .then( () => {
         const recievedNumBeds = this.state.careHome.no_beds;
         const recievedVacBeds = this.state.careHome.vacant_beds;
         const isNull = 0;
         if(recievedNumBeds === null){
            this.setState({recievedNumBeds: isNull, recievedVacBeds: recievedVacBeds});
         }
         if(recievedVacBeds === null){
            this.setState({recievedNumBeds: recievedNumBeds, recievedVacBeds: isNull});
         }
         else{
            this.setState({recievedNumBeds: recievedNumBeds, recievedVacBeds: recievedVacBeds});
         }
      })
      }
   }

   handleVacancyChange = (e) => {
      const userChange = e.target.value;
      this.setState({recievedVacBeds: userChange})
      // console.log(userChange);
   }

   patchUpdatedCapacity = (e) =>{
      axios.patch(`/api/skills_assessment/${this.props.resultId || this.props.id}/?format=json`, {
         "vacant_beds": this.state.recievedVacBeds,
      })
      .then(res => {
         // console.log(res.data)
      })
      e.preventDefault();
}
   
   render(){
      return(
         <div className="careHomeComp">
            <h1>{this.state.careHome.name}</h1>
           <div className="topData">
            <span className="spanTop1">
               <h2>About:</h2>
               <p>{this.state.careHome.name} care home is located in {this.state.careHome.local_authority}. It is provided by {this.state.careHome.provider} and is managed by {this.state.careHome.home_manager}.</p>
            </span>
            <span className="spanTop2">
               <h2>Full address:</h2>
               <p>{this.state.careHome.full_address}</p>
            </span>
            <span className="spanTop3">
               <h2>CQC rating:</h2>
               <p>{this.state.careHome.overall_cqc_rating}</p>
            </span>
            </div>
           <div className="bottomData">
            <span className="spanBottom1">
                  <h2>Capacity:</h2>
                  <p>{this.state.recievedNumBeds} beds</p>
            </span>
            <span>
                  <h2>Vacant beds:</h2>
                  <form className="bottomShowAndInput" onSubmit={this.patchUpdatedCapacity}> 
                     <span><input id="changeAvalible" type="number" value={this.state.recievedVacBeds} onChange={this.handleVacancyChange}></input></span>
                     <span><input id="submitAvChange" type="submit"></input></span>
                  </form>
            </span>
           </div>
         </div>
      )
   }
}