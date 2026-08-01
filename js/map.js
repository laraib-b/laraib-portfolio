function svgEl(tag, attrs) {
  var el = document.createElementNS(SVGNS, tag);
  Object.keys(attrs).forEach(function (key) {
    el.setAttribute(key, attrs[key]);
  });
  return el;
}

function nodeCollisionRadius(node) {
  if (node.type === 'project') return 34 + node.label.length * 3.2;
  return 20 + node.label.length * 2.8;
}

function nodeVisualBox(node) {
  var hw = node.type === 'project' ? node.label.length * 3.8 : node.label.length * 3.2;
  if (node.type === 'project') {
    return { l: node.x - hw, r: node.x + hw, t: node.y - 24, b: node.y + 34 };
  }
  return { l: node.x - hw, r: node.x + hw, t: node.y - 28, b: node.y + 14 };
}

function fitMapViewBox(svg, nodes) {
  var pad = 20;
  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach(function (node) {
    var box = nodeVisualBox(node);
    minX = Math.min(minX, box.l);
    minY = Math.min(minY, box.t);
    maxX = Math.max(maxX, box.r);
    maxY = Math.max(maxY, box.b);
  });
  svg.setAttribute('viewBox', [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].join(' '));
}

function layoutGraph() {
  var nodes = Object.keys(MAP_META).map(function (id) {
    var meta = MAP_META[id];
    var pos = MAP_LAYOUT[id];
    return {
      id: id, label: meta.label, type: meta.type, jump: meta.jump, note: meta.note,
      x: pos.x, y: pos.y,
      r: nodeCollisionRadius({ type: meta.type, label: meta.label })
    };
  });
  var nodeById = {};
  nodes.forEach(function (n) { nodeById[n.id] = n; });

  PROJECT_IDS.forEach(function (id) {
    var node = nodeById[id];
    node.fx = node.x;
    node.fy = node.y;
  });

  for (var tick = 0; tick < 72; tick++) {
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i];
        var b = nodes[j];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        var overlap = (a.r + b.r) - dist;
        if (overlap <= 0) continue;
        var ux = dx / dist;
        var uy = dy / dist;
        if (a.fx != null && b.fx != null) continue;
        if (a.fx != null) {
          b.x += ux * overlap;
          b.y += uy * overlap;
        } else if (b.fx != null) {
          a.x -= ux * overlap;
          a.y -= uy * overlap;
        } else {
          a.x -= ux * overlap * 0.5;
          a.y -= uy * overlap * 0.5;
          b.x += ux * overlap * 0.5;
          b.y += uy * overlap * 0.5;
        }
      }
    }
  }

  PROJECT_IDS.forEach(function (id) {
    var node = nodeById[id];
    var pos = MAP_LAYOUT[id];
    node.x = pos.x;
    node.y = pos.y;
    delete node.fx;
    delete node.fy;
  });

  return { nodes: nodes };
}

function nodeAnchor(node) {
  return { x: node.x, y: node.y + (node.type === 'project' ? 2 : 4) };
}

function wavyPath(x1, y1, x2, y2, seed) {
  var mx = (x1 + x2) / 2;
  var my = (y1 + y2) / 2;
  var dx = x2 - x1;
  var dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy) || 1;
  var nx = -dy / len;
  var ny = dx / len;
  var wobble = ((seed % 5) - 2) * 8 + (len > 200 ? 12 : 6);
  var cx = mx + nx * wobble;
  var cy = my + ny * wobble;
  return 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2;
}

function drawSketchMap() {
  var mapSvg = document.querySelector('.map-svg');
  var linksGroup = document.getElementById('map-links');
  var nodesGroup = document.getElementById('map-nodes');
  if (!mapSvg || !linksGroup || !nodesGroup) return;

  var graph = layoutGraph();
  var nodes = graph.nodes;
  fitMapViewBox(mapSvg, nodes);

  var nodeById = {};
  nodes.forEach(function (n) { nodeById[n.id] = n; });

  MAP_LINKS.forEach(function (pair, i) {
    var a = nodeById[pair[0]];
    var b = nodeById[pair[1]];
    if (!a || !b) return;
    var pa = nodeAnchor(a);
    var pb = nodeAnchor(b);
    var path = svgEl('path', {
      d: wavyPath(pa.x, pa.y, pb.x, pb.y, i * 7 + pair[0].length),
      class: 'map-path'
    });
    linksGroup.appendChild(path);
  });

  linksGroup.querySelectorAll('.map-path').forEach(function (path) {
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
  });

  nodes.forEach(function (node) {
    var g = svgEl('g', {
      class: node.type === 'project' ? 'map-node' : 'skill-node',
      transform: 'translate(' + node.x + ',' + node.y + ')'
    });

    if (node.type === 'project') {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.appendChild(svgEl('text', { x: 0, y: 0, class: 'proj-star' })).textContent = '\u2606';
      g.appendChild(svgEl('text', { x: 0, y: 24, class: 'proj-label' })).textContent = node.label;
      if (node.note) {
        g.appendChild(svgEl('text', { x: 14, y: -14, class: 'map-hover-note' })).textContent = '\u2190 ' + node.note;
      }
      g.addEventListener('click', function () {
        var target = document.getElementById(node.jump);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var target = document.getElementById(node.jump);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    } else {
      g.appendChild(svgEl('text', { x: 0, y: -10, class: 'skill-label' })).textContent = node.label;
      g.appendChild(svgEl('circle', { cx: 0, cy: 4, r: 5, class: 'skill-dot' }));
    }

    nodesGroup.appendChild(g);
  });
}
