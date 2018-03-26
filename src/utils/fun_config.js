export const loadsh=(datas,id)=>{
            for(let i=0;i<datas.length;i++){
                datas[i].label=datas[i].Name;
                datas[i].value=datas[i][id];
                datas[i].key=datas[i][id];
                if(datas[i].children&&datas[i].children.length>0){
                    loadsh(datas[i].children,id)
                }else{
                    delete datas[i].children;
                }
            }

      return datas;
};
export const arrList=(datas,id)=>{
              for(let i=0;i<datas.length;i++){
                  datas[i].label=datas[i].Name;
                  datas[i].value=datas[i][id];
                  datas[i].key=datas[i][id];
              }
    return datas;
};
export const isBool=(datas,str)=>{
     for(let i=0;i<datas.length;i++){
       if(datas[i].IconCss==str){
             return true;
       }

     }
        return false;
    }
export const actionList=(datas)=>{
    let arr=[];
    for(let i=0;i<datas.length;i++){
      if(datas[i]&&datas[i].IconCss!='add'&&datas[i].IconCss!='search'&&datas[i].IconCss!='browse'){
          arr.push({
            key: datas[i].IconCss,
            name: datas[i].Name,
            color: datas[i].ColorValue,
            icon: datas[i].IconCss
          })
      }
    }
    return arr;
  }
const obj2key = (obj, keys) =>{
    var n = keys.length,
        key = [];
    while(n--){
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
export const uniqeByKeys=(array,keys)=>{
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr .push(array[i]);
        }
    }
    return arr ;
}
export function  formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};
export const authAdminButtons=(datas,id,arrs)=>{
    datas.map(item=>{
      if(item.children&&item.children.length>0){
        authAdminButtons(item.children,id,arrs)
      }else{
        item.ButtonList.map(obj=>{
          if(obj.InAuthorization){
            arrs.push({
              Menu_id:obj.MenuId,
              Button_id:obj.Id,
              Role_id:id
            });
          }
          return arrs;
        })
      }
      return arrs;
    })
    return arrs;
}
export function formatDateTime (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    return y + '-' + m + '-' + d+' '+h+':'+minute;
};
export const authButtons=(datas,id,arrs)=>{
    datas.map(item=>{
      if(item.children&&item.children.length>0){
        authButtons(item.children,id,arrs)
      }else{
        item.ButtonList.map(obj=>{
          if(obj.InAuthorization){
            arrs.push({
              Menu_id:obj.MenuId,
              Button_id:obj.Id,
              Role_id:id
            });
          }
          return arrs;
        })
      }
      return arrs;
    })
    return arrs;

}
export function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
