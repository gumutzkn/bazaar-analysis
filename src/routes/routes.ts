import express from 'express';
import { Model } from '../models/data';

const router = express.Router();

router.get('/getAll', async (req, res) => {
    try {
        const datas = await Model.find();
        res.json(datas);
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
        res.json(data)
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
                $addFields: {
                    convertedDate: {
                        $dateFromString: {
                            dateString: "$TARIH",
                            format: "%Y-%m-%d"
                        }
                    }
                }
            },
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    convertedDate: {
                        $gte: new Date(baslangicTarihi),
                        $lt: new Date(bitisTarihi)
                    }
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
            Baslangic_Tarihi: baslangicTarihi,
            Bitis_Tarihi: bitisTarihi,
            Yillik_Ortalama_Ucret: data.length > 0 ? data[0].Ortalama : 0
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
                $addFields: {
                    convertedDate: {
                        $dateFromString: {
                            dateString: "$TARIH",
                            format: "%Y-%m-%d"
                        }
                    }
                }
            },
            {
                $match: {
                    MAL_ADI: { $regex: regex },
                    convertedDate: {
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

        res.json({
            Meyve_Sebze: mal_adi,
            Baslangic_Tarihi: baslangic_tarihi,
            Bitis_Tarihi: bitis_tarihi,
            Aylık_Ortalama_Ucret: data.length > 0 ? data[0].Ortalama : 0 
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
        const ay = req.params.ay;
        const gun = req.params.gun;

        if(Number(ay) > 12 || Number(gun) > 31){
            res.status(500).json({message: "Uygun değer giriniz"});
        }

        else{
            const tarih = `${yil}-${ay}-${gun}`;

            const data = await Model.aggregate([
                {
                    $addFields: {
                        convertedDate: {
                            $dateFromString: {
                                dateString: "$TARIH",
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                {
                    $match: {
                        MAL_ADI: { $regex: regex },
                        convertedDate:new Date(tarih)
                        
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
        const ay = req.params.ay;
        const gun = req.params.gun;

        if(Number(ay) > 12 || Number(gun) > 31){
            res.status(500).json({message: "Uygun değer giriniz"});
        }

        else{
            const tarih = `${yil}-${ay}-${gun}`;

            const data = await Model.aggregate([
                {
                    $addFields: {
                        convertedDate: {
                            $dateFromString: {
                                dateString: "$TARIH",
                                format: "%Y-%m-%d"
                            }
                        }
                    }
                },
                {
                    $match: {
                        convertedDate:new Date(tarih)    
                    }
                }
                
            ]);
    
            res.json(data);
        }
   
    }

    catch(error:any){
        res.status(500).json({message: error.message});
    }
})

export default router;
