import React from 'react'
import logoSmall from "./assets/logo_small.png";
import "./Spinner.css"

function Spinner() {
    return (
        <div className="spinner">
            <img src={logoSmall} alt="Loading...." />
            <h4>Loading...</h4>
        </div>
    )
}

export default Spinner
