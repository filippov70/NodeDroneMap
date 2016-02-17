/* 
 * The MIT License
 *
 * Copyright 2015 filippov.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

$(document).ready(function () {

// Рабочие слои
    var pointsLayer = new ol.layer.Vector({
        title: 'Съёмка',
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: '/js/drone.png',
                scale: 0.18,
                fill: [255, 0, 0, 0.5]
                        //anchor: [0,0]
            })
        })
    });
    var polygonLayer = new ol.layer.Vector({
        title: 'Покрытие съёмкой',
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5],
                width: 7,
                lineCap: 'round'
            })
        })
    });

    var geoJSONFormat = new ol.format.GeoJSON();

    var pointSource = new ol.source.Vector({
        loader: function (extent, resolution, vectorDataProj) {
            var url = '/data?lname=points';// + extent.join(',');
            $.ajax({
                url: url,
                success: function (data) {
                    var features = geoJSONFormat.readFeatures(data, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                    pointSource.addFeatures(features);
                }
            });
        },
        strategy: ol.loadingstrategy.bbox
    });
    
    var polygonSource = new ol.source.Vector({
        loader: function (extent, resolution, vectorDataProj) {
            var url = '/data?lname=area';// + extent.join(',');
            $.ajax({
                url: url,
                success: function (data) {
                    var features = geoJSONFormat.readFeatures(data, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                    polygonSource.addFeatures(features);
                }
            });
        },
        strategy: ol.loadingstrategy.bbox
    });

    pointsLayer.setSource(pointSource);
    polygonLayer.setSource(polygonSource);
//    $.getJSON("/data?lname=points", function (layerJSON) {
//
//        if (layerJSON.features.length > 0)
//        {
//            var layerSource = new ol.source.GeoJSON({
//                //style: styleFunction,
//                defaultProjection: 'EPSG:4326',
//                projection: "EPSG:3857",
//                object: layerJSON
//            });
//
//            pointsLayer.setSource(layerSource);
//        }
//    });
//    var imgLayerBoundSrc = new ol.source.ImageWMS({
//        url: 'http://localhost:8181/geoserver/wms',
//        params: {
//            'LAYERS': 'raster:raster_mesh',
//            'VERSION': '1.1.0',
//            'transparent': 'true'
//        }
//    });
//    var imgLayerBound = new ol.layer.Image({
//        source: imgLayerBoundSrc,
//        opacity: 0.7,
//        title: 'Съёмка. Границы'
//    });
//    var imgLayerSrc = new ol.source.ImageWMS({
//        url: 'http://localhost:8181/geoserver/wms',
//        params: {
//            'LAYERS': 'raster:orthofoto',
//            'transparent': 'true'
//        }
//    });
//    var imgLayer = new ol.layer.Image({
//        source: imgLayerSrc,
//        opacity: 1.0,
//        visible: false,
//        title: 'Съёмка'
//    });
    // Карта с подложками
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Group({
                title: 'Базовые слои',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM(),
                        type: 'base',
                        title: 'OSM'
                    }),
                    new ol.layer.Tile({
                        visible: false,
                        preload: Infinity,
                        type: 'base',
                        title: 'Bing',
                        source: new ol.source.BingMaps({
                            key: 'Am9FXphKwSqnJcVK2v4dWpzwQvCmdtFMzRNpGZI6RXWdOFgxR8uXYmz_49R-RVoQ',
                            imagerySet: 'AerialWithLabels'
                        })
                    })]}),
            new ol.layer.Group({
                title: 'Съёмки',
                layers: [
                    pointsLayer, polygonLayer
                ]})],
        view: new ol.View({
            center: ol.proj.transform([85, 56.5], 'EPSG:4326', 'EPSG:3857'),
            zoom: 11
        })
    });
    // Переключатель слоёв
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Слои' // Optional label for button
    });
    map.addControl(layerSwitcher);
    // 
    map.on('singleclick', function (evt) {
        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        var url = imgLayerBoundSrc.getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:3857', {
                    'INFO_FORMAT': 'application/json' //text/xml, application/geojson, text/html
                });
        if (url) {
            //console.log();
            //createInfoContetnt(url);
        }
    });

    // Geocoder

    /**
     * geocoder Popup
     **/
    var container = $('#popup')[0],
            content = $('#popup-content')[0],
            closer = $('#popup-closer')[0],
            overlay = new ol.Overlay({
                element: container,
                offset: [0, -40]
            });
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    //Instantiate with some options and add the Control
    var geocoder = new Geocoder('nominatim', {
        provider: 'osm',
        lang: 'ru-RU',
        placeholder: 'Город, посёлок...',
        limit: 15,
        keepOpen: true
    });
    map.addControl(geocoder);

    //Listen when an address is chosen
    geocoder.on('addresschosen', function (evt) {
        var feature = evt.feature,
                coord = evt.coordinate,
                address_html = feature.get('address_html');
        content.innerHTML = '<p>' + address_html + '</p>';
        overlay.setPosition(coord);
    });

    map.addOverlay(overlay);

    function createInfoContetnt(url) {
        $.ajax({
            url: url,
            dataType: 'jsonp'
        }).done(function (data) {
            $('#infocontent').html('');
            if (data.features.length > 0) {
                $('#info').modal({
                    show: true,
                    remote: ''
                });
                var additionalInfo = '';
                console.log(data);
//                if (data.features[0].properties.add_prop !== undefined) {
//
//                }
//                $('#infocontent').html(
//                        "<h2>" + data.features[0].properties.name + "</h2>" +
//                        "</br><h3>" + data.features[0].properties.a_strt +
//                        " " + data.features[0].properties.a_hsnmbr + "</h3>"
//                        );
            }
        }
        );
    }
});