
window.App = require('app');

require('templates');
require('models');
require('controllers');
require('views');

App.reopen({
    ready: function() {

        this._super();

        var dude = App.Models.MyModel.create({
            total: 3303030
        });

        App.controllers.home.set('theMan', dude);
        App.resize();
        App.events();

    },

    controllers: {
        home    : App.Controllers.Home.create(),
        referral: App.Controllers.Referral,
        stream  : ''
    },

    resize: function() {
        var width = $(window).width() - 120,
            height = $(window).height() - 20;

        return $('#dashboard')
            .css({
                'height': height,
                'width': width
            })
            .removeAttr('class')
            .attr('class', 'bordered shadowed');
    },

    events: function() {
        $(window).resize(App.resize);
    }
});

App.store = DS.Store.create({
  revision: 4
});
