
var trip=new Array();var trip_pls;var departure_poly;var arrival_poly;var current_step;var departure_ready;var arrival_ready;var map2recenter=false;drawpoint_callback=function(feature){trip_layer.removeFeatures([feature]);toolbarControl.activateControl(toolbarControl.controls[0]);if(getTripType()==TYPE_DEMAND)
return;removeTrip();var arrival_idx=trip.length-1;var arrival=trip[arrival_idx];arrival.linestring=null;var text=interpolate(gettext('Check point n&deg;%s'),[arrival_idx]);text+='<br /><br /><span class="info"><a href="javascript:removeStep('+arrival_idx+')">'+gettext('Delete')+'</a></span>';step=new Step(null,null,null,new OpenLayers.Feature.Vector(feature.geometry,{id:arrival_idx,name:text},step_style))
trip[arrival_idx]=step;trip[arrival_idx+1]=arrival;if(trip[arrival_idx+1].marker)
trip[arrival_idx+1].marker.attributes.id=arrival_idx+1;current_step=1;updateTrip();showMarkerPopup(trip[arrival_idx].marker);}
function removeStep(index){if(index>0&&index<trip.length-1){removeTrip();trip[index]=null;trip=trip.compact();trip[index].linestring=null;current_step=1;for(var idx=index,len=trip.length;idx<len;idx++){if(idx<len-1){var text=interpolate(gettext('Check point n&deg;%s'),[idx]);text+='<br /><br /><span class="info"><a href="javascript:removeStep('+idx+')">'+gettext('Delete')+'</a></span>';trip[idx].marker.attributes.name=text;}
if(trip[idx].marker)
trip[idx].marker.attributes.id=idx;}
updateTrip();}}
completeDragMarker=function(marker,pixel){if(marker){step_idx=parseInt(marker.attributes.id,10);if(step_idx>=0){removeTrip();trip[step_idx].linestring=null;if(step_idx!=trip.length-1){trip[step_idx+1].linestring=null;}
current_step=1;updateTrip();displayDepartureRadiusCircle();displayArrivalRadiusCircle();if(step_idx==0||step_idx==trip.length-1){var glonlat=OpenLayers.Layer.SphericalMercator.inverseMercator(marker.geometry.x,marker.geometry.y);new Ajax.Request('/ajax/reverse_geocode/',{method:'get',parameters:{lat:glonlat.lat,lng:glonlat.lon},onSuccess:function(transport){var json=transport.responseText.evalJSON();trip[step_idx].city=json.city_name;trip[step_idx].address=$('id_departure_address_name').setValue('');if(step_idx==0){$('id_departure_city_name').setValue(json.city_name);var text="<b>"+gettext('Departure')+":</b><br />"+json.city_name;}else{$('id_arrival_city_name').setValue(json.city_name);var text="<b>"+gettext('Arrival')+":</b><br />"+json.city_name;}
marker.attributes.name=text;}});}}}}
function departurePointGeocoder(){var departure_name=$('id_departure_city_name').getValue();if(departure_name){departure_ready=false;geocoder.getLatLng(departure_name+', '+$('id_departure_address_name').getValue(),function(point){departure_ready=true;if(!point){alert(gettext('ERROR : Departure address not found.'));}else{var lonlat=OpenLayers.Layer.SphericalMercator.forwardMercator(point.lng(),point.lat());var text="<b>"+gettext('Departure')+":</b><br />"+departure_name;if($('id_departure_address_name').getValue()){text+="<br />"+$('id_departure_address_name').getValue();}
removeTrip();trip[0].city=departure_name;trip[0].address=$('id_departure_address_name').getValue();if(trip[0].marker==null){trip[0].marker=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat),{id:0,name:text},departure_style);}else{trip[0].marker.geometry=new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);trip[0].marker.attributes.name=text;}
trip[1].linestring=null;displayDepartureRadiusCircle();}
if(arrival_ready){doGeocodeReady();}});}else{departure_ready=true;}}
function arrivalPointGeocoder(){var arrival_name=$('id_arrival_city_name').getValue();if(arrival_name){arrival_ready=false;geocoder.getLatLng(arrival_name+', '+$('id_arrival_address_name').getValue(),function(point){arrival_ready=true;if(!point){alert(gettext('ERROR : Arrival address not found.'));}else{var lonlat=OpenLayers.Layer.SphericalMercator.forwardMercator(point.lng(),point.lat());var text="<b>"+gettext('Arrival')+":</b><br />"+arrival_name;if($('id_arrival_address_name').getValue()){text+="<br />"+$('id_arrival_address_name').getValue();}
removeTrip();trip[trip.length-1].city=arrival_name;trip[trip.length-1].address=$('id_arrival_address_name').getValue();if(trip[trip.length-1].marker==null){trip[trip.length-1].marker=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat),{id:trip.length-1,name:text},arrival_style);}else{trip[trip.length-1].marker.geometry=new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);trip[trip.length-1].marker.attributes.name=text;}
trip[trip.length-1].linestring=null;displayArrivalRadiusCircle();}
if(departure_ready){doGeocodeReady();}});}else{arrival_ready=true;}}
function doGeocodeReady(){updateTrip();if(map2recenter){var points=new Array();for(var index=0,len=trip.length;index<len;index++){var step=trip[index];if(step.marker){points[points.length]=step.marker.geometry;}}
if(points.length>0){var dabounds=(new OpenLayers.Geometry.MultiPoint(points)).getBounds();map.setCenter(dabounds.getCenterLonLat(),map.getZoomForExtent(dabounds));}
map2recenter=false;}}
function displayTrip(){var linestring_array=new Array();for(var index=0,len=trip.length;index<len;index++){var step=trip[index];if(step.marker){if(getTripType()!=TYPE_DEMAND||getTripType()==TYPE_DEMAND&&(index==0||index==len-1)){markers.addFeatures([step.marker]);}}
if(step.linestring){linestring_array[linestring_array.length]=step.linestring;}}
if(getTripType()!=TYPE_DEMAND&&linestring_array.length>0){trip_pls=new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(linestring_array),null,route_style)
trip_layer.addFeatures([trip_pls]);if(isRouteOK()){calculateSimpleTripBuffer(trip_pls,map,trip_offer_radius,'wait',trip_layer);}}}
function removeTrip(){for(var index=0,len=trip.length;index<len;index++){var step=trip[index];if(step.marker){hideMarkerPopup(step.marker);markers.removeFeatures([step.marker]);}}
if(trip_pls){trip_layer.removeFeatures([trip_pls]);trip_pls=null;}
if(simple_trip_buffer){trip_layer.removeFeatures([simple_trip_buffer]);simple_trip_buffer=null;}}
function displayDepartureRadiusCircle(){removeDepartureRadiusCircle();if(getTripType()==TYPE_OFFER)
return;if(trip[0].marker){departure_poly=new OpenLayers.Feature.Vector(getCircle(trip[0].marker.geometry,trip_demand_radius),null,buffer_style);trip_layer.addFeatures([departure_poly]);}}
function removeDepartureRadiusCircle(){if(departure_poly){trip_layer.removeFeatures([departure_poly]);departure_poly=null;}}
function displayArrivalRadiusCircle(){removeArrivalRadiusCircle();if(getTripType()==TYPE_OFFER)
return;if(trip[trip.length-1].marker){arrival_poly=new OpenLayers.Feature.Vector(getCircle(trip[trip.length-1].marker.geometry,trip_demand_radius),null,buffer_style);trip_layer.addFeatures([arrival_poly]);}}
function removeArrivalRadiusCircle(){if(arrival_poly){trip_layer.removeFeatures([arrival_poly]);arrival_poly=null;}}
function updateTrip(){for(var index=current_step,len=trip.length;index<len;index++){current_step=index;if(getTripType()!=TYPE_DEMAND&&trip[index].linestring==null&&trip[index-1].marker&&trip[index].marker){setDirections(OpenLayers.Layer.SphericalMercator.inverseMercator(trip[index-1].marker.geometry.x,trip[index-1].marker.geometry.y),OpenLayers.Layer.SphericalMercator.inverseMercator(trip[index].marker.geometry.x,trip[index].marker.geometry.y));return;}}
current_step+=1;if(current_step>=trip.length){displayTrip();}}
function setDirections(from,to){$('wait').show();gdir.load("from: "+from.lat+", "+from.lon+" to: "+to.lat+", "+to.lon,{getPolyline:true});}
function handleErrors(){$('wait').hide();if(gdir.getStatus().code==G_GEO_UNKNOWN_ADDRESS){alert(gettext('Error : Address not found.'));}else if(gdir.getStatus().code==G_GEO_UNKNOWN_DIRECTIONS){first_point=(current_step-1==0)?trip[0].city:interpolate(gettext('Check point n&deg;%s'),[current_step-1]);second_point=(current_step==trip.length-1)?trip[trip.length-1].city:interpolate(gettext('Check point n&deg;%s'),[current_step]);alert(interpolate(gettext('Route %s - %s not found.'),[first_point,second_point]));}else if(gdir.getStatus().code==G_GEO_SERVER_ERROR){alert(interpolate(gettext('Directions request could not be successfully processed.\nError code: %s'),[gdir.getStatus().code]));}else if(gdir.getStatus().code==G_GEO_BAD_KEY){alert(interpolate(gettext('Invalid key.\nError code: %s'),[gdir.getStatus().code]));}else if(gdir.getStatus().code==G_GEO_BAD_REQUEST){alert(interpolate(gettext('A directions request could not be successfully parsed.\nError code: %s'),[gdir.getStatus().code]));}else{alert(interpolate(gettext('An error occurs.\nError code: %s'),[gdir.getStatus().code]));}
current_step+=1;updateTrip();}
function onGDirectionsLoad(){$('wait').hide();var points=new Array();var lonlat;for(var i=0;i<gdir.getPolyline().getVertexCount();i++){lonlat=OpenLayers.Layer.SphericalMercator.forwardMercator(gdir.getPolyline().getVertex(i).lng(),gdir.getPolyline().getVertex(i).lat());points[points.length]=new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);}
if(points.length==1){points[points.length]=points[0];}
trip[current_step].linestring=new OpenLayers.Geometry.LineString(points);updateTrip();}
function isRouteOK(){for(var index=1,len=trip.length;index<len;++index){if(trip[index].linestring==null)return false;}
return true;}
function getTripType(){return $('id_trip_type').getValue();}
function enabledisableOptions(){$('id_driver_km_price').disabled=(getTripType()==TYPE_DEMAND);$('id_driver_smokers_accepted').disabled=(getTripType()==TYPE_DEMAND);$('id_driver_pets_accepted').disabled=(getTripType()==TYPE_DEMAND);$('id_driver_place_for_luggage').disabled=(getTripType()==TYPE_DEMAND);$('id_driver_car_type').disabled=(getTripType()==TYPE_DEMAND);$('id_driver_seats_available').disabled=(getTripType()==TYPE_DEMAND);$('id_passenger_max_km_price').disabled=(getTripType()==TYPE_OFFER);$('id_passenger_smokers_accepted').disabled=(getTripType()==TYPE_OFFER);$('id_passenger_pets_accepted').disabled=(getTripType()==TYPE_OFFER);$('id_passenger_place_for_luggage').disabled=(getTripType()==TYPE_OFFER);$('id_passenger_car_type').disabled=(getTripType()==TYPE_OFFER);$('id_passenger_min_remaining_seats').disabled=(getTripType()==TYPE_OFFER);}
function getDows(){dows=new Array();for(var index=0;index<7;index++){if($('dow_'+index).checked)
dows[dows.length]=index;}
return dows;}
function saveTrip(for_return){var departure;var arrival;var steps=new Array();for(var index=0,len=trip.length;index<len;++index){var step=$H({'city':trip[index].city,'address':trip[index].address,'point':wkt.write(trip[index].marker)});if(index==0){departure=step;}else if(index==len-1){arrival=step;}else if(getTripType()!=TYPE_DEMAND){steps[steps.length]=step;}}
var trip_details=$H({'name':$('id_trip_name').getValue(),'type':getTripType(),'departure':departure,'arrival':arrival,'frequency_type':$('id_frequency_type').getValue(),'hour':$('id_hour').getValue(),'date':$('id_date').getValue(),'interval_min_radius':7-interval_min_radius,'interval_max_radius':interval_max_radius,'dows':getDows()});if(getTripType()!=TYPE_OFFER){trip_details.set('demand_radius',trip_demand_radius);}
if(getTripType()!=TYPE_DEMAND){trip_details.set('route',wkt.write(trip_pls));trip_details.set('steps',steps);trip_details.set('offer_radius',trip_offer_radius);}
if(for_return){$('trip_details_for_return').setValue(trip_details.toJSON());$('form_trip_details_for_return').submit();}else{$('trip_details').setValue(trip_details.toJSON());$('form_trip_details').submit();}}
onSlideOfferRadius=function(v){var value=v/1000+' km';$('verbose_offer_radius').innerHTML=value;}
onChangeOfferRadius=function(v){onSlideOfferRadius(v);removeTrip();trip_offer_radius=(v==0)?500:v;displayTrip();}
var slider_offer=new Control.Slider('handle_offer_radius','track_offer_radius',{range:$R(0,20000),values:[0,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000],increment:1000,sliderValue:(trip_offer_radius==500)?0:trip_offer_radius,onSlide:onSlideOfferRadius,onChange:onChangeOfferRadius});observeRadiusLeft('slider_offer_left',slider_offer);observeRadiusRight('slider_offer_right',slider_offer);onSlideDemandRadius=function(v){var value=v/1000+' km';$('verbose_demand_radius').innerHTML=value;}
onChangeDemandRadius=function(v){onSlideDemandRadius(v);trip_demand_radius=(v==0)?500:v;displayDepartureRadiusCircle();displayArrivalRadiusCircle();}
var slider_demand=new Control.Slider('handle_demand_radius','track_demand_radius',{range:$R(0,20000),values:[0,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000,19000,20000],increment:1000,sliderValue:(trip_demand_radius==500)?0:trip_demand_radius,onSlide:onSlideDemandRadius,onChange:onChangeDemandRadius});observeRadiusLeft('slider_demand_left',slider_demand);observeRadiusRight('slider_demand_right',slider_demand);onSlideIntervalMinRadius=function(v){$('verbose_interval_min_radius').innerHTML=((v==7)?"-":"")+(v-7)+'j';}
onChangeIntervalMinRadius=function(v){onSlideIntervalMinRadius(v);interval_min_radius=v;}
var slider_interval_min=new Control.Slider('handle_interval_min_radius','track_interval_min_radius',{range:$R(0,7),values:[0,1,2,3,4,5,6,7],sliderValue:interval_min_radius,onSlide:onSlideIntervalMinRadius,onChange:onChangeIntervalMinRadius});observeRadiusLeft('slider_interval_min_left',slider_interval_min);observeRadiusRight('slider_interval_min_right',slider_interval_min);onSlideIntervalMaxRadius=function(v){$('verbose_interval_max_radius').innerHTML='+'+v+'j';}
onChangeIntervalMaxRadius=function(v){onSlideIntervalMaxRadius(v);interval_max_radius=v;}
var slider_interval_max=new Control.Slider('handle_interval_max_radius','track_interval_max_radius',{range:$R(0,7),values:[0,1,2,3,4,5,6,7],sliderValue:interval_max_radius,onSlide:onSlideIntervalMaxRadius,onChange:onChangeIntervalMaxRadius});observeRadiusLeft('slider_interval_max_left',slider_interval_max);observeRadiusRight('slider_interval_max_right',slider_interval_max);new Ajax.Autocompleter("id_departure_city_name","id_departure_city_autocomplete",autocomplete_url,{paramName:autocomplete_paramName,frequency:autocomplete_frequency,minChars:autocomplete_minChars});new Ajax.Autocompleter("id_arrival_city_name","id_arrival_city_autocomplete",autocomplete_url,{paramName:autocomplete_paramName,frequency:autocomplete_frequency,minChars:autocomplete_minChars});new Tip($('help_trip_type'),help_trip_type_tt);new Tip($('help_map'),help_map_tt);new Tip($('help_slider_date'),help_slider_date_tt);new Tip($('help_slider_radius_driver'),help_slider_radius_driver_tt);new Tip($('help_slider_radius_passenger'),help_slider_radius_passenger_tt);Event.observe(window,'load',function(){enabledisableOptions();enabledisableDateParams();initOL();});$('form_departure_arrival').observe('submit',function(event){current_step=1;departurePointGeocoder();arrivalPointGeocoder();map2recenter=true;Event.stop(event);});$('id_trip_type').observe('change',function(event){$('param_radius_driver').style.visibility=(getTripType()==TYPE_DEMAND)?'hidden':'visible';$('help_radius_driver_slider').style.visibility=(getTripType()==TYPE_DEMAND)?'hidden':'visible';$('param_radius_passenger').style.visibility=(getTripType()==TYPE_OFFER)?'hidden':'visible';$('help_radius_passenger_slider').style.visibility=(getTripType()==TYPE_OFFER)?'hidden':'visible';removeTrip();current_step=1;updateTrip();displayDepartureRadiusCircle();displayArrivalRadiusCircle();enabledisableOptions();});$('id_frequency_type').observe('change',function(event){enabledisableDateParams();});function enabledisableDateParams(){$('param_date').style.display=(($('id_frequency_type').getValue()==1)?'none':'block');$('date_slider').style.display=(($('id_frequency_type').getValue()==1)?'none':'block');$('help_date_slider').style.display=(($('id_frequency_type').getValue()==1)?'none':'block');$('date_dows').style.display=(($('id_frequency_type').getValue()==0)?'none':'block');}
function areDowsEmpty(){for(var index=0;index<7;index++){if($('dow_'+index).checked){return false;}}
return true;}
function areSomeParamOK(){if(!$('id_trip_name').getValue()){alert(gettext('Please give a name to your trip.'));return false;}
if($('id_frequency_type').getValue()==0&&!$('id_date').getValue()){alert(gettext('Please choose a date.'));return false;}
if($('id_frequency_type').getValue()==1&&areDowsEmpty()){alert(gettext('Please choose a frequency.'));return false;}
if(getTripType()!=TYPE_DEMAND&&!isRouteOK()){alert(gettext('The route is not correctly defined.'));return false;}
return true;}
$('form_trip_details').observe('submit',function(event){Event.stop(event);if(!areSomeParamOK())
return;saveTrip(false);});if($('form_trip_details_for_return')){$('form_trip_details_for_return').observe('submit',function(event){Event.stop(event);if(!areSomeParamOK())
return;saveTrip(true);});}