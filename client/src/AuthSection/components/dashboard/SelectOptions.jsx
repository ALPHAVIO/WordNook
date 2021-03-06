import React from "react";

function SelectOptions({ selectOptions, selectedOption }) {
  const options = [
    {
      id: "all",
      title: "All",
    },
    {
      id: "public",
      title: "Public",
    },
    {
      id: "private",
      title: "Private",
    },
    {
      id: "saved",
      title: "Saved",
    },
  ];
  return (
    <div className="mx-auto my-2 d-flex justify-content-around pt-2 text-center">
      {options.map((option) =>
        option.id === selectedOption ? (
          <div
            key={option.id}
            className="options text-danger border-bottom border-danger"
          >
            <h6>{option.title}</h6>
          </div>
        ) : (
          <div
            key={option.id}
            className="options"
            onClick={() => selectOptions(option.id)}
          >
            <h6>{option.title}</h6>
          </div>
        )
      )}
    </div>
  );
}

export default SelectOptions;
