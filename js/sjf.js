"use strict";
function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}
const table = document.getElementById("table");
const addbtn = document.getElementById("add");
const deletebtn = document.querySelector(".delete");
const outputtable = document.getElementById("output");
const result = document.querySelector(".Calculate");
const gtdisp = document.querySelector("#OO");
//function to add process
function ADDprocess() {
  let trow = document.createElement("tr"); //creating element row
  trow.id = "row"; //giving id to row so we can delete it later
  ///coloumn of pid
  let tdata1 = document.createElement("td"); //data of col 1
  let input1 = document.createElement("input"); //input of col1
  input1.min = 0; //least input it will take is 0
  input1.setAttribute("type", "number"); //setting attribut of input 1
  input1.style.width = "15em";
  input1.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input1.style.border = "hidden";
  input1.style.borderRadius = "10px";
  input1.style.padding = "12px"; //adding css
  tdata1.appendChild(input1); //appending input 1 to its data
  trow.appendChild(tdata1); //appending col to row along with all its attributes and input types
  input1.id = "PID"; //giving same class to added row
  //creating next coloumn arrival
  let tdata2 = document.createElement("td");
  let input2 = document.createElement("input");
  input2.min = 0;
  input2.setAttribute("type", "number");
  input2.style.width = "15em";
  input2.style.padding = "6px";
  input2.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input2.style.border = "hidden";
  input2.style.borderRadius = "10px";
  input2.style.padding = "12px";

  tdata2.appendChild(input2);
  trow.appendChild(tdata2);
  input2.id = "ART";
  //burst coloumn
  let tdata3 = document.createElement("td");
  let input3 = document.createElement("input");
  input3.min = 0;
  input3.setAttribute("type", "number");
  input3.style.width = "15em";
  input3.style.padding = "6px";
  input3.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input3.style.border = "hidden";
  input3.style.borderRadius = "10px";
  input3.style.padding = "12px";
  tdata3.appendChild(input3);
  trow.appendChild(tdata3);
  input3.id = "BT";
  table.append(trow);
}
addbtn.addEventListener("click", ADDprocess);
///function to delete process
function delete_Process() {
  table.removeChild(document.getElementById("row"));
}
deletebtn.addEventListener("click", delete_Process);
//making arrays
let start_time = [];
let completion_time = [];
let turnaround_time = [];
let waiting_time = [];
let response_time = [];
//initializing variables
let avg_turnaround_time;
let avg_waiting_time;
let avg_response_time;
let cpu_utilisation;
let total_turnaround_time = 0;
let total_waiting_time = 0;
let total_response_time = 0;
let total_idle_time = 0;
let throughput;
let is_completed = [];
let current_time = 0;
let completed = 0;
let prev = 0;
let mpST = new Map();
let mpCt = new Map();
///function to calculate
function resultt() {
  console.log("clicked");
  const arrvialarray = document.querySelectorAll("#ART");
  const burstarray = document.querySelectorAll("#BT");
  const pidarr = document.querySelectorAll("#PID");
  const n = burstarray.length;
  for (let i = 0; i < n; i++) {
    is_completed.push(0); //marking 0 the index of each process no process has been completed yet
  }
  ///while loop
  while (completed != n) {
    let idx = -1;
    let mn = 1000; // variable to help in sorting
    for (let i = 0; i < n; i++) {
      if (arrvialarray[i].value <= current_time && is_completed[i] == 0) {
        //if process is arrived in the cpu and has not been completed ye
        if (burstarray[i].value < mn) {
          //and if the burst time of process is less
          mn = Number(burstarray[i].value);
          idx = i;
        }
        if (burstarray[i].value == mn) {
          //if burst time of process is equal then the procees with less arrival time will taken into consideration
          if (arrvialarray[i].value < arrvialarray[idx].value) {
            mn = Number(burstarray[i].value);
            idx = i;
          }
        }
      }
    }
    if (idx != -1) {
      start_time[idx] = current_time;
      completion_time[idx] = start_time[idx] + Number(burstarray[idx].value);
      turnaround_time[idx] =
        completion_time[idx] - Number(arrvialarray[idx].value);
      waiting_time[idx] = turnaround_time[idx] - Number(burstarray[idx].value);
      // response_time[idx] = start_time[idx] - Number(arrvialarray[idx].value);
      total_turnaround_time += turnaround_time[idx];
      total_waiting_time += waiting_time[idx];
      total_response_time += response_time[idx];
      total_idle_time += start_time[idx] - prev;

      is_completed[idx] = 1;
      completed++;
      current_time = completion_time[idx];
      prev = current_time;
    } else {
      current_time++;
    }
  }
  //making a map corresponding to the starting values and the index to implement gantt-chart
  start_time.forEach(function (value, index) {
    mpST.set(value, index);
  });
  // //sorting the map on the basis of starting values
  const mapStarttime = new Map(
    //this function will make an array out of the key of starting map and then it will sort it
    Array.from(mpST).sort((a, b) => {
      // a[0], b[0] is the key of the map
      return a[0] - b[0]; //this is simply means return true if a>b
      //that means if a>b already then no swapping but if a<b then neg no(false) will be returned in that
      //case swapping would be done
    })
  );
  completion_time.forEach(function (val, ind) {
    mpCt.set(ind, val);
  });
  ////
  let min_arrival_time = 1000;
  let max_completion_time = -1;
  for (let i = 0; i < n; i++) {
    min_arrival_time = Math.min(
      min_arrival_time,
      Number(arrvialarray[i].value)
    );
    max_completion_time = Math.max(max_completion_time, completion_time[i]);
  }
  avg_turnaround_time = total_turnaround_time / n;
  avg_waiting_time = total_waiting_time / n;
  avg_response_time = total_response_time / n;
  cpu_utilisation =
    ((max_completion_time - total_idle_time) / max_completion_time) * 100;
  throughput = n / (max_completion_time - min_arrival_time);
  let row = outputtable.insertRow(1);
  for (let index = 0; index < pidarr.length; index++) {
    let row = outputtable.insertRow(index + 1);
    row.insertCell(0).innerText = pidarr[index].value;
    row.insertCell(1).innerText = arrvialarray[index].value;
    row.insertCell(2).innerText = burstarray[index].value;
    row.insertCell(3).innerText = waiting_time[index];
    row.insertCell(4).innerText = turnaround_time[index];
  }
  ///creating output box of avg's
  const showop = document.querySelector(".show");
  const avgwtime = document.createElement("h6");
  const avgtattime = document.createElement("h6");
  const CPUutil = document.createElement("h6");
  const throughputt = document.createElement("h6");
  //setting precision of float
  let finalthroughput = throughput.toPrecision(2);
  let finalcpuutil = cpu_utilisation.toPrecision(3);
  let pretat = avg_turnaround_time.toPrecision(3);
  let prewt = avg_waiting_time.toPrecision(3);
  avgwtime.innerHTML = `Average waititng time:-${prewt}`;
  avgtattime.innerHTML = `Average Turnarround time:-${pretat}`;
  CPUutil.innerHTML = `Cpu Utilization:-${finalcpuutil} %`;
  throughputt.innerHTML = `Throughput:-${finalthroughput} process/unit time`;
  showop.appendChild(avgwtime);
  showop.appendChild(avgtattime);
  showop.appendChild(CPUutil);
  showop.appendChild(throughputt);
  outputtable.style.visibility = "visible";
  showop.style.visibility = "visible";
  gtdisp.style.visibility = "visible";
  ///ganttt chart
  mapStarttime.forEach(function (val, key) {
    console.log(`${val}::${key}`);
  });
  let ganttChartData = [];
  let startGantt = 0;
  //implementing gantt chart
  mapStarttime.forEach(function (vall, keyyy) {
    if (startGantt < keyyy) {
      //nothing
      ganttChartData.push([
        "Time",
        "Empty",
        "black",
        getDate(startGantt),
        getDate(keyyy),
      ]);
      startGantt = keyyy;
    }
    if (startGantt >= keyyy) {
      //process
      ganttChartData.push([
        "Time",
        "P" + vall,
        "",
        getDate(startGantt),
        getDate(mpCt.get(vall)),
      ]);
    }
    startGantt = mpCt.get(vall);
  });
  google.charts.load("current", { packages: ["timeline"] });
  google.charts.setOnLoadCallback(drawGanttChart);
  function drawGanttChart() {
    var container = document.getElementById("gantt-chart");
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: "string", id: "Gantt Chart" });
    dataTable.addColumn({ type: "string", id: "Process" });
    dataTable.addColumn({ type: "string", id: "style", role: "style" });
    dataTable.addColumn({ type: "date", id: "Start" });
    dataTable.addColumn({ type: "date", id: "End" });
    dataTable.addRows(ganttChartData);
    let ganttWidth = "100%";
    if (startGantt >= 20) {
      ganttWidth = 0.05 * startGantt * screen.availWidth;
    }
    var options = {
      width: ganttWidth,
      colors: [
        "#f6c7b6",
        "#DAB4E5",
        "#F0CA86",
        "DDE59B",
        "#e0440e",
        "#e6693e",
        "#ec8f6e",
        "#f3b49f",
      ],
      timeline: {
        showRowLabels: false,
        avoidOverlappingGridLines: false,
      },
    };
    chart.draw(dataTable, options);
  }
  {
    once: true;
  }
  let ganttHeading = document.createElement("h3");
  ganttHeading.innerText = "Gantt chart";
  document.querySelector(".gantt").appendChild(ganttHeading);
  // creating timeline chart///////////////
  let startTimeline = 0;
  let timelineChartData = [];

  mapStarttime.forEach(function (vall, keyyy) {
    if (startTimeline < keyyy) {
      startTimeline = keyyy;
    }
    if (startTimeline >= keyyy) {
      //process
      timelineChartData.push([
        `P${vall}`,
        "P" + vall,
        "",
        getDate(startTimeline),
        getDate(mpCt.get(vall)),
      ]);
    }
    startTimeline = mpCt.get(vall);
  });
  timelineChartData.sort(
    (a, b) =>
      parseInt(a[0].substring(1, a[0].length)) -
      parseInt(b[0].substring(1, b[0].length))
  );
  google.charts.load("current", { packages: ["timeline"] });
  google.charts.setOnLoadCallback(drawTimelineChart);
  ///function
  function drawTimelineChart() {
    var container = document.getElementById("timeline-chart");
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: "string", id: "Gantt Chart" });
    dataTable.addColumn({ type: "string", id: "Process" });
    dataTable.addColumn({ type: "string", id: "style", role: "style" });
    dataTable.addColumn({ type: "date", id: "Start" });
    dataTable.addColumn({ type: "date", id: "End" });
    dataTable.addRows(timelineChartData);
    let timelineWidth = "100%";
    if (startTimeline >= 20) {
      timelineWidth = 0.05 * startTimeline * screen.availWidth;
    }
    var options = {
      width: timelineWidth,
      colors: [
        "#f6c7b6",
        "#DAB4E5",
        "#F0CA86",
        "DDE59B",
        "#e0440e",
        "#e6693e",
        "#ec8f6e",
        "#f3b49f",
      ],
      timeline: {
        showRowLabels: true,
        avoidOverlappingGridLines: false,
      },
    };
    chart.draw(dataTable, options);
  }
  //heading/////
  let timeHeading = document.createElement("h3");
  timeHeading.innerText = "Timeline chart";
  document.querySelector(".time").appendChild(timeHeading);
}
result.addEventListener("click", resultt);
