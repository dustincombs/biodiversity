// select elements from the html
var demoPanel = d3.select("#sample-metadata")
var select = d3.select("#selDataset")

async function getData() {
  let data = await d3.json("./static/data/samples.json")
  fillDropDown(data)
  return data
}
const promise = getData()

// fill drop down list with IDs from the data
function fillDropDown(data){
  data.names.forEach((item, i) => {
    var option = select.append("option")
    option.text(item)
    option.property("value",item)
  })
}

// fill the demographic information
function fillDemoPanel(info){
  // clear the panel
  demoPanel.html("")
  // create an unordered list
  infoList = demoPanel.append("ul")
  infoList.attr("class","list-group")
  // iterate over key value pairs and append a list item
  // for each pair
  Object.entries(info).forEach(([key, value]) => {
    var listItem = infoList.append("li")
    listItem.html(`<b>${key}:</b> ${value}`)
    listItem.attr("class","list-group-item")
    listItem.attr("style","border: none")
  })
}

function drawGaugePlot(wfreq){
  var trace = {
    value: wfreq,
    title: {text: "Washing Frequency (per Week)"},
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: {
        range: [null,10],
        tickvals: [0,2,4,6,8,10]},
      bar: {color: '#1f77b4'}
    }
  }
  Plotly.newPlot("gauge",[trace])
}

function drawBarPlot(sample){
  var samples = sample.sample_values.slice(0,10)
  samples.reverse()
  var otu_ids = sample.otu_ids.slice(0,10)
  otu_ids.reverse()
  var otu_labels = sample.otu_labels.slice(0,10)
  otu_labels.reverse()
  var trace = {
    x: samples,
    y: otu_ids.map(x => `OTU ${x}`),
    text: otu_labels,
    type: "bar",
    orientation: "h"
  }
  var layout = {
    xaxis: {
      title: "Sample Values"
    }
  }
  Plotly.newPlot("bar",[trace],layout)
}

function drawBubblePlot(sample){
  var trace = {
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: "markers",
    marker: {
      size: sample.sample_values,
      color: sample.otu_ids,
      colorscale: "Viridis"
    },
    type: "scatter",
  }
  var layout = {
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Values"
    }
  }
  Plotly.newPlot("bubble",[trace],layout)
}

function optionChanged(value){
  promise.then(d => {
    var metadata = d.metadata
    var samples = d.samples
    var demoData = metadata.find(x => x.id == value)
    fillDemoPanel(demoData)
    drawGaugePlot(demoData.wfreq)
    var sample = samples.find(x => x.id == value)
    drawBarPlot(sample)
    drawBubblePlot(sample)
    console.log(sample)
  })
}
