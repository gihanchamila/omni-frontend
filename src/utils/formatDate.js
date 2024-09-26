export const formatDate = (date) => {
    if (!date) return ""; // Handle null or empty date
    const d = new Date(date); // Ensure it's a Date object
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-'); // Format as YYYY-MM-DD
  };