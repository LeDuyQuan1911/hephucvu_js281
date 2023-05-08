// Khai báo thư viện http của node
const http=require("http");
// Khai báo cổng của dịch vụ
const port=8080;
// Khai báo thư viện Xử lý tập tin của node
const fs=require("fs");
// Khai báo thư viện mongoDB
const mongoDB = require("mongodb")
// Khai báo thư viện SendMail
const sendMail = require("./sendmail")
// Xây dựng dịch vụ
const mongoClient = mongoDB.MongoClient
const uri = 'mongodb+srv://leduyquan2574:0937779060@quan.bqfgfhl.mongodb.net/?retryWrites=true&w=majority'
const dbName = "js282"
// Xây dựng dịch vụ
const dich_vu= http.createServer((req,res)=>{
    let method=req.method;
    let url=req.url;
    let ketqua=`Dịch vụ NodeJS - Method:${method} - Url:${url}`;
    // Cấp quyền
    res.setHeader("Access-Control-Allow-Origin", '*');
    if(method=="GET"){
        if(url=="/dsTivi"){
            // ketqua=fs.readFileSync('./data/Tivi.json',"utf8");
            // res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            // res.end(ketqua);
            mongoClient.connect(uri).then(client=>{
                client.db(dbName).collection("tivi").find().toArray().then(result=>{
                    console.log(result)
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(result))
                })
            }).catch(err=>{
                console.log(err)
            })
        }else if(url=="/dsHocsinh"){
            // ketqua=fs.readFileSync('./data/Hocsinh.json',"utf8");
            // res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            // res.end(ketqua);
            mongoClient.connect(uri).then(client=>{
                client.db(dbName).collection("dienthoai").find().toArray().then(result=>{
                    console.log(result)
                    res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
                    res.end(JSON.stringify(result))
                })
            }).catch(err=>{
                console.log(err)
            })
        }else if(url=="/dsMathang"){
            ketqua=fs.readFileSync('./data/Mat_hang.json',"utf8");
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(ketqua);
        }else if(url=="/Cuahang"){
            ketqua=fs.readFileSync('./data/Cua_hang.json',"utf8");
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(ketqua);
        }else if(url=="/dsDienthoai"){
            ketqua=fs.readFileSync('./data/Dien_thoai.json',"utf8");
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(ketqua);
        }else{
            res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
            res.end(ketqua);
        }
    }else if(method=="POST"){
        // Lấy dữ liệu client gởi về
        let noi_dung_nhan=``;
        req.on("data",(dulieu)=>{
            noi_dung_nhan+= dulieu
        })

        if(url=="/Dangnhap"){
            req.on("end",()=>{
                let user=JSON.parse(noi_dung_nhan);
                let dsUser=JSON.parse(fs.readFileSync("./data/Nguoi_dung.json","utf8"));
                let nguoidung=dsUser.find(x=>x.Ten_Dang_nhap==user.Ten_Dang_nhap && x.Mat_khau==user.Mat_khau);
                let kq={
                    "noi_dung": false
                }
                if(nguoidung){
                    kq.noi_dung=true
                }
                res.end(JSON.stringify(kq));
            })
        }
        else if(url=="/Lienhe"){
            req.on("end",()=>{
                let kq = {
                    "noi_dung":true
                }
                info =JSON.parse(noi_dung_nhan)
                let from = "admin@shoptt.com"
                let to = `leduyquan2574@gmail.com`;
                let subject = info.tieude
                let body = info.noidung
                sendMail.Goi_Thu_Lien_he(from,to,subject,body).then(result=>{
                    console.log(result)
                    res.end(JSON.stringify(kq))
                }).catch(err=>{
                    console.log(err)
                    kq.noi_dung=false
                    res.end(JSON.stringify(kq))
                })
            })
        }else{
            res.end(ketqua);
        }
        
    }else{
        res.end(ketqua);
    }
    
})

dich_vu.listen(port,()=>{
    console.log(`Service Runing http://localhost:${port}`)
})

