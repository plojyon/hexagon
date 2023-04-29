const initial_size = [3,3];
const CLASSES = ["a", "b", "any"];

const parse_name = (name) => {
    console.log("parsing name: " + name)
    const [row, col] = name.split("-")[1].split(':');
    const coords = [parseInt(row), parseInt(col)];

    // just to be extra verbose, idk (hopefully not needed)
    coords.x = coords[1];
    coords.y = coords[0];
    coords.row = coords[0];
    coords.col = coords[1];

    return coords;
}

const get_hexagon = (row, col) => {
    const hexagon = document.createElement('div');
    hexagon.id = 'hex-' + col + ':' + row;
    hexagon.className = 'hexagon';
    
    // randomly add one of the classes from CLASSES
    // hexagon.classList.add(CLASSES[Math.floor(Math.random() * CLASSES.length)]);
    hexagon.classList.add("any");

    hexagon.onclick = (e) => {
        let target = e.target.classList.contains('hexagontent')? e.target.parentNode : e.target;

        // const coords = parse_name(target.id);
        // console.log(coords);

        // cycle class
        const classes = target.classList;
        const current_class = classes[classes.length - 1];
        const current_class_index = CLASSES.indexOf(current_class);
        const next_class_index = (current_class_index + 1) % CLASSES.length;
        const next_class = CLASSES[next_class_index];
        target.classList.remove(current_class);
        target.classList.add(next_class);
    }

    const content = document.createElement('div');
    content.className = 'hexagontent';
    content.innerHTML = 'hex-' + col + ':' + row;
    hexagon.appendChild(content);

    return hexagon;
}

const add_row = (honeycomb, size=undefined) => {
    const row_div = document.createElement('div');

    let row_count, column_count;
    row_count = honeycomb.children.length;
    if (row_count == 0) {
        column_count = 0;
    } else {
        column_count = honeycomb.children[0].children.length;
    }

    row_div.classList.add('hexrow');
    for (let col = 0; col < column_count; col++) {
        row_div.appendChild(get_hexagon(row_count, col));
    }
    honeycomb.appendChild(row_div);
}

const add_column = (honeycomb) => {
    let row_count = honeycomb.children.length;
    let column_count = honeycomb.children[0].children.length;

    for (let row = 0; row < row_count; row++) {
        honeycomb.children[row].appendChild(get_hexagon(row, column_count));
    }
}

window.onload = () => {
    console.log('loaded');

    // generate honeycomb
    const honeycomb = document.getElementById('honeycomb');
    for (let row = 0; row < initial_size[0]; row++) {
        add_row(honeycomb);
    }
    for (let col = 0; col < initial_size[1]; col++) {
        add_column(honeycomb);
    }
}
