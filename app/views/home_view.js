var App = require('app');

module.exports = App.Views.Home = Em.View.extend({
    templateName: require('templates/home'),
    contentBinding: 'App.controllers.home.theMan',
    eventManager: Em.Object.create({
        click: function(event, view) {
        },

        doubleclick: function(event, view) {
            alert( 'amended' );
        }
    }),

    init: function(){
        this._super();
        var self = this;
        setTimeout(function() {
            self.build();
        }, 1e2);
    },

    build: function() {
        var m = [20, 120, 20, 120],
            width = 1080 - m[1] - m[3],
            height = 600 - m[0] - m[2],
            focalNodeID = 0,
            totalClick = 0,
            centerNodeSize = 50,
            nodeSize = 10,
            _node, _links;
        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-450)
            .linkDistance(100)
            .size([width, height]);

        var svg = d3.select("#chart").append("svg:svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("miserables3.json", function(json) {
            var nodeLinks = json.links,
                nodeInst = json.nodes;

            force.nodes(json.nodes)
                .links(json.links)
                .on('tick', tick)
                .start();

            // Per-type markers, as they don't inherit styles.
            svg.append("svg:defs").selectAll("marker")
                .data(force.links())
              .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
              .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            var path = svg.append("svg:g").selectAll("path")
                .data(force.links())
              .enter().append("svg:path")
                .attr("class", function(d) { return "link " + d.group; })
                .attr("marker-end", function(d) { return "url(#" + d.group + ")"; });

            var circle = svg.append("svg:g").selectAll("circle")
                .data(force.nodes())
              .enter().append("svg:circle")
                .attr("r", 6)
                .style("fill", function(d) { return color(d.group); })
                .call(force.drag);

            var text = svg.append("svg:g").selectAll("g")
                .data(force.nodes())
              .enter().append("svg:g");

            // A copy of the text with a thick white stroke for legibility.
            text.append("svg:text")
                .attr("x", 8)
                .attr("y", ".31em")
                .attr("class", "shadow")
                .style("fill", "#333")
                .text(function(d) { return d.name; });

            text.append("svg:text")
                .attr("x", 8)
                .attr("y", ".31em")
                .style("fill", "#999")
                .text(function(d) { return d.name; });

            // Use elliptical arc path segments to doubly-encode directionality.
            function tick() {
                path.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                    });

                    circle.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                    text.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }

            circle.on('click', function(d) {
                var source = _(_(nodeLinks).pluck('source')).pluck('index'),
                    target = _(_(nodeLinks).pluck('target')).pluck('index'),
                    _targetIndex = [], _sourceIndex = [], obj = [];

                _(target).each(function(val,index){
                    if(val == d.index){
                        _targetIndex.push(index);
                        var _obj = {
                                port: "port",
                                octetTotalCount: nodeLinks[index].value,
                                name : nodeLinks[index].source.name,
                                color: color(nodeLinks[index].source.group)
                            };
                        obj.push(_obj);
                    }
                });
                _(source).each(function(val,index){
                    if(val == d.index){
                        _sourceIndex.push(index);
                        var _obj = {
                                port: "port",
                                octetTotalCount: nodeLinks[index].value,
                                name : nodeLinks[index].target.name,
                                color:color(nodeLinks[index].target.group)

                            };
                        obj.push(_obj);
                    }
                });
                PubSub.publish("dataAdj",obj);
            });
        });

    }
});