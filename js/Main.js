


/////////////////////////
/////LOCATION BRANCH/////
/////////////////////////



//A grid is 2D array
//X axis (left to right) is the swing strength. Pitch, Half, 3/4, Full
//Y axis (top to bottom) is the type of club
let grid_X_Keys = ["Pitch", "Half", "3/4", "Full"];
let grid_Y_Keys = ["60deg", "SW", "GW", "PW", "9", "8", "7", "6", "5", "4h", "3h", "3w", "D"];
let grid_carry = {};
let grid_total = {};

let targetCarry = 0;
let targetTotal = 0;

let closeMarginMinus = 10;
let closeMarginPlus = 10;

let carryOpen = false;
let totalOpen = false;


if(localStorage.getItem("grid_carry") == undefined){
    localStorage.setItem("grid_carry", "{\"0_60deg\":{\"Pitch\":null,\"Half\":20,\"3/4\":35,\"Full\":60},\"1_SW\":{\"Pitch\":null,\"Half\":30,\"3/4\":50,\"Full\":70},\"2_GW\":{\"Pitch\":null,\"Half\":50,\"3/4\":80,\"Full\":100},\"3_PW\":{\"Pitch\":null,\"Half\":60,\"3/4\":100,\"Full\":120},\"4_9\":{\"Pitch\":null,\"Half\":80,\"3/4\":90,\"Full\":130},\"5_8\":{\"Pitch\":null,\"Half\":80,\"3/4\":120,\"Full\":150},\"6_7\":{\"Pitch\":null,\"Half\":90,\"3/4\":145,\"Full\":160},\"7_6\":{\"Pitch\":null,\"Half\":100,\"3/4\":160,\"Full\":170},\"8_5\":{\"Pitch\":null,\"Half\":110,\"3/4\":170,\"Full\":185},\"9_4h\":{\"Pitch\":null,\"Half\":120,\"3/4\":175,\"Full\":195},\"10_3h\":{\"Pitch\":null,\"Half\":125,\"3/4\":180,\"Full\":200},\"11_3w\":{\"Pitch\":null,\"Half\":null,\"3/4\":195,\"Full\":210},\"12_D\":{\"Pitch\":null,\"Half\":null,\"3/4\":null,\"Full\":230}}")
    grid_carry = generateGrid(grid_X_Keys, grid_Y_Keys)
    console.log("made new grid")
} else{
    grid_carry = JSON.parse(localStorage.getItem("grid_carry"))
    console.log("loaded grid")
}

if(localStorage.getItem("grid_total") == undefined){
    localStorage.setItem("grid_total", "{\"0_60deg\":{\"Pitch\":null,\"Half\":20,\"3/4\":35,\"Full\":50},\"1_SW\":{\"Pitch\":null,\"Half\":30,\"3/4\":50,\"Full\":70},\"2_GW\":{\"Pitch\":null,\"Half\":50,\"3/4\":80,\"Full\":100},\"3_PW\":{\"Pitch\":null,\"Half\":60,\"3/4\":100,\"Full\":120},\"4_9\":{\"Pitch\":null,\"Half\":85,\"3/4\":105,\"Full\":140},\"5_8\":{\"Pitch\":null,\"Half\":90,\"3/4\":135,\"Full\":160},\"6_7\":{\"Pitch\":null,\"Half\":100,\"3/4\":160,\"Full\":170},\"7_6\":{\"Pitch\":null,\"Half\":110,\"3/4\":175,\"Full\":185},\"8_5\":{\"Pitch\":null,\"Half\":125,\"3/4\":190,\"Full\":200},\"9_4h\":{\"Pitch\":null,\"Half\":135,\"3/4\":195,\"Full\":210},\"10_3h\":{\"Pitch\":null,\"Half\":150,\"3/4\":200,\"Full\":215},\"11_3w\":{\"Pitch\":null,\"Half\":null,\"3/4\":216,\"Full\":230},\"12_D\":{\"Pitch\":null,\"Half\":null,\"3/4\":null,\"Full\":250}}")
    grid_total = generateGrid(grid_X_Keys, grid_Y_Keys)
    console.log("made new grid")
} else{
    grid_total = JSON.parse(localStorage.getItem("grid_total"))
    console.log("loaded grid")
}

document.write(createInput())
document.write(createOutputBox())

document.write("<div id='distanceSelect'></div>");
let distanceSelectElem = document.getElementById('distanceSelect');
let distanceInputCarryElem = document.getElementById('distanceInputCarry');
let distanceInputTotalElem = document.getElementById('distanceInputTotal');
document.write("<button id='showLocationButton' class='gridHideButton showLocation' onClick='showLocation()'>Location</button>");
let showLocationButton = document.getElementById('showLocationButton');
let outputBoxElem = document.getElementById('outputBox');

