export const minutesToHours = (numb) =>  {
  var hours = Math.floor((numb)/60).toString();
  var minutes = ((numb)%60).toString();
  if (minutes < 10) {minutes = "0"+minutes;}
  if (hours < 10) {hours = "0"+hours;}
  return hours + ':' + minutes + 'h';
};

export const dateNow = (today) => {
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm;
  } 
  return dd + '/' + mm + '/' + yyyy;
};