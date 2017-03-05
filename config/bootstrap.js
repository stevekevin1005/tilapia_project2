/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = async (cb) => {
	let ssrlist = await tilapia2SSR.findAll();
	for(var i in ssrlist){
		var start = ssrlist[i].start;
		var end = ssrlist[i].end;
		var contig = ssrlist[i].contig;
		let variations = await tilapia2VAR.findAll({
			where:{
				position:{
					$between: [start, end]
				},
				contig: contig,
			}
		});
		await ssrlist[i].setTilapia2VARs(variations);
	}
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
