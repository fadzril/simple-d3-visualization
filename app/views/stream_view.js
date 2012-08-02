var App = require('app');

module.exports = App.Views.Stream = Em.View.extend({
    templateName: require('templates/stream'),

    init: function(){
        this._super();
    }
}); 
