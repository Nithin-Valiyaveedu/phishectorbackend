const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();

var end;

async function urlres(url){
    console.log("URL to be checked:", url);
    res=Array.from(url)
    console.log(res);

    //60 tokens

    var json = require('./datapre.json')

    //console.log(json);
    var sequence=[]
    for(let i=0;i<res.length;i++){
        for (x in json){
            if(String(res[i])==String(x)){
                sequence.push(json[x]);        
            }
        }
    }
    console.log(sequence);

    var urlsize=sequence.length
    var pad=128-urlsize
    if(pad>0){
        for (let i = 0; i<pad;i++){
            sequence.unshift(0)
        }
    }
    //console.log(sequence);
    //console.log(sequence.length);

    const tf = require("@tensorflow/tfjs-node");
    var x=tf.tensor2d([sequence])
    //console.log(x.shape)
    //console.log(x.print())
    const model = await tf.loadLayersModel("file://model/model.json");
    //const preds = model.predict(x);
    //console.log(model.predict(x))
    var x=tf.tensor2d([sequence])
    const prediction = model.predict(x);
        //console.log(prediction.print());
    value = prediction.dataSync()[0]
    console.log(value) 
        //var pred=prediction.values;
    if(value>0.5){
        return "Phishing";
    }
    else   
        return "Benign";


    // app.get('/try', function (req, res) {
    //     res.send(answer)
    // })

}


//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/create', function(req, res) {
    const newurl = {
      URL: req.body.url,
    };
  
    var u= newurl['URL'];
    console.log(u);
    //var ans = urlres(newurl['URL'])
    //urlres(newurl['URL']) 
    //console.log(ans);
    var ans;
    (async () => {
        ans = await urlres(newurl['URL'])
        console.log(ans);
        res.send(ans)

    })(

    )

    
})




//start your server on port 3001
app.listen(3001, () => {
    console.log('Server Listening on port 3001');
  });
  