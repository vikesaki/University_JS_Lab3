function DrawLinearGrafic_02(data_x, data_y, strX, strY) {
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

    // Создаем элемент SVG
    var svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", '500px')
        .attr("height", '400px')
        .attr("margin", 'auto');


    let dat_x = GetMinMaxVal(data_x);
    let dat_y = GetMinMaxVal(data_y);

    var xScale = d3.scaleLinear()
        .domain([dat_x[0], dat_x[1]])
        .range([50, 450]);

    var yScale = d3.scaleLinear()
        .domain([dat_y[0], dat_y[1]])
        .range([250, 50]);

    var xAxis = d3.axisBottom(xScale);
    xAxis.tickFormat(d3.format(".0f"))
        .tickValues(data_x.filter((d, i) => i % 2 === 0).map(d => Number(d).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})));

    var yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(Math.ceil(yScale.domain()[0]), Math.floor(yScale.domain()[1]) + 1, 1))
        .tickFormat(d3.format(".0f"));

    svg.append("g")
        .attr("transform", "translate(0," + 250 + ")")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + 50 + ",0)")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(225," + 290 + ")")
        .append("text")
        .text(strY)
        .attr("class", "x-legend")
        .style("fill", "gray");

    svg.append("g")
        .attr("transform", "translate(" + 20 + ", "+ 200 + ") rotate(-90)")
        .append("text")
        .text(strX)
        .attr("class", "y-legend")
        .style("fill", "gray");


    svg.append("path")
        .datum(data_y)
        .attr("fill", "none")
        .attr("stroke", "#3b0042")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,0")
        .attr("d", d3.line()
            .x(function(d, i) { return xScale(data_x[i]); })
            .y(function(d) { return yScale(d); })
            .curve(d3.curveCardinal.tension(0.1))
        );
}

function GetMinMaxVal(mass) {
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
function tetroidDraw(count) {
    const width = 300;
    const height = 300;
    const radius = 40;

    const svg = d3.select(".curr-graff")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const angles = d3.range(0, 2 * Math.PI, 2 * Math.PI / count);

    //Coordinate here
    const points = angles.map(d => ({
        x: radius * (2 * Math.cos(d) + Math.cos(2 * d)),
        y: radius * (2 * Math.sin(d) - Math.sin(2 * d))
    }));

    const dots = svg.selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", d => d.x + width / 2)
        .attr("cy", d => d.y + height / 2)
        .attr("r", 9)
        .attr("fill", "rgba(2,26,70,0.5)");
}

function GetIntForInput(Elem) {
    let inp = Elem.value;
    inp = parseInt(inp);
    if (!(isNaN(parseInt(inp)) || !isFinite(inp))){
        console.log(inp);
        if(inp >= 10 && inp <= 500) {
            return inp;
        } else return 0;
    } else return 0;
}

let graf_container = document.getElementById('graf-container');
let buttDraw = document.getElementById('butt-02');
let textError = document.getElementById('p-1-1');
textError.style.display = 'none';

let inpEl = document.querySelector("div.r-block input");

buttDraw.addEventListener('click', () => {
    let count = GetIntForInput(inpEl);

    let mainGraf = document.getElementsByClassName('curr-graff');

    if(count != 0) {
        mainGraf[0].style.display = 'block';
        textError.style.display = 'none';

        mainGraf[0].remove();

        let mainGraf2 = document.createElement("div");
        mainGraf2.className = "curr-graff";

        graf_container.insertBefore(mainGraf2, graf_container.firstChild);

        tetroidDraw(count);
    } else {
        mainGraf[0].style.display = 'none';
        textError.style.display = 'block';
    }
});
function MainGenerateGrafic(input_a, input_b) {

    let strLett;

    if(input_b == 0) strLett = "Кол-во частей";
    else if(input_b == 1) strLett = "Max рейтинг";
    else if(input_b == 2) strLett = "Min рейтинг";

    DrawLinearGrafic_02(data_x, data_y, strLett, "Год выхода");
}
