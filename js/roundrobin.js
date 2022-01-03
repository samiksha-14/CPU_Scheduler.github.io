function getDate(sec) {
  return new Date(0, 0, 0, 0, sec / 60, sec % 60);
}
function Queue() {
  this.elements = [];
}
Queue.prototype.enqueue = function (e) {
  this.elements.push(e);
};
// remove an element from the front of the queue
Queue.prototype.dequeue = function () {
  return this.elements.shift();
};
// check if the queue is empty
Queue.prototype.isEmpty = function () {
  return this.elements.length == 0;
};
// get the element at the front of the queue
Queue.prototype.peek = function () {
  return !this.isEmpty() ? this.elements[0] : undefined;
};
Queue.prototype.length = function () {
  return this.elements.length;
};
let a = document.getElementById("table"); //gets the html table
let addprocess = document
  .getElementById("add")
  .addEventListener("click", function add_Process(e) {
    //addind event listener to the add button to add the process.
    let trow = document.createElement("tr"); //creates a new row in the table
    trow.id = "row";
    let tdata1 = document.createElement("td"); //creates a new table data
    let input1 = document.createElement("input"); //creates input element
    input1.setAttribute("type", "number"); // with type number
    input1.style.width = "15em"; //sets width of input
    input1.style.padding = "12px";
    input1.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input1.style.border = "hidden";
    input1.style.borderRadius = "10px";
    input1.className = "process";
    tdata1.appendChild(input1);
    trow.appendChild(tdata1);
    let tdata2 = document.createElement("td");
    let input2 = document.createElement("input");
    input2.setAttribute("type", "number");
    input2.style.width = "15em";
    input2.style.padding = "12px";
    input2.style.borderRadius = "10px";
    input2.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input2.style.border = "hidden";
    input2.className = "Arrival";
    tdata2.appendChild(input2);
    trow.appendChild(tdata2);
    let tdata3 = document.createElement("td");
    let input3 = document.createElement("input");
    input3.setAttribute("type", "number");
    input3.style.width = "15em";
    input3.style.padding = "12px";
    input3.style.borderRadius = "10px";
    input3.style.backgroundColor = "rgba(249, 252, 251, 0.938)";
    input3.style.border = "hidden";
    input3.className = "Burst";
    tdata3.appendChild(input3);
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
    let tq = document.querySelector(".time").value; //extracts the value of time quantum
    //console.log(timeQuantum);
    var arrivalArr = document.querySelectorAll(".Arrival");
    var idArr = document.querySelectorAll(".process");
    var burstArr = document.querySelectorAll(".Burst");
    var corres = [];
    for (let i = 0; i < arrivalArr.length; i++) {
      let obj = new Object();
      obj.arrival_time = Number(arrivalArr[i].value);
      obj.burst_time = Number(burstArr[i].value);
      obj.id = Number(idArr[i].value);
      obj.waiting_time = 0;
      obj.turnaround_time = 0;
      obj.remaining_time = 0;
      obj.start_time = 0;
      obj.completion_time = 0;
      obj.response_time = 0;
      corres.push(obj);
    }

    // let  complete,current_time,change;
    //     // double total_waiting_time = 0.0;
    //     // double total_turn_around_time = 0.0;

    //     for(let i=0; i<arrivalArr.length; i++){
    //         corres[i].remaining_time = Number(corres[i].burst);
    //     }
    //     complete = 0;
    //     current_time = 0;

    //     while(complete < arrivalArr.length)
    //     {
    //         change = 0;
    //         for(let i=0; i<arrivalArr.length; i++)
    //         {
    //             if(Number(corres[i].arrival) <= current_time && Number(corres[i].remaining_time) > 0)
    //             {
    //                 if(Number(corres[i].remaining_time) <= Number(quant))
    //                 {
    //                     complete++;
    //                     current_time += Number(corres[i].remaining_time);

    //                     corres[i].finishing_time = current_time;
    //                     corres[i].turnAroundTime = Number(corres[i].finishing_time) - Number(corres[i].arrival);
    //                     corres[i].waitingTime = Number(corres[i].turnAroundTime) - Number(corres[i].burst);
    //                     corres[i].remaining_time = 0;
    //                 }
    //                 else
    //                 {
    //                     current_time += Number(quant);
    //                     corres[i].remaining_time -= Number(quant);
    //                 }
    //                 change++;
    //             }
    //         }
    //         if(change == 0)
    //         {
    //             current_time++;
    //         }
    //     }
    let startGantt = 0;
    let ganttChartData = [];
    let avg_turnaround_time;
    let avg_waiting_time;
    let avg_response_time;
    let cpu_utilisation;
    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    let total_response_time = 0;
    let total_idle_time = 0;
    let throughput;
    let burst_remaining = [];
    let idx;
    corres.sort((a, b) => {
      return a.arrival_time - b.arrival_time;
    });
    for (let i = 0; i < arrivalArr.length; i++) {
      burst_remaining[i] = Number(corres[i].burst_time);
    }

    console.log(corres);
    q = new Queue();
    let current_time = 0;
    q.enqueue(0);
    let completed = 0;
    let mark = [];
    for (let i = 0; i < 100; i++) {
      mark[i] = 0;
    }
    mark[0] = 1;

    while (completed != arrivalArr.length) {
      idx = q.peek();
      q.dequeue();

      if (burst_remaining[idx] == corres[idx].burst_time) {
        corres[idx].start_time = Math.max(
          current_time,
          Number(corres[idx].arrival_time)
        );
        total_idle_time += Number(corres[idx].start_time) - current_time;
        current_time = Number(corres[idx].start_time);
      }
      if (startGantt < Number(corres[idx].start_time)) {
        //nothing
        startGantt = current_time;
      }
      if (burst_remaining[idx] - Number(tq) > 0) {
        burst_remaining[idx] -= Number(tq);
        current_time += Number(tq);
        if (startGantt >= Number(corres[idx].start_time)) {
          ganttChartData.push([
            Number(corres[idx].id),
            "P" + Number(corres[idx].id),
            startGantt,
            current_time,
          ]);
          //this is a 2d array which will have the values correseponing to each process currently in ready q
          // row will be index of process
          //e.g ganttchartdata[0][0]=[idx,pidx,start-time,end-time] 4 coloumn
        }
        startGantt = current_time;
      } else {
        current_time += burst_remaining[idx];
        if (startGantt >= Number(corres[idx].start_time)) {
          ganttChartData.push([
            Number(corres[idx].id),
            "P" + Number(corres[idx].id),
            startGantt,
            current_time,
          ]);
          //this is a 2d array which will have the values correseponing to each process currently in ready q
          // row will be index of process
          //e.g ganttchartdata[0][0]=[idx,pidx,start-time,end-time] 4 coloumn
        }
        startGantt = current_time;
        burst_remaining[idx] = 0;
        completed++;

        corres[idx].completion_time = current_time;
        corres[idx].turnaround_time =
          Number(corres[idx].completion_time) -
          Number(corres[idx].arrival_time);
        corres[idx].waiting_time =
          Number(corres[idx].turnaround_time) - Number(corres[idx].burst_time);
        corres[idx].response_time =
          Number(corres[idx].start_time) - Number(corres[idx].arrival_time);

        total_turnaround_time += Number(corres[idx].turnaround_time);
        total_waiting_time += Number(corres[idx].waiting_time);
        total_response_time += Number(corres[idx].response_time);
      }

      for (let i = 1; i < arrivalArr.length; i++) {
        if (
          burst_remaining[i] > 0 &&
          corres[i].arrival_time <= current_time &&
          mark[i] == 0
        ) {
          q.enqueue(i);
          mark[i] = 1;
        }
      }
      if (burst_remaining[idx] > 0) {
        q.enqueue(idx);
      }

      if (q.isEmpty()) {
        for (let i = 1; i < arrivalArr.length; i++) {
          if (burst_remaining[i] > 0) {
            q.enqueue(i);
            mark[i] = 1;
            break;
          }
        }
      }
    }

    avg_turnaround_time = total_turnaround_time / arrivalArr.length;
    avg_waiting_time = total_waiting_time / arrivalArr.length;
    avg_response_time = total_response_time / arrivalArr.length;
    cpu_utilisation =
      ((Number(corres[arrivalArr.length - 1].completion_time) -
        total_idle_time) /
        Number(corres[arrivalArr.length - 1].completion_time)) *
      100;
    throughput =
      arrivalArr.length /
      Number(
        corres[arrivalArr.length - 1].completion_time -
          Number(corres[0].arrival_time)
      );
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
    // console.log(testarr);
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
    row.insertCell(1).innerText = corres[0].arrival_time;
    row.insertCell(2).innerText = corres[0].burst_time;
    row.insertCell(3).innerText = corres[0].waiting_time;
    row.insertCell(4).innerText = corres[0].turnaround_time;
    for (let index = 1; index < arrivalArr.length; index++) {
      let row = outputtable.insertRow(index + 1);
      row.insertCell(0).innerText = corres[index].id;
      row.insertCell(1).innerText = corres[index].arrival_time;
      row.insertCell(2).innerText = corres[index].burst_time;
      row.insertCell(3).innerText = corres[index].waiting_time;
      row.insertCell(4).innerText = corres[index].turnaround_time;
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
    //outputtable.style.visibility='visible';

    document.querySelector(".charts").style.visibility = "visible";
  },
  { once: true }
);
