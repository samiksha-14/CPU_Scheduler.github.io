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
    let avg_turnaround_time;
    let avg_waiting_time;
    let avg_response_time;
    let cpu_utilisation;
    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    let total_response_time = 0;
    let total_idle_time = 0;
    let throughput;
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

    corres.sort((a, b) => {
      return a.arrival - b.arrival;
    });

    for (let i = 0; i < arrivalArr.length; i++) {
      corres[i].start_time =
        i == 0
          ? corres[i].arrival
          : Math.max(corres[i - 1].completion_time, corres[i].arrival);
      corres[i].completion_time = corres[i].start_time + corres[i].burst;
      corres[i].turnAroundTime = corres[i].completion_time - corres[i].arrival;
      corres[i].waitingTime = corres[i].turnAroundTime - corres[i].burst;
      corres[i].response_time = corres[i].start_time - corres[i].arrival;

      total_turnaround_time += corres[i].turnAroundTime;
      total_waiting_time += corres[i].waitingTime;
      total_response_time += corres[i].response_time;
      total_idle_time +=
        i == 0
          ? corres[i].arrival
          : corres[i].start_time - corres[i - 1].completion_time;
    }

    avg_turnaround_time = total_turnaround_time / arrivalArr.length;
    avg_waiting_time = total_waiting_time / arrivalArr.length;
    avg_response_time = total_response_time / arrivalArr.length;
    cpu_utilisation =
      ((corres[arrivalArr.length - 1].completion_time - total_idle_time) /
        corres[arrivalArr.length - 1].completion_time) *
      100;
    throughput =
      arrivalArr.length /
      (corres[arrivalArr.length - 1].completion_time - corres[0].arrival);
    let ganttHeading = document.createElement("h3");
    ganttHeading.innerText = "Gantt chart";
    document.querySelector(".charts").appendChild(ganttHeading);

    let ganttChartData = []; // object array to store gantt chart data which is to be passed in addrows
    let startGantt = 0; // variable which keeps the track of time for each process
    for (let i = 0; i < corres.length; i++) {
      if (startGantt < Number(corres[i].arrival)) {
        //condition when cpu is idle
        ganttChartData.push([
          "Time", // this should be same in order to show everything in same line
          "Empty", // used to label over the bars
          "black", // defines color
          getDate(startGantt),
          getDate(startGantt + Number(corres[i].arrival) - startGantt),
        ]);
        startGantt = Number(corres[i].arrival);
      }
      if (startGantt >= Number(corres[i].arrival)) {
        //process
        ganttChartData.push([
          "Time",
          "P" + corres[i].id,
          "",
          getDate(startGantt),
          getDate(startGantt + Number(corres[i].burst)),
        ]);
      }
      startGantt += Number(corres[i].burst);
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
      document.getElementById("gantt_chart").style.overflowX = "scroll";
      document.getElementById("gantt_chart").style.overflowY = "hidden";
    }
    let TimelineHeading = document.createElement("h3");
    TimelineHeading.innerText = "Timeline chart";
    document.querySelector(".charts").appendChild(TimelineHeading);

    let timeChartData = []; // object array to store gantt chart data which is to be passed in addrows
    let startTimeline = 0; // variable which keeps the track of time for each process
    for (let i = 0; i < corres.length; i++) {
      if (startTimeline < Number(corres[i].arrival)) {
        //condition when cpu is idle
        startTimeline = Number(corres[i].arrival);
      }
      if (startTimeline >= Number(corres[i].arrival)) {
        //process
        timeChartData.push([
          `P${corres[i].id}`,
          "P" + corres[i].id,
          "",
          getDate(startTimeline),
          getDate(startTimeline + Number(corres[i].burst)),
        ]);
      }
      startTimeline += Number(corres[i].burst);
    }
    timeChartData.sort(
      (a, b) =>
        parseInt(a[0].substring(1, a[0].length)) -
        parseInt(b[0].substring(1, b[0].length))
    );
    let Timeline_chart = document.createElement("div");
    Timeline_chart.id = "Timeline_chart";
    document.querySelector(".charts").appendChild(Timeline_chart);
    google.charts.load("current", { packages: ["timeline"] });
    google.charts.setOnLoadCallback(drawTimelineChart);
    function drawTimelineChart() {
      var container = document.getElementById("Timeline_chart");
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: "string", id: "Timeline Chart" });
      dataTable.addColumn({ type: "string", id: "Process" });
      dataTable.addColumn({ type: "string", id: "style", role: "style" });
      dataTable.addColumn({ type: "date", id: "Start" });
      dataTable.addColumn({ type: "date", id: "End" });
      dataTable.addRows(timeChartData);
      let TimelineWidth = "100%";
      //  if (startTimeline >= 20) {
      //      TimelineWidth = 0.05 * startGantt * screen.availWidth;
      //  }
      var options = {
        width: TimelineWidth,
        timeline: {
          //  showRowLabels: false,
          avoidOverlappingGridLines: false,
        },
      };
      chart.draw(dataTable, options);
      document.getElementById("Timeline_chart").style.overflowX = "scroll";
      document.getElementById("Timeline_chart").style.overflowY = "hidden";
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
    document.querySelector(".charts").style.visibility = "visible";
  },
  { once: true }
);
