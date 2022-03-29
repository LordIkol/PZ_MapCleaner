document.getElementById('addToFolder').addEventListener('click', async () => {
  let Coords = await getFilearr();
  let LineArr = CreateLineArray(Coords);
  let rectList = LineArrToRect(LineArr);
  drawRectangles(rectList);
});

document.getElementById('test').addEventListener('click', async () => {
  annolist = anno.getAnnotations();

  let deleteMapData = document.getElementById('chk_Mapdata').checked;
  let deleteChunkData = document.getElementById('chk_Chunkdata').checked;
  let deleteZPopData = document.getElementById('chk_ZpopData').checked;

  if (deleteMapData == false && deleteChunkData == false && deleteZPopData == false) {
    alert("Select at least one filetype to Delete")
    return
  }

  toggleprogressbar(true);
  areasCleared = 0;
  AreasToClear = annolist.length;

  for (let an of annolist) {
    rectinfo = annoCoordToPZCoord(an.target.selector.value)
    //console.log(rectinfo.sx, rectinfo.sy, rectinfo.ex, rectinfo.ey);
    //console.log(rectinfo.sx / 30, rectinfo.sy / 30, rectinfo.ex / 30, rectinfo.ey / 30);
    let FilesToCheck = (rectinfo.ex-rectinfo.sx) * (rectinfo.ey - rectinfo.sy)+1
    let filesChecked = 0;
    for (let i = rectinfo.sx; i < rectinfo.ex; i++) {
      for (let j = rectinfo.sy; j < rectinfo.ey; j++) {
        filesChecked++;
        try {
          if (deleteMapData == true) {
            try {
              await directory.removeEntry(CoordinateToFileName(i, j, "M"));
            } catch (e) { }
          }
          if (deleteChunkData == true) {
            try {
              await directory.removeEntry(CoordinateToFileName(i, j, "C"));
            } catch (e) {}
          }
          if (deleteZPopData == true) {
            try {
              await directory.removeEntry(CoordinateToFileName(i, j, "Z"));
            } catch (e) { }
          }
        } catch (e) {
        }
      }
      updateProgressBar(FilesToCheck,filesChecked,AreasToClear,areasCleared)
    }
    areasCleared++;
  }

  let Coords = await reloadFileArr();
  viewer.clearOverlays();
  let LineArr = CreateLineArray(Coords);
  let rectList = LineArrToRect(LineArr);
  drawRectangles(rectList);

  toggleprogressbar(false);


});