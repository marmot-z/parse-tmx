// 重构解析tmx文件的代码
// 单元测试就是看输出到窗口的地图是不是和预期一致
;(function(window, TMXParser) {
	'use strict';

	function OldTMXParser() {}

	OldTMXParser.prototype = new TMXParser();
	OldTMXParser.prototype.constructor = OldTMXParser;
	OldTMXParser.prototype.assemble = assemble;

	function assemble(dataNode, width, height) {
		let map = [];
		let tiles = dataNode.querySelectorAll('tile');

		for (let x = 0; x < width; x++) {
			map[x] = [];

			for (let y = 0; y < height; y++) {
				map[x][y] = -1;				
			}
		}

		let offset = -4;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let tileId = tiles[y * width + x].getAttribute('gid');
				map[x][y] = tileId ? Number.parseInt(tileId) : 0;
			}
		}

		return map;
	}

	window.OldTMXParser = OldTMXParser;
} (this, this.TMXParser));