import React from 'react';
import './HeadStyle.css';

function Head() {
  return (
    <div className="headerContain">
      <div className="left">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/NHS-Logo.svg/1280px-NHS-Logo.svg.png" alt="NHS logo"></img>
        <p id="leftP1">NHS London Care Homes</p>
        <p id="leftP2">presented by Evalucom Consulting Ltd</p>
      </div>
    </div>
  );
}

export default Head;
