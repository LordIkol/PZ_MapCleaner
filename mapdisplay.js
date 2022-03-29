var zomify = {
    //required	
    type: "zoomifytileservice",
    width: 15000,
    height: 13500,
    tilesUrl: "openseadragon/mymap/"
};

var viewer = OpenSeadragon({
    id: "openseadragon1",
    prefixUrl: "openseadragon/images/",
    tileSources: zomify,

    maxZoomLevel: 50
});

var positionEl = document.querySelectorAll('.position')[0];

viewer.addHandler('open', function () {

    var tracker = new OpenSeadragon.MouseTracker({
        element: viewer.container,
        moveHandler: function (event) {
            var webPoint = event.position;
            var viewportPoint = viewer.viewport.pointFromPixel(webPoint);
            var imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
            var zoom = viewer.viewport.getZoom(true);
            var imageZoom = viewer.viewport.viewportToImageZoom(zoom);
            positionEl.innerHTML = 'Location: ' + makePZCoord(imagePoint.x) + ',' + makePZCoord(imagePoint.y);
        }
    });

});


const config = {
    allowEmpty: true,
    disableEditor: true,
    drawOnSingleClick: true
  };
  
  var anno = OpenSeadragon.Annotorious(viewer,config);
  //anno.loadAnnotations('annotations.w3c.json');
  anno.allowEmpty = true;
  
  anno.on('createAnnotation', function (a) {
      //console.info(a.target.selector.value)
  });
  
  anno.on('updateAnnotation', function (a) {
    //console.info(a.target.selector.value)
  });