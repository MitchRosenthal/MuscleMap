$(document).ready(function(){
    const $container = $('.image-map-container');
  
    // Hover‐in: draw highlight
    $container.on('mouseenter', 'area.muscle-area', function(){
      // parse all x,y pairs
      const pts = this.coords.split(',').map(Number);
      const xs = pts.filter((_,i) => i % 2 === 0);
      const ys = pts.filter((_,i) => i % 2 === 1);
  
      // compute bounding box
      const x1 = Math.min(...xs),
            x2 = Math.max(...xs),
            y1 = Math.min(...ys),
            y2 = Math.max(...ys);
  
      // add highlight div
      const $hl = $('<div class="muscle-highlight"></div>').css({
        top:    y1,
        left:   x1,
        width:  x2 - x1,
        height: y2 - y1
      });
      $container.append($hl);
    });
  
    // Hover‐out: remove highlight
    $container.on('mouseleave', 'area.muscle-area', function(){
      $container.find('.muscle-highlight').remove();
    });
  });