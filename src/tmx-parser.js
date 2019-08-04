// 重构解析tmx文件的代码
// 单元测试就是看输出到窗口的地图是不是和预期一致
;(function(window) {
	'use strict';

	function TMXParser() {}

	TMXParser.prototype.parse = parse;
	TMXParser.prototype.unmarshalMap = unmarshalMap;
	TMXParser.prototype.unmarshalTileset = unmarshalTileset;
	TMXParser.prototype.unmarshalLayer = unmarshalLayer;
	TMXParser.prototype.assemble = assemble;


	let baseUrl;

	async function parse(fileUrl) {
		let tmxFileUrl = location.href.substring(0, location.href.lastIndexOf('/')) + '/' + fileUrl;		
		let xmlDoc = await loadXMLDoc(tmxFileUrl);

		baseUrl = tmxFileUrl.substring(0, tmxFileUrl.lastIndexOf('/'));

		let map = await this.unmarshalMap(xmlDoc.querySelector('map'));
		map.baseUrl = baseUrl;

		return map;
	};

	async function loadXMLDoc(url) {
		let content = await fetch(url).then(response => response.text());

		return new DOMParser().parseFromString(content, 'text/html');
	}

	async function unmarshalMap(mapNode) {
		let map = copyAttributes2Object(mapNode);

		let tileset = await this.unmarshalTileset(mapNode.querySelector('tileset'));
		let layers = Array.from(mapNode.querySelectorAll('layer'))
						  .map(this.unmarshalLayer, this);

		Object.assign(map, {tileset, layers});

		return map;
	}

	function copyAttributes2Object(node) {
		let obj = Object.create(null);

		if (node === null || node === undefined) {
			return obj;
		}		

		for (let attribute of node.attributes) {
			obj[attribute.name] = attribute.nodeValue;
		}

		return obj;
	}

	async function unmarshalTileset(tilesetNode) {

		// 有些格式的tmx文件中的tsx节点单独存储于外部tmx文件中
		// 有些格式的tmx文件中的tsx节点存储于tmx文件中
		let source = tilesetNode.getAttribute('source');
		let tileset = copyAttributes2Object(tilesetNode);
		if (source) {
			let tsxFileUrl = baseUrl + '/' + tilesetNode.getAttribute('source');
			let xmlDoc = await loadXMLDoc(tsxFileUrl);

			return Object.assign(tileset, _unmarshalTilesetNode(xmlDoc.querySelector('tileset')));
		}

		return Object.assign(tileset, _unmarshalTilesetNode(tilesetNode));
	}

	function _unmarshalTilesetNode(tilesetNode) {
		let tileset = copyAttributes2Object(tilesetNode);
		let img = copyAttributes2Object(tilesetNode.querySelector('img'));
		let tiles = Array.from(tilesetNode.querySelectorAll('tile'))
						 .map(copyAttributes2Object);	

		Object.assign(tileset, {tiles, img, getPositionFromTileid});

		return tileset;
	}

	function getPositionFromTileid(tileid) {
		tileid -= Number.parseInt(this.firstgid);

		let y = Math.floor(tileid / this.columns);
		let x = tileid - (y * this.columns);

		return {
			x: x,
			y: y,
			width: Number.parseInt(this.tilewidth),
			height: Number.parseInt(this.tileheight) 
		};
	}

	function unmarshalLayer(layerNode) {
		let layer = copyAttributes2Object(layerNode);
		let width = Number.parseInt(layer.width);
		let height = Number.parseInt(layer.height);

		layer.tileMap = this.assemble(layerNode.querySelector('data'), width, height);

		return layer;
	}

	function assemble(dataNode, width, height) {
		let map = [];

		for (let x = 0; x < width; x++) {
			map[x] = [];

			for (let y = 0; y < height; y++) {
				map[x][y] = -1;				
			}
		}

		return map;
	}

	window.TMXParser = TMXParser;
} (this));