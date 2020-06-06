import React from 'react'
import ReactDOM from 'react-dom'
import './BodyStyle.css'
import axios from 'axios';
import IndCareHomeComp from './IndCareHomeComp';


export default class Search extends React.Component{

   constructor(props){
      super(props);
      
      this.state = {
         userQuery: '',
         resultId: '',
         checkPrev: 0,
         carehomes:{
            results: []
         }
      };

      this.handleInput = this.handleInput.bind(this);

   }

componentDidMount() {
      axios.get(`/api/skills_assessment/?limit=750`)
      .then(res => {
         const carehomes= res.data;
         this.setState({carehomes: carehomes});
      })    
   }   

   assignStateInput = (e) => {
      const queryState = e.target.value;
      this.setState({userQuery: queryState});
   };

   handleInput = () => {
         const userQuery = this.state.userQuery;
         const arrayNames = this.state.carehomes.results.map(val => val.name);
         const arrayIds = this.state.carehomes.results.map(val => val.id);
         var checkPrev = this.state.checkPrev;
         for(let i = 0; i < arrayNames.length; i++){
            if(arrayNames[i] === userQuery)
            {  
               checkPrev++;
               this.setState({resultId: arrayIds[i], checkPrev: checkPrev}, () => {
                  if(this.state.resultId !== '')
                     {  
                        ReactDOM.render(<IndCareHomeComp {...this.state}/>, document.getElementById('displayResult')); 
                        // console.log(this.state.checkPrev);
                        // console.log(this.state.resultId);
                     }
               });
            }
         }
   }


   render(){
      const query = this.state.userQuery;
      return(
         <div className="containSearch">
            <div className="searchBar">
               <input onChange={this.assignStateInput} name="query" className="searchCareHomes" type="search" placeholder="Search care homes" value={query}></input>
               <img  onClick={this.handleInput} className="searchIcon" src={require('./icons8-search-50.png')} alt="searchIcon"></img>
            </div>
            <div id='displayResult'>

            </div>
         </div>
         
      )     
   }
}