/*
Flot plugin for stacking data sets horizontally, i.e. putting them  
beside each other instead of overlapping.

Specify multiplebars to enable this plugin:

  $.plot($("#placeholder"), [{ data: [ ... ], multiplebars: true }])
  
The stacking order is determined by the order of the data series in
the array (later series end up to the right of the previous).

NOTE: This plugin conflicts with the stack plugin

*/

(function ($) {
    function init(plot) {
        var multiple = false;
        var sArray = [];
        var totWidth = 0;
        
        function procRawData(plot, series, data, datapoints) {
            if(series.bars.show) {
                sArray.push(series);
            }
        }
        
        function procDatapoints(plot, series, datapoints) {
            //Ensure we only process these once
            if(series.bars.show && series.bars.barLeft==undefined) {
                if(totWidth==0) {
                    for(var j = 0; j < sArray.length; j++) {
                        totWidth+=sArray[j].bars.barWidth;
                    }
                }
                
                var runWidth=0;
                for(var k = 0; k < sArray.length; k++) {
                    s=sArray[k];
                    if(s==series) {
                        break;
                    }
                    runWidth+=s.bars.barWidth;
                }
                series.bars.barLeft = runWidth-(totWidth/2);
            }
        }
        
        function checkMultipleBarsEnabled(plot, options) {
            if (options.multiplebars) {
                multiple = options.multiplebars;
                sArray=[];
                totWidth=0;

                plot.hooks.processRawData.push(procRawData);
                plot.hooks.processDatapoints.push(procDatapoints);
            }
        }
    
        plot.hooks.processOptions.push(checkMultipleBarsEnabled);
    }
    
    var options = { multiplebars: false };
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: "multiplebars",
        version: "0.1"
    });
})(jQuery);