distanceSelect.appendChild(distanceInputCarryElem)
distanceSelect.appendChild(distanceInputTotalElem)
distanceSelect.appendChild(outputBoxElem)
distanceSelect.appendChild(showLocationButton)

document.write(gridToDocumentString(grid_carry, grid_X_Keys, grid_Y_Keys, "grid_carry"))
document.write(gridToDocumentString(grid_total, grid_X_Keys, grid_Y_Keys, "grid_total"))


let outputBoxText = document.getElementById('outputBoxText');

setupGridListners("grid_carry", grid_carry);
setupGridListners("grid_total", grid_total);

setupInputListners();

targetCarry = document.getElementById("input_carry").value
targetTotal = document.getElementById("input_total").value

carryClosest = getClosestCells(grid_carry, targetCarry);
totalClosest = getClosestCells(grid_total, targetTotal);

outputBoxText.innerHTML = displayClosest(carryClosest, totalClosest);



function generateGrid(gridX, gridY){
    let grid = []
    for(let y = 0; y < gridY.length; y++){
        let row = []
        for(let x = 0; x < gridX.length; x++){
            //console.log(gridY[x])
            row[gridX[x]] = 0
        }
        grid[y + "_" + gridY[y]] = row
    }
    return grid
}

function showGrid(gridName){
    distanceSelectElem.style = "visibility:hidden"
    let gridElem = document.getElementById("gridDiv_"+gridName)
    gridElem.style = "visibility:visible"
}

function hideGrid(gridName){
    distanceSelectElem.style = "visibility:visible"
    let gridElem = document.getElementById("gridDiv_"+gridName)
    gridElem.style = "visibility:hidden"
}

function showLocation(){
    distanceSelectElem.style = "visibility:hidden"
    let locationElem = document.getElementById("holeDistancesDiv")
    locationElem.style = "visibility:visible"
}

function hideLocation(){
    distanceSelectElem.style = "visibility:visible"
    let locationElem = document.getElementById("holeDistancesDiv")
    locationElem.style = "visibility:hidden"
    let distanceText = document.getElementById("holeDistances")
    distanceText.innerHTML = "Press the 'Update' button to start<br>"
}

function gridToDocumentString(grid, gridX, gridY, gridName){
    let gridStr = "<div id='gridDiv_"+gridName+"' class='grid'>"
    gridStr += "<h1 class='gridTitle'>"+gridName.replace('grid_', '')+"</h1>"
    gridStr += "<button class='gridHideButton' onClick='hideGrid("+'"'+gridName+'"'+")'>< Back</button>"
    gridStr += "<div id='"+gridName+"_inner' style='visibility:'>"
    
    gridStr += "<input type='text' id='XName' value='' style='visibility:hidden'></input>"
    
    for(let x = 0; x < gridX.length; x++){
        gridStr += "<input type='text' id='XName' value='" + gridX[x] + "'></input>"
    }

    for(let y = 0; y < gridY.length; y++){
        gridStr += "<div id='gridRow'> <input type='text' id='YName' name='" + y + "_" + gridY[y] + "' value='" + gridY[y] + "'></input>"
        for(let x = 0; x < gridX.length; x++){
            let value = grid[y + "_" + gridY[y]][gridX[x]];
            console.log(value)
            if(value == undefined){
                value = "";
            }
            gridStr += "<div id='entry'><input pattern='[0-9]*' class='distanceValue' id='"+gridName+"_distanceValue' type='text' name='" + x + ":" + y + "' value='" + value + "'></input></div>"
        }
        gridStr += "</div>"
    }
    return gridStr + "</div></div>"
}

function createOutputBox(){
    let boxStr = ""
    boxStr += "<div id='outputBox' class='outputBox'>"
    boxStr += "<p id='outputBoxText'>Carry:<br/><br/>Total:</p>"
    boxStr += "</div>"
    return boxStr
}

function createInput(){
    let inputStr = ""
    inputStr += "<div id='distanceInputCarry' class='distanceInput'><p>Carry<button class='gridHideButton' onClick='showGrid("+'"grid_carry"'+")'>Edit</button></p><input pattern='[0-9]*' type='text' id='input_carry' value='75'></input></div><br/>"
    inputStr += "<div id='distanceInputTotal' class='distanceInput'><p>Total<button class='gridHideButton' onClick='showGrid("+'"grid_total"'+")'>Edit</button></p><input pattern='[0-9]*' type='text' id='input_total' value='75'></input></div><br/>"
    //inputStr += "Plus: <input type='text' id='input_plus' value='0'></input><br/>"
    //inputStr += "Minus: <input type='text' id='input_minus' value='0'></input><br/><br/>"
    return inputStr
}

