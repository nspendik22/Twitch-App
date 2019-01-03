import React from 'react'
import {Link} from 'react-router-dom'
import { faYenSign } from '@fortawesome/free-solid-svg-icons';



const Suggestions = (props) => {

  const options = props.results
  
  .sort((a, b) => b.followers - a.followers)
  
  .map(r => (
    <li key={r.id} className="listing" onClick={ function onClick(){
        window.location.href=r.url;
    }}>
        <div className="image-wrapper"><img src={`${r.logo}`}/></div>
        <div className="info"><span>{r.display_name}</span></div>
    </li>
  ))
  return <ul className="users">{options}</ul>
}

export default Suggestions