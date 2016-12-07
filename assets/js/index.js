$(function(){
	//tilapia 2 go detection "step 1"

	$("#tilapia_2_go_search").on('click', function(){	
		$("#tilapia_2_step1_table").html("");
		var key = $("#GODetection input").val();
		if(key != ''){
			$(".tilapia_2_load").addClass("loader");
			$.ajax({
				url: "/tilapia/2/go?name="+key,
				type: 'get',
				success: function(goList){
					console.log('goList-->', goList);
					$(".tilapia_2_load").removeClass("loader");
					var goListTemplate = $.templates( "#goList" );
					var goListHtml = goListTemplate.render(goList);
					$("#tilapia_2_step1_table").append(goListHtml);
					/////step2////
					$(".tilapia_2_step1_row").on('click', function(){
						var index = $(this).data('index');
						var geneIdList = JSON.stringify(goList[index].geneId);
						
						$("#GeneCluster >div:last").html("");
						$(".tilapia_2_load").addClass("loader");
						$('#Tilapia2 a[href="#GeneCluster"]').tab('show');

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

								$(".tilapia_2_step2_button").on('click', function(){
									var index = $(this).data('index');
									var geneIdList = JSON.stringify(geneClusterList[index].geneIdList);
									var contig = geneClusterList[index].id;
									$("#SSRDetection >div:last").html("");
									$(".tilapia_2_load").addClass("loader");
									$('#Tilapia2 a[href="#SSRDetection"]').tab('show');

									$.ajax({
										url: "/tilapia/2/ssr?geneIdList="+geneIdList,
										type: 'get',
										success: function(SSRClusterList){
											console.log('SSRClusterList->', SSRClusterList);
											$(".tilapia_2_load").removeClass("loader");
											var SSRClusterTemplate = $.templates( "#SSRClusterList" );
											var SSRClusterHtml = SSRClusterTemplate.render(SSRClusterList);
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
													for(var k = start-200;k < end+200;k++){
														var position = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].position;
														var length = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].ref.length;
														
														if((k >= position - 1) && (k <= position + length)){
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
													var position = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].position;
													var length = SSRClusterList[geneIndex].SSRList[ssrIndex].tilapia2VARs[i].alt.length;
													console.log('position->', position);
													console.log('length->', length);
													for(var k = start-200;k < end+200;k++){
														if(k >= position - 1 && k <= position + length){
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
												  title: "<h1>SSRdatail</h1>",
												  html: "<div style='overflow:scroll;'><table  class='table table-bordered'>"+ssr+"</table></div>",
												  width: 1000 
												});
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
});