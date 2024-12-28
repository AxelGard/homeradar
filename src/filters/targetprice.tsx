import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Form } from "react-bootstrap";

export function TargetPrice() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get values from the URL or use defaults
    const targetPrice = searchParams.get('TargetPrice') || '1000000';
    const isChecked = searchParams.has('IsTargetPriceChecked') 
        ? searchParams.get('IsTargetPriceChecked') === 'true' 
        : true; // Default to true if missing

    const [localValue, setLocalValue] = useState(targetPrice);
    const [isCheckedLocal, setIsCheckLocal] = useState(isChecked);

    // Push default values to the URL if missing
    useEffect(() => {
        let updated = false;

        if (!searchParams.has('TargetPrice')) {
            searchParams.set('TargetPrice', '1000000');
            updated = true;
        }

        if (!searchParams.has('IsTargetPriceChecked')) {
            searchParams.set('IsTargetPriceChecked', 'true');
            updated = true;
        }

        if (updated) {
            setSearchParams(searchParams);
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        // Sync local state with URL parameters
        const newTargetPrice = searchParams.get('TargetPrice') || '1000000';
        setLocalValue(newTargetPrice);

        const newIsTargetPriceChecked = searchParams.has('IsTargetPriceChecked') 
            ? searchParams.get('IsTargetPriceChecked') === 'true' 
            : true;
        setIsCheckLocal(newIsTargetPriceChecked);
    }, [searchParams]);

    const updateTargetPrice = (newValue) => {
        searchParams.set('TargetPrice', newValue);
        setSearchParams(searchParams);
        setLocalValue(newValue);
    };

    const updateIsTargetPriceChecked = (newValue) => {
        searchParams.set('IsTargetPriceChecked', newValue);
        setSearchParams(searchParams);
        setIsCheckLocal(newValue);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Form>
                <Form.Check
                    type="switch"
                    label="💰 Price:"
                    onChange={() => updateIsTargetPriceChecked(!isCheckedLocal)}
                    checked={isCheckedLocal}
                />
            </Form>
            <input
                type="number"
                value={localValue}
                onChange={(e) => updateTargetPrice(e.target.value)}
                min={0}
                max={100000000}
                step={500000}
            />
        </div>
    );
}
