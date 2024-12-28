import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Form } from "react-bootstrap";

export function HomeSize(){
    const [searchParams, setSearchParams] = useSearchParams();
    
    const size = Number(searchParams.get('HomeSize')) || "50";
    const isChecked = searchParams.has('IsHomeSizeChecked') 
        ? searchParams.get('IsHomeSizeChecked') === 'true' 
        : true; 

    const [localSize, setLocalValue] = useState(size);
    const [localIsChecked, setLocalIsChecked] = useState(isChecked);

    useEffect(() => {
        let updated = false;

        const newValue = Number(searchParams.get('HomeSize')) || "50";
        setLocalValue(newValue);
        if(searchParams.has('IsHomeSizeChecked')){
            searchParams.set('HomeSize', String(newValue))
            updated=true;
        }

        const newIsHomeSizeChecked = searchParams.get('IsHomeSizeChecked') === 'true';
        setLocalIsChecked(newIsHomeSizeChecked);
        if (updated) {
            setSearchParams(searchParams);
        }
    }, [searchParams]);

    const updateHomeSize = (newValue) => {
        searchParams.set('HomeSize', String(newValue));
        setSearchParams(searchParams);
        setLocalValue(newValue);
    };
    const updateIsSizeChecked = (newValue) => {
        searchParams.set('IsHomeSizeChecked', String(newValue));
        setSearchParams(searchParams);
        setLocalIsChecked(newValue);
    };

    return <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Form>
            <Form.Check 
                type="switch"
                label="📏 Size [m^2]:"
                onChange={e => updateIsSizeChecked(!localIsChecked)}
                checked={localIsChecked}
            />
        </Form>
            <input
              type="number"
              value={localSize}
              onChange={e => updateHomeSize(String(e.target.value))}
              min={0}
              max={500}
              step={10}
            />
    </div> 
}