export const TRAVELERS=['Dan','Emily','Lyssie','Ashton','Alec'];
export const REMOTE_PARTICIPANTS=['Alexis'];
export const PEOPLE=[...TRAVELERS,...REMOTE_PARTICIPANTS];
export const OVERVIEW=[['Thu 3','Arrive Denver'],['Fri 4','Breakfast, shopping & Salida'],['Sat 5','UTV riding'],['Sat 5','Saturday evening wedding'],['Sun 6','Adventure or chill day'],['Mon 7','Adventure or slow day'],['Tue 8','Fly home']];
export const DEFAULT_ITINERARY={
  Friday:{day:'Friday',title:'Breakfast, shopping & Salida',details:['Breakfast in Denver','Shopping in Denver','Drive to Salida','Optional hike along the way'],locked:true,updatedBy:'Dan'},
  Saturday:{day:'Saturday',title:'UTV riding',details:['Morning · UTV riding','Late morning / early afternoon · Lunch and free time','Afternoon · Shower, relax and get ready for the wedding'],locked:true,updatedBy:'Dan'}
};
