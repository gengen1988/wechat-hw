var config = {
  appid: 'wx42b2746da8e4f318',
  appsecret: '515e6bc276b9efe11dc463746490a123',
  token: 'token',
  encodingAESKey: '0000000000000000000000000000000000000000000'
};

var api = new (require('wechat-api'))(config.appid, config.appsecret);

var app = require('express')();

app.listen(3000);

app.use(require('serve-static')(require('path').join(__dirname, 'public')));
app.use(require('body-parser').json());

app.get('/devices/qrcode', function(req, res, next) {
  var productId = req.query.productId;
  api.getDeviceQRCode(productId, function(err, result) {
    if (err) return next(err);
    console.log(result);
    var deviceId = result.deviceid;
    var qrcode = result.qrticket;
    res.json({deviceId, qrcode});
  });
});

app.get('/menu', function(req, res, next) {
  api.getMenu(function(err, result) {
    if (err) return next(err);
    res.json(result.menu);
  });
});

app.post('/menu', function(req, res, next) {
  var menu = req.body.menu;
  console.log(menu);
  api.createMenu(menu, function(err, result) {
    if (err) return next(err);
    res.json();
  });
});

app.use('/wechat', require('wechat')(config, function(req, res, next) {
  res.reply('ok');
}));
