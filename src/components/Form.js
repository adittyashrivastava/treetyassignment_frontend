import { useState, useMemo, useEffect } from "react";
import axios from 'axios';

import RelatedFields from './RelatedFields.js';
import './Form.css';
import './RelatedFields.css';

function Form() {
    const [errorMessage, setErrorMessage] = useState('');
    const [display, setDisplay] = useState('none');
    const [exchanges, setExchanges] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [exchangesToShow, setExchangesToShow] = useState([]);
    const [industriesToShow, setIndustriesToShow] = useState([]);
    const [sectorsToShow, setSectorsToShow] = useState([]);
    const [citiesToShow, setCitiesToShow] = useState([]);
    const [statesToShow, setStatesToShow] = useState([]);
    const [countriesToShow, setCountriesToShow] = useState([]);
    const [finalExchange, setFinalExchange] = useState(null);
    const [finalIndustry, setFinalIndustry] = useState(null);
    const [finalSector, setFinalSector] = useState(null);
    const [finalCity, setFinalCity] = useState(null);
    const [finalState, setFinalState] = useState(null);
    const [finalCountry, setFinalCountry] = useState(null);
    const [otherFinalData, setOtherFinalData] = useState({
        'symbol' : '',
        'shortname' : '',
        'longname' : '',
        'current_price' : '',  //null,
        'marketcap' : '', //null,
        'ebitda' : '', //null,
        'revenue_growth' : '', //null,
        'full_time_employees' : '', //null,
        'long_business_summary' : '', //null,
        'weight' : '' //null
    })

    const toggleIsOpen = () => {
        if (display==='none') {
            setDisplay('block');
        } else {
            setDisplay('none');
        }
    }

    const DataLoad = (urlToHit, propertyName, setFunction, setFunctionTwo) => {
        axios({
            method: 'GET',
            url: urlToHit,
        }).then(response => {
            setFunction(response.data[propertyName]);
            setFunctionTwo(response.data[propertyName]);
        });
    }

    useMemo(() => {
        DataLoad('http://localhost:8000/list-cities/', 'cities', setCities, setCitiesToShow);
        DataLoad('http://localhost:8000/list-states/', 'states', setStates, setStatesToShow);
        DataLoad('http://localhost:8000/list-countries/', 'countries', setCountries, setCountriesToShow);
        DataLoad('http://localhost:8000/list-industries/', 'industries', setIndustries, setIndustriesToShow);
        DataLoad('http://localhost:8000/list-sectors/', 'sectors', setSectors, setSectorsToShow);
        DataLoad('http://localhost:8000/list-exchanges/', 'exchanges', setExchanges, setExchangesToShow);
    }, []);

    //The following useEffects govern the working of cascading dropdowns intelligently narrowing
    //the range of options based upon previously selected options and data entered in the system
    useEffect(() => {
        setFinalState(null);
        setFinalCity(null);

        if (finalCountry!==null) {

            if(finalCountry===0) {
                setStatesToShow(states.filter((el) => { return el.country===null }))
            } else {
                setStatesToShow(states.filter((el) => { return el.country===null ? true : el.country.id===finalCountry }))
            }
        }
    }, [finalCountry, states])

    useEffect(() => {
        setFinalCity(null);

        if (finalState!==null) {

            if(finalState===0 && finalCountry===0) {
                setCitiesToShow(cities.filter((el) => { return el.state===null && el.country===null }))
            }else if (finalState===0 && finalCountry!==0) {
                setCitiesToShow(cities.filter((el) => { return (el.state===null && el.country===null) || (el.country===null ? false : el.country.id===finalCountry && el.state===null) }))
            } else if (finalState!==0 && finalCountry===0) {
                setCitiesToShow(cities.filter((el) => { return (el.state===null && el.country===null) || (el.state===null ? false : el.state.id===finalState && el.country===null) }))
            } else {
                setCitiesToShow(cities.filter((el) => { return (el.state===null && el.country===null) || (el.state===null ? false : el.state.id===finalState) || (el.country===null ? false : el.country.id===finalCountry) }))
            }
        }
    }, [finalState, finalCountry, cities])

    useEffect(() => {
        setFinalIndustry(null);

        if (finalSector!==null) {

            if (finalSector===0) {
                setIndustriesToShow(industries.filter((el) => { return el.related_sector===null }))
            } else {
                setIndustriesToShow(industries.filter((el) => { return el.related_sector===null ? true : el.related_sector.id===finalSector }))
            }
        }
    }, [finalSector, industries])

    return (
        <div>
            <div>
                <button style={{margin: '30px'}} onClick={toggleIsOpen}>Add Company</button>
            </div>
            <div style={{display}} id="myModal" className="modal">
                <div className="modal-content">
                    <span onClick={toggleIsOpen} className="close">&times;</span>
                    <form>
                        <RelatedFields placeholder = "Exchanges"
                            propertyKey = "name"
                            showDropdownItems = {exchangesToShow}
                            setValue = {setFinalExchange}
                            value = {finalExchange}
                        />

                        <label htmlFor="symbol">Symbol:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'symbol' : e.target.value})} type="text" id="symbol" value={otherFinalData.symbol} name="symbol"/><br/><br/>
                        <label htmlFor="shortname">Short Name:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'shortname' : e.target.value})} type="text" id="shortname" value={otherFinalData.shortname} name="shortname"/><br/><br/>
                        <label htmlFor="longname">Long Name:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'longname' : e.target.value})} type="text" id="longname" value={otherFinalData.longname} name="longname"/><br/><br/>

                        <RelatedFields placeholder = "Sectors"
                        propertyKey = "name"
                        showDropdownItems = {sectorsToShow}
                        setValue = {setFinalSector}
                        value = {finalSector}
                        />

                        {finalSector!==null && <RelatedFields placeholder = "Industries"
                        propertyKey = "name"
                        showDropdownItems = {industriesToShow}
                        setValue = {setFinalIndustry}
                        value = {finalIndustry}
                        />}

                        <label htmlFor="currentprice">Current Price:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'current_price' : e.target.value})} type="text" id="currentprice" value={otherFinalData.current_price} name="currentprice"/><br/><br/>
                        <label htmlFor="marketcap">Market Cap:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'marketcap' : e.target.value})} type="text" id="marketcap" value={otherFinalData.marketcap} name="marketcap"/><br/><br/>
                        <label htmlFor="ebitda">EBITDA:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'ebitda' : e.target.value})} type="text" id="ebitda" value={otherFinalData.ebitda} name="ebitda"/><br/><br/>
                        <label htmlFor="revenuegrowth">Revenue Growth:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'revenue_growth' : e.target.value})} type="text" id="revenuegrowth" value={otherFinalData.revenue_growth} name="revenuegrowth"/><br/><br/>

                        <RelatedFields placeholder = "Country"
                        propertyKey = "name"
                        showDropdownItems = {countriesToShow}
                        setValue = {setFinalCountry}
                        value = {finalCountry}
                        />

                        {finalCountry!==null && <RelatedFields placeholder = "State"
                            propertyKey = "name"
                            showDropdownItems = {statesToShow}
                            setValue = {setFinalState}
                            value = {finalState}
                        />}

                        {finalState!==null && <RelatedFields placeholder = "City"
                            propertyKey = "name"
                            showDropdownItems = {citiesToShow}
                            setValue = {setFinalCity}
                            value = {finalCity}
                        />}

                        <label htmlFor="fulltimeemployees">Full Time Employees:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'full_time_employees' : e.target.value})} type="text" id="fulltimeemployees" value={otherFinalData.full_time_employees} name="fulltimeemployees"/><br/><br/>
                        <label htmlFor="longbusinesssummary">Long Business Summary:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'long_business_summary' : e.target.value})} type="text" id="longbusinesssummary" value={otherFinalData.long_business_summary} name="longbusinesssummary"/><br/><br/>
                        <label htmlFor="weight">Weight:</label>
                        <input onChange={(e) => setOtherFinalData({...otherFinalData, 'weight' : e.target.value})} type="text" id="weight" value={otherFinalData.weight} name="weight"/><br/><br/>
                        <button onKeyDown={(e) => {
                            console.log(e)
                        }} onClick={(e) => {
                            e.preventDefault();
                            console.log(e)
                            console.log(finalCity, finalState, finalCountry, finalIndustry, finalSector, finalExchange)
                            console.log(otherFinalData);

                            if (finalExchange===0 || finalExchange===null) {
                                setErrorMessage('Please choose a valid exchange value')
                                return false
                            }

                            if (otherFinalData.shortname==='' || otherFinalData.shortname===null || otherFinalData.longname==='' || otherFinalData.longname===null || otherFinalData.symbol==='' || otherFinalData.symbol===null) {
                                setErrorMessage('Shortname, longname and symbol are mandatory fields')
                                return false
                            }

                            var body = {}

                            var nullchangers = ['current_price', 'marketcap', 'ebitda', 'revenue_growth', 'full_time_employees', 'long_business_summary', 'weight']

                            nullchangers.forEach((el) => {
                                if (otherFinalData[el]==='') {
                                    body[el] = null
                                } else {
                                    body[el] = otherFinalData[el]
                                }
                            });

                            body['exchange'] = finalExchange;
                            body['sector'] = finalSector===null ? 0 : finalSector;
                            body['industry'] = finalIndustry===null ? 0 : finalIndustry;
                            body['country'] = finalCountry===null ? 0 : finalCountry;
                            body['state'] = finalState===null ? 0 : finalState;
                            body['city'] = finalCity===null ? 0 : finalCity;

                            body['symbol'] = otherFinalData['symbol'];
                            body['shortname'] = otherFinalData['shortname'];
                            body['longname'] = otherFinalData['longname'];


                            axios({
                                method: 'POST',
                                url: 'http://localhost:8000/add-company/',
                                data: body
                            }).then(response => {
                                // setDisplay('none')
                                window.location.reload()
                                return true
                            });

                            return false}}>Enter</button><br></br>
                        <span style={{color:'red'}}>{errorMessage}</span>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Form;
