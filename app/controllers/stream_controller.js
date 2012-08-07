var App = require('app');

module.exports = App.Controllers.Stream = Em.ArrayController.create({
    content: [],

    init: function() {
        this._super();
    },

    ready: function() {
        this.load();
        this.totalPath = 0;
    },

    load: function() {
        var self = this;
        return $.getJSON('path.json', function(data) {
            self.set('content', data);
        });
    },

    total: function() {
        var self = this,
            totalCount = this.content.getEach('count').forEach(function(item) {
                return self.totalPath = item + self.totalPath;
            });
        return self.totalPath;
    },

    percentage: function() {
        return (parseInt(this.get('count'), 10) / this.total() * 100).toFixed(0);
        // return this.get('content').map(function(item, index) {
        //     return {c: item.count};
        //   });
    }.property('content.@each', 'count').cacheable()
})