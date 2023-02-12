import { useState, useMemo } from "react";

import './RelatedFields.css'

function RelatedFields(props) {  //placeholder, showDropdownItems, propertyKey(key to access value of list element), setValue(set Value of field)

    const [clicked, setClicked] = useState(false);
    const [actualShowDropdownItems, setActualShowDropdownItems] = useState([]);
    const [fieldValue, setFieldValue] = useState('');

    const hasClicked= (e) => {
        setActualShowDropdownItems(props.showDropdownItems.filter((el) => { return e.target.value ? el[props.propertyKey].startsWith(e.target.value) : true }))
        setClicked(!clicked);
    }

    const selectElement = (listValue) => {
        return (e) => {
            props.setValue(listValue.id)
            setFieldValue(listValue[props.propertyKey])
            setActualShowDropdownItems(props.showDropdownItems.filter((el) => { return el.id===listValue.id }))
            setClicked(!clicked)
        }
    }

    const selectElementNew = (fieldValue) => {
        return (e) => {
            props.setValue(fieldValue)
            setFieldValue(fieldValue)
            setClicked(!clicked)
        }
    }

    return (
        <div className="t-dropdown-block">
            <div className="t-dropdown-select">
                <input onKeyDown={(e) => { if (e.key==="Enter") { e.preventDefault() } }} onClick={hasClicked} onChange={(e) => {
                    setClicked(true)
                    if (props.value!==null) {
                        props.setValue(null);
                    }
                    setFieldValue(e.target.value);
                    // props.setValue(e.target.value) {props.value ===null ? '' : props.value}
                    setActualShowDropdownItems(props.showDropdownItems.filter((el) => { return e.target.value ? el[props.propertyKey].startsWith(e.target.value) : true }))}
                    } type="text"  className="t-dropdown-input" value={fieldValue} placeholder={props.placeholder}></input>
                {/* <span className="t-select-btn"></span> */}
            </div>
            <ul style={{display: clicked ? 'block' : 'none'}} className="t-dropdown-list">
            {props.placeholder!=="Exchanges" && fieldValue==="" ? <li onClick={ (e) => {
                props.setValue(0)
                setClicked(false)
                } } className="t-dropdown-item"><i>{'Mark empty'}</i></li> : null}
                {actualShowDropdownItems.map((listValue, index) => {
                    return (
                        <li key={index} onClick={
                            selectElement(listValue)
                        } className="t-dropdown-item">{ listValue[props.propertyKey] }</li>
                        );
                    })}
                    {(fieldValue!=="" && (actualShowDropdownItems.length===1 ? actualShowDropdownItems[0].name!==fieldValue : true)) ? <li onClick={ selectElementNew(fieldValue) } className="t-dropdown-item">{'Create New "' + fieldValue + '"'}</li> : null}
            </ul>
        </div>
    )
}

export default RelatedFields;