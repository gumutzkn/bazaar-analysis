# Express ve MongoDB ile Pazar Analizi

1. Repoyu indir:

```bash
git clone https://github.com/gumutzkn/bazaar-analysis
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `env` dosyası oluşturun:

```env
MONGO_USERNAME=<username>
MONGO_PASSWORD=<password>
MONGO_CLUSTER=<your_mongo_cluster>
MONGO_DBNAME=<your_mongo_dbname>

SERVER_PORT=<port>
```

## Enpoints

### Bütün ürünleri listele

- URL: `/getAll`
- Method: `GET`
- Örnek yanıt:

```json
{
	"datas": [
		{
			"_id": "6616c4186b9ae1698d9bf3c4",
			"TARIH": "Mon Jan 02 2023 03:00:00 GMT+0300 (GMT+03:00)",
			"MAL_TURU": "MEYVE",
			"MAL_ADI": "PORTAKAL VALENCIA",
			"BIRIM": "kg",
			"ASGARI_UCRET": 4,
			"AZAMI_UCRET": 8,
			"ORTALAMA_UCRET": 6
		}
	],
	"uniqueMalAdiValues": [
		"ACUR",
		"ALABAŞ",
		"ANANAS",
		"ARMUT",
		"ARMUT AKÇA",
		"ARMUT DEVECI"
	]
}
```

### Mal adına göre verileri getir

- URL: `/getName/:mal_adi`
- Method: `GET`
- Description: `MAL_ADI` na göre verileri getirir.
- Örnek yanıt:

```json
[...]
```
