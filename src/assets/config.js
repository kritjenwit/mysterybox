const config = {
	img_url : 'https://luckygame.in.th/asset/luckygame2/images/',
	chksumKey : 'aofkitapigamemysterbox2020',
	addorsubChksumKey : 'aofkitapigamemysterbox_qsfhcortjf1245',
	apiUrl : 'https://back.luckygame.in.th',
	logFile : 'G:/game/Mysterbox/log/',
	api : {
		getItems : 'apiaction/get_listboxrandom_detail',
		addOrSub : 'apiaction/cut_add_pointMlive',
		recvItem : 'apiaction/get_Product',
		logFile  : 'apiaction/app_log_file',
		logbet   : 'apiaction/logbet',
	},
	crypto : {
		algo : {
			aes_256_cbc : 'aes-256-cbc',
			aes_256_ecb : 'aes-256-ecb',
		},
		ivLength : 16,
		key : {
			secret : '0ae7365328a9af36030092497564605d',
			second : '7cd8723c6933040274e0f76bb3b056d0',
		}
	}
}

module.exports = config;