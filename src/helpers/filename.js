Handlebars.registerHelper('filename', function(name) {

    return name.split('/').pop();
});
