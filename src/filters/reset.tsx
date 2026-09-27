import React from "react";
import { useSearchParams } from "react-router";
import { Button } from "react-bootstrap";


export function ResetFilters() {
    const [, setSearchParams] = useSearchParams();

    return <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Button
            variant="danger"
            style={{ fontSize: "0.7rem" }}
            onClick={() => setSearchParams(new URLSearchParams())}
        >🗑️ Reset</Button>
    </div>
}
