function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}
let a = document.getElementById("table"); //gets the html table
let addprocess = document
  .getElementById("add")
  .addEventListener("click", function add_Process(e) {
    //adding event listener to the (add) button to add the process.
    let trow = document.createElement("tr"); //creates a new row in the table
    trow.id = "row";
    let tdata1 = document.createElement("td"); //creates a new table data
    let input1 = document.createElement("input"); //creates input element
    input1.style.width = "15em";
    input1.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input1.style.border = "hidden";
    input1.style.borderRadius = "10px";
    input1.style.padding = "12px"; //adding css
    input1.className = "process";
    tdata1.appendChild(input1);
    trow.appendChild(tdata1);
    let tdata2 = document.createElement("td");
    let input2 = document.createElement("input");
    input2.setAttribute("type", "number");
    input2.style.width = "15em";
    input2.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input2.style.border = "hidden";
    input2.style.borderRadius = "10px";
    input2.style.padding = "12px"; //adding css
    input2.className = "Arrival";
    tdata2.appendChild(input2);
    trow.appendChild(tdata2);
    let tdata3 = document.createElement("td");
    let input3 = document.createElement("input");
    input3.setAttribute("type", "number");
    input3.style.width = "15em";
    input3.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input3.style.border = "hidden";
    input3.style.borderRadius = "10px";
    input3.style.padding = "12px"; //adding css
    input3.className = "Burst";
    tdata3.appendChild(input3);
    trow.appendChild(tdata3);
    a.appendChild(trow);
  });
//algorithm start
//function to delete process
let deleteprocess = document
  .getElementById("delete")
  .addEventListener("click", function delete_Process(e) {
    a.removeChild(document.getElementById("row"));
  });
//function to add process
document.getElementById("calculate").addEventListener(
  "click",
  function () {
    var arrivalArr = document.querySelectorAll(".Arrival");
    var idArr = document.querySelectorAll(".process");
    var burstArr = document.querySelectorAll(".Burst");
    var service_time = [];
    service_time[0] = Number(arrivalArr[0].value);
    var wt = [];
    wt[0] = 0;
    for (let i = 1; i < arrivalArr.length; i++) {
      service_time[i] =
        Number(service_time[i - 1]) + Number(burstArr[i - 1].value);
      wt[i] = Number(service_time[i] - arrivalArr[i].value);
      if (wt[i] < 0) {
        wt[i] = 0;
      }
    }
    var tat = [];
    // Calculating turnaround time by adding bt[i] + wt[i]
    for (let i = 0; i < burstArr.length; i++) {
      tat[i] = Number(burstArr[i].value) + Number(wt[i]);
    }
    let total_wt = 0,
      total_tat = 0;
    for (let i = 0; i < arrivalArr.length; i++) {
      total_wt += Number(wt[i]);
      total_tat += Number(tat[i]);
    }
    let outputtable = document.getElementById("output");
    let row = outputtable.insertRow(1);
    row.insertCell(0).innerText = idArr[0].value;
    row.insertCell(1).innerText = arrivalArr[0].value;
    row.insertCell(2).innerText = burstArr[0].value;
    row.insertCell(3).innerText = wt[0];
    row.insertCell(4).innerText = tat[0];
    for (let index = 1; index < arrivalArr.length; index++) {
      let row = outputtable.insertRow(index + 1);
      row.insertCell(0).innerText = idArr[index].value;
      row.insertCell(1).innerText = arrivalArr[index].value;
      row.insertCell(2).innerText = burstArr[index].value;
      row.insertCell(3).innerText = wt[index];
      row.insertCell(4).innerText = tat[index];
    }
    outputtable.style.visibility = "visible";
    //implementing gantt chart
    let ganttChartData = [];
    let startGantt = 0;
    for (let i = 0; i < arrivalArr.length; i++) {
      if (startGantt < Number(arrivalArr[i].value)) {
        //nothing
        ganttChartData.push([
          "Time",
          "Empty",
          "black",
          getDate(startGantt),
          getDate(startGantt + Number(arrivalArr[i].value) - startGantt),
        ]);
        startGantt = Number(arrivalArr[i].value);
      }
      if (startGantt >= Number(arrivalArr[i].value)) {
        //process
        ganttChartData.push([
          "Time",
          "P" + i,
          "",
          getDate(startGantt),
          getDate(startGantt + Number(burstArr[i].value)),
        ]);
      }
      startGantt += Number(burstArr[i].value);
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
      dataTable.addRows(ganttChartData);
      let ganttWidth = "100%";
      if (startGantt >= 50) {
        ganttWidth = 0.01 * startGantt * screen.availWidth;
      }
      var options = {
        width: ganttWidth,
        colors: [
          "#e0440e",
          "#e6693e",
          "#ec8f6e",
          "#f3b49f",
          "#f6c7b6",
          "#DAB4E5",
          "#F0CA86",
          "#DDE59B",
        ],
        timeline: {
          showRowLabels: false,
          avoidOverlappingGridLines: false,
        },
      };
      chart.draw(dataTable, options);
    }
  },
  { once: true }
);
