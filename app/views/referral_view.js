var App = require('app');

module.exports = App.Views.Referral = Em.View.extend({
    templateName: require('templates/referral'),
    contentBinding: 'App.controllers.referral.content',
    className: ['referral']

    init: function(){
        this._super();
        console.log(this.contentBinding);
        this.load();
    },

    load: function() {
        console.log(App.controllers.referral.get('content'));
    }
});
