class formProses {
	constructor(url) {
		this.url = url;
	}

	tambah(tbl, data, url = 'manajemen') {
		const send = {
			manajemen: 'tambah',
			tbl: tbl,
			...data
		}

		const res = app.request.promise.post(`${this.url}${url}`, send, 'json');

		return res;
	}

	update(tbl, data, where = {}, url = 'manajemen') {
		const send = {
			manajemen: 'update',
			tbl: tbl,
			...data,
			where: where
		}

		const res = app.request.promise.post(`${this.url}${url}`, send, 'json');

		return res;
	}

	upload(formData, url = 'uploadSuratPengantar') {
		const res = app.request.promise({
			url: `${this.url}${url}`,
			type: 'POST',
			data: formData,
			dataType: 'json'
		})

		return res;
	}

	getData(data = {}, url = 'getData', type = 'GET') {
		const res = app.request.promise({
			type: type,
			url: this.url + url,
			dataType: 'json',
			data: data,
			// async: false
		})

		return res;
	}

	getWaktu() {
		const res = app.request({
			url: this.url + 'getWaktu',
			async: false
		});

		return res.response;
	}

	createID(data = {}, type = 'POST') {
		const res = app.request({
			type: type,
			url: this.url + 'generate_id',
			dataType: 'json',
			data: data,
			async: false
		})

		return JSON.parse(res.response);
	}

	cekData(tbl, send) {
		const res = app.request({
			type: "POST",
			url: this.url + 'cekData',
			dataType: 'json',
			data: {
				tabel: tbl,
				data: send
			},
			async: false
		})

		return res;
	}

	async cekDataPromise(tbl, send) {
		const res = app.request({
			type: "POST",
			url: this.url + 'cekData',
			dataType: 'json',
			data: {
				tabel: tbl,
				data: send
			},
			async: false
		})

		return await res;
	}
}