import React, { Component } from 'react';
import './App.css';

function City(props) {
  return (
    <div id="zip_Info">
        <div id="info_Body">
        <h3 className="title">{props.data.LocationText}</h3>
        <ul class="no-bullets">
            <li>State: {props.data.State}</li>
            <li>Location: ({props.data.Lat}, {props.data.Long})</li>
            <li>Population (Estimated): {props.data.EstimatedPopulation}</li>
            <li>Total Wages: {props.data.TotalWages}</li>
        </ul>
      </div>
    </div>
  );
}

function ZipCodeSearch(props) {
  return (
    <div id="searchBar">
      <label htmlFor="zip">Zip Code: </label>
      <input
        type="text"
        id="zipcode"
        value={props.zipValue}
        onChange={props.handleChange}
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
    }

    this.zipCodeChange = this.zipCodeChange.bind(this);
  }

  zipCodeChange(event) {
    const zip = event.target.value;

    this.setState({
      zipCodeValue: zip,
    })

    if(zip.length === 5) {
      fetch('https://ctp-zip-api.herokuapp.com/zip/'+zip)
        .then((response) => {
          if(response.ok) {
            return response.json();
          } else {
            return[];
          }
      })

      .then((jsonResponse) => {
        const cities = jsonResponse.map((city) => {
          return <City data={city} key={city.RecordNumber} />;
        });

        this.setState({
          cities: cities,
        });
      })

    } else {
      this.setState({
        cities: [],
      });
    
    }
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
              zipValue={this.state.zipValue}
              handleChange={this.zipCodeChange} 
            />
            {this.state.cities.length > 0 ? this.state.cities :
            <div id="null"> No Results
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;