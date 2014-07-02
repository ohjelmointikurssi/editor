TMCWebClient.snapshot = function (exercise, action, filename, oldData, newData, fullDocument) {

	this.courseName = exercise.getCourseName();
	this.exerciseName = exercise.getExerciseName();
	this.eventType = this.getEventType(action);
	/* jshint camelcase:false */
	this.data = btoa(JSON.stringify(
		{
			file: filename, 
			patches: this.generatePatch(oldData, newData), 
			full_document: fullDocument
		}));
	/* jshint camelcase:true */
	this.happendAt = Date.now();
	this.systemNanotime = Math.round(window.performance.now());
}

TMCWebClient.snapshot.prototype.getEventType = function(action) {
	
	var actions = {
		insertText: 'text_insert',
		insertLines: 'text_insert',
		removeText: 'text_remove',
		removeLines: 'text_remove'
	}
	return actions[action] || action;
}

TMCWebClient.snapshot.prototype.generatePatch = function(oldData, newData) {

	/* jshint camelcase:false */
	var dmp = new diff_match_patch();

	var diff = dmp.diff_main(oldData, newData, true);

	if (diff.length > 2) {
		dmp.diff_cleanupSemantic(diff);
	}

	var patchList = dmp.patch_make(oldData, newData, diff);
	return dmp.patch_toText(patchList);
	/* jshint camelcase:true */
}