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
            totalClick = 0,
            _node, _links;
        var color = d3.scale.category20();

        var force = d3.layout.force()
            .charge(-350)
            .linkDistance(60)
            .size([width, height]);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("miserables3.json", function(json) {
            force.nodes(json.nodes)
                .links(json.links)
                .start();

            _node = json.nodes;
            _links = json.links;
            var link = svg.selectAll("line.link")
                .data(json.links)
                .enter().append("line")
                .attr("class",function(d){return d.isingle == 'yes' ? "center":"link";})
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });
            
            link.append('title')
              .text(function(d) {return d.value; });
            
            for (var index = 0 ; index <json.links.length; index++){
                totalClick += json.links[index].value;
            };
              
            var node = svg.selectAll("circle.node")
                .data(json.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function(d) { return color(d.group); })
                .call(force.drag);

            node.append("svg:text")
                .attr("class", "node")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .text(function(d) { return d.name; })

            node.append('title')
                .text(function(d) { return d.name });

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            });

            node.on('click',function(d){
                var source = _(_(_links).pluck('source')).pluck('index'),
                    target = _(_(_links).pluck('target')).pluck('index'),
                    _targetIndex = [], _sourceIndex = [], obj = [];

                _(target).each(function(val,index){
                    if(val == d.index){
                        _targetIndex.push(index);
                        var _obj = {
                                port: "port",
                                octetTotalCount: _links[index].value,
                                name : _links[index].source.name,
                                color: color(_links[index].source.group)
                            };
                        obj.push(_obj);
                    }
                });
                _(source).each(function(val,index){
                    if(val == d.index){
                        _sourceIndex.push(index);
                        var _obj = {
                                port: "port",
                                octetTotalCount: _links[index].value,
                                name : _links[index].target.name,
                                color:color(_links[index].target.group)

                            };
                        obj.push(_obj);
                    }
                });
                PubSub.publish("dataAdj",obj);
            });
        });

    }
});