function xhrGet(reqUri, callback, type) {
    var caller = xhrGet.caller;
    var rq = new XMLHttpRequest();
    rq.open("GET",reqUri,true);
    
    if(type){
        rq.responseType = type;
    }
    rq.onload = function(){
        if(callback){
            try{
                callback(rq);
            }catch(e){
                throw e;
            }
        }
    }
    rq.send();
}