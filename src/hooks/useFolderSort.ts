import { useState } from "react";

export const useFolderSortSettings = (folderSub: string) => {
  const [sortBy, setSortBy] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("folderSortSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return settings[folderSub] || "date_desc";
      }
    } catch (error) {
      console.error("Error loading sort settings:", error);
    }
    return "date_desc";
  });

  const updateSortBy = (newSortBy: string) => {
    setSortBy(newSortBy);

    try {
      const savedSettings = localStorage.getItem("folderSortSettings");
      const settings = savedSettings ? JSON.parse(savedSettings) : {};

      settings[folderSub] = newSortBy;

      localStorage.setItem("folderSortSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving sort settings:", error);
    }
  };

  return [sortBy, updateSortBy] as const;
};
