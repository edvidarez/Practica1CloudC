$(document).ready(function() {
  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    displayModal();
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }	
  });
  var globalData, globalIni,globalFin;
  function displayModal() {
    $(  "#myModal").modal('show');

    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      globalData = data;
      globalIni = 0
      globalFin = 4
      renderQueryResults(data);
    });
  }
  
  $("#next").click( function(e) {
    globalFin += 4
    globalIni += 4  
    renderQueryResults(globalData);
  });
  
  $("#previous").click( function(e) {
    if(globalIni!=0){
        globalIni -= 4
        globalFin -= 4
      }
      
      renderQueryResults(globalData);
  });

  function renderQueryResults(data) {
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
    } else {
      $("#status").html(""+data.num_results+" result(s)");
      for(var i=globalIni;i<globalFin;i++){
        console.log(i-globalIni);
        var item = i-globalIni;
        if(i>=0 && i<data.num_results){
          let alt = data.results[i].split("/")
          alt = alt[alt.length-1]
          $("#photo"+item).html("<img src="+data.results[i]+" alt="+alt+" width='128' height='128'>");
        } else {
          $("#photo"+item).html("");
        }
      } 
      if(globalFin < data.num_results) {
        $("#next").show();
      } else {
        $("#next").hide(); 
      }
      if(globalIni == 0){
        $("#previous").hide(); 
      } else {
        $("#previous").show(); 
      }
     }
   }
});
