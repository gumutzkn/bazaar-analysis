# Express ve MongoDB ile Pazar Analizi

1. Repoyu indir:

```bash
git clone https://github.com/gumutzkn/bazaar-analysis
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env` dosyası oluşturun:

```env
MONGO_USERNAME=<username>
MONGO_PASSWORD=<password>
MONGO_CLUSTER=<your_mongo_cluster>
MONGO_DBNAME=<your_mongo_dbname>

SERVER_PORT=<port>
```

4. Sunucuyu başlat:

```bash
npm start
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
[
	{
		"_id": "6616c4186b9ae1698d9bf3b8",
		"TARIH": "Mon Jan 02 2023 03:00:00 GMT+0300 (GMT+03:00)",
		"MAL_TURU": "MEYVE",
		"MAL_ADI": "ELMA",
		"BIRIM": "kg",
		"ASGARI_UCRET": 4,
		"AZAMI_UCRET": 15,
		"ORTALAMA_UCRET": 9.5
	},
	{
		"_id": "6616c4186b9ae1698d9bf3bb",
		"TARIH": "Mon Jan 02 2023 03:00:00 GMT+0300 (GMT+03:00)",
		"MAL_TURU": "MEYVE",
		"MAL_ADI": "ELMA STARKING",
		"BIRIM": "kg",
		"ASGARI_UCRET": 4,
		"AZAMI_UCRET": 16,
		"ORTALAMA_UCRET": 10
	}
]
```

### Mal adına göre ortalamayı getir

- URL: `/getOrt/:mal_adi`
- Method: `GET`
- Description: Her malın `ORTALAMA_UCRET` ini tüm veriden hesaplar
- Örnek yanıt:

```json
[
	{
		"_id": null,
		"Ortalama": 19.670992584141473
	}
]
```

### Get yearly average by name

- URL: `/getOrt/:mal_adi/:yil`
- METHOD: `GET`
- Description: Calculates the yearly average `ORTALAMA_UCRET` for the provided `MAL_ADI` and year.
- Sample response:

```json
{
	"Meyve_Sebze": "elma",
	"Baslangic_Tarihi": "2023-01-01",
	"Bitis_Tarihi": "2024-01-01",
	"Yillik_Ortalama_Ucret": 17.875635205233593,
	"Aylik_Ortalamalar": [
        {
            "_id": {
                "month": 1
            },
            "Ortalama": 12.09870848708487
        },
        {
            "_id": {
                "month": 2
            },
            "Ortalama": 13.359110169491526
        },
		...
		]
}
```

### Get monthly average by name

- URL: `/getOrt/:mal_adi/:yil/:ay`
- Method: `GET`
- Description: Calculates the monthly average `ORTALAMA_UCRET` for the provided `MAL_ADI`, year and month
- Örnek yanıt:

```json
{
	"Meyve_Sebze": "elma",
	"Baslangic_Tarihi": "2023-05-01",
	"Bitis_Tarihi": "2023-06-01",
	"Aylık_Ortalama_Ucret": 13.291666666666666,
	"Gunluk_Ortalamalar": [
        {
            "Gun": 1,
            "Ortalama": 13.0625
        },
        {
            "Gun": 2,
            "Ortalama": 13.0625
        },
		...
	]
}
```

### Get daily average by name

- URL: `/getOrt/:mal_adi/:yil/:ay/:gun`
- Method: `GET`
- Description: Calculates the monthly average `ORTALAMA_UCRET` for the provided `MAL_ADI`, year, month and day
- Örnek yanıt:

```json
{
	"Meyve_Sebze": "elma",
    "Tarih": "2023-05-01",
    "Ortalama_Ucret": 13.0625
}
```

### Get data by date

- URL: `/getdate/:yil/:ay/:gun`
- Method: `GET`
- Description: Retrieves data for the specified date.
- Örnek yanıt:

```json
{
	"datas": [
		{
			"_id": "ALABAŞ",
			"ORTALAMA_UCRET": 4.5
		},
		{
			"_id": "ANANAS",
			"ORTALAMA_UCRET": 37.5
		}
	],
	"uniqueMalAdiValues": ["ALABAŞ", "ANANAS", "ARMUT DEVECI", "ARMUT S.MARIA"]
}
```

### Get data by year and month

