;(function(window) {
	'use strict';

	async function draw(map) {
		let context = initCanvas(map);

		let imageSrc = map.baseUrl + '/' + map.tileset.img.source;
		let img = await loadImage(imageSrc);

		let width = Number.parseInt(map.width);
		let height = Number.parseInt(map.height);

		map.layers.forEach(function(layer) {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					let tileId = layer.tileMap[x][y];
					let position = map.tileset.getPositionFromTileid(tileId);
					let tileWidth = position.width + (map.tileset.margin ? Number.parseInt(map.tileset.margin) : 0);
					let tileHeight = position.height + (map.tileset.margin ? Number.parseInt(map.tileset.margin) : 0);

					context.drawImage(img, 
									  position.x * tileWidth, position.y * tileHeight, position.width, position.height,
									  x * tileWidth, y * tileHeight, tileWidth, tileHeight);	
				}
			}
		});				
	}

	function initCanvas(map) {
		let canvas = document.createElement('canvas');
	
		canvas.id = 'canvas';
		canvas.width = map.width * map.tilewidth;
		canvas.height = map.height * map.tileheight;

		document.body.appendChild(canvas);

		return document.querySelector('canvas').getContext('2d');
	}

	async function loadImage(src) {
		let img = new Image();
		
		let p = new Promise((resolve, reject) => {
			img.onload = function(e) {
				resolve(e.target);
			}
		});

		img.src = src;

		return p;
	}

	window.draw = draw;
} (this));