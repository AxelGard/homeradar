import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Form, Button} from "react-bootstrap";


export function ResetFilters() {

    return <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Button variant="danger" style={{
            fontSize:"0.7rem",
        }}>🗑️ Reset</Button>
    </div> 
}