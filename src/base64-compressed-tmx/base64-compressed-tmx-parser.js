// 重构解析tmx文件的代码
// 单元测试就是看输出到窗口的地图是不是和预期一致
;(function(window, TMXParser) {
	'use strict';

	function Base64CompressedTMXParser() {}

	Base64CompressedTMXParser.prototype = new TMXParser();
	Base64CompressedTMXParser.prototype.constructor = Base64CompressedTMXParser;
	Base64CompressedTMXParser.prototype.assemble = assemble;

	function assemble(dataNode, width, height) {
		let map = [];
		let plain = decompress(dataNode.innerHTML.trim());

		for (let x = 0; x < width; x++) {
			map[x] = [];

			for (let y = 0; y < height; y++) {
				map[x][y] = -1;				
			}
		}

		let offset = -4;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				map[x][y] = calcTileid(plain, offset += 4);
			}
		}

		return map;
	}

	function decompress(rawData) {
		const bytes = window.atob(rawData);

		let uint8Array = new Uint8Array(bytes.length);
		for (let i = 0; i < bytes.length; i++) {
			uint8Array[i] = bytes.charCodeAt(i);
		}

		return new Zlib.Inflate(uint8Array).decompress();
	}	

	const BYTE_SIZE = 4;
	function calcTileid(plain, offset) {
		let tileid = 0;

		tileid |= plain[offset];
		tileid |= plain[offset + 1] << BYTE_SIZE;
		tileid |= plain[offset + 2] << BYTE_SIZE * 2;
		tileid |= plain[offset + 3] << BYTE_SIZE * 3;

		return tileid;
	}

	window.Base64CompressedTMXParser = Base64CompressedTMXParser;
} (this, this.TMXParser));