- URL: `/getay/:yil/:ay`
- Method: `GET`
- Description: Retrieves data for the specified year and month.
- Örnek yanıt:

```json
["ALABAŞ", "ANANAS", "ARMUT DEVECI", "ARMUT S.MARIA"]
```

### Get data by year

- URL: `/getyil/:yil`
- Method: `GET`
- Description: Retrieves data for the specified year.
- Örnek yanıt:

```json
["ALABAŞ", "ANANAS", "ARMUT DEVECI", "ARMUT S.MARIA"]
```

### Get compare this year's average with last year's average

- URL: `/getcomparepast/:mal_adi/:yil/:ay`
- Method: `GET`
- Description: Calculates the monthly average `ORTALAMA_UCRET` for the provided `MAL_ADI`, year, month for this year and last year
- Örnek yanıt:
```json
{
    "Meyve_Sebze": "patates",
    "Baslangic_Tarihi": "2024-1-01",
    "Bitis_Tarihi": "2024-2-01",
    "Aylik_Ortalama_Ucret": 13.461538461538462,
    "Geçmiş_Baslangic": "2023-1-01",
    "Geçmiş_Bitis": "2023-2-01",
    "Geçmiş_Aylik_Ortalama_Ucret": 7.716346153846154
}
```

### Get compare by dates
- URL: `/getcompared/:mal_adi/:yil1/:ay1/:yil2/:ay2`
- Method: `GET`
- Description: Calculates the monthly average `ORTALAMA_UCRET` for the provided `MAL_ADI`, start_year(yil1), start_month(ay1), end_year(yil2),end_month(ay2)
- Örnek yanıt: 
```json
{
	"Meyve_Sebze": "cilek",
    "Baslangic_Tarihi1": "2023-3-01",
    "Bitis_Tarihi1": "2023-4-01",
    "Aylik_Ortalama_Ucret1": 28.796296296296298,
    "Baslangic_Tarihi2": "2023-8-01",
    "Bitis_Tarihi2": "2023-9-01",
    "Aylik_Ortalama_Ucret2": 46.22222222222222,
    "Yuzdelik_Fark": 60.51446945337619,
    "Yorum": "8 - 2023 fiyatı, 3 - 2023 fiyatıdan %60.51 daha yüksek. Bu, fiyatların arttığını gösteriyor."
}
```

### Get averages between selected dates by name
- URL: `/getselectmonth/:mal_adi/:yil1/:ay1/:yil2/:ay2`
- Method: `GET`
- Description: Calculates the monthly averages `ORTALAMA_UCRET` for the provided `MAL_ADI`, start_year(yil1), start_month(ay1), end_year(yil2),end_month(ay2) between start and end dates
- Örnek yanıt: 
```json
{
    "Meyve_Sebze": "ayva",
    "Baslangic_Tarihi": "2023-10-01",
    "Bitis_Tarihi": "2023-12-01",
    "Ortalama_Ucret": 19.08653846153846,
    "Aylik_Ortalamalar": [
        {
            "_id": {
                "year": 2023,
                "month": 10
            },
            "Ortalama": 19.326923076923077
        },
        {
            "_id": {
                "year": 2023,
                "month": 11
            },
            "Ortalama": 18.846153846153847
        }
    ]
}
```

### Get averages between selected days by name
- URL: `/getselectday/:mal_adi/:yil1/:ay1/:gun1/:yil2/:ay2/:gun2`
- Method: `GET`
- Description: Calculates the daily averages `ORTALAMA_UCRET` for the provided `MAL_ADI`, start_year(yil1), start_month(ay1), start_day(gun1), end_year(yil2),end_month(ay2), end_day(gun2) between start and end dates
- Örnek yanıt:
```json
{
    "Meyve_Sebze": "kabak",
    "Baslangic_Tarihi": "2024-1-08",
    "Bitis_Tarihi": "2024-1-11",
    "Ortalama_Ucret": 18.416666666666668,
    "Gunluk_Ortalamalar": [
        {
            "Gun": {
                "day": 8,
                "month": 1,
                "year": 2024
            },
            "Ortalama": 19.25
        },
        {
            "Gun": {
                "day": 9,
                "month": 1,
                "year": 2024
            },
            "Ortalama": 18.25
        },
        {
            "Gun": {
                "day": 10,
                "month": 1,
                "year": 2024
            },
            "Ortalama": 17.75
        }
    ]
}
``` 