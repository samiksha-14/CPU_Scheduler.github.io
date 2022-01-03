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
let burst_rem = [];
let current_time = 0; //initially no process starts executing therefore current time is 0
let completed = 0; //no process has completed yet therefore 0
let total_turnaround_time = 0;
let total_waiting_time = 0;
let total_idle_time = 0;
let prev = 0;
// var mpST = new Map(); //map
// var mpCt = new Map();
/// output display
let ganttChartData = []; //array to store gantt chart data at as the algorithm advance
let startGantt = 0; //initital starting starting time
function resultt() {
  //pid will automatically become an array as the values we are inserting inside it is from node list
  const pid_arr = document.querySelectorAll(".process");
  const arrival_time = document.querySelectorAll(".Arrival");
  const burst_time = document.querySelectorAll(".Burst");
  const priority = document.querySelectorAll(".Priority ");
  for (let i = 0; i < burst_time.length; i++) {
    burst_rem[i] = Number(burst_time[i].value); ///remaining burst time array for processes
  }

  //implementng algorithm of priority preemptive
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
      //if the remaining burst time of this process is equal to the actual
      //burst time that means the process is getting executed first timme
      if (burst_rem[idx] == Number(burst_time[idx].value)) {
        start_time[idx] = current_time;
        total_idle_time += start_time[idx] - prev;
      }
      //if process is not getting executed first time then decrease its burst time
      burst_rem[idx] -= 1;
      ////implementing gantt chart
      if (startGantt < start_time[idx]) {
        //nothing
        startGantt = current_time;
      }
      current_time++; //increasing the current time
      if (startGantt >= start_time[idx]) {
        ganttChartData.push([idx, "P" + idx, startGantt, current_time]);
        //this is a 2d array which will have the values correseponing to each process currently in ready q
        // row will be index of process
        //e.g ganttchartdata[0][0]=[idx,pidx,start-time,end-time] 4 coloumn
      }
      startGantt = current_time;
      ////END OF GANTT CHART DATA
      prev = current_time;
      if (burst_rem[idx] == 0) {
        //burst time ==0 means the process is completed and i can calulate all the stuff abt it
        completion_time[idx] = current_time;
        turnaround_time[idx] =
          completion_time[idx] - Number(arrival_time[idx].value);
        waiting_time[idx] =
          turnaround_time[idx] - Number(burst_time[idx].value);
        // response_time = start_time - arrival_time;

        total_turnaround_time += turnaround_time[idx];
        total_waiting_time += waiting_time[idx];

        is_completed[idx] = 1;
        completed++;
      }
    } else {
      //if no process is there in ready queue
      current_time++;
    }
  }
  console.log(start_time);
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

  outputtable.style.visibility = "visible";
  showop.style.visibility = "visible";
  gtdisp.style.visibility = "visible";
  ////CREATING GANTT-CHART
  ////test----ARRAYYYY to make a container for gantt chart
  console.log(ganttChartData);
  let testarr = [];
  for (let i = 0; i < ganttChartData.length - 1; ) {
    if (ganttChartData[i][0] !== ganttChartData[i + 1][0]) {
      //this if condition check if the continous rows are not same then just push the start-t and end-t
      testarr.push([
        ganttChartData[i][0],
        ganttChartData[i][2],
        ganttChartData[i][3],
      ]);
      i++;
    } else {
      let j = i; //else if rows are same then to merge them in single row so as to remove the breaks from g-chart
      while (
        i < ganttChartData.length - 1 &&
        ganttChartData[i][0] == ganttChartData[i + 1][0]
      ) {
        i++;
      }
      testarr.push([
        ganttChartData[j][0],
        ganttChartData[j][2],
        ganttChartData[i][3],
      ]);
      i++;
    }
  }
  testarr.push([
    ganttChartData[ganttChartData.length - 1][0],
    ganttChartData[ganttChartData.length - 1][2],
    ganttChartData[ganttChartData.length - 1][3],
  ]); //pushing the data of last coloumn
  // console.log(ganttChartData);
  console.log(testarr);
  ///gantt chart
  let ganttChartARR = [];
  let startG = 0;
  ///// implementing gantt chart
  for (let i = 0; i < testarr.length; i++) {
    if (startG < testarr[i][1]) {
      //nothing
      ganttChartARR.push([
        "Time",
        "Empty",
        "black",
        getDate(startG),
        getDate(testarr[i][1]),
      ]);
      startG = testarr[i][1];
    }
    if (startG >= testarr[i][1]) {
      //process
      ganttChartARR.push([
        "Time",
        "P" + testarr[i][0],
        "",
        getDate(startG),
        getDate(testarr[i][2]),
      ]);
    }
    startG = testarr[i][2];
  }
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
    dataTable.addRows(ganttChartARR);
    let ganttWidth = "100%";
    if (startG >= 20) {
      ganttWidth = 0.05 * startG * screen.availWidth;
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
  ///
  //heading/////
  let ganttHeading = document.createElement("h3");
  ganttHeading.innerText = "Gantt chart";
  document.querySelector(".gantt").appendChild(ganttHeading);

  // // ///making timeline chart///////////////
  let startTimeline = 0;
  let timelineChartData = [];

  for (let i = 0; i < testarr.length; i++) {
    if (startTimeline < testarr[i][1]) {
      startTimeline = testarr[i][1];
    }
    if (startTimeline >= testarr[i][1]) {
      //process
      timelineChartData.push([
        `P${testarr[i][0]}`,
        "P" + testarr[i][0],
        "",
        getDate(startTimeline),
        getDate(testarr[i][2]),
      ]);
    }
    startTimeline = testarr[i][1];
  }
  console.log(timelineChartData);
  timelineChartData.sort((a, b) => a[0] - b[0]);
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
