class ShichenEngine {
  constructor(data){
    this.data=data;
    this.items=[...(data.shichen||[])].sort((a,b)=>a.order-b.order);
    this.map=new Map(this.items.map(item=>[item.id,item]));
  }
  getMeta(){ return this.data.meta; }
  list(){ return this.items.slice(); }
  get(id){ return this.map.get(id)||null; }
  getByHour(hour){
    const h=((Number(hour)%24)+24)%24;
    if(h===23 || h<1) return this.get("zi");
    return this.items.find(item=>item.id!=="zi" && h>=item.startHour && h<item.endHour) || null;
  }
  getCurrent(date=new Date()){ return this.getByHour(date.getHours()); }
  getNext(itemOrId){
    const item=typeof itemOrId==="string"?this.get(itemOrId):itemOrId;
    if(!item) return null;
    return this.items[(item.order+1)%this.items.length];
  }
  nextBoundary(date=new Date()){
    const current=this.getCurrent(date);
    if(!current) return null;
    const next=this.getNext(current);
    const d=new Date(date);
    let hour=next.startHour;
    if(current.id==="hai" && next.id==="zi"){
      d.setHours(23,0,0,0);
    } else if(current.id==="zi"){
      if(date.getHours()===23){
        d.setDate(d.getDate()+1);
        d.setHours(1,0,0,0);
      } else {
        d.setHours(1,0,0,0);
      }
    } else {
      d.setHours(hour,0,0,0);
      if(d<=date) d.setDate(d.getDate()+1);
    }
    return d;
  }
  timeUntilNext(date=new Date()){
    const boundary=this.nextBoundary(date);
    return boundary ? Math.max(0,boundary-date) : 0;
  }
}
async function loadShichenEngine(url="./data/shichen.json"){
  const response=await fetch(url,{cache:"no-cache"});
  if(!response.ok) throw new Error("Unable to load shichen data");
  return new ShichenEngine(await response.json());
}
if(typeof window!=="undefined"){
  window.ShichenEngine=ShichenEngine;
  window.loadShichenEngine=loadShichenEngine;
}
if(typeof module!=="undefined" && module.exports) module.exports={ShichenEngine,loadShichenEngine};
