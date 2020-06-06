import React from 'react';
import './BodyStyle.css';
import Search from './Search.js'
import Map from './Map.js'

export default function Body(){
   return(
      <div className="bodyContain">
         <Search />
         <Map />
      </div>
   )
}