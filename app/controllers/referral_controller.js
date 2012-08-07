var App = require('app');

module.exports = App.Controllers.Referral = Em.ArrayController.create({
    content: [],

    ready: function() {
        this.load();
        this.counter = 0;
    },

    load: function() {
        var self = this;
        return $.getJSON('referral.json', function(item) {
            // self.pushObject( App.Models.Referral.create(item.children) );
            self.set('content', item.children);
        });
    },

    total: function() {
        var self = this, 
            count = this.content.getEach('count');

        count.forEach(function(item) {
            return self.counter = parseInt(item + self.counter, 10);
        });

        return this.counter;
    }.property('content.@each'),

    findAll: function() {
        this.set('content', App.store.findAll( App.Models.Referral ))
    }
})