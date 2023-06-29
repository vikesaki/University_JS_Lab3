function myRound(int, okr)
{
    let out = Math.round((int)*10**okr)/10**okr;
    return(out);
}
function DrawLinearGrafic(data_x, data_y, strX, strY) {
    if (!Array.isArray(data_x) || !Array.isArray(data_y) || data_x.length !== data_y.length) {
        console.error("Invalid input data");
        return;
    }
    for (var i = 0; i < data_x.length; i++) {
        if (isNaN(data_x[i]) || isNaN(data_y[i])) {
            console.error("Invalid input data");
            return;
        }
    }

    var svg = d3.select(".curr-graff_02")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');


    let dat_x = GetMinMaxVal_2(data_x);
    let dat_y = GetMinMaxVal_2(data_y);

    var xScale = d3.scaleLinear()
        .domain([dat_x[0], dat_x[1]])
        .range([50, 450]);

    var yScale = d3.scaleLinear()
        .domain([dat_y[0], dat_y[1]])
        .range([250, 50]);

    var xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat()

    let yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);


    svg.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(255," + 290 + ")")
        .append("text")
        .text(strY)
        .attr("class", "x-legend")

    svg.append("g")
        .attr("transform", "translate(" + 10 + ", "+ 155 + ") rotate(-90)")
        .append("text")
        .text(strX)
        .attr("class", "y-legend")


    svg.selectAll(".dot")
        .data(data_y)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d, i) { return xScale(data_x[i]); })
        .attr("cy", function(d) { return yScale(d); })
        .attr("r", 1.5)
        .attr("fill", "#aa9c00");

}

function GetMinMaxVal_2(mass) {
    for(let i = 0; i<mass.length; i++) {
        mass[i] = parseFloat(mass[i]);
    }

    let min = d3.min(mass);
    let max = d3.max(mass);
    let gerr = max-min;

    let outMin = min - gerr*0.1;
    let outMax = max + gerr*0.1;

    let outMass = [outMin, outMax];
    console.log('sizeMass = ' + outMass);
    return outMass;
}

//Formula here
function GenerateMassFromValuesOfFormula(valMass) {
    let f = x => {
        const value = (Math.pow(x, 2) + 8)/ (Math.sqrt(Math.pow(x, 2) - 4));
        return value;
    };

    let countOfDots = (valMass[1] - valMass[0])*20;
    if(countOfDots < 300) countOfDots = 300;
    let mapResult = {};
    let massOfFinitDots = []

    for (let i = 0; i <= countOfDots; i++) {
        let x = valMass[0] + (i * (valMass[1] - valMass[0])) / countOfDots;

        let currVal = f(x);

        if(Math.abs(currVal) > 1000) {
            console.log(x + ' - точка разрыва!');
            massOfFinitDots.push(x);
            currVal > 0 ? currVal = 1000 : currVal = -1000;
        } else {
            if(isFinite(currVal) === true){
                currVal = myRound(currVal, 5);
                mapResult[x] = currVal;
            }
        }
    }

    for(let i = 0; i < massOfFinitDots.length; i++) {
        let step = 0.0005;
        let widt = 0.15;

        if(massOfFinitDots[i] == -5) {
            step = 0.00000001;
            widt = 0.0001;
        }

        for(let x = massOfFinitDots[i] - widt; x < massOfFinitDots[i] + widt; x += step) {
            let currVal = f(x);

            if ((Math.abs(currVal) < 1000)) {
                if(isFinite(currVal) === true){
                    currVal = myRound(currVal, 5);
                    mapResult[x] = currVal;
                }
            }
        }
    }

    return mapResult;
}

function GetIntForInput_2(Elem) {
    bool_isIntValCorrect = false;
    let inp = Elem.value;
    inp = parseFloat(inp);
    if (!(isNaN(parseInt(inp)) || !isFinite(inp))){
        console.log(inp);
        if(inp >= -50 && inp <= 50) {
            bool_isIntValCorrect = true;
            return inp;
        } else return 0;
    } else return 0;
}

let graf_container_2 = document.getElementById('graf-container_02');
let buttDraw_2 = document.getElementById('butt-003');
let textError_2 = document.getElementById('p-1-2');
textError_2.style.display = 'none';

let inpEl_2_01 = document.querySelector("#pg-0-inp-1");
let inpEl_2_02 = document.querySelector("#pg-0-inp-2");

let bool_isIntValCorrect = false;

let data_x = [];
let data_y = [];

buttDraw_2.addEventListener('click', () => {
    console.log('Кнопка нажата!');

    let valMass_1_val = GetIntForInput_2(inpEl_2_01);
    let valMass_2_val = GetIntForInput_2(inpEl_2_02);

    let valMass = [];

    let mainGraf_02 = document.getElementsByClassName('curr-graff_02');

    let bool_isAllOk = true;

    if (!(bool_isIntValCorrect == true))
        bool_isAllOk = false;
    if (!(valMass_1_val < valMass_2_val))
        bool_isAllOk = false;


    if(bool_isAllOk) {
        valMass[0] = valMass_1_val;
        valMass[1] = valMass_2_val;

        mainGraf_02[0].style.display = 'block';
        textError_2.style.display = 'none';


        let inMap = GenerateMassFromValuesOfFormula(valMass);

        console.log(inMap);

        data_x = Object.keys(inMap);
        data_y = Object.values(inMap);

        mainGraf_02[0].remove();

        let mainGraf2 = document.createElement("div");
        mainGraf2.className = "curr-graff_02";

        graf_container_2.insertBefore(mainGraf2, graf_container_2.firstChild);

        DrawLinearGrafic(data_x, data_y, "Y", "X");
    } else {
        mainGraf_02[0].style.display = 'none';
        textError_2.style.display = 'block';
    }
});