module.exports = {
	getGeneId: async (goList) => {
		try{

			let result = new Array();

			for(var i in goList){

				let goid = goList[i].acc.substr('3');
				goid = parseInt(goid);
				if(!isNaN(goid)){
					let geneId = await sequelize.query("SELECT * FROM `go_annotation` WHERE goid = "+ goid +";");
	
					let goInformation = goList[i];
					
					goInformation.geneId = geneId[0];
					result.push(goInformation);
				}
			}

			return result;

		}catch(e){
			console.error('e->', e);
			return e;
		}
	},
	getSSR: async (geneIdList) => {
		try{

			let result = await tilapia2SSR.findAll({
				include: [{
					model: tilapia2inf,
					where: {
						$or: geneIdList
					},
					order: [
						['geneId', 'DESC'],
					]
				},{
					model: tilapia2VAR
				}]
			});

			return result;
		}catch(e){
			console.error('e->', e);
			return e;
		}
	},
	getContig: async (geneIdList) => {
		try{
			let result = new Array();
			for(var i in geneIdList){
				let geneId = geneIdList[i].geneid;
				let contigInformation = await sequelize.query("SELECT contig FROM `tilapia_2_information` WHERE geneId = "+ geneId +" limit 1;");
				
				if(contigInformation[0].length != 0){
					let contig = contigInformation[0][0].contig;
					let index = await module.exports.getIndex(result, contig);
					
					if(index && index != undefined){
						result[index].geneIdList.push({
							geneId: geneId
						});
					}
					else{
						let contigJson = {
							id: contig,
							geneIdList: new Array()
						}
						contigJson.geneIdList.push({
							geneId: geneId
						});
						result.push(contigJson);
					}
				}
			}

			return result;
		}catch(e){
			console.error('e->', e);
			return e;
		}
	},
	getIndex: (array, id) => {
		try{
			var index;
			for(var i in array){
				if(array[i].id == id){
					index = i;
				}
			}
			return index;
		}catch(e){
			console.error('e->', e);
			return e;
		}
	}
}
