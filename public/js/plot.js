/**
 * Adapted from JS from http://www.highcharts.com/demo/dynamic-update/dark-unica
 */

$(function () {
    $(document).ready(function () {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        var $plot = $('.plot');

        $plot.each(function( index ) {
            var id = $(this).data('id');
            var last_point_time = 0;
            var title = $(this).data('title');
            var yaxis = $(this).data('yaxis');
            var interval = $(this).data('interval');
            var get_new_points = function(id, last_time, func) {
                $.getJSON( "ajax", {id: id, last: last_time}, function( data ) {
                    func(data);
                });
            };

            $( this ).highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function () {
                            var series = this.series[0];
                            console.log(id);
                            console.log(last_point_time);
                            setInterval(function () {
                                get_new_points(id, last_point_time, function (new_points) {
                                    console.log("New points!");
                                    console.log(new_points);
                                    console.log(series.data.length);
                                    if (last_point_time == 0) {
                                        series.setData(new_points);
                                    } else {
                                        for (var i = 0; i < new_points.length; i++) {
                                            series.addPoint(new_points[i], true, true);
                                        }
                                    }
                                    if (new_points.length > 0 && series.data.length >= 20 ) {
                                        last_point_time = new_points[new_points.length - 1][0];
                                    }
                                });
                                
                            }, 1000);
                        }
                        //load: function () {
                        //
                        //    // set up the updating of the chart
                        //    var series = this.series[0];
                        //    setInterval(function () {
                        //        var x = (new Date()).getTime(), // current time
                        //            y = Math.random();
                        //        series.addPoint([x, y], true, true);
                        //    }, interval);
                        //}
                    }
                },
                title: {
                    text: title
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: yaxis
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: yaxis,
                    data: []
                    //data: (function () {
                    //   // generate an array of random data
                    //   var data = [],
                    //       time = 1458886113600,
                    //       i;
                    //
                    //   for (i = -19; i <= 0; i += 1) {
                    //       data.push({
                    //           x: time + i * 1000,
                    //           y: Math.random()
                    //       });
                    //   }
                    //   return data;
                    //}())
                }],
                last_point_time: last_point_time,
                id: id
            });
        });
    });
});