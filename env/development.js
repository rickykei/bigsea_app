let url = 'https://bigsea.rickykei.com';
if(process.env.NODE_ENV != 'development'){
	url = '/api';
}
export default {
	url
}
