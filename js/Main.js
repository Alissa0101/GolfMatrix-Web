


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
    localStorage.setItem("grid_carry", "{\"0_60deg\":{\"Pitch\":8,\"Half\":20,\"3/4\":36,\"Full\":52},\"1_SW\":{\"Pitch\":13,\"Half\":31,\"3/4\":51,\"Full\":60},\"2_GW\":{\"Pitch\":17,\"Half\":41,\"3/4\":66,\"Full\":86},\"3_PW\":{\"Pitch\":21,\"Half\":58,\"3/4\":81,\"Full\":105},\"4_9\":{\"Pitch\":6,\"Half\":41,\"3/4\":80,\"Full\":128},\"5_8\":{\"Pitch\":15,\"Half\":79,\"3/4\":121,\"Full\":150},\"6_7\":{\"Pitch\":24,\"Half\":86,\"3/4\":147,\"Full\":159},\"7_6\":{\"Pitch\":21,\"Half\":91,\"3/4\":162,\"Full\":170},\"8_5\":{\"Pitch\":26,\"Half\":105,\"3/4\":170,\"Full\":184},\"9_4h\":{\"Pitch\":118,\"Half\":119,\"3/4\":176,\"Full\":0},\"10_3h\":{\"Pitch\":127,\"Half\":128,\"3/4\":178,\"Full\":195},\"11_3w\":{\"Pitch\":193,\"Half\":194,\"3/4\":195,\"Full\":210},\"12_D\":{\"Pitch\":226,\"Half\":227,\"3/4\":228,\"Full\":229}}")
    grid_carry = generateGrid(grid_X_Keys, grid_Y_Keys)
    console.log("made new grid")
} else{
    grid_carry = JSON.parse(localStorage.getItem("grid_carry"))
    console.log("loaded grid")
}

if(localStorage.getItem("grid_total") == undefined){
    localStorage.setItem("grid_total", "{\"0_60deg\":{\"Pitch\":8,\"Half\":20,\"3/4\":35,\"Full\":50},\"1_SW\":{\"Pitch\":13,\"Half\":31,\"3/4\":51,\"Full\":59},\"2_GW\":{\"Pitch\":18,\"Half\":42,\"3/4\":66,\"Full\":86},\"3_PW\":{\"Pitch\":23,\"Half\":60,\"3/4\":82,\"Full\":106},\"4_9\":{\"Pitch\":7,\"Half\":48,\"3/4\":88,\"Full\":137},\"5_8\":{\"Pitch\":19,\"Half\":90,\"3/4\":134,\"Full\":162},\"6_7\":{\"Pitch\":28,\"Half\":99,\"3/4\":161,\"Full\":171},\"7_6\":{\"Pitch\":26,\"Half\":105,\"3/4\":178,\"Full\":186},\"8_5\":{\"Pitch\":35,\"Half\":124,\"3/4\":190,\"Full\":202},\"9_4h\":{\"Pitch\":132,\"Half\":133,\"3/4\":193,\"Full\":0},\"10_3h\":{\"Pitch\":147,\"Half\":148,\"3/4\":199,\"Full\":216},\"11_3w\":{\"Pitch\":214,\"Half\":215,\"3/4\":216,\"Full\":231},\"12_D\":{\"Pitch\":249,\"Half\":250,\"3/4\":251,\"Full\":252}}")
    grid_total = generateGrid(grid_X_Keys, grid_Y_Keys)
    console.log("made new grid")
} else{
    grid_total = JSON.parse(localStorage.getItem("grid_total"))
    console.log("loaded grid")
}

document.write(createInput())
document.write(createOutputBox())
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

displayClosest(carryClosest, totalClosest);

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

function hideShowGrid(gridName){
    let gridElement = document.getElementById(gridName+"_inner");

    if(gridElement.style.visibility == "hidden"){
        gridElement.style = "visibility:visible"
        if(gridName == "grid_carry"){
            carryOpen = true;
        } else if(gridName == "grid_total"){
            totalOpen = true;
        }
    } else {
        gridElement.style = "visibility:hidden"
        if(gridName == "grid_carry"){
            carryOpen = false;
        } else if(gridName == "grid_total"){
            totalOpen = false;
        }
    }

    console.log(carryOpen, totalOpen)

    let carryGridElement = document.getElementById("grid_carry_inner");
    let totalGridElement = document.getElementById("grid_total_inner");

     if(carryOpen == true &&  totalOpen == true){
        if(gridName == "grid_carry"){
            totalGridElement.style = "visibility:hidden"
            totalOpen = false;
        } else if(gridName == "grid_total"){
            carryGridElement.style = "visibility:hidden"
            carryOpen = false;
        }
     }

}

function gridToDocumentString(grid, gridX, gridY, gridName){
    let gridStr = "<div class='grid'>"
    gridStr += "<p class='gridHideButton' id='"+gridName+"_hide' onclick="+'hideShowGrid("'+gridName+'")>'+gridName+" <p>"
    gridStr += "<div id='"+gridName+"_inner' style='visibility:hidden'>"
    gridStr += "<h1>"+gridName+"</h1>"
    gridStr += "<input type='text' id='XName' value='' style='visibility:hidden'></input>"
    
    for(let x = 0; x < gridX.length; x++){
        gridStr += "<input type='text' id='XName' value='" + gridX[x] + "'></input>"
    }

    for(let y = 0; y < gridY.length; y++){
        gridStr += "<div id='gridRow'> <input type='text' id='YName' name='" + y + "_" + gridY[y] + "' value='" + gridY[y] + "'></input>"
        for(let x = 0; x < gridX.length; x++){
            gridStr += "<div id='entry'><input pattern='[0-9]*' class='distanceValue' id='"+gridName+"_distanceValue' type='text' name='" + x + ":" + y + "' value='" + grid[y + "_" + gridY[y]][gridX[x]] + "'></input></div>"
        }
        gridStr += "</div>"
    }
    return gridStr + "</div></div>"
}

function createOutputBox(){
    let boxStr = ""
    boxStr += "<div class='outputBox'>"
    boxStr += "<p id='outputBoxText'>Carry:<br/><br/>Total:</p>"
    boxStr += "</div>"
    return boxStr
}

function createInput(){
    let inputStr = ""
    inputStr += "Carry: <input pattern='[0-9]*' type='text' id='input_carry' value='0'></input><br/>"
    inputStr += "Total: <input pattern='[0-9]*' type='text' id='input_total' value='0'></input><br/>"
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

        displayClosest(carryClosest, totalClosest);

    });

    totalInput.addEventListener('input', function (evt) {
        targetTotal = this.value

        carryClosest = getClosestCells(grid_carry, targetCarry);
        totalClosest = getClosestCells(grid_total, targetTotal);

        displayClosest(carryClosest, totalClosest);

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
    console.log("Looking for close cells")
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
    return closest;
}

function displayClosest(carry, total){
    let displayString = "Carry: <br/>"
    for(let i = 0; i < carry.length; i++){
        displayString += carry[i].club + ": " + carry[i].swing + " (" + carry[i].dist + ")" + "<br/>"
    }

    displayString += "<br/><br/>Total: <br/>"

    for(let i = 0; i < total.length; i++){
        displayString += total[i].club + ": " + total[i].swing + " (" + total[i].dist + ")" + "<br/>"
    }
    outputBoxText.innerHTML = displayString
}
