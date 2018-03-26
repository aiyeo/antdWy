import dva from 'dva';
import './index.css';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}
// 1. Initialize
const app = dva({
  history: useRouterHistory(createHashHistory)({ queryKey: false }),
});

// 2. Plugins
// app.use({});

// 3. Model
//全局登录-----密码----路由加载
app.model(require('./models/homepage'))
 app.model(require('./models/login'));
 app.model(require('./models/password'));
 app.model(require('./models/global'));
 app.model(require('./models/common'));

 //个人信息认证
 app.model(require('./models/userinfo/userinfo'));
 app.model(require('./models/userinfo/certification'));

//--------------------权限控制
 app.model(require('./models/Authorization/membermanage'));
 app.model(require('./models/Authorization/sysbutton'));
 app.model(require('./models/Authorization/sysrole'));
 app.model(require('./models/Authorization/sysmodule'));


 //----------------基础数据配置
 app.model(require('./models/Database/sunit'));
 app.model(require('./models/Database/gtype'));
 app.model(require('./models/Database/packingform'));
 app.model(require('./models/Database/transportgoods'));
 app.model(require('./models/Database/transportline'));
 app.model(require('./models/Database/contacter'));
 app.model(require('./models/Database/industries'));
 app.model(require('./models/Database/bankaccount'));
 app.model(require('./models/Database/truckmanage'));
 app.model(require('./models/Database/drivermanage'));
 //---------------托运单
app.model(require('./models/Consignment/myconsignment'));
app.model(require('./models/Consignment/addconsignment'));
app.model(require('./models/Consignment/consignmentCarrier'));
app.model(require('./models/Consignment/signconsignment'));
app.model(require('./models/Consignment/consignmentacceptsreach'));
app.model(require('./models/Consignment/consignmentdetailtrans'));
app.model(require('./models/Consignment/reconciliation'));
app.model(require('./models/Consignment/batchmanage'));
app.model(require('./models/Consignment/batchdetails'));
app.model(require('./models/Consignment/batchlist'));
app.model(require('./models/Consignment/transstowage'));
app.model(require('./models/Consignment/loadingcar'));
//----------------回单管理
app.model(require('./models/Receipt/carrierreceipt'));
app.model(require('./models/Receipt/consignmentreceipt'));


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

