// 重构解析tmx文件的代码
// 单元测试就是看输出到窗口的地图是不是和预期一致
;(function(window, TMXParser) {
	'use strict';

	function CSVTMXParser() {}

	CSVTMXParser.prototype = new TMXParser();
	CSVTMXParser.prototype.constructor = CSVTMXParser;
	CSVTMXParser.prototype.assemble = assemble;

	function assemble(dataNode, width, height) {
		let map = [];
		let plain = dataNode.innerHTML.trim().replace('\r\n', '').split(',');

		for (let x = 0; x < width; x++) {
			map[x] = [];

			for (let y = 0; y < height; y++) {
				map[x][y] = -1;				
			}
		}

		let offset = -4;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				map[x][y] = plain[y * width + x];
			}
		}

		return map;
	}

	window.CSVTMXParser = CSVTMXParser;
} (this, this.TMXParser));