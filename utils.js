let directory;

class ChunkCoordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class overlayLine {
  constructor(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
  }
}

function makePZCoord(coord) {
  var roundedstring = Math.floor(coord).toString();
  var newlen = roundedstring.length - 1;
  return roundedstring.slice(0, newlen)
}

function getCoordFromMapName(Mapname) {
  Mapname = Mapname.replace("map_", "");
  Mapname = Mapname.replace(".bin", "");
  const arr = Mapname.split("_");
  let coord = new ChunkCoordinate(arr[0], arr[1]);
  return coord;
}

function addOverlay(myviewer, AnnoName, x, y, w, h) {
  let rect = myviewer.viewport.imageToViewportRectangle(x * 10, y * 10, w, h);
  var elt = document.createElement("div");
  elt.id = AnnoName;
  elt.style.color = "rgba(0, 255, 0, 0.25)";
  elt.style.background = "rgba(0, 255, 0, 0.25)";
  //elt.style.border = "1px solid #969696";

  this.viewer.addOverlay(elt, rect);
  //console.log("ADDED OVERLAY")
}

const sortByDistance = (coordinates, point) => {
  const sorter = (a, b) => distance(a, point) - distance(b, point);
  coordinates.sort(sorter);
};

const distance = (coor1, coor2) => {
  const x = coor2.x - coor1.sx;
  const y = coor2.y - coor1.sy;
  return Math.sqrt((x * x) + (y * y));
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function annoCoordToPZCoord(annocoord) {
  annocoord = annocoord.replace("xywh=pixel:", "");
  const arr = annocoord.split(",");
  let sx = parseInt(arr[0].slice(0, arr[0].indexOf(".") - 1), 10);
  let sy = parseInt(arr[1].slice(0, arr[1].indexOf(".") - 1), 10);
  let ex = sx + Math.floor(arr[2].slice(0, arr[2].indexOf(".")) / 10)
  let ey = sy + Math.floor(arr[3].slice(0, arr[3].indexOf(".")) / 10)
  return { sx: sx, sy: sy, ex: ex, ey: ey }
}

function CoordinateToFileName(x, y, filetype) {
  if (filetype == "M") {
    return "map_" + x + "_" + y + ".bin";
  } else if (filetype == "C") {
    let cx = Math.floor(x / 30)
    let cy = Math.floor(y / 30)
    return "chunkdata_" + cx + "_" + cy + ".bin";
  } else if (filetype == "Z") {
    let cx = Math.floor(x / 30)
    let cy = Math.floor(y / 30)
    return "zpop_" + cx + "_" + cy + ".bin";
  }
}

function toggleprogressbar(state) {
  if (state) {
    document.getElementById("overlay").style.display = "block";
    //document.getElementById("wrapper").classList.remove("d-none");
  } else {
    document.getElementById("overlay").style.display = "none";
    //document.getElementById("wrapper").classList.add("d-none");
  }
} 

function updateProgressBar(FilesToCheck,filesChecked,AreasToClear,areasCleared){
  CurrentProgress = Math.floor(filesChecked/FilesToCheck*100)
  MainProgress = Math.floor(areasCleared/AreasToClear*100)
  MainProgressbar = document.getElementById("OverallprogressBar")
  CurrentprogressBar =   document.getElementById("CurrentprogressBar")
  MainProgressbar.innerText = "Areas cleared " + areasCleared + "/" + AreasToClear;
  CurrentprogressBar.innerText = "Current Area " + CurrentProgress + "%";
  CurrentprogressBar.style.width = CurrentProgress + "%";
  MainProgressbar.style.width = MainProgress+ "%";
}