import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function HomeSize(){
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const size = Number(searchParams.get('HomeSize')) || 50;
    const [localSize, setLocalValue] = useState(size);
    
    const isChecked = Boolean(searchParams.get('IsHomeSizeChecked')) || true;
    const [localIsChecked, setLocalIsChecked] = useState(isChecked);

    useEffect(() => {
        const newValue = Number(searchParams.get('HomeSize')) || 50;
        setLocalValue(newValue);
        const newIsHomeSizeChecked = Boolean(searchParams.get('IsHomeSizeChecked')) || true;
        setLocalIsChecked(newIsHomeSizeChecked);
    }, [searchParams]);

    const updateHomeSize = (newValue) => {
        searchParams.set('HomeSize', newValue);
        setSearchParams(searchParams);
        setLocalValue(newValue);
    };
    const updateIsSizeChecked = (newValue) => {
        searchParams.set('IsHomeSizeChecked', newValue);
        setSearchParams(searchParams);
        setLocalIsChecked(newValue);
    };

    return <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div>
        <input
            type="checkbox"
            checked={localIsChecked}
            onChange={e => updateIsSizeChecked(String(e.target.checked))} />
        <label htmlFor="size">📏Size(m^2):</label>
        </div>
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