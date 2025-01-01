import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CustomSelect({ formData, updateHobbies }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");
        const formattedOptions = response.data.hobbies.rows.map((item) => ({
          value: item.hobbies_id.toString(),
          label: item.hobby_name,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = options.filter(
      (option) =>
        option.label.toLowerCase().includes(value.toLowerCase()) &&
        !selectedOptions.some((selected) => selected.value === option.value),
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(value.trim() !== "");
  };

  const handleInputFocus = () => {
    const filtered = options.filter(
      (option) =>
        !selectedOptions.some((selected) => selected.value === option.value),
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(true);
  };

  const handleSelectOption = (option) => {
    if (selectedOptions.length >= 10) {
      alert("You can select up to 10 options only.");
      setIsDropdownOpen(false);
      return;
    }
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    setInputValue("");
    setIsDropdownOpen(false);

    updateHobbies(newSelectedOptions);
  };

  const handleRemoveOption = (value) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option.value !== value),
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {" "}
      {/* ใช้ ref ที่นี่ */}
      <label
        htmlFor="hobbies"
        className="block text-sm font-semibold text-gray-700"
      >
        Hobbies / Interests (Maximum 10)
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          id="hobbies"
          placeholder="Type to search or click..."
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="rounded-lg border border-gray-300 bg-white p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* //อันนี้เพิ่มค่า option แต่ติดปัญหาที่ไม่อัพเดท ก่อนส่งค่า */}
        {/* {isDropdownOpen && (
          <ul className="absolute top-full z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li
                onClick={handleAddNewOption}
                className="cursor-pointer p-2 text-blue-600 hover:bg-blue-100"
              >
                Add "{inputValue}" as a new option
              </li>
            )}
          </ul>
        )} */}

        {/* อันนี้ตัวแก้ไขโดยไม่ให้เพิ่ม option */}
        {isDropdownOpen && (
          <ul className="absolute top-full z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))
            ) : (
              // ไม่แสดงรายการเพิ่มใหม่ในกรณีที่ไม่มีตัวเลือก
              <li className="cursor-pointer p-2 text-gray-500">
                No results found
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center rounded-full bg-pink-200 px-3 py-1 text-blue-500"
            >
              <span className="mr-2">{option.label}</span>
              <button
                onClick={() => handleRemoveOption(option.value)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
