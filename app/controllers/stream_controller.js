var App = require('app');

module.exports = App.Controllers.Stream = Em.ArrayController.create({
    content: [],

    init: function() {
        this._super();
    },

    ready: function() {
        var self = this;
        this.load();
        this.totalPath = 0;
    },

    load: function() {
        var self = this;
        return $.getJSON('path.json', function(data) {
            self.set('content', data);
            Handlebars.registerHelper('percentageCount', function(property, options) {
                var item = Ember.getPath(this, property),
                    total= self.total();
                return parseInt(item/total * 100, 10) + '%';
            });
        });
    },

    total: function() {
        var self = this, totalPath = 0,
            totalCount = this.content.getEach('count').forEach(function(item) {
                return totalPath = item + totalPath;
            });
        return totalPath;
    },

    percentage: function(num) {
        return num;
    }.property().cacheable()
})