function setupInputListners(){
    let carryInput = document.getElementById("input_carry")
    let totalInput = document.getElementById("input_total")
    let plusInput = document.getElementById("input_plus")
    let minusInput = document.getElementById("input_minus")
    

    carryInput.addEventListener('input', function (evt) {
        targetCarry = this.value

        carryClosest = getClosestCells(grid_carry, targetCarry);
        totalClosest = getClosestCells(grid_total, targetTotal);

        outputBoxText.innerHTML = displayClosest(carryClosest, totalClosest);

    });

    totalInput.addEventListener('input', function (evt) {
        targetTotal = this.value

        carryClosest = getClosestCells(grid_carry, targetCarry);
        totalClosest = getClosestCells(grid_total, targetTotal);

        outputBoxText.innerHTML = displayClosest(carryClosest, totalClosest);

    });

    /**plusInput.addEventListener('input', function (evt) {
        closeMarginPlus = this.value

        carryClosest = getClosestCells(grid_carry, targetCarry);
        totalClosest = getClosestCells(grid_total, targetTotal);

        displayClosest(carryClosest, totalClosest);
    });*/

}

function setupGridListners(gridName, grid){

    let inputs = document.querySelectorAll('[id='+gridName+'_distanceValue]');

    inputs.forEach(input => {
        input.addEventListener('input', function (evt) {
            let XKey = grid_X_Keys[this.name.split(":")[0]]
            let YKey = grid_Y_Keys[this.name.split(":")[1]]
            //console.log("Row: " + XKey + " Col: " + this.name.split(":")[1] + "_" +YKey)
            grid[this.name.split(":")[1] + "_" +YKey][XKey] = parseInt(this.value)
            //console.log(grid_carry)
            //console.log(localStorage)
            let newGrid = {}
            for(let i = 0; i < grid_Y_Keys.length; i++){
                let row = Object.assign({}, grid[i + "_" + grid_Y_Keys[i]])
                newGrid[i + "_" + grid_Y_Keys[i]] = row
            }
            //console.log(JSON.stringify(newGrid))
            localStorage.setItem(gridName, JSON.stringify(newGrid))
            //console.log(localStorage)
        });
    });
    
}



function getClosestCells(grid, target){
    //console.log("Looking for close cells")
    let closest = []
    target = parseInt(target)
    for(let i = 0; i < grid_Y_Keys.length; i++){
        let row = Object.assign({}, grid[i + "_" + grid_Y_Keys[i]])
        let rowName = grid_Y_Keys[i]
        //console.log(rowName + ":")
        //console.log(row)
        //Pitch
        if(row['Pitch'] <= target+closeMarginPlus && row['Pitch'] >= target-closeMarginMinus){
            //console.log(rowName + " Pitch: " + row['Pitch'])
            closest.push({'club': rowName, 'swing': "Pitch", 'dist': row['Pitch']})
        }
        //Half
        if(row['Half'] <= target+closeMarginPlus && row['Half'] >= target-closeMarginMinus){
            //console.log(rowName + " Half: " + row['Half'])
            closest.push({'club': rowName, 'swing': "Half", 'dist': row['Half']})
        }
        //3/4
        if(row['3/4'] <= target+closeMarginPlus && row['3/4'] >= target-closeMarginMinus){
            //console.log(rowName + " 3/4: " + row['3/4'])
            closest.push({'club': rowName, 'swing': "3/4", 'dist': row['3/4']})
        }
        //Full
        if(row['Full'] <= target+closeMarginPlus && row['Full'] >= target-closeMarginMinus){
            //console.log(rowName + " Full: " + row['Full'])
            closest.push({'club': rowName, 'swing': "Full", 'dist': row['Full']})
        }
    }
    //console.log(closest)
    return closest;
}

function getDistanceFromClubAndSwing(grid, club, swing){
    let dist = 0;
    //console.log(grid);
    let index = grid_Y_Keys.indexOf(club);
    clubKey = index + "_" + club;
    //console.log(clubKey, swing)
    dist = grid[clubKey][swing]
    return dist;
}

function displayClosest(carry, total){
    let displayString = "<p class='closestTitle'>Carry</p>"
    for(let i = 0; i < carry.length; i++){
        if(carry[i].dist != 0){
            let totalDist = getDistanceFromClubAndSwing(grid_total, carry[i].club, carry[i].swing);
            displayString += carry[i].club + ": " + carry[i].swing + " (" + carry[i].dist + ")  > (" + totalDist + ")" + "<br/>"
        }
        
    }

    displayString += "<br/><p class='closestTitle'>Total</p>"

    for(let i = 0; i < total.length; i++){
        if(total[i].dist != 0){
            displayString += total[i].club + ": " + total[i].swing + " (" + total[i].dist + ")" + "<br/>"
        }
    }
    //outputBoxText.innerHTML = displayString
    return displayString
}
