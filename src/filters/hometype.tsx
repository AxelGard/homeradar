import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";

enum HomeTypes {
  Apartment = "Apartment",
  House = "House ",
  TerracedHouse = "TerracedHouse",
  ChainHouse = "ChainHouse",
  Farm = "Farm",
  LeisureHouse = "LeisureHouse",
  Plot = "Plot",
  SemiDetachedHouse = "SemiDetachedHouse",
}



export function HomeType() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get selected home types from URL or default to an empty array
  const selectedTypesFromUrl = searchParams.get("HomeTypes")
    ? searchParams.get("HomeTypes")!.split(",")
    : [];

  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    selectedTypesFromUrl
  );

  useEffect(() => {
    // Sync local state with URL when searchParams change
    const typesFromUrl = searchParams.get("HomeTypes")
      ? searchParams.get("HomeTypes")!.split(",")
      : [];
    setSelectedTypes(typesFromUrl);
  }, [searchParams]);

  const toggleHomeType = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type) // Remove type
      : [...selectedTypes, type]; // Add type

    setSelectedTypes(updatedTypes);

    // Update search parameters
    if (updatedTypes.length > 0) {
      searchParams.set("HomeTypes", updatedTypes.join(","));
    } else {
      searchParams.delete("HomeTypes");
    }
    setSearchParams(searchParams);
  };

  return (
    <div>
      <Dropdown autoClose="outside">
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Home types
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.values(HomeTypes).map((homeType, index) => (
            <Dropdown.Item key={index}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  style={{ marginRight: "8px" }}
                  checked={selectedTypes.includes(homeType)}
                  onChange={() => toggleHomeType(homeType)}
                />
                {homeType}
              </label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
