var App = require('app');

module.exports = App.Controllers.Referral = Em.ArrayController.create({
    content: [],

    ready: function() {
        this.load();
    },

    load: function() {
        var self = this;
        return $.get('referral.json', function(item) {
            self.pushObject( item );
        });
    }
})