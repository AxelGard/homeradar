import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";


export function TargetPrice() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const targetPrice = searchParams.get('TargetPrice') || '1000000';
    const [localValue, setLocalValue] = useState(targetPrice);

    const isChecked = Boolean(searchParams.get('IsTargetPriceChecked')) || true;
    const [isCheckedLocal, setIsCheckLocal] = useState(isChecked);

    useEffect(() => {
        const newTargetPrice = searchParams.get('TargetPrice') || '1000000';
        setLocalValue(newTargetPrice);

        const newIsTargetPriceChecked = Boolean(searchParams.get('IsTargetPriceChecked')) || true;
        setLocalValue(String(newIsTargetPriceChecked));

    }, [searchParams]);

    const updateTargetPrice = (newValue) => {
        searchParams.set('TargetPrice', newValue);
        setSearchParams(searchParams);
        setLocalValue(newValue);
    };

    const updateIsTargetPriceChecked = (newValue) => {
        searchParams.set('IsTargetPriceChecked', newValue);
        setSearchParams(searchParams);
        setLocalValue(newValue);
    };

    return <div style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
        <div>
        <input
            type="checkbox"
            checked={isChecked}
            onChange={e => updateIsTargetPriceChecked(String(e.target.checked))} />
        <label htmlFor="targetPrice">💰Price:</label>
        </div>
        <input
            type="number"
            value={targetPrice}
            onChange={e => updateTargetPrice(String(e.target.value))}
            min={0}
            max={100000000}
            step={500000} />
    </div>
}