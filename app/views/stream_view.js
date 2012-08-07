var App = require('app');

module.exports = App.Views.Stream = Em.View.extend({
    templateName: require('templates/stream'),
    className: 'stream-path',

    init: function() {
        var self = this;
        this._super();
        this.load();

        setTimeout(function() {
            self.renderChart();
            self.setProperties();
        }, 1e2);
    },

    load: function() {
        return App.Controllers.Stream.ready();
    },

    renderChart: function() {
    },

    setProperties: function() {
        setTimeout(function() {
            var list    = Ember.$('#sidebar ul')[0],
                child   = $(list).children('li')
                len     = child.length;

            $(child).eq(0).addClass('first');
            $(child).eq(len - 1).addClass('last');
        }, 1e2)
    }
}); 
