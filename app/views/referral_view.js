var App = require('app');

module.exports = App.Views.Referral = Em.View.extend({
    templateName: require('templates/referral'),
    className: ['referral'],

    init: function(){
        this._super();
        this.load();
    },

    load: function() {
        return App.Controllers.Referral.ready();
    }
});
