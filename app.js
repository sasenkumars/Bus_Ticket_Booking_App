let express=require('express');
let cors=require('cors');
let bodyParser=require('body-parser');
let mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/busDb", { useCreateIndex: true,useUnifiedTopology: true,useNewUrlParser: true });
let ticketModel=require('./Database/ticketDetails');
let app=express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

/*------------create api---------------------*/
// app.post('/fillDb',function(req,res){
//     for(var i=1;i<=40;i++){
//         let ins = new ticketModel({status:false,ticketNo:i});
//         ins.save(function(err){
//             if(err){
//                 console.log(err);
//             }
//         })
//     }
//     res.json({msg:'Data Saved'});
// });

/*--------------TicketStatus api-------------------*/
app.post('/updateTicket',function(req,res){
    let status = req.body.status;
    let no = req.body.ticketNo;
    if(no>40 || no<1){
        res.json({data:"Invalid Input!"});
        return;
    }
    if(status=="open"){
        ticketModel.updateOne({"ticketNo":no}, {"$set":{"status":false,"userDetails":[]}}, function(err){
            if(err){
                console.log(err);
            }
            else{
                res.json({Data:"Data Updated"});
            }
        });    
    }
    else{
        let name=req.body.name;
        let age=req.body.age;
        let source=req.body.source;
        let destination=req.body.destination;
        ticketModel.updateOne({"ticketNo":no}, {"$set":{"status":true,"userDetails":[{"name":name,"age":age,"source":source,"destination":destination}]}}, function(err){
            if(err){
                console.log(err);
            }
            else{
                res.json({Data:"Data Updated"});
            }
        });
    }
});

/*--------------TicketStatus api-------------------*/
app.post('/ticketStatus',function(req,res){
    let no = req.body.ticketNo;
    if(no>40 || no<1){
        res.json({data:"Invalid Input!"});
        return;
    }
    let query = ticketModel.find({"ticketNo":no}).select("status");
    query.exec(function(err,data){
        if(err) console.log(err);
        else if(!data[0].status){
            res.json({Data:"open"});
        }
        else{
            res.json({Data:"close"});
        }
    });
});

/*--------------UserDetails api-------------------*/
app.post('/userDetails',function(req,res){
    let no = req.body.ticketNo;
    if(no>40 || no<1){
        res.json({Data:"Invalid Input!"});
        return;
    }
    let query = ticketModel.find({"ticketNo":no}).select("status");
    query.exec(function(err,data){
        if(err) console.log(err);
        else if(!data[0].status){
            res.json({Data:"No User Available"});
        }
        else{
            let lt = ticketModel.find({"ticketNo":no}).select("userDetails");
            lt.exec(function(err,data){
                if(err) console.log(err);
                else{
                    res.json({Data:data[0].userDetails});
                }
            });
        }
    });
});

/*--------------view all closed tickets-----------*/
app.get('/closed',function(req,res){
    let query = ticketModel.find({"status":true}).select("ticketNo");
    query.exec(function(err,data){
        if(err) console.log(err);
        else res.json({Data:data});
    });
});

/*--------------view all open tickets-----------*/
app.get('/open',function(req,res){
    let query = ticketModel.find({"status":false}).select("ticketNo");
    query.exec(function(err,data){
        if(err) console.log(err);
        else res.json({Data:data});
    });
});

/*--------------reset api-------------------*/
app.put('/reset',function(req,res){
    ticketModel.updateMany({"status":true}, {"$set":{"status":false,"userDetails":[]}}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.json({Data:"Data Reset"});
        }
    });
});

app.listen(8899,function()
{
    console.log("Work on 8899");
})