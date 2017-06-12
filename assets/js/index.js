$(function(){
	var SSRClusterArray; 
	//tilapia 2 go detection "step 1"
	$("#tilapia_2_go_search").on('click', function(){	

		$("#tilapia_2_step1_table").html("");
		$("#tilapia_2_GO_amount").html("");
		var key = $("#GODetection input").val();
		if(key != ''){
			$(".tilapia_2_load").addClass("loader");
			$.ajax({
				url: "/tilapia/2/go?name="+key,
				type: 'get',
				success: function(goList){
					$(".tilapia_2_load").removeClass("loader");
					var goListTemplate = $.templates( "#goList" );
					console.log('goList->', goList);
					var goListHtml = goListTemplate.render(goList);
					$("#tilapia_2_GO_amount").html("Found GO Terms: "+goList.length)+" terms";
					$("#tilapia_2_step1_table").append(goListHtml);
					/////step2////
					$(".tilapia_2_step1_row").unbind();
					$(".tilapia_2_step1_row").on('click', function(){
						var index = $(this).data('index');
						var geneIdList = JSON.stringify(goList[index].geneId);
						
						$("#GeneCluster >div:last").html("");
						$(".tilapia_2_load").addClass("loader");
						$('#Tilapia2 a[href="#GeneCluster"]').tab('show');
						$("#GeneCluster >h4:last").html("GO:"+goList[index].name);
						$.ajax({
							url: "/tilapia/2/contig?geneIdList="+geneIdList,
							type: 'get',
							success: function(geneClusterList){
								console.log('res->', geneClusterList);
								$(".tilapia_2_load").removeClass("loader");
								var geneClusterTemplate = $.templates( "#geneClusterList" );
								var geneClusterHtml = geneClusterTemplate.render(geneClusterList);
								$("#GeneCluster >div:last").append(geneClusterHtml);
								/////step3////
								$(".tilapia_2_step2_button").unbind();
								$(".tilapia_2_step2_button").on('click', function(){
									var index = $(this).data('index');
									var geneIdList = JSON.stringify(geneClusterList[index].geneIdList);
									var contig = geneClusterList[index].id;
									$("#SSRDetection >h4:last").html("Contig:"+contig);
									$("#SSRDetection >div:last").html("");
									$(".tilapia_2_load").addClass("loader");
									$('#Tilapia2 a[href="#SSRDetection"]').tab('show');

									$.ajax({
										url: "/tilapia/2/ssr?geneIdList="+geneIdList,
										type: 'get',
										success: function(SSRClusterList){
											SSRClusterArray = SSRClusterList
											console.log('SSRClusterList->', SSRClusterList);
											$(".tilapia_2_load").removeClass("loader");
											var SSRClusterTemplate = $.templates( "#SSRClusterList" );
											var SSRClusterHtml = SSRClusterTemplate.render(SSRClusterList);
											console.log('contig->', contig);
											
											$("#SSRDetection >div:last").append(SSRClusterHtml);

											$(".variationDetail").on('click', function(){
												
												var geneIndex = $(this).data('gene');
												var ssrIndex = $(this).data('ssr');

												var start = SSRClusterList[geneIndex].SSRList[ssrIndex].start;
												var end = SSRClusterList[geneIndex].SSRList[ssrIndex].end;
												var pattern = SSRClusterList[geneIndex].SSRList[ssrIndex].SSRPattern1;
												var SSRArray = SSRClusterList[geneIndex].SSRList[ssrIndex].SSR;

												var ssr = "<tr style='background: antiquewhite'>";
												for(var i = start-200 ;i<= end+200 ;i++ ){
													ssr += ("<td>"+i+"</td>")	;
												}
												ssr += "</tr>";

												ssr += "<tr style='background: antiquewhite'>";
												for(var i = 0;i < 200;i++){
													ssr += ("<td>"+SSRClusterList[geneIndex].SSRList[ssrIndex].fk5[i]+"</td>");
												}
												for(var i = 0; i < SSRArray.length; i++){
													ssr += ("<td>"+SSRArray[i]+"</td>");
												}
												for(var i = 0;i < 200;i++){
													ssr += ("<td>"+SSRClusterList[geneIndex].SSRList[ssrIndex].fk3[i]+"</td>");
												}
												ssr += "</tr>";

												for(var i = 0; i < SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs.length; i++){
													ssr += "<tr style='background: cyan'>";
													var refArray = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].ref.toUpperCase().split("");
													var refIndex = 0;
													for(var k = start-200;k <= end+200;k++){
														var position =parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].position);
														var length = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].ref.length);
														
														if((k >= position) && (k < position + length)){
															ssr += ("<td>"+refArray[refIndex]+"</td>");
															refIndex++;
														}
														else{
															ssr += "<td></td>";
														}
													}
													ssr += "</tr>";

													ssr += "<tr>";
													var altArray = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].alt.toUpperCase().split("");
													var altIndex = 0;
													var position = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].position);
													var length = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].alt.length);

													for(var k = start-200;k <= end+200;k++){
														if(k >= position&& k < position + length){
															ssr += ("<td>"+altArray[altIndex]+"</td>");
															altIndex++;
														}
														else{
															ssr += "<td></td>";
														}
													}
													ssr += "</tr>";
												}

												swal({
												  title: "<h1>SSRdatail (Blue: reference, White: alt)</h1>",
												  html: "<div style='overflow:scroll;'><table  class='table table-bordered'>"+ssr+"</table></div>",
												  width: 1000 
												});
											});

											$(".downloadFile").on('click', function(){
												
												var geneIndex = $(this).data('gene');
												var ssrIndex = $(this).data('ssr');

												var start = SSRClusterList[geneIndex].SSRList[ssrIndex].start;
												var end = SSRClusterList[geneIndex].SSRList[ssrIndex].end;
												var pattern = SSRClusterList[geneIndex].SSRList[ssrIndex].SSRPattern1;
												var SSRArray = SSRClusterList[geneIndex].SSRList[ssrIndex].SSR;


												var ssr = ">"+contig+"|"+(start-200).toString()+"|"+(end+200).toString()+" Oreochromis niloticus | NCBI \n";
												
												for(var i = 0;i < 200;i++){
													ssr += SSRClusterList[geneIndex].SSRList[ssrIndex].fk5[i];
												}
												for(var i = 0; i < SSRArray.length; i++){
													ssr += SSRArray[i];
												}
												for(var i = 0;i < 200;i++){
													ssr += SSRClusterList[geneIndex].SSRList[ssrIndex].fk3[i];
												}
												ssr += "\n";


												for(var i = 0; i < SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs.length; i++){
													
													var reflength = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].ref.length);
													var altlength = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].alt.length);
													var altArray = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].alt.toUpperCase().split("");
													var refIndex = 0;
													var altIndex = 0;
													var position = parseInt(SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].position);
													ssr += ">"+contig+"|"+(start-200).toString()+"|"+(end+200+altlength-reflength).toString()+" Oreochromis niloticus | R.O.C \n";

													for(var k = start-200;k <= end+200-reflength+altlength;k++){
														if(k == position){
															refIndex+=reflength;
														}
														if(k >= position && k < position + altlength){
															ssr += altArray[altIndex];
															altIndex++;
														}
														else{
															if(refIndex < 200){
																ssr += SSRClusterList[geneIndex].SSRList[ssrIndex].fk5[refIndex];
															}
															else if(200 <= refIndex && refIndex < 200+SSRArray.length){
																ssr += SSRArray[refIndex-200];
															}
															else {
																ssr += SSRClusterList[geneIndex].SSRList[ssrIndex].fk3[refIndex-200-SSRArray.length]
															}
															refIndex++;
														}
													}
												}
												
												download("sequence.fasta", ssr);
											});
										},
										error: function(e){
											$(".tilapia_2_load").removeClass("loader");
											console.log(e);
											sweetAlert(
											  'Oops...',
											  e,
											  'error'
											);
										}
									});
								});
							},
							error: function(e){
								$(".tilapia_2_load").removeClass("loader");
								sweetAlert(
								  'Oops...',
								  e,
								  'error'
								);
							}
						});
					});
				},
				error: function(e){
					$(".tilapia_2_load").removeClass("loader");
					sweetAlert(
					  'Oops...',
					  e,
					  'error'
					)
				}
			});
		}
		else{
			sweetAlert(
			  'Oops...',
			  'Please input key word!',
			  'error'
			)
		}
	});

	var ssr_data1 = [ 
		["NC_022199.1(LG1)", 4838], 
		["NC_022200.1(LG2)", 3465],
		["NC_022201.1(LG3)", 2370],
		["NC_022202.1(LG4)", 3969],
		["NC_022203.1(LG5)", 5280],
		["NC_022204.1(LG6)", 5686],
		["NC_022205.1(LG7)", 7661],
		["NC_022206.1(LG8-24)", 3858],
		["NC_022207.1(LG9)", 2612],
		["NC_022208.1(LG10)", 2175]
		["NC_022209.1(LG11)", 4920],
	];

	var ssr_data2 = [
		["NC_022210.1(LG12)", 4980],
		["NC_022211.1(LG13)", 4901],
		["NC_022212.1(LG14)", 5091],
		["NC_022213.1(LG15)", 4062],
		["NC_022214.1(LG16-21)", 4938],
		["NC_022215.1(LG17)", 5003],
		["NC_022216.1(LG18)", 3711],
		["NC_022217.1(LG19)", 3884],
		["NC_022218.1(LG20)", 4650],
		["NC_022219.1(LG22)", 3743],
		["NC_022220.1(LG23)", 3012]
	];

	var variation_data1 = [ 
		["NC_022199.1(LG1)", 119174], 
		["NC_022200.1(LG2)", 85939],
		["NC_022201.1(LG3)", 125001],
		["NC_022202.1(LG4)", 118263],
		["NC_022203.1(LG5)", 164912],
		["NC_022204.1(LG6)", 174902],
		["NC_022205.1(LG7)", 174541],
		["NC_022206.1(LG8-24)", 174705],
		["NC_022207.1(LG9)", 115797],
		["NC_022208.1(LG10)", 67391]
		["NC_022209.1(LG11)", 103601],
	];

	var variation_data2 = [
		["NC_022210.1(LG12)", 161215],
		["NC_022211.1(LG13)", 122183],
		["NC_022212.1(LG14)", 145372],
		["NC_022213.1(LG15)", 151368],
		["NC_022214.1(LG16-21)", 127511],
		["NC_022215.1(LG17)", 153429],
		["NC_022216.1(LG18)", 156455],
		["NC_022217.1(LG19)", 118158],
		["NC_022218.1(LG20)", 121493],
		["NC_022219.1(LG22)", 106528],
		["NC_022220.1(LG23)", 132503]
	];
	$.plot("#SSR-float1", [ ssr_data1 ], {
		series: {
			bars: {
				show: true,
				barWidth: 0.6,
				align: "center",

			}
		},
		yaxis: {
			show: true
		},
		xaxis: {
			mode: "categories",
			tickLength: 0
		}
	});

	$.plot("#SSR-float2", [ ssr_data2 ], {
		series: {
			bars: {
				show: true,
				barWidth: 0.4,
				align: "center"
			}
		},
		xaxis: {
			mode: "categories",
			tickLength: 0
		}
	});

	$.plot("#Variation-float1", [ variation_data1 ], {
		series: {
			bars: {
				show: true,
				barWidth: 0.6,
				align: "center",

			}
		},
		yaxis: {
			show: true
		},
		xaxis: {
			mode: "categories",
			tickLength: 0
		}
	});

	$.plot("#Variation-float2", [ variation_data2 ], {
		series: {
			bars: {
				show: true,
				barWidth: 0.4,
				align: "center"
			}
		},
		xaxis: {
			mode: "categories",
			tickLength: 0
		}
	});

	function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
      pom.click();
    }
	}
});