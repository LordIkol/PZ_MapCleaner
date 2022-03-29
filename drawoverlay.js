async function getFilearr() {
  //let directory;
  let Coords = [];
  try {
    directory = await window.showDirectoryPicker({
      startIn: 'desktop'
    });

    for await (const entry of directory.values()) {
      if (entry.name.startsWith("map_")) {
        currentCoord = getCoordFromMapName(entry.name);
        if (isNumeric(currentCoord.x)) {
          Coords.push(currentCoord)
        }
      }
    }
    return Coords;
  } catch (e) {
    console.log(e);
  }
}

async function reloadFileArr() {
  let Coords = [];
  try {
    for await (const entry of directory.values()) {
      if (entry.name.startsWith("map_")) {
        currentCoord = getCoordFromMapName(entry.name);
        if (isNumeric(currentCoord.x)) {
          Coords.push(currentCoord)
        }
      }
    }
    return Coords;
  } catch (e) {
    console.log(e);
  }
}


function CreateLineArray(Coords) {
  let LineArr = [];
  let lastcoord = new ChunkCoordinate(0, 0);
  let currentCoord = new ChunkCoordinate(0, 0);
  let w = 0;
  let h = 0
  let startx = 0;
  let starty = 0;
  let endx = 0;
  let endy = 0;
  let AnnoName = "";
  Coords.sort((a, b) => { return a.x - b.x; });

  for (let i = 0; i < Coords.length; i++) {

    AnnoName = Coords[i].x + "-" + Coords[i].y;
    currentCoord = Coords[i];

    if (currentCoord.x == lastcoord.x && currentCoord.y == parseInt(lastcoord.y, 10) + 1) {
      h = h + 10;
      lastcoord = new ChunkCoordinate(currentCoord.x, currentCoord.y);
      endx = currentCoord.x;
      endy = currentCoord.y;
    }
    else if (startx <= 0) {
      lastcoord = new ChunkCoordinate(currentCoord.x, currentCoord.y);
      startx = currentCoord.x;
      starty = currentCoord.y;
      endx = currentCoord.x;
      endy = currentCoord.y;
    }
    else {
      LineArr.push(new overlayLine(startx, starty, endx, endy));
      lastcoord = new ChunkCoordinate(currentCoord.x, currentCoord.y);
      startx = currentCoord.x;
      starty = currentCoord.y;
      endx = currentCoord.x;
      endy = currentCoord.y;
    }
  }
  return LineArr;
}

function LineArrToRect(LineArr) {
  let rectList = [];
  let lastline;
  let newRect;
  let line = LineArr[0];
  let LinesToSearch = LineArr.length;

  for (let i = 0; i < LinesToSearch; i++) {
    if (!lastline) {
      line = LineArr[0];
      newRect = new overlayLine(line.sx, line.sy, line.ex, line.ey);
      lastline = new overlayLine(line.sx, line.sy, line.ex, line.ey);
    }
    else if ((line.sx == parseInt(lastline.sx, 10) + 1) && (line.sy == lastline.sy && line.ey == lastline.ey)) {
      newRect.ex = line.ex;
    }
    else if ((line.sx == parseInt(lastline.sx, 10) - 1) && (line.sy == lastline.sy && line.ey == lastline.ey)) {
      newRect.sx = line.sx;
    } else {
      rectList.push(new overlayLine(newRect.sx, newRect.sy, newRect.ex, newRect.ey));
      newRect.sx = line.sx;
      newRect.sy = line.sy;
      newRect.ex = line.ex;
      newRect.ey = line.ey;
    }
    lastline.sx = line.sx;
    lastline.sy = line.sy;
    lastline.ex = line.ex;
    lastline.ey = line.ey;
    LineArr.shift();
    sortByDistance(LineArr, { x: lastline.sx, y: lastline.sy });
    line = LineArr[0];
  }
  return rectList;
}

function drawRectangles(rectList) {
  let cnt = 0;
  for (let Orect of rectList) {
    let w = (Orect.ex - parseInt(Orect.sx, 10) + 1) * 10;
    let h = (Orect.ey - parseInt(Orect.sy, 10) + 1) * 10;
    //console.log(`adding rect ${Orect.sx},${Orect.sy},${w},${h}`);
    addOverlay(viewer, cnt.toString(), Orect.sx, Orect.sy, w, h);
    cnt++;
  }
  //console.log("Rectangles drawn: " + rectList.length);
}