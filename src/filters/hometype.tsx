import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';

enum HomeTypes {
  Apartment = 'Lägenhet',
  House = 'Villa',
  TerracedHouse = 'Radhus',
  ChainHouse = 'Kedjehus',
  Farm = 'Gård',
  LeisureHouse = 'Fritidshus',
  Plot = 'Tomt/Mark',
  SemiDetachedHouse= 'Parhus',
}

export function HomeType(){
  return <div>
    <Dropdown autoClose="inside">
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Home types
      </Dropdown.Toggle>
      <Dropdown.Menu >
      {Object.values(HomeTypes).map((hoseT, index) => (
        <Dropdown.Item key={index}>
          <input
              type="checkbox"
          />
          { hoseT}
        </Dropdown.Item>
      ))}
      </Dropdown.Menu>
    </Dropdown>
  </div>
}