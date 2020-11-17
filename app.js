
function plots(){
  
  var navel = d3.json("/Biodiversity-of-the-Navel/samples.json").then(function(navel){
    console.log(navel);  


    var iD = navel.samples[0].otu_ids;
    console.log(iD);
 
  
    var SV= navel.samples[0].sample_values;
    console.log(SV);

    var labels = navel.samples[0].otu_labels;
    console.log(labels)

    var SVslice= SV.slice(0,10).reverse();
    console.log(SVslice);

    var topLabels = labels.slice(0,10).reverse();
    console.log(topLabels);

    var topOTU =iD.slice(0,10).reverse();
    console.log(topOTU);

    var idOTU = topOTU.map(d => 'OTU ' + d );
    console.log(`OTU IDs: ${idOTU}`);

   var barTrace = { 
    x: SVslice,    
    y: topOTU.map(d => 'OTU ' + d ),
    text: labels,
    type: "bar",
    orientation: 'h',
  };

  var barData = [barTrace];

  var barLayout = {
        title: "Top Ten OTU",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU" },
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };

Plotly.newPlot("bar", barData, barLayout,{responsive: true});

var bubbleTrace = {
  x:iD,
  y:SV,
  mode: "markers",
  marker:{
    size:SV,
    color: iD
  },
  text: navel.samples[0].otu_labels,

};

var bubbleLayout = {
  xaxis:{title: "OTU ID"},
  height:  600,
  width: 1200,
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};


var bubbleData = [bubbleTrace];

Plotly.newPlot("bubble", bubbleData, bubbleLayout),{responsive: true};


})};


function info() {

  d3.json("/Biodiversity-of-the-Navel/samples.json").then(function(navelinfo){
    var naveldata = navelinfo.metadata;
    console.log(navelinfo);
    console.log(naveldata);

    var filterID = naveldata.filter(d => d.id =="940")[0];
    console.log(filterID);
    var selection = d3.select("#sample-metadata");
    selection.html("");
  

    Object.entries(filterID).forEach(function([key,value]) {
      selection.append("panel-body")
               .text(`${key}:${value} \n`);

    });

})};

function init() {

  var selectdrop = d3.select("#selDataset");
  
  d3.json("/samples.json").then(function(navelNames){
    navelNames.names.forEach(function (navelName){
      selectdrop.append("option")
                .text(navelName)
                .property("value",navelName);

        
    });
      plots(navelNames.names);
      info(navelNames.names);
  
  });


};


d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(){

  var navel = d3.json("/Biodiversity-of-the-Navel/samples.json").then(function(navel){
    console.log(navel); 

  var navelmeta = navel.metadata;

  var nextselect = d3.select("#selDataset");
  var nextValue = nextselect.property("value");
  var restData = navel.samples.filter(sample => sample.id ==nextValue)[0];

  var selectValues = restData.sample_values;
  var selectLabels = restData.otu_labels;
  var sampleID = restData.otu_ids;

  var topselectValues= selectValues.slice(0,10).reverse();

  var topselectLabels = selectLabels.slice(0,10).reverse();
    
  var topsampleID = sampleID.slice(0,10).reverse();

  Plotly.restyle("bar", "x", [topselectValues]);
  Plotly.restyle("bar", "y", [topsampleID.map(p => 'OTU ' + p)]);
  Plotly.restyle("bar", "text", [topselectLabels]);

  Plotly.restyle("bubble", "x", [sampleID]);
  Plotly.restyle("bubble", "y", [selectValues]);
  Plotly.restyle("bubble", "text", [selectLabels]);
  Plotly.restyle("bubble", "marker.size", [selectValues]);
  Plotly.restyle("bubble", "marker.color", [sampleID]);  



  var  newID = navelmeta.filter(n => n.id == nextValue)[0];
  console.log(newID);
  var nextselection = d3.select("#sample-metadata");
  nextselection.html("");


  Object.entries(newID).forEach(function([key,value]) {
    nextselection.append("panel-body")
             .text(`${key}:${value} \n`);


})})};

init();
optionChanged();
