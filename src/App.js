import React, { Component } from 'react';
import './App.css';


//city display object
function City(props) {
  //console.log("Function City is displayed");
  //console.log(props);
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
  //console.log("Function ZipCode is displayed");
  //console.log(props);
	return(
	<div id="zip_Info"> 
		<div id= "zipinfo_Body">
			<h3>{props.zip}</h3>  
		</div>
	</div>
	);
}

//This runs 2nd
//creates search bars
function ZipCodeSearch(props) {
  //console.log("Function ZipCodeSearch is run");
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
      zipCodeCities: [],
      zipCities: [],
    }

    this.zipCodeChange = this.zipCodeChange.bind(this);
	  this.cityChange= this.cityChange.bind(this);
  }
  
  //This runs third and zip is updated w/ the value of what's in search bar - 3rd
	//called on every character input of zipcode searchbar
  zipCodeChange(event) {
    let zip = event.target.value;
    //console.log("In zipCodeChange zip is ");
    //console.log(zip);
    this.setState ({
      zipCodeValue: zip,
    });
    
    //After all 5 digits are in the search bar, this part is run
    //getting zip code endpoint
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
          //console.log("CITY");
          //console.log(city);
          return <City data={city} key={city.RecordNumber} />;
        });
        //console.log("OUTSIDE OF CITIES");
        this.setState({
          cities: cities,
        });
        //console.log("CITIES[0]");
        //console.log(cities[2]);
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
    //console.log("CITYCHANGE RESTART");
    //console.log(city);
    this.setState ({
      cityValue: city,
    });
    
    //Getting zipcodes for each city - from city endpoint
    fetch('https://ctp-zip-api.herokuapp.com/city/' + city)
      //gets a JSON object from response 
      .then((response) => {
        if(response.ok) { 
          return response.json();
        } 
        else {
          return[];
        }
      })
      //use the JSON object that was returned to store it as zipcode
      .then((jsonResponse) => {
        let zipcodes = jsonResponse.map((zipcode) => {
          //zipcode right here is each zipcode
          fetch('https://ctp-zip-api.herokuapp.com/zip/' + zipcode) //loop up cities w/ zipcode obtained from looking up cit
            .then((response) => {
              //console.log("NEW SEARCH IS MADE");
              if(response.ok) {
                return response.json();
              } 
              
              else {
                return[];
              }
          })
          
          .then((jsonResponses) => {
            //let foundCities = [];
            //console.log("jsonResponses");
            //console.log(jsonResponses);
            
            /*let cities = jsonResponses.map((foundCity) => {
              /*console.log("EACH CITY ----");
              console.log(eachCity);
              console.log("CITY ----");
              console.log(city)
              console.log("EACHCITIES CITY ----");
              console.log(eachCity.City)
              if(foundCity.City===city) //if the found city is the same as the city that user inputted
              {
                console.log("THESE CITIES ARE IT----");
                //console.log(foundCity);
                foundCities.push(foundCity); //add the currently found city to the list of found cities
                return <City data={foundCity} key={foundCity.RecordNumber} />;
              }
              //zipCodeCities.push(foundCity);
              
            });*/
           
            //This filters the Jsonresponses to only include the json responses w/ zipcodes that match the city user entered
            let filteredCities = jsonResponses.filter(foundCity => foundCity.City===city);
            let zipCodeCities = filteredCities.map((foundCity) => {
              //console.log(foundCity);
              return <City data={foundCity} key={foundCity.RecordNumber} />; 
            });
            this.setState({
              zipCodeCities: zipCodeCities,
            });
          })
          return <ZipCode zip={zipcode} />;
        });
        this.setState({
          zipcodes:zipcodes,
        });

      })
      
  } 

  //This happens first each time a number is typed
  render() {
    //console.log("Render is run");
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
          {this.state.zipcodes.length > 0 ? this.state.zipcodes : 
          <div id = "null"> No Results </div>}			
          </div>
		    </div>
      </div>
      
    );
  }
}

export default App;
