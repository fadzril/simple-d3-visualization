var App = require('app');

module.exports = App.Views.Referral = Em.View.extend({
    templateName: require('templates/referral'),
    className: ['referral'],

    init: function(){
        var self = this;
        this._super();
        this.load();
        setTimeout(function() {
            Em.$('.chart').each(self.renderChart);
            self.setProperties();
        }, 1e3);
    },

    load: function() {
        return App.Controllers.Referral.ready();
    },

    setProperties: function() {
        var list    = Ember.$('#sidebar ul')[1],
            child   = $(list).children('li')
            len     = child.length;

        $(child).eq(0).addClass('first');
        $(child).eq(len - 1).addClass('last');
    },

    renderChart: function() {
        var w = 60, h = 60, r = 25,
            collection, data,
            index = Array.prototype.slice.call(arguments)[0],
            element = Em.$(this),
            color = d3.scale.ordinal().range(["#08C", "#CECECE"]);

        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }

        collection = App.Controllers.Referral
            .get('content')
            .getEach('count');

        data = [
            {"label":"one", "value": collection[index]}, 
            {"label":"two", "value": App.Controllers.Referral.get('total')}
        ];

        if ( index == 0) 
            element.parents('li').addClass('no-border');

        var vis = d3.select(this)
            .append("svg:svg")
            .data([data])
                .attr("width", w)
                .attr("height", h)
            .append("svg:g")
                .attr("transform", "translate(" + r + "," + r + ")")

        var arc = d3.svg.arc()
            .outerRadius(r);

        var pie = d3.layout.pie()
            .value(function(d) { return d.value; });

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
                .append("svg:g")
                    .attr("class", "slice");

            arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } )
                .attr("d", arc);

            arcs.append("svg:text")
                .attr("text-anchor", "middle")
                .attr("font-size", 10)
                .text(function(d, i) {
                    if (i !== 0)
                        return parseInt((data[0].value / data[1].value * 100), 10) + '%'; 
                    else return '';
                });
    }
});
