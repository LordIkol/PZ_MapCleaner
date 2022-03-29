document.getElementById('addToFolder').addEventListener('click', async () => {
  let LineArr = await CreateLineArray();
  let rectList = LineArrToRect(LineArr);
  drawRectangles(rectList);

  

});

document.getElementById('test').addEventListener('click', async () => {
  annolist = anno.getAnnotations();

  for (let an of annolist) {
    rectinfo = annoCoordToPZCoord(an.target.selector.value)
    console.log(rectinfo.sx, rectinfo.sy, rectinfo.ex, rectinfo.ey);
    for (let i = rectinfo.sx; i < rectinfo.ex; i++) {
      for (let j = rectinfo.sy; j < rectinfo.ey; j++) {
        filetoDelete = "map_" + i + "_" + j + ".bin";
        try{
          await directory.removeEntry(filetoDelete);
          //console.log(filetoDelete + " Deleted");
        }catch (e) {
          //console.log(filetoDelete + " Was not found!");
        }
      }
    }
   
  }
  alert("local files deleted!");
  

});