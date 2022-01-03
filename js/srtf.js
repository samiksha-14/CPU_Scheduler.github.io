function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}
let a = document.getElementById("table"); //gets the html table
let addprocess = document
  .getElementById("add")
  .addEventListener("click", function add_Process(e) {
    //addind event listener to the add button to add the process.
    let trow = document.createElement("tr"); //creates a new row in the table
    trow.id = "row";
    let tdata1 = document.createElement("td"); //data of col 1
    let input1 = document.createElement("input"); //input of col1
    input1.min = 0; //least input it will take is 0
    input1.setAttribute("type", "number"); //setting attribut of input 1
    input1.style.width = "15em";
    input1.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input1.style.border = "hidden";
    input1.style.borderRadius = "10px";
    input1.style.padding = "11px"; //adding css
    tdata1.appendChild(input1); //appending input 1 to its data
    trow.appendChild(tdata1); //appending col to row along with all its attributes and input types
    input1.className = "process"; //giving same class to added row
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
    input2.style.padding = "11px";

    tdata2.appendChild(input2);
    trow.appendChild(tdata2);
    input2.className = "Arrival";
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
    input3.style.padding = "11px";
    tdata3.appendChild(input3);
    trow.appendChild(tdata3);
    input3.className = "Burst";
    trow.appendChild(tdata3);
    a.appendChild(trow);
  });
let deleteprocess = document
  .getElementById("delete")
  .addEventListener("click", function delete_Process(e) {
    a.removeChild(document.getElementById("row"));
  });
