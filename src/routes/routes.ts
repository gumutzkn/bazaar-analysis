import express from 'express';
import { Model } from '../models/data';

const router = express.Router();

router.get('/getAll', async (req, res) => {
    try {
        const [datas, uniqueMalAdiValues] = await Promise.all([Model.find(), Model.distinct('MAL_ADI')]);
        res.json({datas: datas, uniqueMalAdiValues: uniqueMalAdiValues});
    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getName/:mal_adi', async (req, res) => {
    try {
        let mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`${mal_adi.split(' ').join('\\s+')}`, 'i');
        const data = await Model.find({ MAL_ADI: { $regex: regex } });
        res.json(data);
    }
    catch (error:any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/getOrt/:mal_adi', async (req, res) => {
    try{
        let mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`${mal_adi.split(' ').join('\\s+')}`, 'i');
        const data = await Model.aggregate([
            { $match: {MAL_ADI: { $regex: regex } } },
            { $group: {_id: null, Ortalama: { $avg: "$ORTALAMA_UCRET" } } }
        ]);
        res.json({Ortalama:data.length > 0 ? data[0].Ortalama : 0})
    }
    catch(error:any){
        res.status(500).json({message: error.message})
    }
})

router.get('/getOrt/:mal_adi/:yil', async (req, res) => {
    try{
        let mal_adi = req.params.mal_adi.trim(); 
        const regex = new RegExp(`${mal_adi.split(' ').join('\\s+')}`, 'i');
        const yil = req.params.yil;

        const baslangicTarihi = `${yil}-01-01`; 
        const bitisTarihi = `${Number(yil) + 1}-01-01`; 

        const data = await Model.aggregate([
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    TARIH: {
                        $gte: new Date(baslangicTarihi),
                        $lt: new Date(bitisTarihi)
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$TARIH" } },
                    Ortalama: { $avg: "$ORTALAMA_UCRET" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        const yillikOrtalama = data.reduce((acc, val) => acc + val.Ortalama, 0) / data.length;

        res.json({
            Meyve_Sebze: mal_adi,
            Baslangic_Tarihi: baslangicTarihi,
            Bitis_Tarihi: bitisTarihi,
            Yillik_Ortalama_Ucret: yillikOrtalama,
            Aylik_Ortalamalar: data
        });
        
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
});

router.get('/getOrt/:mal_adi/:yil/:ay', async (req, res) => {
    try{
        let mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`${mal_adi.split(' ').join('\\s+')}`, 'i');
        const yil = req.params.yil;
        let ay = Number(req.params.ay);
        
        if (ay > 12){
            res.status(500).json({message: "12'den büyük değer alamaz"});
        }
        else{
            const baslangic_tarihi = `${yil}-${ay < 10 ? '0' + ay : ay}-01`;
            ay = ay + 1 > 12 ? 1 : ay + 1;
            const bitis_tarihi = `${ay === 1 ? Number(yil) + 1 : yil}-${ay < 10 ? '0' + ay : ay}-01`;
            const data = await Model.aggregate([
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    TARIH: {
                        $gte: new Date(baslangic_tarihi),
                        $lt: new Date(bitis_tarihi)
                    }
                }
            },
            {
                $group: {
                    _id: { $dayOfMonth: "$TARIH"},
                    Ortalama: { $avg: "$ORTALAMA_UCRET"}
                }
            },
            {
                $sort: {"_id": 1 }
            }
        ]);

        res.json({
            Meyve_Sebze: mal_adi,
            Baslangic_Tarihi: baslangic_tarihi,
            Bitis_Tarihi: bitis_tarihi,
            Aylik_Ortalama_Ucret: data.reduce((acc, val) => acc + val.Ortalama, 0) / data.length,
            Gunluk_Ortalamalar: data.map(item => ({Gun: item._id, Ortalama: item.Ortalama}))
        });
        }
     
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
})

router.get('/getOrt/:mal_adi/:yil/:ay/:gun', async (req, res) => {
    
    try{
        let mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`${mal_adi.split(' ').join('\\s+')}`, 'i');
        const yil = req.params.yil;
        const ay = req.params.ay.padStart(2, '0');
        const gun = req.params.gun.padStart(2, '0');

        if(Number(ay) > 12 || Number(gun) > 31){
            res.status(500).json({message: "Uygun değer giriniz"});
        }

        else{
            const tarih = `${yil}-${ay}-${gun}`;

            const data = await Model.aggregate([
                {
                    $match: {
                        MAL_ADI: { $regex: regex },
                        TARIH:new Date(tarih)        
                    }
                },
                {
                    $group: {
                        _id: null,
                        Ortalama: { $avg: "$ORTALAMA_UCRET" }
                    }
                }
                
            ]);
    
            res.json({
                Meyve_Sebze: mal_adi,
                Tarih: tarih,
                Ortalama_Ucret: data.length > 0 ? data[0].Ortalama : 0
            });
        }

        
    }

    catch(error:any){
        res.status(500).json({message: error.message});
    }
})

router.get('/getdate/:yil/:ay/:gun', async (req, res) => {
    
    try{
        const yil = req.params.yil;
        const ay = req.params.ay.padStart(2, '0');
        const gun = req.params.gun.padStart(2, '0');

        if(Number(ay) > 12 || Number(gun) > 31){
            res.status(500).json({message: "Uygun değer giriniz"});
        }

        else{
            const tarih = new Date(`${yil}-${ay}-${gun}`);

            const data = await Model.aggregate([
                {
                    $match: {
                        TARIH:tarih    
                    }
                },
                {
                    $group: {
                        _id: "$MAL_ADI",
                        ORTALAMA_UCRET: { $avg: "$ORTALAMA_UCRET" }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }   
            ]);
            const uniqueMalAdiValues = data.map(doc => doc._id);
            res.json({datas: data,uniqueMalAdiValues:uniqueMalAdiValues});
        }
   
    }

    catch(error:any){
        res.status(500).json({message: error.message});
    }
});

router.get('/getay/:yil/:ay', async (req, res) => {
    try{
        const yil = req.params.yil;
        let ay = Number(req.params.ay);
        
        if (ay > 12){
            res.status(500).json({message: "12'den büyük değer alamaz"});
        }
        else{
            const baslangic_tarihi = `${yil}-${ay}-01`;
            ay = ay + 1 > 12 ? 1 : ay + 1;
            const bitis_tarihi = `${ay === 1 ? Number(yil) + 1 : yil}-${ay}-01`;
            const data = await Model.aggregate([
            {
                $match: {
                    TARIH: {
                        $gte: new Date(baslangic_tarihi),
                        $lt: new Date(bitis_tarihi)
                    }
                }
            },
            {
                $group: {
                    _id: "$MAL_ADI"
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        const uniqueMalAdiValues = data.map(doc => doc._id);
        res.json(uniqueMalAdiValues);
        }
     
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
});

router.get('/getyil/:yil', async (req, res) => {
    try{
        const yil = req.params.yil;

        const baslangicTarihi = `${yil}-01-01`; 
        const bitisTarihi = `${Number(yil) + 1}-01-01`; 

        const data = await Model.aggregate([
            {
                $match: {
                    TARIH: {
                        $gte: new Date(baslangicTarihi),
                        $lt: new Date(bitisTarihi)
                    }
                }
            },
            {
                $group: {
                    _id: "$MAL_ADI"
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
        const uniqueMalAdiValues = data.map(doc => doc._id);
        res.json(uniqueMalAdiValues);
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
});

router.get('/getcomparepast/:mal_adi/:yil/:ay', async (req, res) => {
    try{
        const mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`^${mal_adi}`, 'i');
        let yil = Number(req.params.yil.padStart(2, '0'));
        let ay = Number(req.params.ay.padStart(2, '0'));
        
        if (ay > 12){
            res.status(500).json({message: "12'den büyük değer alamaz"});
        }
        else{
            const baslangic_tarihi = `${yil}-${ay}-01`;
            const past_baslangic_tarihi = `${yil-1}-${ay}-01`;
            ay = ay + 1 > 12 ? 1 : ay + 1;
            const bitis_tarihi = `${ay === 1 ? yil + 1 : yil}-${ay}-01`;
            const past_bitis_tarihi = `${ay === 1 ? yil : yil-1}-${ay}-01`;
            const datanow = await Model.aggregate([
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    TARIH: {
                        $gte: new Date(baslangic_tarihi),
                        $lt: new Date(bitis_tarihi)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    Ortalama: { $avg: "$ORTALAMA_UCRET"}
                }
            }
        ]);
        const datapast = await Model.aggregate([
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    TARIH: {
                        $gte: new Date(past_baslangic_tarihi),
                        $lt: new Date(past_bitis_tarihi)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    Ortalama: { $avg: "$ORTALAMA_UCRET"}
                }
            }
        ]);

        res.json({
            Meyve_Sebze: mal_adi,
            Baslangic_Tarihi: baslangic_tarihi,
            Bitis_Tarihi: bitis_tarihi,
            Aylik_Ortalama_Ucret: datanow.length > 0 ? datanow[0].Ortalama : 0, 
        
            Geçmiş_Baslangic: past_baslangic_tarihi,
            Geçmiş_Bitis: past_bitis_tarihi,
            Geçmiş_Aylik_Ortalama_Ucret: datapast.length > 0 ? datapast[0].Ortalama : 0 
        });
        }
     
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
})

router.get('/getcompared/:mal_adi/:yil1/:ay1/:yil2/:ay2', async (req, res) => {
    try{
        const mal_adi = req.params.mal_adi.trim();
        const regex = new RegExp(`^${mal_adi}`, 'i');
        let yil1 = Number(req.params.yil1.padStart(2, '0'));
        let ay1 = Number(req.params.ay1.padStart(2, '0'));
        let yil2 = Number(req.params.yil2.padStart(2, '0'));
        let ay2 = Number(req.params.ay2.padStart(2, '0'));
        
        if (ay1 > 12 || ay2 > 12 ){
            res.status(500).json({message: "12'den büyük değer alamaz"});
        }
        else{
            const baslangic_tarihi1 = `${yil1}-${ay1}-01`;
            const baslangic_tarihi2 = `${yil2}-${ay2}-01`;
            let ay11 = ay1 + 1 > 12 ? 1 : ay1 + 1;
            let ay22 = ay2 + 1 > 12 ? 1 : ay2 + 1;
            const bitis_tarihi1 = `${ay11 === 1 ? yil1 + 1 : yil1}-${ay11}-01`;
            const bitis_tarihi2 = `${ay22 === 1 ? yil2 +1 : yil2}-${ay22}-01`;
            const [data1, data2] = await Promise.all([
                Model.aggregate([
                    {
                        $match: {
                            MAL_ADI: { $regex: regex },
                            TARIH: {
                                $gte: new Date(baslangic_tarihi1),
                                $lt: new Date(bitis_tarihi1)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            Ortalama: { $avg: "$ORTALAMA_UCRET"}
                        }
                    }
                ]),
                Model.aggregate([
                    {
                        $match: {
                            MAL_ADI: { $regex: regex },
                            TARIH: {
                                $gte: new Date(baslangic_tarihi2),
                                $lt: new Date(bitis_tarihi2)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            Ortalama: { $avg: "$ORTALAMA_UCRET"}
                        }
                    }
                ])
            ]);
            const Aylik_Ortalama_Ucret1 = data1.length > 0 ? data1[0].Ortalama : 0;
            const Aylik_Ortalama_Ucret2 = data2.length > 0 ? data2[0].Ortalama : 0;    

            const yuzdelikFark = ((Aylik_Ortalama_Ucret2 - Aylik_Ortalama_Ucret1) / Aylik_Ortalama_Ucret1) * 100;

            let yorum = '';
            if (yuzdelikFark > 0) {
                yorum = `${ay2} - ${yil2} fiyatı, ${ay1} - ${yil1} fiyatıdan %${yuzdelikFark.toFixed(2)} daha yüksek. Bu, fiyatların arttığını gösteriyor.`;
            } else if (yuzdelikFark < 0) {
                yorum = `${ay2} - ${yil2} fiyatı, ${ay1} - ${yil1} fiyatından %${Math.abs(yuzdelikFark).toFixed(2)} daha düşük. Bu, fiyatların düştüğünü gösteriyor.`;
            } else {
                yorum = `${ay2} - ${yil2} ve ${ay1} - ${yil1} fiyatları aynı. Bu, fiyatların değişmediğini gösteriyor.`;
            }

            res.json({
                Meyve_Sebze: mal_adi,
                Baslangic_Tarihi1: baslangic_tarihi1,
                Bitis_Tarihi1: bitis_tarihi1,
                Aylik_Ortalama_Ucret1: Aylik_Ortalama_Ucret1, 
        
                Baslangic_Tarihi2: baslangic_tarihi2,
                Bitis_Tarihi2: bitis_tarihi2,
                Aylik_Ortalama_Ucret2: Aylik_Ortalama_Ucret2,
            
                Yuzdelik_Fark: yuzdelikFark,
                Yorum: yorum
            });
        }
     
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
})

export default router;
