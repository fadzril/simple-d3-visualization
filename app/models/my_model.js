var App = require('app');

App.Models.MyModel = Em.Object.extend({
    total: 0,
    init: function() {
        this._super();
    },

    count: function() {
        return this.get('total').toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    }.property('total')
});