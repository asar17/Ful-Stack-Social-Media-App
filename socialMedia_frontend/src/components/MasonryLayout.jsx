import React,{useState} from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';
import { client} from '../client';
import { useEffect } from 'react';



const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

const MasonryLayout = ({ pins,savePin,savingPost,saved,alreadySaved }) => {
  const pinsAfterDelete = localStorage.getItem('pinsAfterDelete') !=='undefined'? JSON.parse(localStorage.getItem('pinsAfterDelete')) : localStorage.clear();

  const [pins2,setPins2]=useState(null)
  

  useEffect(()=>{
     if(pinsAfterDelete===null){
      localStorage.removeItem('pinsAfterDelete')
       setPins2(pins)
     }
     else{
      setPins2(pinsAfterDelete)

     }
     
    return () =>{};
   },[pins])


   //const refreshComp=()=>{
    //client.fetch(feedQuery).then((data) => {
    //  setPins2(data);
    //  console.log(pins2)
      //setLoading(false);
   // });
   ///}
   















  

  
  //delete pin
  const deletePin = (id,e) => {
    client
      .delete(id)
      .then(() => {
        const temp=[...pins2]
        const deletePin=temp.find((item)=>item?._id===id);
        const index=temp.indexOf(deletePin)
        const finalDelete=temp[index]
        const finalPin= pins2?.filter((item)=>item !==finalDelete)
        setPins2(finalPin)
        console.log(pins2)
        localStorage.setItem('pinsAfterDelete',JSON.stringify(finalPin))
        
      });
  };

  return(
    <div>
        <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
          {pins2?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" deletePin={deletePin} savePin={savePin} saveingPost={savingPost} saved={saved} alreadySaved={alreadySaved}/>)}
        </Masonry>
    </div>
  )
};

export default MasonryLayout;
