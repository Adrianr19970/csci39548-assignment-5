import React, { Component } from 'react';
import './App.css';


//city display object
function City(props) {
  return (
    <div id="zip_Info">
        <div id="info_Body">
        <h3 id="Location">{props.data.LocationText} </h3>
          <ul class="no-bullets">
            <li>Country: {props.data.Country}</li>
            <li>State: {props.data.State}</li>
            <li>Location: ({props.data.Lat}, {props.data.Long})</li>
            <li>Population (Estimated): {props.data.EstimatedPopulation}</li>
            <li>Tax Returns Filled: {props.data.TaxReturnsFiled}</li>
          </ul>
      </div>
    </div>
  );
}
//zipcode display object
function ZipCode(props){
	return(
	<div id="zip_Info"> 
		<div id= "zipinfo_Body">
			<h3>{props.zip}</h3>
		</div>
	</div>
	);
}

//creates search bars
function ZipCodeSearch(props) {
  return (
    <div id="searchBar">
	<label> {props.label} </label>
      <input
        type = "text"
        id = "zipcode"
        value = {props.zipValue}
        onChange = {props.handleChange}
      />
    </div>
  );
}




class App extends Component {
  constructor() {
    super();
    this.state = {
      zipCodeValue: "",
      cities: [],
	  cityValue: "", 
	  zipcodes: [], 
    }

    this.zipCodeChange = this.zipCodeChange.bind(this);
	this.cityChange= this.cityChange.bind(this);
  }
	
	//called on every character input of zipcode searchbar
  zipCodeChange(event) {
    let zip = event.target.value;

    this.setState ({
      zipCodeValue: zip,
    })

    if(zip.length === 5) {
      fetch('https://ctp-zip-api.herokuapp.com/zip/' + zip)
        .then((response) => {
          if(response.ok) {
            return response.json();
          } 
          
          else {
            return[];
          }
      })

      .then((jsonResponse) => {
        let cities = jsonResponse.map((city) => {
          return <City data={city} key={city.RecordNumber} />;
        });

        this.setState({
          cities: cities,
        });
      })
    } 
    
    else {
    this.setState ({
      cities: [],
    });
    
    }
  }
  //called on every character input of city search bar (making API requests on each character)
	cityChange(event) {
    let city = event.target.value.toUpperCase();

    this.setState ({
      cityValue: city,
    });

      fetch('https://ctp-zip-api.herokuapp.com/city/' + city)
        .then((response) => {
          if(response.ok) { 
            return response.json();
          } 
          
          else {
            return[];
          }
		})
   
      .then((jsonResponse) => {
        let zipcodes = jsonResponse.map((zipcode) => {
          return <ZipCode zip={zipcode} />;
        });

        this.setState({
          zipcodes:zipcodes,
        });
      })
    } 


  render() {
    return (
      <div className="App">
        <div className="header">
          <h2>Zip Code Search</h2>
        </div>
        <div id="display">
          <div id="display_Info">
            <ZipCodeSearch
              zipValue = {this.state.zipValue}
              handleChange = {this.zipCodeChange} 
			  label = {"Zip Code: "}
            />
            {this.state.cities.length > 0 ? this.state.cities :
            <div id="null"> No Results
            </div>}
          </div>
        </div>

        <div className="header">
          <h2>City Search</h2>
        </div>
		<div id="display"> 
			<div id="display_Info">
			<ZipCodeSearch
			cityValue= {this.state.cityValue}
			handleChange= {this.cityChange}
			label = {"City: " }
			/>
			{this.state.zipcodes.length > 0 ? this.state.zipcodes : <div id = "null"> No Results </div>}			
			</div>
		</div>
		
			
      </div>
    );
  }
}

export default App;