const gtdisp = document.querySelector("#OO");
document.getElementById("calculate").addEventListener(
  "click",
  function () {
    var arrivalArr = document.querySelectorAll(".Arrival");
    var idArr = document.querySelectorAll(".process");
    var burstArr = document.querySelectorAll(".Burst");
    var corres = [];
    for (let i = 0; i < arrivalArr.length; i++) {
      let obj = new Object();
      obj.arrival = Number(arrivalArr[i].value);
      obj.burst = Number(burstArr[i].value);
      obj.id = Number(idArr[i].value);
      obj.waitingTime = 0;
      obj.turnAroundTime = 0;
      obj.response_time = 0;
      obj.start_time = 0;
      obj.completion_time = 0;
      corres.push(obj);
    }

    // corres.sort((a, b) => {
    //     return a.arrival - b.arrival;
    // });
    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    let total_response_time = 0;
    let total_idle_time = 0;
    // let throughput;
    let avg_turnaround_time, avg_waiting_time, cpu_utilisation, throughput;
    let burst_remaining = [];
    let is_completed = [];
    let ganttChartData = []; //array to store gantt chart data at as the algorithm advance
    let startGantt = 0;
    // memset(is_completed,0,sizeof(is_completed));
    for (let i = 0; i < arrivalArr.length; i++) {
      is_completed[i] = 0;
    }
    for (let i = 0; i < arrivalArr.length; i++) {
      burst_remaining[i] = Number(corres[i].burst);
    }

    let current_time = 0;
    let completed = 0;
    let prev = 0;

    while (completed != arrivalArr.length) {
      let idx = -1;
      let mn = 10000000;
      for (let i = 0; i < arrivalArr.length; i++) {
        if (Number(corres[i].arrival) <= current_time && is_completed[i] == 0) {
          if (burst_remaining[i] < mn) {
            mn = burst_remaining[i];
            idx = i;
          }
          if (burst_remaining[i] == mn) {
            if (Number(corres[i].arrival) < Number(corres[idx].arrival)) {
              mn = burst_remaining[i];
              idx = i;
            }
          }
        }
      }

      if (idx != -1) {
        if (burst_remaining[idx] == Number(corres[idx].burst)) {
          corres[idx].start_time = current_time;
          total_idle_time += corres[idx].start_time - prev;
        }
        burst_remaining[idx] = burst_remaining[idx] - 1;
        if (startGantt < Number(corres[idx].start_time)) {
          //nothing
          startGantt = current_time;
        }
        current_time++;
        if (startGantt >= Number(corres[idx].start_time)) {
          ganttChartData.push([idx, "P" + idx, startGantt, current_time]);
          //this is a 2d array which will have the values correseponing to each process currently in ready q
          // row will be index of process
          //e.g ganttchartdata[0][0]=[idx,pidx,start-time,end-time] 4 coloumn
        }
        prev = current_time;

        if (burst_remaining[idx] == 0) {
          corres[idx].completion_time = current_time;
          corres[idx].turnAroundTime =
            Number(corres[idx].completion_time) - Number(corres[idx].arrival);
          corres[idx].waitingTime =
            Number(corres[idx].turnAroundTime) - Number(corres[idx].burst);
          corres[idx].response_time =
            Number(corres[idx].start_time) - Number(corres[idx].arrival);

          total_turnaround_time += Number(corres[idx].turnAroundTime);
          total_waiting_time += Number(corres[idx].waitingTime);
          total_response_time += corres[idx].response_time;

          is_completed[idx] = 1;
          completed++;
        }
      } else {
        current_time++;
      }
    }

    let min_arrival_time = 10000000;
    let max_completion_time = -1;
    for (let i = 0; i < arrivalArr.length; i++) {
      min_arrival_time = Math.min(min_arrival_time, Number(corres[i].arrival));
      max_completion_time = Math.max(
        max_completion_time,
        Number(corres[i].completion_time)
      );
    }

    avg_turnaround_time = total_turnaround_time / arrivalArr.length;
    avg_waiting_time = total_waiting_time / arrivalArr.length;
    avg_response_time = total_response_time / arrivalArr.length;
    cpu_utilisation =
      ((max_completion_time - total_idle_time) / max_completion_time) * 100;
    throughput = arrivalArr.length / (max_completion_time - min_arrival_time);
    let ganttHeading = document.createElement("h3");
    ganttHeading.innerText = "Gantt chart";
    document.querySelector(".charts").appendChild(ganttHeading);
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
    let gantt_chart = document.createElement("div");
    gantt_chart.id = "gantt_chart";
    document.querySelector(".charts").appendChild(gantt_chart);
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawGanttChart);
    function drawGanttChart() {
      var container = document.getElementById("gantt_chart");
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
    let TimelineHeading = document.createElement("h3");
    TimelineHeading.innerText = "Timeline chart";
    document.querySelector(".charts").appendChild(TimelineHeading);
    let timeChartARR = [];
    let startT = 0;
    ///// implementing gantt chart
    for (let i = 0; i < testarr.length; i++) {
      if (startT < testarr[i][1]) {
        //nothing
        startT = testarr[i][1];
      }
      if (startT >= testarr[i][1]) {
        //process
        timeChartARR.push([
          `${testarr[i][0]}`,
          "P" + testarr[i][0],
          "",
          getDate(startT),
          getDate(testarr[i][2]),
        ]);
      }
      startT = testarr[i][2];
    }
    timeChartARR.sort(
      (a, b) =>
        parseInt(a[0].substring(1, a[0].length)) -
        parseInt(b[0].substring(1, b[0].length))
    );

    let time_chart = document.createElement("div");
    time_chart.id = "time_chart";
    document.querySelector(".charts").appendChild(time_chart);
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawtimeChart);
    function drawtimeChart() {
      var container = document.getElementById("time_chart");
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: "string", id: "Time Chart" });
      dataTable.addColumn({ type: "string", id: "Process" });
      dataTable.addColumn({ type: "string", id: "style", role: "style" });
      dataTable.addColumn({ type: "date", id: "Start" });
      dataTable.addColumn({ type: "date", id: "End" });
      dataTable.addRows(timeChartARR);
      let timeWidth = "100%";
      if (startT >= 20) {
        timeWidth = 0.05 * startT * screen.availWidth;
      }
      var options = {
        width: timeWidth,
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
          // showRowLabels: false,
          avoidOverlappingGridLines: false,
        },
      };
      chart.draw(dataTable, options);
      document.getElementById("time_chart").style.overflowX = "scroll";
      document.getElementById("time_chart").style.overflowY = "hidden";
    }
    {
      once: true;
    }

    corres.sort((a, b) => {
      return a.id - b.id;
    });
    let outputtable = document.getElementById("output");
    let row = outputtable.insertRow(1);
    row.insertCell(0).innerText = corres[0].id;
    row.insertCell(1).innerText = corres[0].arrival;
    row.insertCell(2).innerText = corres[0].burst;
    row.insertCell(3).innerText = corres[0].waitingTime;
    row.insertCell(4).innerText = corres[0].turnAroundTime;
    for (let index = 1; index < arrivalArr.length; index++) {
      let row = outputtable.insertRow(index + 1);
      row.insertCell(0).innerText = corres[index].id;
      row.insertCell(1).innerText = corres[index].arrival;
      row.insertCell(2).innerText = corres[index].burst;
      row.insertCell(3).innerText = corres[index].waitingTime;
      row.insertCell(4).innerText = corres[index].turnAroundTime;
    }
    outputtable.style.visibility = "visible";
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

    // outputtable.style.visibility = "visible";
    showop.style.visibility = "visible";
    gtdisp.style.visibility = "visible";
    document.querySelector(".charts").style.visibility = "visible";
  },
  { once: true }
);
