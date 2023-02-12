import { useState, useMemo } from "react";
import axios from 'axios';

import './Table.css';

function Table() {

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadedAll, setLoadedAll] = useState(false);

    const DataLoad = (loadAll) => {

        const urlToPass = 'http://localhost:8000/list-companies/' + (currentPage + 1) + '/' + loadAll + '/'

        return () => {
            axios({
                method: 'GET',
                url: urlToPass,
            }).then(response => {
                if (response.data.companies.length===0 || loadAll===1) {
                    setLoadedAll(true);
                }

                setRows(prev => {
                    var newList;

                    if (response.data.companies.length===0) {
                        newList = prev;
                    } else {
                        newList = prev.concat(response.data.companies);
                    }

                    return newList
                })

                setCurrentPage(prev => prev + 1);
            })
        }
    }


    useMemo(() => {
        DataLoad(0)();
      }, []);

    return (
        <div id="table">
            <table>
                <thead>
                    <tr>
                        <th>Exchange</th>
                        <th>Symbol</th>
                        <th>Short Name</th>
                        <th>Long Name</th>
                        <th>Sector</th>
                        <th>Industry</th>
                        <th>Current Price</th>
                        <th>Market Cap</th>
                        <th>EBITDA</th>
                        <th>Revenue Growth</th>
                        <th>Country</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Full Time Employees</th>
                        <th>Weight</th>
                        <th>Long Business Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(( listValue, index ) => {
                        return (
                            <tr key={index}>
                                <td>{listValue.exchange.name}</td>
                                <td>{listValue.symbol}</td>
                                <td>{listValue.shortname}</td>
                                <td>{listValue.longname}</td>
                                <td>{listValue.industry.related_sector===null ? null : listValue.industry.related_sector.name}</td>
                                <td>{listValue.industry.name}</td>
                                <td>{listValue.current_price}</td>
                                <td>{listValue.marketcap}</td>
                                <td>{listValue.ebitda}</td>
                                <td>{listValue.revenue_growth}</td>
                                <td>{listValue.city.country===null ? null : listValue.city.country.name}</td>
                                <td>{listValue.city.state===null ? null : listValue.city.state.name}</td>
                                <td>{listValue.city.name}</td>
                                <td>{listValue.full_time_employees}</td>
                                <td>{listValue.weight}</td>
                                <td> <div>{listValue.long_business_summary}</div></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {!loadedAll && <div><button onClick={DataLoad(0)}>Load More</button>
            <button onClick={DataLoad(1)}>Load All</button></div>}
        </div>
    )
}

export default Table;
