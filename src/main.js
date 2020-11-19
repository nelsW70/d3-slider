import * as d3 from 'd3';
import { attrs } from 'd3-selection-multi';

let dim = {
  width: 600,
  height: 400
};

let svg = d3
  .select('body')
  .append('svg')
  .style('background', 'lightgray')
  .attrs(dim);

let data = d3.range(50, 551, 5);

let lineAtts = {
  x1: d => d,
  y1: 200,
  x2: d => d,
  y2: (d, i) => (i % 10 == 0 ? 220 : 210),
  stroke: 'black'
};

let lines = svg
  .selectAll('line')
  .data(data)
  .enter()
  .append('line')
  .attrs(lineAtts);

let drag = d3.drag();
drag
  .on('start', function () {
    d3.select(this).attrs({
      stroke: 'red',
      cursor: 'none'
    });
  })
  .on('drag', function () {
    let el = d3.select(this);
    let xPos = parseInt(el.attr('cx'));
    let nPos = xPos + d3.event.dx;
    if (nPos < 50) nPos = 50;
    if (nPos > 550) nPos = 550;
    el.attr('cx', nPos);
    pushLines();
  })
  .on('end', function () {
    d3.select(this).attrs({
      stroke: 'black',
      cursor: 'grab'
    });
  });

let slider = svg
  .append('circle')
  .attrs({
    cx: 50,
    cy: 200,
    r: 20,
    fill: 'white',
    stroke: 'black',
    cursor: 'grab'
  })
  .call(drag);

let label = svg
  .append('text')
  .attrs({
    x: 50,
    y: 200,
    'text-anchor': 'middle',
    'alignment-baseline': 'middle'
  })
  .text(50)
  .style('pointer-events', 'none');

function pushLines() {
  lines.each(function (d, i) {
    let el = d3.select(this);
    let x = parseInt(el.attr('x1'));
    let sx = parseInt(slider.attr('cx'));
    let dx = Math.abs(sx - x);
    let r = 25;
    if (x >= sx - r && x <= sx + r) {
      let dy = Math.sqrt(Math.abs(r * r - dx * dx));
      el.attr('y1', 200 + dy);
      el.attr('y2', i % 10 == 0 ? 220 + dy : 210 + dy);
    } else {
      el.attr('y1', 200);
      el.attr('y2', i % 10 == 0 ? 220 : 210);
    }
    label.text(slider.attr('cx'));
    label.attr('x', slider.attr('cx'));
  });
}

pushLines();
