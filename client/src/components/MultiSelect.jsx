import PropTypes from "prop-types";
import { useState } from "react";

const MultiSelect = ({ options=[],selectedOptions=[],setSelectedOptions,selectedUsers=[],setSelectedUsers }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = ({_id,username}) => {
    if (selectedOptions.includes(_id)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== _id));
    } else {
      setSelectedOptions([...selectedOptions, _id]);
    }

    if (selectedUsers.includes(username)) {
        setSelectedUsers(selectedUsers.filter((item) => item !== username));
    } else {
        setSelectedUsers([...selectedUsers, username]);
    }
  };

  const isSelected = (option) => selectedOptions.includes(option);

  return (
    <div className="mt-1 block relative w-full">
      <button
        type="button"
        className="flex justify-between items-center w-full px-1 ps-3 py-2 text-left border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUsers.length > 0
          ? selectedUsers.join(", ")
          : "--Select options"}
        <span className="text-[10px] font-black"><i className="fa-solid fa-chevron-down"></i></span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg overflow-y-scroll">
          {options.map(({_id,username}) => (
            <label
              key={_id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected(_id)}
                onChange={() => handleToggleOption({_id,username})}
                className="mr-2 rounded"
              />
              {username}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

MultiSelect.propTypes = {
    options:PropTypes.array,
    selectedOptions:PropTypes.array,
    setSelectedOptions:PropTypes.any,
    selectedUsers:PropTypes.array,
    setSelectedUsers:PropTypes.any
};

export default MultiSelect;
