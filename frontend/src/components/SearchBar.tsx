import React, { useEffect, useState } from "react";
import Select from "react-select";

interface SearchBarProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function SearchBar({ setQuery }: SearchBarProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/list/");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tag/list/");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.toLowerCase(),
    label: category,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.toLowerCase(),
    label: tag,
  }));

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);
  return (
    <div className="max-w-[1150px] mx-auto w-full px-4 xl:px-0 py-2">
      <div className="flex justify-between gap-4 flex-col sm:flex-row">
        <div className="flex justify-start gap-5">
          <Select
            options={categoryOptions}
            placeholder="Category"
            onChange={(choice) => setQuery("?category=" + choice?.value)}
          />
          <Select
            options={tagOptions}
            placeholder="Tag"
            onChange={(choice) => setQuery("?tags=" + choice?.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 bg-gray-200 border border-gray-500 rounded"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              setQuery("?search=" + searchValue);
              setSearchValue("");
            }
          }}
        />
      </div>
    </div>
  );
}

export default SearchBar;
