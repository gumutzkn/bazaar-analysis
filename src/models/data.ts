import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
	TARIH: {
		type: String,
	},
	MAL_TURU: {
		type: String,
	},
	MAL_ADI: {
		type: String,
	},
	BIRIM: {
		type: String,
	},
	ASGARI_UCRET: {
		type: Number,
	},
	AZAMI_UCRET: {
		type: Number,
	},
	ORTALAMA_UCRET: {
		type: Number,
	},
});

export const Model = mongoose.model('Datas', dataSchema);
