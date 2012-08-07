var App = require('app');

module.exports = App.Views.Stream = Em.View.extend({
    templateName: require('templates/stream'),
    className: 'stream-path',

    init: function() {
        var self = this;
        this._super();
        this.load();

        // Registring helpers
        Handlebars.registerHelper('format', function(property, options) {
            var item = Ember.getPath(this, property)
            return item.toString();
        });
    },

    load: function() {
        var self = this;
        this.info = Ember.A();
        PubSub.subscribe("dataAdj",function(topic,data){
            Em.$('#node-chart').empty();
            Em.$('#info li').remove();
            App.Views.PathItem.create();
            self.renderChart(data);
            self.renderDetails(data);
            self.setProperties();
        });
    },

    renderChart: function(dataAdj) {
        var n = Math.ceil(Math.random()*10),
            q = 0,        
            width = 150,
            height = 150,
            arrayRange = 10000,
            totalOctets = 0,
            outerRadius = Math.min(width, height) / 2,
            innerRadius = outerRadius * .8,
            color = d3.scale.category20(),
            arc = d3.svg.arc(),
            fillArray = function () {
                return {
                    port: "port",
                    octetTotalCount: Math.ceil(Math.random()*(arrayRange))
                };
            },
            data0 = dataAdj  || d3.range(n).map(fillArray),
            filterData = function (element, index, array) {
                element.name = data0[index].port;
                element.value = data0[index].octetTotalCount;
                element.innerRadius = innerRadius;
                element.outerRadius = outerRadius;
                totalOctets += element.value;
                return (element.value > 0);
            },
            donut = d3.layout.pie().value(function(d){
                return d.octetTotalCount;
            }),
            pieData = donut(data0),
            filteredPieData = pieData.filter(filterData),
            data, vis, arc_group, center_group, paths,whiteCircle, totalLabel,totalValue,totalUnits;

        vis = d3.select("#node-chart")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height);

        arc_group = vis.append("svg:g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        center_group = vis.append("svg:g")
            .attr("class", "center_group")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

        paths = arc_group.append("circle")
            .attr("fill", "#EFEFEF")
            .attr("r", outerRadius);

        whiteCircle = center_group.append("svg:circle")
            .attr("fill", "white")
            .attr("r", innerRadius);

        totalLabel = center_group.append("svg:text")
            .attr("class", "label")
            .attr("dy", -15)
            .attr("text-anchor", "middle")
            .text("TOTAL");

        totalValue = center_group.append("svg:text")
            .attr("class", "total")
            .attr("dy", 7)
            .attr("text-anchor", "middle")
            .text("Waiting...");

        totalUnits = center_group.append("svg:text")
            .attr("class", "units")
            .attr("dy", 21)
            .attr("text-anchor", "middle")
            .text("path views");

        totalValue.text(function(){
            var kb = totalOctets;
            return kb;
        });
        arc_group.selectAll("circle").remove();
        arc_group.selectAll("g.arc")
            .data(filteredPieData)
            .enter().append("g")
            .attr("class", "arc")
            .append("path")
            .attr("fill", function(d, i) { return dataAdj[i].color; })
            .attr("d", arc);
    },

    renderDetails: function(data) {
        var self = this,
            clicks = _.pluck(data, 'octetTotalCount'),
            total  = _.reduce(clicks, function(memo, num) {
                return memo + num;
            }, 0);
        data.forEach(function(k, v) {
            var node = {
                percentage: (k['octetTotalCount']/total * 100).toFixed(0),
                pathView: k['octetTotalCount'],
                url: k.name,
                color: k.color
            }
            self.info.pushObject(node);
        });
        return this.set('content', this.info);
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
