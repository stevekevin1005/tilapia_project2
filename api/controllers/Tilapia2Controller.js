module.exports = {
	getGo: async (req, res) => {
		try{
			let name = req.query.name || '';
			let goList = await sequelize.query("SELECT * FROM `term` WHERE name Like '%"+name+"%' or acc Like '%"+name+"%' ORDER BY `term_type`, `acc`;");
			
			let result = await Tilapia2Service.getGeneId(goList[0]);

			return res.json(result);
		}
		catch(e){
			return res.serverError(e);
		}
	},
	getContig: async (req, res) => {
		try{
			let geneIdList = JSON.parse(req.query.geneIdList) || new Array();
			console.log('geneIdList->', geneIdList);
			let result = await Tilapia2Service.getContig(geneIdList);
		
			return res.json(result);
		}
		catch(e){
			return res.serverError(e);
		}
	},
	getSSR: async (req, res) => {
		try{
			let geneIdList = JSON.parse(req.query.geneIdList) || new Array();

			
			let SSRObj = {};
			// let query = new Array();
			let SSRList = await Tilapia2Service.getSSR(geneIdList);

			for(var i in SSRList){
				for(var k in SSRList[i].tilapia2infs){
					var geneId = SSRList[i].tilapia2infs[k].geneId;
					var SSRId = SSRList[i].id;
					if(!SSRObj[geneId]){
						SSRObj[geneId] = {};
						SSRObj[geneId][SSRId] = SSRList[i];
					}
					else{
						if(!SSRObj[geneId][SSRId]){
							SSRObj[geneId][SSRId] = SSRList[i];
						}
					}
				}
			}
			

			let result = new Array();
			var geneIndex = 0;
			for(var i in SSRObj){
				
				var arr = Object.keys(SSRObj[i]).map(function (key) { 
					return SSRObj[i][key]; 
				});

				for(var k in arr){
					arr[k].dataValues.region = "";
					for(var j in arr[k].dataValues.tilapia2infs){
						arr[k].dataValues.region += arr[k].dataValues.tilapia2infs[j].region + "(parent: " + arr[k].dataValues.tilapia2infs[j].parent + ")	";
					}
					arr[k].dataValues.fk3 = arr[k].dataValues["3'frinkinSequence"].split("");
					arr[k].dataValues.fk5 = arr[k].dataValues["5'frinkinSequence"].split("");

					var start = arr[k].dataValues["start"];
					var end = arr[k].dataValues["end"];
					var pattern = arr[k].dataValues["SSRPattern2"].split("");
					var j = 0;
					var SSR = new Array();
					for(start; start <= end; start++){
						SSR.push(pattern[j]);
						j++;
						if(j >= pattern.length){
							j = 0;
						}
					}
					arr[k].dataValues.geneIndex = geneIndex;
					arr[k].dataValues.SSR = SSR;
					arr[k].dataValues.variationLength = arr[k].dataValues.tilapia2VARs.length;
					arr[k].dataValues.variation = JSON.stringify(arr[k].dataValues.tilapia2VARs);
					arr[k].dataValues.start += 1;
					arr[k].dataValues.end += 1;
					arr[k].dataValues.contig2 = arr[k].dataValues.contig.split('(')[0];
				}


				arr = arr.sort(function (a, b) {
				 return a.start > b.start ? 1 : -1;
				});

				let SSRInformation = {
					geneId: i,
					SSRList: arr
				}
				result.push(SSRInformation);
				geneIndex++;
			}

			return res.json(result);
		}
		catch(e){
			return res.serverError(e);
		}
	}
}