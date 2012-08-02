var App = require('app');

module.exports = App.Models.Referral = Em.Object.extend({
    name: '',
    count: '',
    url: '',

    init: function(){
        this._super();
    }
}); 
