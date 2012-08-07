var App = require('app');

module.exports = App.Models.Referral = Em.Object.extend({
    name: null,
    count: null,
    url: null,

    init: function(){
        this._super();
        this.validate();
        this.total = 0;
    },

    validate: function() {
        return this.get('name') !== null;
    },

    totalCount: Em.computed(function() {
        var _total = this.total + this.get('count');
        return _total;
    }).property('count')
});