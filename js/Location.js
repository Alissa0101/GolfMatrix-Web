class Course{
    constructor(){
        this.holes = [] //{number: int, lat: float, long: float, dist: int}
        this.name = "PH NAME"
    }
}

console.log("Loaded location file")

let courses = []

let maningsHeath = new Course();
maningsHeath.name = "Mannings Heath"
maningsHeath.holes.push({number: 1, lat: 51.048435481877675, long: -0.27366097416561724, dist: 0})//
maningsHeath.holes.push({number: 2, lat: 51.05157082281548, long: -0.27174673252999787, dist: 0})//
maningsHeath.holes.push({number: 3, lat: 51.04894121501648, long: -0.26891890003400964, dist: 0})//
maningsHeath.holes.push({number: "Chickens", lat: 50.972010700293964, long: -0.10903059356302304, dist: 0})//

courses.push(maningsHeath)

console.log(courses)


document.write("<div id='holeDistancesDiv'><br><br><button onClick='getLocation()'>Update Location</button>")
document.write("<p id='holeDistances'>Distance to holes:<br>")
courses.forEach(course => {
    course.holes.forEach(hole => {
        document.write("Hole: " + hole.number + " Distance: "+hole.dist+"<br>")
    });
});
document.write("</p></div>")

function updateDistances(loc){
    console.log(loc.coords)
    let distanceText = document.getElementById("holeDistances")
    distanceText.innerHTML = "Distance to holes:<br>"
    courses.forEach(course => {
        course.holes.forEach(hole => {
            let distance = calcCrow(hole.lat, hole.long, loc.coords.latitude, loc.coords.longitude)
            hole.dist = Math.round(kmToYards(distance));
            distanceText.innerHTML += "<h1>Hole: " + hole.number + " Distance: "+hole.dist+" Yards</h1><br>"
            let closestCarry = getClosestCells(grid_carry, hole.dist)
            let closestTotal = getClosestCells(grid_total, hole.dist)

            distanceText.innerHTML += displayClosest(closestCarry, closestTotal) + "<br><br>"
            console.log(closestCarry, closestTotal)
        });
    });
}

function getLocation() {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(updateDistances);
    } else { 
      console.log("LOCATION ERROR - GetLocation() - Location.js")
    }
}

function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
}

function kmToYards(km){
    let m = km*1000;
    return m * 1.094;
}
