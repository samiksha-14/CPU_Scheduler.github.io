"use strict";
function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}
const aPR = document.getElementById("table"); //selecting query of table to append element to it afterwards
//implentng evevnt listner of add button ->what will happen after clicking on add
let addprocessPR = document.getElementById("addpr");
let deleteprocess = document.getElementById("delete");
let result = document.querySelector("#calculate");
const gtdisp = document.querySelector("#OO");
console.log(gtdisp);
function ADDprocess() {
  let trow = document.createElement("tr"); //creating row
  trow.id = "row"; //giving id to row so we can delete it later
  ///coloumn of pid
  let tdata1 = document.createElement("td"); //data of col 1
  let input1 = document.createElement("input"); //input of col1
  input1.min = 0; //least input it will take is 0
  input1.setAttribute("type", "number"); //setting attribut of input 1
  input1.style.width = "14em";
  input1.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input1.style.border = "hidden";
  input1.style.borderRadius = "10px";
  input1.style.padding = "11px"; //adding css
  input1.style.textAlign = "center";
  tdata1.appendChild(input1); //appending input 1 to its data
  trow.appendChild(tdata1); //appending col to row along with all its attributes and input types
  input1.className = "process"; //giving same class to added row
  //creating next coloumn arrival
  let tdata2 = document.createElement("td");
  let input2 = document.createElement("input");
  input2.min = 0;
  input2.setAttribute("type", "number");
  input2.style.width = "14em";
  input2.style.padding = "6px";
  input2.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input2.style.border = "hidden";
  input2.style.borderRadius = "10px";
  input2.style.padding = "11px";
  input2.style.textAlign = "center";

  tdata2.appendChild(input2);
  trow.appendChild(tdata2);
  input2.className = "Arrival";
  //burst coloumn
  let tdata3 = document.createElement("td");
  let input3 = document.createElement("input");
  input3.min = 0;
  input3.setAttribute("type", "number");
  input3.style.width = "14em";
  input3.style.padding = "6px";
  input3.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input3.style.border = "hidden";
  input3.style.borderRadius = "10px";
  input3.style.padding = "11px";
  tdata3.appendChild(input3);
  trow.appendChild(tdata3);
  input3.style.textAlign = "center";
  input3.className = "Burst";
  //priority col
  let tdata4 = document.createElement("td");
  let input4 = document.createElement("input");
  input4.min = 0;
  input4.setAttribute("type", "number");
  input4.style.width = "14em";
  input4.style.padding = "6px";
  input4.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
  input4.style.border = "hidden";
  input4.style.borderRadius = "10px";
  input4.style.padding = "11px";
  tdata4.appendChild(input4);
  input4.style.textAlign = "center";
  trow.appendChild(tdata4); // 4 coloumns bec priority is included
  input4.className = "Priority";
  aPR.append(trow);
}
addprocessPR.addEventListener("click", ADDprocess);
///deleting rows
function delete_Process() {
  aPR.removeChild(document.getElementById("row"));
}
deleteprocess.addEventListener("click", delete_Process);
//implementing algorithm on clicking calculate |||||||||---------------
//selecting query of calculatebtn
let avg_turnaround_time;
let avg_waiting_time;
let cpu_utilisation;
let throughput;
let waiting_time = []; //waiting time array
let turnaround_time = []; //tat array
let is_completed = []; //make array to check the state of process if it has completed
let start_time = []; //starting time array i.e which process starts when
let completion_time = [];
let current_time = 0; //initially no process starts executing therefore current time is 0
let completed = 0; //no process has completed yet therefore 0
let total_turnaround_time = 0;
let total_waiting_time = 0;
let total_idle_time = 0;
let prev = 0;
var mpST = new Map(); //map
var mpCt = new Map();
/// output display
function resultt() {
  //pid will automatically become an array as the values we are inserting inside it is from node list
  const pid_arr = document.querySelectorAll(".process");
  const arrival_time = document.querySelectorAll(".Arrival");
  const burst_time = document.querySelectorAll(".Burst");
  const priority = document.querySelectorAll(".Priority ");

  //implementng algorithm of priority
  const n = burst_time.length;
  for (let i = 0; i < n; i++) {
    is_completed.push(0); //marking 0 the index of each process no process has been completed yet
  }
  //loop will run until all the process get completed
  while (completed != n) {
    let idx = -1;
    let max = -1; //max will help us to find process with highest priority
    for (let i = 0; i < n; i++) {
      //this for loop will iterate through all the all the process and
      //first it will find the process which has already arrived and has not been completed
      //in second if condition since it will check that if that process has priority greater than the previous one
      //chhosing the index of proccess with highest priority
      if (arrival_time[i].value <= current_time && is_completed[i] == 0) {
        if (priority[i].value > max) {
          //if that process is found then we will update max
          max = Number(priority[i].value);
          idx = i; //save the index in idx
        }
        if (priority[i].value == max) {
          //if priority of both process is same then process will less arrival time will get cpu
          if (arrival_time[i].value < arrival_time[idx].value) {
            max = Number(priority[i].value);
            idx = i;
          }
        }
      }
    }
    //if index of process is not equal to -1 that means there is process exist which is already in the ready q and is not completed yet
    if (idx != -1) {
      start_time[idx] = current_time;
      completion_time[idx] = start_time[idx] + Number(burst_time[idx].value);
      turnaround_time[idx] =
        completion_time[idx] - Number(arrival_time[idx].value);
      waiting_time[idx] = turnaround_time[idx] - Number(burst_time[idx].value);
      // response_time = start_time - arrival_time;

      total_turnaround_time += turnaround_time[idx];
      total_waiting_time += waiting_time[idx];
      total_idle_time += start_time[idx] - prev;

      is_completed[idx] = 1;
      completed++;
      current_time = completion_time[idx];
      prev = current_time;
    } else {
      //if no process is there in ready queue
      current_time++;
    }
  }
  ////making a map correspondig to the starting values and the index to implement gantt-chart
  start_time.forEach(function (value, index) {
    mpST.set(value, index);
  });
  console.log(mpST);
  // //sorting the map on the basis of starting values
  const mapStarttime = new Map(
    Array.from(mpST).sort((a, b) => {
      // a[0], b[0] is the key of the map
      return a[0] - b[0]; //this is simply means return true if a>b
      //that means if a>b already then no swapping but if a<b then neg no(false) will be returned in that
      //case swapping would be done
    })
  );
  console.log(mapStarttime);
  ///making a map correspondin to their completion time
  completion_time.forEach(function (val, ind) {
    mpCt.set(ind, val);
  });
  console.log(mpCt);
  mapStarttime.forEach(function (value, index) {
    console.log(mpCt.get(value));
  });
  avg_turnaround_time = total_turnaround_time / n;
  avg_waiting_time = total_waiting_time / n;
  //for calculating cpu utilization
  let min_arrival_time = 10000000;
  let max_completion_time = -1;
  for (let i = 0; i < n; i++) {
    min_arrival_time = Math.min(
      min_arrival_time,
      Number(arrival_time[i].value)
    );
    // console.log(min_arrival_time);
    max_completion_time = Math.max(max_completion_time, completion_time[i]);
  }
  // console.log(max_completion_time);
  throughput = n / (max_completion_time - min_arrival_time);
  cpu_utilisation =
    ((max_completion_time - total_idle_time) / max_completion_time) * 100;
  ////Displaying the table as output
  let outputtable = document.getElementById("output");
  // const headopt = document.createElement("h3");
  // headopt.innerHTML = "Output table";
  // outputtable.append(headopt);
  //let row = outputtable.insertRow(1);
  for (let index = 0; index < pid_arr.length; index++) {
    let row = outputtable.insertRow(index + 1);
    row.insertCell(0).innerText = pid_arr[index].value;
    row.insertCell(1).innerText = arrival_time[index].value;
    row.insertCell(2).innerText = burst_time[index].value;
    row.insertCell(3).innerText = priority[index].value;
    row.insertCell(4).innerText = waiting_time[index];
    row.insertCell(5).innerText = turnaround_time[index];
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
  ///wiritng the values on the show box
  avgwtime.innerHTML = `Average waititng time:-${prewt}`;
  avgtattime.innerHTML = `Average Turnarround time:-${pretat}`;
  CPUutil.innerHTML = `Cpu Utilization:-${finalcpuutil} %`;
  throughputt.innerHTML = `Throughput:-${finalthroughput} process/unit time`;
  showop.appendChild(avgwtime);
  showop.appendChild(avgtattime);
  showop.appendChild(CPUutil);
  showop.appendChild(throughputt);
  // console.log(showop);

  outputtable.style.visibility = "visible";
  showop.style.visibility = "visible";
  gtdisp.style.visibility = "visible";
  document.querySelector(".gantt").style.visibility = "visible";
  //gantt chart
  let ganttChartData = [];
  let startGantt = 0;
  let ganttheading = document.createElement("h3");

  ///// implementing gantt chart
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
  //heading/////
  let ganttHeading = document.createElement("h3");
  ganttHeading.innerText = "Gantt chart";
  document.querySelector(".gantt").appendChild(ganttHeading);

  // ///making timeline chart///////////////
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
