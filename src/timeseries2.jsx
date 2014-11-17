var React = require('react');
var Support = require('../lib/support');
var d3 = require('d3');

var TimeSeries2Chart = React.createClass({
  chart: function(selection){
    var {
      margin,
      width,
      height,
      xValue,
      yValue,
      style
    } = Support.getProps(this, 'chart', {
      margin: {top: 10, right: 10, bottom: 100, left: 40},
      width: 1200,
      height: 400,
      xValue: function(d) {
          return d[0];
        },
      yValue: function(d) {
          return d[1];
        },
      style: false
    });

    var margin2 = {top: height-70, right: margin.right, bottom: 20, left: margin.left};
    var height2 = height - margin2.top - margin2.bottom;

    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom,

    selection.each(function(data) {
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      }).sort(function(a, b){
        return a[0]-b[0];
      });

      var brushed = function() {
        x.domain(brush.empty() ? x2.domain() : brush.extent());
        focus.select(".area").attr("d", area);
        focus.select(".x.axis").call(xAxis);
      };

      var x = d3.time.scale().range([0, width]),
          x2 = d3.time.scale().range([0, width]),
          y = d3.scale.linear().range([height, 0]),
          y2 = d3.scale.linear().range([height2, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom"),
          xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
          yAxis = d3.svg.axis().scale(y).orient("left");

      var brush = d3.svg.brush()
          .x(x2)
          .on("brush", brushed);

      var area = d3.svg.area()
          .interpolate("monotone")
          .x(function(d) { return x(d[0]); })
          .y0(height)
          .y1(function(d) { return y(d[1]); });

      var area2 = d3.svg.area()
          .interpolate("monotone")
          .x(function(d) { return x2(d[0]); })
          .y0(height2)
          .y1(function(d) { return y2(d[1]); });


      var svg = d3.select(this).selectAll("svg").data([data]);

      var svg = svg.enter().append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

      svg.append("defs").append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", width)
          .attr("height", height);

      var focus = svg.append("g")
          .attr("class", "focus")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var context = svg.append("g")
          .attr("class", "context")
          .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      x.domain(d3.extent(data.map(function(d) { return d[0]; })));
      y.domain([0, d3.max(data.map(function(d) { return d[1]; }))]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      focus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

      focus.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      focus.append("g")
          .attr("class", "y axis")
          .call(yAxis);

      context.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area2);

      context.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height2 + ")")
          .call(xAxis2);

      context.append("g")
          .attr("class", "x brush")
          .call(brush)
        .selectAll("rect")
          .attr("y", -6)
          .attr("height", height2 + 7);

      if(style){
        Object.keys(style).forEach(function(key){
          svg.selectAll(key).attr('style', style[key]);
        });
      }
    });
  },
  renderChart: function(data){
    if(!data){
      return;
    }
    var container = this.getDOMNode();
    d3.select(container)
      .datum(data)
      .call(this.chart)
      ;
  },
  componentDidMount: function(){
    return this.renderChart(this.props.data);
  },
  componentDidUpdate: function(){
    return this.renderChart(this.props.data);
  },
  render: function(){
    var classNames = Support.classList(this, {
      'bar-chart': true
    });
    return (
      <div className={classNames}>
      </div>
    );
  }
});

module.exports = {
  TimeSeries2Chart: TimeSeries2Chart
};