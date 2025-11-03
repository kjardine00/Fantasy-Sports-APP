export interface TimeOption {
    value: string; // "HH:MM" format
    label: string; // "12:00 PM" format
  }
  
  /**
   * Get today's date in YYYY-MM-DD format (for date input min attribute)
   * Uses local timezone, not UTC
   */
  export const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  /**
   * Get current time in HH:MM format (24-hour)
   */
  export const getCurrentTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  /**
   * Check if a date string (YYYY-MM-DD) is today
   */
  export const isToday = (date: string): boolean => {
    return date === getTodayDate();
  };
  
  /**
   * Generate all time options for the day (every 15 minutes)
   * Returns array with both 24-hour value and 12-hour display label
   */
  export const generateAllTimeOptions = (): TimeOption[] => {
    const times: TimeOption[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        const value = `${hh}:${mm}`;
        
        // Convert to 12-hour format for label
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const label = `${displayHour}:${mm} ${period}`;
        
        times.push({ value, label });
      }
    }
    
    return times;
  };
  
  /**
   * Get available time options, filtering out past times if the date is today
   */
  export const getAvailableTimeOptions = (selectedDate?: string): TimeOption[] => {
    const allTimes = generateAllTimeOptions();
    
    if (selectedDate && isToday(selectedDate)) {
      const currentTime = getCurrentTime();
      return allTimes.filter(time => time.value >= currentTime);
    }
    
    return allTimes;
  };
  
  /**
   * Format 24-hour time (HH:MM) to 12-hour display format (H:MM AM/PM)
   */
  export const formatTimeDisplay = (time24: string): string => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };
  
  /**
   * Parse ISO datetime string (YYYY-MM-DDTHH:MM:SS or YYYY-MM-DD HH:MM:SS+00) into separate date and time
   * Returns { date: "YYYY-MM-DD", time: "HH:MM" } or null if invalid
   */
  export const parseISODatetime = (isoString: string): { date: string; time: string } | null => {
    if (!isoString) {
      return null;
    }
    
    // Handle both "T" separator and space separator (with timezone)
    const separator = isoString.includes("T") ? "T" : " ";
    const parts = isoString.split(separator);
    
    if (parts.length < 2) {
      return null;
    }
    
    const datePart = parts[0];
    const timePartFull = parts[1];
    
    // Extract hours and minutes (ignore seconds and timezone)
    const timeMatch = timePartFull.match(/^(\d{2}):(\d{2})/);
    if (!timeMatch) {
      return null;
    }
    
    const [hh, mm] = [timeMatch[1], timeMatch[2]];
    
    return {
      date: datePart || "",
      time: `${hh}:${mm}`
    };
  };
  
  /**
   * Combine date and time into ISO format (YYYY-MM-DDTHH:MM:00)
   * If only time is provided, returns just the time
   */
  export const combineDateAndTime = (date?: string, time?: string): string => {
    if (date && time) {
      return `${date}T${time}:00`;
    }
    return time || "";
  };

  /**
   * Convert local date and time to UTC ISO string for database storage
   * @param date Local date in YYYY-MM-DD format
   * @param time Local time in HH:MM format (24-hour)
   * @returns UTC ISO string (YYYY-MM-DDTHH:MM:SSZ)
   */
  export const convertLocalToUTC = (date: string, time: string): string => {
    if (!date || !time) {
      return "";
    }

    // Create a date object in local timezone
    // Format: "2025-11-03T20:15:00" (no timezone = local)
    const localDateStr = `${date}T${time}:00`;
    const localDate = new Date(localDateStr);

    // Check if date is valid
    if (isNaN(localDate.getTime())) {
      console.error("Invalid local date/time:", date, time);
      return "";
    }

    // Convert to UTC ISO string
    return localDate.toISOString();
  };

  /**
   * Convert UTC ISO string from database to local date and time
   * @param utcString UTC ISO string (e.g., "2025-11-03T20:15:00Z" or "2025-11-03 20:15:00+00")
   * @returns Object with local date (YYYY-MM-DD) and time (HH:MM) in local timezone
   */
  export const convertUTCToLocal = (utcString: string): { date: string; time: string } | null => {
    if (!utcString) {
      return null;
    }

    // Normalize the UTC string
    let normalized = utcString;
    if (utcString.includes(" ") && !utcString.includes("T")) {
      // Convert "2025-11-03 20:15:00+00" to "2025-11-03T20:15:00Z"
      const parts = utcString.split(" ");
      if (parts.length >= 2) {
        const timePart = parts[1].split(/[+-]/)[0];
        normalized = `${parts[0]}T${timePart}Z`;
      }
    } else if (!utcString.includes("Z") && !utcString.match(/[+-]\d{2}:/)) {
      // If it has T but no timezone, assume UTC
      normalized = utcString + "Z";
    }

    // Parse as UTC
    const utcDate = new Date(normalized);
    if (isNaN(utcDate.getTime())) {
      console.error("Invalid UTC date string:", utcString);
      return null;
    }

    // Convert to local time
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };